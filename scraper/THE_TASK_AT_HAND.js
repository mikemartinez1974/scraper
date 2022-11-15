/*

Scrape penn states directory.  Possible countermeasures at play.

*/

const fs = require('fs');

module.exports = { getRecords:getRecords}

const cheerio = require('cheerio');

function getRecords(record,htmlData) {
    var newRecords = [];
    const $ = cheerio.load(htmlData);

    //fs.writeFileSync('htmlSample.htm',htmlData);
//Here, you create an array of records called 'newRecords'.
//the page is available as 'htmlData'
// the current task we are working with is called "currentTask"

//Do whatever you need to do, but after this code runs, the contents

//newRecords will be written to the database.

    console.log("I'm in here.")
    console.log(record.url);

    let staffListMeta = $("section.StaffList div.row  div.SingleStaffList .StaffListMeta") 
    console.log(staffListMeta)
    for(let staffMemberIndex = 0; staffMemberIndex < staffListMeta.length; staffMemberIndex++){
        let p = staffListMeta[staffMemberIndex];

        let name = $(p).find(".StaffListName").text();
        console.log(name);

        let title = $(p).find(".StaffListTitles")[0].text();
        console.log(title);

        for(let sm = 0; sm < staffListMeta.length; sm++){
            let phone = "N / A";
            let email = "N / A";
            let twitter = "N / A";
            let scholar = "N / A"

            let socialMedia = $(p).find(".StaffListSocial li a");
            for(let i=0; i < socialMedia.length; i++) {
                let link = $(socialMedia[i]).attr('href').toLowerCase();
                if (link.includes("mailto:")) {
                    email = link.replace("mailto:","");
                    console.log(email);
                }
                if (link.includes("tel:")) {
                    phone = link.replace("tel:","")
                    console.log(phone);
                } 
                if (link.includes('twitter.com')) {
                    twitter = link;
                    console.log(twitter);
                } 
                if (link.includes('scholar.google.com')){
                    scholar = link;
                    console.log(scholar);
                } 
            }
        }

        let record = {
            name:name,
            title:title,
            phone:phone,
            email:email,
            twitter:twitter,
            scholar:scholar
        }

        console.log(record);

        newRecords.push(record)

    }

    return newRecords
}
