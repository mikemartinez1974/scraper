
//***** Utility *****//

/** returns 'targetString' with all instances of 'symbol' replaced with 'newsymbol'. */
function makeGroups(myArray, length){
    
    if(debugging) console.warn(`makeGroups([${myArray.length}],${length})`);

    let retval = [];
    let source = myArray;
    source = Array(myArray).reverse();
    while(source.length > 0)
    {
        let subarray = []
        while(subarray.length < length)
        {
            let item = source.pop();
            if(item != undefined)
            {
                subarray.push(item);
            }
            else{
                break;
            }
        }

        retval.push(subarray);
    }

    return retval;
    
}

/** returns an "OR" clause constructed from the elements of and array. For Ex: ("item1" OR "item2" OR "item3") */
function elementsToOrClause(myArray) {

    if(!myArray)
    {
        throw("Null Argument Exception in elementsToOrClause(myArray)");
    }

    console.log("I'm in here.");
    console.log(myArray);

    let retval = "";

    if(debugging) {
        console.warn(`elementsToOrClause([${myArray.length}])`);
    } 

    console.log(myArray);

    retval = myArray.join('" OR "');
    retval = '("' + retval + '")';

    if(debugging) {
        console.warn(retval);
    } 
    return retval;
}

/** returns a new array with duplicates removed. */
function removeDuplicates(myArray) {

    if(debugging) console.warn(`removeDuplicates([${myArray.length}])`);
    retval = [];
    for(let i=0;i<myArray.length;i++) {
        let member = myArray[i].toLowerCase();
        let memberIndex = retval.indexOf(member);
        if(memberIndex == -1) retval.push(member);
    }
    return retval;
}

/**adds a prefix to each element of an array */
function prefixElements(myArray, prefix) {
    if(debugging) console.warn(`prefixElements([${myArray.length}],${length})`);
    retval = [...myArray];
    for(let i = 0; i < retval.length; i++) {
        retval[i] = prefix + retval[i];
    }
    return retval;
}

/** replaces spaces and special characters with search-friendly symbols */
function googlifyString(aQueryOrPartialQuery)
{
    retval = aQueryOrPartialQuery;
    retval = replaceAll(retval," ","+");
    retval = replaceAll(retval,"(","%28");
    retval = replaceAll(retval,")","%29");
    retval = replaceAll(retval,"@","%40");
    retval = replaceAll(retval,'"',"%22");
    retval = replaceAll(retval,":","%3A");
    retval = replaceAll(retval,"/","%2F");

    return retval;

}

/** returns 'targetString' with all instances of 'symbol' replaced with 'newsymbol'. */
function replaceAll(targetString,symbol,newsymbol)
{
    targetString = String(targetString).trim();
    while(targetString.indexOf(symbol) > -1)
    {
        targetString = targetString.replace(symbol,newsymbol);
    }

    return targetString;
}

/** this returns all the possible combitations for any arrays that we send in.  It takes an array of arrays */
function permute(myArray) {
//    return cartesianProduct(myArray);
}

/** Returns the cartesian product of an array (of arrays) */
function cartesianProduct(arr) {
    return arr.reduce(function(a,b){
        return a.map(function(x){
            return b.map(function(y){
                return x.concat([y]);
            })
        }).reduce(function(a,b){ return a.concat(b) },[])
    }, [[]])
}

/** takes a year.  Returns true if it's a leapyear. */
function isLeapyear(year)
{
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}

/** takes a year.  Returns an array of dates ('yyyy-m-d) containing all the days of the year. */
function getDayList(year) {
    let months = [[1,31], [2,28], [3,31], [4,30], [5,31], [6,30], [7,31], [8,31], [9,30], [10,31], [11,30], [12,31]];
    if(isLeapyear(year)){
        months[1][1] = 29;
    }

    let days = [];
    for(let m = 0; m <= months.length -1; m++) {
        for(let d = 1; d <= months[m][1] ; d++) {
            let day = year + "-" + months[m][0] + "-" + d
            days.push(day)
        }
    }

    if(days.length%2) {
        days.push((year+1) + "-1-1");
    }

    let lastindex = days.length - 1;

    //console.log(days);
    return days;
}

/** takes the array generated by getDayList() and generates an array of before and after commands compatible with a google search. */
function getTimeCommands(daylist) {
    retval = [];
    for(let i = 0; i < daylist.length; i += 2) {
        let day1 = daylist[i];
        let day2 = daylist[i+1];
        let clause = "after:" + day1 + " before:" + day2;
        retval.push(clause);
    }
    return retval;
}

/**shuffles an array */
function shuffleArray(array)
{
    let shuffled = array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    return shuffled
}

/** gets current HH:mm:ss */
function currentTime(){
    let date = new Date();
    let h = date.getHours();
    h = ("00" + h).slice(-2)
    let m = date.getMinutes();
    m = ("00" + m).slice(-2)
    let s = date.getSeconds();
    s = ("00" + s).slice(-2)
    return `${h}:${m}:${s}`;
}

/** gets current mm/dd/yyyy */
function currentDate(){
    let date = new Date();
    let m = (date.getMonth() + 1);
    m = ("00" + m).slice(-2);
    let d = date.getDate();
    d = ("00" + d).slice(-2);
    let y = date.getFullYear();
    y = ("0000" + y).slice(-4)
    return `${m}/${d}/${y}`; 
}

Object.defineProperty(global, '__stack', {
    get: function() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function(_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });
    
Object.defineProperty(global, '__line', {
get: function() {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
get: function() {
        return __stack[1].getFunctionName();
    }
});
    
function getCaller() {
    return({line:__line, function:__function})
    console.log(__line);
    console.log(__function);
}

module.exports = {
     getCaller : getCaller
    ,replaceAll : replaceAll
}


// function foo() {
//     console.log(__line);
//     console.log(__function);
// }

// foo()