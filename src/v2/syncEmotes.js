let startTime = null;
const TIMEOUT_LIMIT = 5000; // Maximum wait time in milliseconds
const POLL_INTERVAL = 100; // Poll interval in milliseconds
const SYNC_DELAY = 50; // Delay before synchronizing in milliseconds

function setupAndSynchronizeAnimations(images) {
    console.log("Emotes found, setting up and synchronizing animations...");
    const imagesToSync = [];

    images.forEach((img, index) => {
        img.style.visibility = "hidden";

        const onLoad = () => {
            img.removeEventListener("load", onLoad);
            img.decode().then(() => {
                img.style.visibility = "visible";
                imagesToSync.push(img);

                if (imagesToSync.length === images.length) {
                    setTimeout(() => {
                        synchronizeAnimations(imagesToSync);
                    }, SYNC_DELAY);
                }
            }).catch(error => {});
        };

        img.addEventListener("load", onLoad);
    });
}

function synchronizeAnimations(images) {
    console.log("Synchronizing animations...");
    
    // First, store all original dimensions
    images.forEach((img) => {
        // Save original dimensions
        if (img.width > 0 && img.height > 0) {
            img.setAttribute('data-original-width', img.width);
            img.setAttribute('data-original-height', img.height);
        }
        
        // Create a placeholder style to maintain size
        const width = img.width || img.offsetWidth;
        const height = img.height || img.offsetHeight;
        
        if (width > 0 && height > 0) {
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
        }
    });
    
    // Then reload images
    images.forEach((img) => {
        const src = img.src;
        img.src = ""; // Force reload
        setTimeout(() => {
            img.src = src;
            
            // Cleanup function to remove fixed dimensions after load
            img.addEventListener('load', function onReload() {
                img.removeEventListener('load', onReload);
                // Remove the fixed dimensions after a small delay to ensure smoothness
                setTimeout(() => {
                    img.style.width = '';
                    img.style.height = '';
                }, 50);
            });
        }, 0);
    });
}

function startObservingChatContainer() {
    console.log("Chat container found, observing...");
    const chatContainer = document.getElementById("chat_container");
    if (chatContainer) {
        const emoteObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.classList.contains("chat_line")) {
                            const emotes = Array.from(node.querySelectorAll(".emote"));
                            if (emotes.length > 1) {
                                setupAndSynchronizeAnimations(emotes);
                            }
                        }
                    }
                }
            }
        });

        emoteObserver.observe(chatContainer, {
            childList: true,
            subtree: true,
        });
    }
}

function waitForChatContainer(
    timeout = TIMEOUT_LIMIT,
    interval = POLL_INTERVAL
) {
    const start = Date.now();

    const poll = () => {
        const chatContainer = document.getElementById("chat_container");
        if (chatContainer) {
            startObservingChatContainer();
        } else if (Date.now() - start < timeout) {
            setTimeout(poll, interval);
        }
    };

    poll();
}

window.addEventListener("load", () => {
    if (!Chat.info.disableSync) {
        waitForChatContainer();

        // Set startTime for animations
        startTime = performance.now();
    }
});