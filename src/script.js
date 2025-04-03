applyStyles("size", sizes[2]);

function fadeOption(event) {
    if ($fade_bool.is(":checked")) {
        // Show fade seconds input with a smooth transition
        $fade.removeClass("hidden").css({
            'opacity': 0,
            'transform': 'translateY(-5px)'
        }).animate({
            'opacity': 1,
            'transform': 'translateY(0)'
        }, 300);
        
        $fade_seconds.removeClass("hidden").css({
            'opacity': 0
        }).animate({
            'opacity': 1
        }, 300);
    } else {
        // Hide fade seconds with a smooth transition
        $fade.animate({
            'opacity': 0,
            'transform': 'translateY(-5px)'
        }, 300, function() {
            $(this).addClass("hidden");
        });
        
        $fade_seconds.animate({
            'opacity': 0
        }, 300, function() {
            $(this).addClass("hidden");
        });
    }
}

// New Popup Manager
const popup = {
    elements: {
        overlay: document.getElementById('popupOverlay'),
        container: document.getElementById('popupContainer'),
        title: document.getElementById('popupTitle'),
        content: document.getElementById('popupContent'),
        closeBtn: document.getElementById('popupClose')
    },
    
    // Configuration for different popups
    types: {
        'emote-sync': {
            title: 'Emote Sync',
            contentId: 'emote-sync-content'
        },
        'message-pruning': {
            title: 'Message Pruning',
            contentId: 'message-pruning-content'
        },
        'sms-theme': {
            title: 'SMS Theme',
            contentId: 'sms-theme-content'
        }
    },
    
    // Open popup with specific type
    open: function(type) {
        if (!this.types[type]) return;
        
        // Set popup content
        this.elements.title.textContent = this.types[type].title;
        const contentTemplate = document.getElementById(this.types[type].contentId);
        
        if (contentTemplate) {
            this.elements.content.innerHTML = contentTemplate.innerHTML;
        }
        
        // Show and animate popup
        this.elements.overlay.classList.add('active');
        
        // Delay the container animation slightly for a nicer effect
        setTimeout(() => {
            this.elements.container.classList.add('active');
        }, 50);
    },
    
    // Close popup
    close: function() {
        this.elements.container.classList.remove('active');
        
        // Wait for animation to finish before hiding the overlay
        setTimeout(() => {
            this.elements.overlay.classList.remove('active');
        }, 300);
    },
    
    // Initialize the popup system
    init: function() {
        // Close button click
        this.elements.closeBtn.addEventListener('click', () => this.close());
        
        // Click outside to close
        this.elements.overlay.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) {
                this.close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }
};

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    popup.init();
    initializeAnimations();
    setupFormTransition();
    setupThemeToggle();
    
    // Initial application of styles
    applyStyles("size", sizes[2]);
});

// Unified popup show function
function showPopup(type) {
    popup.open(type);
}

function sizeUpdate(event) {
    let scale = $emoteScale.val();
    let size;
    if (scale === "1") {
        size = sizes[Number($size.val()) - 1];
    } else if (scale === "2") {
        size = sizes_ES2[Number($size.val()) - 1];
    } else if (scale === "3") {
        size = sizes_ES3[Number($size.val()) - 1];
    } else {
        console.log("Invalid scale value:", scale);
    }
    applyStyles("size", size);
}

function heightUpdate(event) {
    let height = heights[Number($height.val())];
    let $chatline = $("#example .chat_line");
    $chatline.css("line-height", height);
}

const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

function fontUpdate(event) {
    let font = fonts[Number($font.val())];
    console.log("Font:", font);
    if (font !== "Custom") {
        $custom_font.prop("disabled", true);
        $example.css("font-family", font);
    } else {
        $custom_font.prop("disabled", false);
        if ($custom_font.val() == "") {
            console.log("Custom font is empty");
            return;
        }
        console.log("Custom font is not empty");
        const fontName = toTitleCase($custom_font.val());
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css?family=${fontName}`;
        document.head.appendChild(link);
        $example.css("font-family", fontName);
    }
}

function customFontUpdate(event) {
    if ($custom_font.val() == "") {
        $example.css("font-family", "");
        console.log("Custom font is empty");
        return;
    }
    console.log("Custom font is not empty");
    removeCSS("font");
    const fontName = toTitleCase($custom_font.val());
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${fontName}`;
    document.head.appendChild(link);
    $example.css("font-family", fontName);
}

function strokeUpdate(event) {
    if ($stroke.val() == "0") removeStyles("stroke");
    else {
        strokeNum = Number($stroke.val()) - 1;
        if (strokeNum > strokes.Length) {
            strokeNum = strokes.Length;
        }
        let stroke = strokes[strokeNum];
        applyStyles("stroke", stroke);
    }
}

function weightUpdate(event) {
    weightNum = Number($weight.val()) - 1;
    if (weightNum > weights.Length) {
        weightNum = weights.Length;
    }
    let weight = weights[weightNum];
    applyStyles("weight", weight);
}

function shadowUpdate(event) {
    $chatLine = $("#example .chat_line");
    if ($shadow.val() == "0") {
        $chatLine.css("filter", "unset");
    } else {
        let shadow = shadows[Number($shadow.val()) - 1];
        $chatLine.css("filter", shadow);
    }
}

function badgesUpdate(event) {
    if ($badges.is(":checked")) {
        $('img[class="badge"]').addClass("hidden");
    } else {
        $('img[class="badge hidden"]').removeClass("hidden");
    }
}

function paintsUpdate(event) {
    if ($paints.is(":checked")) {
        $('span[class="nick paint"]').addClass("nopaint");
        $('span[class="mention paint"]').addClass("nopaint");
    } else {
        $('span[class="nick paint nopaint"]').removeClass("nopaint");
        $('span[class="mention paint nopaint"]').removeClass("nopaint");
    }
}

function colonUpdate(event) {
    if ($center.is(":checked")) {
        $('span[class="nick paint colon"]').removeClass("colon");
        $('span[class="nick colon"]').removeClass("colon");
        $('span[class="colon"]').css("display", "none");
        return;
    }
    if ($colon.is(":checked")) {
        $('span[class="colon"]').css("display", "none");
        $('span[class="nick paint"]').addClass("colon");
        $('span[class="nick"]').addClass("colon");
    } else {
        $('span[class="colon"]').css("display", "inline");
        $('span[class="nick paint colon"]').removeClass("colon");
        $('span[class="nick colon"]').removeClass("colon");
    }
}

function capsUpdate(event) {
    if ($small_caps.is(":checked")) {
        $example.css("font-variant", "small-caps");
    } else {
        $example.css("font-variant", "normal");
    }
}

var disabledCommands = [];
function commandsUpdate(event) {
    disabledCommands = [];
    const commandCheckboxes = {
        'tts': $disableTTS,
        'rickroll': $disableRickroll,
        'ytplay': $disableYTPlay,
        'ytstop': $disableYTStop
    };
    
    // Iterate through all command checkboxes
    Object.entries(commandCheckboxes).forEach(([command, $checkbox]) => {
        if ($checkbox.is(":checked")) {
            disabledCommands.push(command);
        }
    });
}

function applyPreviewSMSTheme() {
    // Apply colors to the preview elements
    $("#example .chat_line").each(function() {
        const $chatLine = $(this);
        const $userInfo = $chatLine.find('.user_info');
        const $message = $chatLine.find('.message');
        const $nick = $userInfo.find('.nick');
        
        // Get user color
        let color = $nick.css('color');
        
        // If color is transparent, try to get color from next nick element
        if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            const $nextNick = $nick.next('.nick');
            if ($nextNick.length) {
            color = $nextNick.css('color');
            }
        }

        var colorIsReadable = tinycolor.isReadable("#ffffff", tinycolor(color), {});
        var darkerColor = tinycolor(color);
        while (!colorIsReadable) {
            darkerColor = darkerColor.darken(5);
            colorIsReadable = tinycolor.isReadable("#ffffff", darkerColor, {});
        }
        
        // Create desaturated background for message
        const hsl = tinycolor(color).toHsl();
        hsl.s = 0.5;
        hsl.l = 0.9;
        const lightColor = tinycolor(hsl).toString();
        
        // Apply styles
        $userInfo.css('backgroundColor', darkerColor);
        $message.css('backgroundColor', lightColor);
        $message[0].style.setProperty('--arrow-color', lightColor);

        emotes = $messageImage.val().split(",");
        if (emotes.length == 0) {
            emotes = ["https://cdn.7tv.app/emote/01GAZ199Z8000FEWHS6AT5QZV0/4x.webp"];
        }
        emote = emotes[Math.floor(Math.random() * emotes.length)];
        
        // Add example message image
        if (!$message.find('.message-image').length) {
            const imageUrl = emote || 'https://cdn.7tv.app/emote/01GAZ199Z8000FEWHS6AT5QZV0/4x.webp';
            const $img = $('<img>', {
                src: imageUrl,
                class: 'message-image',
                alt: ''
            });
            $message.append($img);
        }
    });

    applyStyles("variant_sms", sms);
}

// Remove SMS theme from preview
function removePreviewSMSTheme() {
    removeStyles("variant_sms");
    $("#example .chat_line").each(function() {
        const $chatLine = $(this);
        const $userInfo = $chatLine.find('.user_info');
        const $message = $chatLine.find('.message');
        const $nick = $userInfo.find('.nick');
        $userInfo.css('backgroundColor', '');
        $message.css('backgroundColor', '');
        $message[0].style.setProperty('--arrow-color', '');
    });
    
    // Remove images
    $("#example .message-image").remove();
}

function smsUpdate(event) {
    if ($sms.is(":checked")) {
        // Disable center option 
        $center.prop("disabled", true);
        if ($center.is(":checked")) {
            $center.prop("checked", false);
            removeStyles("variant_center");
        }

        // Disable paints and force them off for SMS theme
        $paints.prop("disabled", true);
        $paints.prop("checked", true);
        paintsUpdate();
        
        // Disable colon option and force it off
        $colon.prop("disabled", true);
        $colon.prop("checked", false);
        colonUpdate();
        
        // Disable invert option and ensure it's off
        $invert.prop("disabled", true);
        $invert.prop("checked", false);
        
        // Disable stroke and set to 0
        $stroke.prop("disabled", true);
        $stroke.val("0");
        strokeUpdate();
        
        // Disable shadow and set to 0
        $shadow.prop("disabled", true);
        $shadow.val("0");
        shadowUpdate();
        
        // Apply SMS styling to preview
        applyPreviewSMSTheme();
    } else {
        $center.prop("disabled", false);
        $paints.prop("disabled", false);
        $colon.prop("disabled", false);
        $invert.prop("disabled", false);
        $stroke.prop("disabled", false);
        $shadow.prop("disabled", false);
        $paints.prop("checked", false);
        paintsUpdate();

        // Enable center option
        $center.prop("disabled", false);
        
        // Remove SMS styling from preview
        removePreviewSMSTheme();
    }
}

function centerUpdate(event) {
    if ($center.is(":checked")) {
        // Disable SMS option
        $sms.prop("disabled", true);
        if ($sms.is(":checked")) {
            $sms.prop("checked", false);
            $(".message-image-field").slideUp();
            removePreviewSMSTheme();
        }
        
        colonUpdate();
        $('span[class="colon"]').css("display", "none");
        applyStyles("variant_center", 
            ".message { width: 45%; display: block; padding-left: 1em; }\n" +
            ".user_info { width: 50%; text-align: right; }\n" +
            ".nick { text-overflow: ellipsis; overflow: hidden; max-width: 60%; display: inline-block; white-space: nowrap; padding-left: 5px; vertical-align: bottom; }\n" +
            ".colon { display: none; }\n" +
            ".chat_line { display: flex; }\n" +
            ".message .emote { vertical-align: top; }"
        );
    } else {
        // Enable SMS option
        $sms.prop("disabled", false);
        
        removeStyles("variant_center");
        $('span[class="colon"]').css("display", "inline");
        colonUpdate();
    }
}

function bigEmoteUpdate(event) {
    // look for all items with the class should-be-big and add the classes emote-only and large-emote
    if ($bigEmotes.is(":checked")) {
        $(".should-be-big").addClass("emote-only large-emote");
        $(".should-be-big").removeClass("emote");
    } else {
        $(".should-be-big").removeClass("emote-only large-emote");
        $(".should-be-big").addClass("emote");
    }
}

function resetForm(event) {
    $channel.val("");
    $ytChannel.val("");
    $regex.val("");
    $blockedUsers.val("");
    $size.val("3");
    $emoteScale.val("1");
    $font.val("0");
    $height.val("4");
    $voice.val("Brian");
    $stroke.val("0");
    $weight.val("4");
    $shadow.val("0");
    $bots.prop("checked", false);
    $commands.prop("checked", false);
    $badges.prop("checked", false);
    $paints.prop("checked", false);
    $colon.prop("checked", false);
    $animate.prop("checked", true);
    $fade_bool.prop("checked", false);
    $fade.addClass("hidden");
    $fade_seconds.addClass("hidden");
    $fade.val("30");
    $small_caps.prop("checked", false);
    $invert.prop("checked", false);
    $center.prop("checked", false);
    $readable.prop("checked", true);
    $sync.prop("checked", false);
    $pruning.prop("checked", false);
    $custom_font.prop("disabled", true);
    $sms.prop("checked", false);
    $messageImage.val("");
    $disableTTS.prop("checked", false);
    $disableRickroll.prop("checked", false);
    $disableYTPlay.prop("checked", false);
    $disableYTStop.prop("checked", false);

    sizeUpdate();
    fontUpdate();
    heightUpdate();
    strokeUpdate();
    weightUpdate();
    shadowUpdate();
    badgesUpdate();
    paintsUpdate();
    colonUpdate();
    capsUpdate();
    centerUpdate();
    smsUpdate();
    commandsUpdate();

    $result.addClass("hidden");
    $generator.removeClass("hidden");
    showUrl();
}

function backToForm(event) {
    const result = document.getElementById('result');
    const form = document.querySelector('form[name="generator"]');
    
    result.style.animation = 'fadeOut 0.5s forwards';
    
    setTimeout(() => {
        result.classList.add('hidden');
        form.classList.remove('hidden');
        form.style.animation = 'fadeIn 0.5s forwards';
        $alert.css("visibility", "hidden");
    }, 500);
}

// Add animations and UI enhancements

// Initialize UI animations
function initializeAnimations() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      ripple.style.borderRadius = '50%';
      ripple.style.transition = 'all 0.5s';
      ripple.style.pointerEvents = 'none';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.transform = 'translate(-50%, -50%) scale(1)';
        ripple.style.opacity = '0';
      }, 10);
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
  
  // Add shimmer effect to form sections
  const formSections = document.querySelectorAll('.form-section');
  let delay = 0;
  
  formSections.forEach(section => {
    section.style.animation = `fadeInDown 0.6s ease ${delay}s both`;
    delay += 0.1;
  });
  
  // Animate details elements
  const detailsElements = document.querySelectorAll('details');
  
  detailsElements.forEach(details => {
    details.addEventListener('toggle', function() {
      const content = this.querySelector('.details-content');
      if (this.open) {
        content.style.animation = 'none';
        // Trigger reflow
        void content.offsetWidth;
        content.style.animation = 'fadeInDown 0.3s';
      }
    });
  });
}

// Nice transition when form is submitted
function setupFormTransition() {
  const form = document.querySelector('form[name="generator"]');
  const result = document.getElementById('result');
  
  if (form && result) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add exit animation to form
      form.style.animation = 'fadeOut 0.5s forwards';
      
      setTimeout(() => {
        form.classList.add('hidden');
        result.classList.remove('hidden');
        result.style.animation = 'fadeIn 0.5s forwards';
        
        // Generate URL
        generateURL(e);
      }, 500);
    });
  }
}

// Toggle light/dark theme
function setupThemeToggle() {
  const brightnessToggle = document.getElementById('brightness');
  const example = document.getElementById('example');
  
  if (brightnessToggle && example) {
    brightnessToggle.addEventListener('click', function() {
      example.classList.toggle('white');
      if (example.classList.contains('white')) {
        brightnessToggle.src = "img/dark.png";
      } else {
        brightnessToggle.src = "img/light.png";
      }
    });
  }
}

function toggleTheme() {
    const example = document.getElementById('example');
    example.classList.toggle('white');
}

// Initialize all the new UI enhancements
document.addEventListener('DOMContentLoaded', function() {
  popup.init();
  initializeAnimations();
  setupFormTransition();
  setupThemeToggle();
  
  // Initial application of styles
  applyStyles("size", sizes[2]);
  
  // Add responsive layout handling
  adjustFormLayout();
  window.addEventListener('resize', adjustFormLayout);
  
  // Ensure form elements have consistent height
  document.querySelectorAll('select, input[type="text"]').forEach(el => {
    el.style.height = '42px';
  });
});

// Add layout improvement functions

// Adjust form layout based on screen size
function adjustFormLayout() {
    const formWidth = document.querySelector('.form_table').offsetWidth;
    const formSections = document.querySelectorAll('.form_col');
    
    if (formWidth < 650) {
        formSections.forEach(section => {
            section.style.minWidth = '100%';
        });
    } else {
        formSections.forEach(section => {
            section.style.minWidth = '320px';
        });
    }
    
    // Adjust checkbox groups based on available width
    const checkboxGroups = document.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
        const parentWidth = group.parentElement.offsetWidth;
        if (parentWidth < 500) {
            group.style.gridTemplateColumns = '1fr';
        } else {
            group.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        }
    });
}

// Override the original generateURL function to use our new transition
const originalGenerateURL = generateURL;
function generateURL(event) {
    event.preventDefault();

    const baseUrl = window.location.href;
    const url = new URL(baseUrl);
    let currentUrl = url.origin + url.pathname;
    currentUrl = currentUrl.replace(/\/+$/, "");

    var generatedUrl = "";
    if ($regex.val() == "") {
        generatedUrl = currentUrl + "/v2/?channel=" + $channel.val();
    } else {
        generatedUrl =
            currentUrl +
            "/v2/?channel=" +
            $channel.val() +
            "&regex=" +
            encodeURIComponent($regex.val());
    }

    var selectedFont;
    if (fonts[Number($font.val())] == "Custom") {
        selectedFont = $custom_font.val();
    } else {
        selectedFont = $font.val();
    }

    let data = {
        size: $size.val(),
        emoteScale: $emoteScale.val(),
        font: selectedFont,
        height: $height.val(),
        voice: $voice.val(),
        stroke: $stroke.val() != "0" ? $stroke.val() : false,
        weight: $weight.val() != "4" ? $weight.val() : false,
        shadow: $shadow.val() != "0" ? $shadow.val() : false,
        bots: $bots.is(":checked"),
        hide_commands: $commands.is(":checked"),
        hide_badges: $badges.is(":checked"),
        hide_paints: $paints.is(":checked"),
        hide_colon: $colon.is(":checked"),
        animate: $animate.is(":checked"),
        fade: $fade_bool.is(":checked") ? $fade.val() : false,
        small_caps: $small_caps.is(":checked"),
        invert: $invert.is(":checked"),
        center: $center.is(":checked"),
        readable: $readable.is(":checked"),
        disable_sync: $sync.is(":checked"),
        disable_pruning: $pruning.is(":checked"),
        block: $blockedUsers.val().replace(/\s+/g, ""),
        yt: $ytChannel.val().replace('@', ''),
        sms: $sms.is(":checked"),
        message_image: $sms.is(":checked") ? $messageImage.val() : false,
        big_emotes: $bigEmotes.is(":checked"),
        off_commands: disabledCommands.join(","),
    };

    const params = encodeQueryData(data);

    $url.val(generatedUrl + "&" + params);
}

// Override backToForm with smooth transitions
const originalBackToForm = backToForm;
function backToForm(event) {
    const result = document.getElementById('result');
    const form = document.querySelector('form[name="generator"]');
    
    result.style.animation = 'fadeOut 0.5s forwards';
    
    setTimeout(() => {
        result.classList.add('hidden');
        form.classList.remove('hidden');
        form.style.animation = 'fadeIn 0.5s forwards';
        $alert.css("visibility", "hidden");
    }, 500);
}

// Enhanced copy URL function
function copyUrl(event) {
    navigator.clipboard.writeText($url.val());

    $alert.css({
        "visibility": "visible",
        "opacity": "1", 
        // "transform": "translateY(0)" 
    });
    
    // Add animation to the alert
    $alert.css("animation", "justFadeIn 0.6s");
    
    setTimeout(() => {
        showUrl();
    }, 2000);
}

// Smooth alert hide transition
function showUrl(event) {
    $alert.css({
        "opacity": "0",
        "visibility": "hidden",
        "animation": "justFadeOut 0.6s"
    });
}

const $generator = $("form[name='generator']");
const $channel = $('input[name="channel"]');
const $ytChannel = $('input[name="yt-channel"]');
const $animate = $('input[name="animate"]');
const $bots = $('input[name="bots"]');
const $fade_bool = $("input[name='fade_bool']");
const $fade = $("input[name='fade']");
const $fade_seconds = $("#fade_seconds");
const $commands = $("input[name='commands']");
const $small_caps = $("input[name='small_caps']");
const $invert = $('input[name="invert"]');
const $center = $('input[name="center"]');
const $readable = $('input[name="readable"]');
const $sync = $('input[name="sync"]');
const $pruning = $('input[name="pruning"]');
const $badges = $("input[name='badges']");
const $paints = $("input[name='paints']");
const $colon = $("input[name='colon']");
const $size = $("select[name='size']");
const $emoteScale = $("select[name='emote_scale']");
const $font = $("select[name='font']");
const $height = $("select[name='height']");
const $voice = $("select[name='voice']");
const $custom_font = $("input[name='custom_font']");
const $stroke = $("select[name='stroke']");
const $weight = $("select[name='weight']");
const $shadow = $("select[name='shadow']");
const $brightness = $("#brightness");
const $example = $("#example");
const $result = $("#result");
const $url = $("#url");
const $alert = $("#alert");
const $reset = $("#reset");
const $goBack = $("#go-back");
const $regex = $('input[name="regex"]');
const $blockedUsers = $('input[name="blocked_users"]');
const $sms = $('input[name="sms"]');
const $messageImage = $('input[name="message_image"]');
const $bigEmotes = $('input[name="big_emotes"]');
const $disableTTS = $('input[name="disable_tts"]');
const $disableRickroll = $('input[name="disable_rickroll"]');
const $disableYTPlay = $('input[name="disable_ytplay"]');
const $disableYTStop = $('input[name="disable_ytstop"]');

$fade_bool.change(fadeOption);
$size.change(sizeUpdate);
$emoteScale.change(sizeUpdate);
$font.change(fontUpdate);
$height.change(heightUpdate);
$custom_font.change(customFontUpdate);
$stroke.change(strokeUpdate);
$weight.change(weightUpdate);
$shadow.change(shadowUpdate);
$small_caps.change(capsUpdate);
$center.change(centerUpdate);
$badges.change(badgesUpdate);
$paints.change(paintsUpdate);
$colon.change(colonUpdate);
$generator.submit(generateURL);
$url.click(copyUrl);
$alert.click(showUrl);
$reset.click(resetForm);
$goBack.click(backToForm);
$sms.change(smsUpdate);
$bigEmotes.change(bigEmoteUpdate);
$disableTTS.change(commandsUpdate);
$disableRickroll.change(commandsUpdate);
$disableYTPlay.change(commandsUpdate);
$disableYTStop.change(commandsUpdate);