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

    let h1 = $('.columns.small-12.large-5 > h1').text();
    console.log(h1);
    
    let position = $($('div.position')[0]).text();
    console.log(position);

    let contactInfo = $('div.faculty-contacts>p')
    // is this page aboutthe target?
    if (h1.toLowerCase().trim() == currentTask.name.toLowerCase().trim()) {
        let record = currentTask;
        let email = 'N / A';
        let phone = 'N / A';
        for(let i = 0; i < contactInfo.length; i++) {
            let item = contactInfo[i];
            let infolink = $(item).find('a').attr('href').toLowerCase();
            console.log('Link: ' + infolink);
            if(infolink.includes('mail')) email = infolink.replace('mailto:','');
            if(infolink.includes('tel')) phone = infolink.replace('tel:','');    
        }

        record.phone = phone;
        record.email = email;

        console.log(record);

        newRecords.push(record)
        
        writeData(newRecords)
    }
}
