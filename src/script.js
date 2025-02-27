applyStyles("size", sizes[2]);

function fadeOption(event) {
    if ($fade_bool.is(":checked")) {
        $fade.removeClass("hidden");
        $fade_seconds.removeClass("hidden");
    } else {
        $fade.addClass("hidden");
        $fade_seconds.addClass("hidden");
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
    if ($shadow.val() == "0") {
        $example.css("filter", "unset");
    } else {
        let shadow = shadows[Number($shadow.val()) - 1];
        $example.css("filter", shadow);
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

function centerUpdate(event) {
    if ($center.is(":checked")) {
        colonUpdate();
        $('span[class="colon"]').css("display", "none");
        appendCSS("variant", "center");
    } else {
        removeCSS("variant", "center");
        $('span[class="colon"]').css("display", "inline");
        colonUpdate();
    }
}

function syncUpdate(event) {
    if (!$sync.is(":checked")) {
        showPopup('emote-sync');
    }
}

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
    };

    const params = encodeQueryData(data);

    $url.val(generatedUrl + "&" + params);

    $generator.addClass("hidden");
    $result.removeClass("hidden");
}

function copyUrl(event) {
    navigator.clipboard.writeText($url.val());

    $alert.css("visibility", "visible");
    $alert.css("opacity", "1");
}

function showUrl(event) {
    $alert.css("opacity", "0");
    setTimeout(function () {
        $alert.css("visibility", "hidden");
    }, 200);
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

    $result.addClass("hidden");
    $generator.removeClass("hidden");
    showUrl();
}

function backToForm(event) {
    $result.addClass("hidden");
    $generator.removeClass("hidden");
    $alert.css("visibility", "hidden");
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
$sync.change(syncUpdate);
