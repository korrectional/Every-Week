document.getElementById('startTyping').addEventListener('click', () => {
    const text = document.getElementById('inputText').value;
    chrome.runtime.sendMessage({
        action: 'startTyping',
        text: text
    });
    window.close(); // Close the popup after sending the message
});

