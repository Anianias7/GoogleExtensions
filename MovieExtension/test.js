
window.addEventListener('DOMContentLoaded', function(){ 

    chrome.tabs.query({
        active: true,
        currentWindow: true,
    },
    function(tabs){
    var id = tabs[0].id;
    var downloadBtn = document.querySelector('#download-btn');
    downloadBtn.addEventListener('click', () => {
            chrome.tabs.executeScript(
                id,
                {file: "app.js"}
            )
        });
    })
})