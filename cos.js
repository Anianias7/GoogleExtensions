// var button = document.querySelector('#expand');
// button.click();

var marksInfoHeader = [...document.querySelectorAll('.semester_headers')];

var marksInfoTable = [...document.querySelectorAll('.semester')];

var listOfSemestersInfo = marksInfoHeader.map(header => header.firstElementChild.innerText);

var listOfYearsNumbers = listOfSemestersInfo.map(header => header.split(',')[1].split(" ")[3]);

var listOfEctsForSemesters = marksInfoTable.map(table => 
                                    [...table.children].map(el => el.lastElementChild.innerText
                                ));

var listOfMarksForSemesters = marksInfoTable.map(table => 
                                    [...table.children].map(el => {
                                        var listOfTd = [...el.children];
                                        var markChild = listOfTd[5];
                                        return markChild.innerText.substring(0,3);
                                        }
                                        ));

var sumOfEtcs = listOfEctsForSemesters.map(semesterEcts => 
                                        semesterEcts.map(parseFloat).reduce((acc, curr) => 
                                                                            acc + curr, 0)
                                        );

var transform = (el1, el2) => parseFloat(el1) * parseFloat(el2);

var zip = (arr1, arr2, transformFn) => {
    var result = [];
    var minLength = Math.min(arr1.length, arr2.length);
    for(var i = 0; i < minLength; i++){
        result.push(transformFn(arr1[i], arr2[i]));
    }
    return result;
}

var weightedMarks = zip(listOfMarksForSemesters,
                            listOfEctsForSemesters,
                            (marks, ects) => zip(marks, ects, transform)
                            )

var sumOfWeightedMarks = weightedMarks.map(semesterMarks => semesterMarks.reduce((acc, curr) => acc + curr, 0));

var averagesForSemesters = zip(sumOfWeightedMarks, 
                               sumOfEtcs, 
                               (sumOfMarks, sumOfEtcs) => (sumOfMarks /sumOfEtcs).toFixed(2)
                               );

var averageSemestersInfo = zip(listOfSemestersInfo,
                               averagesForSemesters, 
                               (info, average) => [info, average]);


console.log(averageSemestersInfo[0][1]);
averageSemestersInfo;
