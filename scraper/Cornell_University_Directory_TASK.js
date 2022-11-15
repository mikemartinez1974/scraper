module.exports = { getRecords:getRecords}

const cheerio = require('cheerio');

function getRecords(currentTask,htmlData) {
    var newRecords = [];
    const $ = cheerio.load(htmlData);
//Here, you create an array of records called 'newRecords'.
//the page is available as 'htmlData'
// the current task we are working with is called "currentTask"

//Do whatever you need to do, but after this code runs, the contents

//newRecords will be written to the database.

console.log("I'm in here.");


let h1 = $("h1").text()  //the big words
let items = $("div.contact-item") //an array of divs that hold contact info.

console.log(h1);
console.log(items.length);

//Is this page about the contact?
if (h1.toLowerCase().trim() == currentTask.name.toLowerCase().trim()) {

    let phone,fax,email

    phone = "N / A";
    fax = "N / A";
    email = " N / A";

    for(let i = 0; i < items.length; i++){
        
        let item = $(items[i]);
        let label = item.find(".label").text();
        let value = item.find(".value").text();

        console.log(label,value);

        if (label.toLowerCase() == "tel") phone = value;
        if (label.toLowerCase() == "fax") fax = value;
        if (label.toLowerCase() == "email") email = value;
    }

    let record = currentTask;
    record.phone = phone;
    record.fax = fax;
    record.email = email;
    newRecords.push(record);

    console.log(currentTask.name)
    console.log(record);
}

return newRecords;
process.exit();


}
