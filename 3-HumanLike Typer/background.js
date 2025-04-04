// Keep service worker active
const keepAlive = () => setInterval(() => {
    console.log('Background service worker is running');
}, 20000);

keepAlive();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTyping') {



        console.log('Starting typing');
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            // Check if URL contains codehs
            const codehs = tabs[0].url.includes('codehs.com');
            console.log('Tabs:', tabs);
            console.log('CodeHS:', codehs);
            if (codehs) {
                console.log('CodeHS detected');
            }

            console.log('Injecting content script');
            const text = request.text;
            const delay = 0;
            const initialDelay = 1000;
            console.log('Text:', text);
            
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (text, delay, initialDelay, codehs) => {
                        let index = 0;
                        console.log("Typing text:", text);
                        function type() {
                            if (index < text.length) {
                                console.log("Typing character:", text[index]);
                                const event = new Event('input', { bubbles: true });
                                if (text[index] == "`") {
                                    document.activeElement.value += "    ";
                                } else {
                                    if (codehs) {
                                        document.activeElement.value = document.activeElement.value.slice(0, -2);
                                        document.activeElement.value += text[index] + "  ";
                                    }
                                }
                                document.activeElement.dispatchEvent(event);
                                index++;
                                setTimeout(type, delay);
                            }
                        }
                        setTimeout(type, initialDelay);
                    },
                    args: [text, delay, initialDelay, codehs]
                });
                console.log('Content script injected successfully');
            } catch (error) {
                console.error('Failed to inject content script:', error);
            }
            
        });
    }
    return true;
});