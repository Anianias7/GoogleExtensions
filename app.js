// var button = document.querySelector('#expand');
// button.click();

var marksInfoHeader = [...document.querySelectorAll('.semester_headers')];

var marksInfoTable = [...document.querySelectorAll('.semester')];

//Lista ["Semestr akademicki Letni(2017/2018), Rok studiów 3, Semestr studiów 6"]
var listOfSemestersInfo = marksInfoHeader.map(header => header.firstElementChild.innerText);

//Lista lat [3,3,2,2,1]
var listOfYearsNumbers = listOfSemestersInfo.map(header => header.split(',')[1].split(" ")[3]);

//Lista semestrów [6,5,4,3,2]
var listOfSemestersNumbers = listOfSemestersInfo.map(header => header.split(',')[2].split(" ")[3]);

//Zwraca rok oraz przyporządkowane mu indeksy semestrów z listy [6,5,4,3,2]
var groupBy = (xs, keys) => {
    return xs.reduce((acc, val, index) =>  ({
        ...acc,
       [keys[index]]: (acc[keys[index]] || []).concat(index)
       
    })
    , {});
  };

  console.log(listOfSemestersNumbers);
  console.log(listOfYearsNumbers);
  console.log(groupBy(listOfSemestersNumbers, listOfYearsNumbers));

//Lista ectsów dla ocen z semestrów 
//marksInfoTable
var ectsForSemesters = marksInfoTable.map(table => 
                                    [...table.children].map(el => {
                                        if(isNaN(el.lastElementChild.innerText)){
                                            if(el.lastElementChild.innerText === "k.cz.1")
                                                return 0;      
                                            return el.lastElementChild.firstChild.firstChild.lastChild.innerText;
                                        } 
                                        return el.lastElementChild.innerText
                                    }
                                ));



var marksForSemesters = marksInfoTable.map(table => 
                                    [...table.children].map(el => {
                                        var markChild = [...el.children][5];
                                        return markChild.innerText.substring(0,3);
                                        }
                                        ));


// listOfEctsForSemesters
var sumOfEcts = (arr) => (arr).map(semesterEcts => 
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

var flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), [])



var weightedMarks = (marksForSemesters, ectsForSemesters) => zip(marksForSemesters, 
                                                                 ectsForSemesters,
                                                                 (marks, ects) => zip(marks, ects, transform))

var sumOfWeightedMarks = weightedMarks => weightedMarks.map(semesterMarks => semesterMarks.reduce((acc, curr) => acc + curr, 0));

var average = (sumOfWeightedMarks, sumOfEcts) => zip(sumOfWeightedMarks, 
                                                                  sumOfEcts, 
                                                                 (sumOfMarks, sumOfEcts) => 
                                                                                    (sumOfMarks /sumOfEcts).toFixed(2));

var semesterAverageAndInfo = zip(listOfSemestersInfo,
                               average(sumOfWeightedMarks(weightedMarks(marksForSemesters, ectsForSemesters)),sumOfEcts(ectsForSemesters)), 
                               (info, average) => [info, average]);

//Objekt pogrupowanych numerów semestrów dla poszczególnych lat
var groupedSemesters = groupBy(listOfSemestersNumbers, listOfYearsNumbers);

//Ects dla poszczególnych lat 
var ectsForYears = Object.values(groupedSemesters).map(el => el.reduce((acc, val) => acc.concat(ectsForSemesters[val]), []));

//Suma Ectsów dla roku
var sumOfEctsForYear = sumOfEcts(ectsForYears);
 
//Oceny dla poszczególnych lat 
var marksForYears = Object.values(groupedSemesters).map(el => el.reduce((acc, val) => acc.concat(marksForSemesters[val]), []));

//Oceny ważone dla poszczególnych lat
var weightedMarksForYears = weightedMarks(marksForYears, ectsForYears);

//Suma ocen ważonych dla lat
var sumOfWeightedMarksForYears = sumOfWeightedMarks(weightedMarksForYears);

//Średnia ważona dla lat
var averageForYears = average(sumOfWeightedMarksForYears, sumOfEctsForYear)
console.log(averageForYears);


//Średnia dla roku przyporządkowana do miesięcy
var yearAveragesForSemesters = (groupedSemesters, averageForYears) => {
    var years = [...Object.keys(groupedSemesters)];
    return years.sort((a,b) => a - b).map(x => groupedSemesters[x].map(el => averageForYears[x-1]))
}

                               
var averageSemestersInfo = zip(semesterAverageAndInfo, 
                               (flatten(yearAveragesForSemesters(groupedSemesters, averageForYears))).reverse(), 
                               (infoAndSemesterAverage, yearAverage) => infoAndSemesterAverage.concat(yearAverage))


averageSemestersInfo;
