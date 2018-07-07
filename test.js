
window.addEventListener('DOMContentLoaded', function(){ 

    var createAverageSemesterInfoUl = (averageArrayInfo) => {
        var tableBody = document.createElement('tbody');
        tableBody.classList.add("semester-table-body");
        for(var i = 0; i < averageArrayInfo.length; i++){
            var row = document.createElement('tr');
            var text = document.createElement('td');
            var average = document.createElement('td');
            var yearAverage = document.createElement('td');
            text.appendChild(document.createTextNode(averageArrayInfo[i][0]));
            average.appendChild(document.createTextNode(averageArrayInfo[i][1]));
            yearAverage.appendChild(document.createTextNode("Buuu"));
            row.appendChild(text);
            row.appendChild(average);
            row.appendChild(yearAverage);
            row.classList.add('table-row');
            text.classList.add('text');
            average.classList.add('average');
            tableBody.appendChild(row);
        }
        return tableBody;
    }

    chrome.tabs.query({
        active: true,
        currentWindow: true,
    },
    function(tabs){
    var id = tabs[0].id;
        chrome.tabs.executeScript(
            id,
            {file: "cos.js"}
        , function(res) {
            var table = document.querySelector(".semester-table");
            table.appendChild(createAverageSemesterInfoUl(res[0]))
        })
    })
})