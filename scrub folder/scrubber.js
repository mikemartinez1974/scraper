const fs = require('fs');
const readline = require('readline');
const Papa = require('papaparse');
const axios = require('axios');
var asyncLoop = require('node-async-loop');

const doValidation = false;

let keptlist = [];
let originals = [];

let newleads = [];
let output = null;
let apikey = '0nOrIIVm6tbtQHCn';
let creditEndpoint = `https://client.myemailverifier.com/verifier/getcredits/${apikey}`
let credits = 0;

/** delay(milliseconds)
 * 
 * delay(1000).then(() => {
 *      console.log('ran after 1 second1 passed');
 * });
*/
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/** thisIsInTheGoodList(obj)
 * 
 * @param {*} obj a JSON object representing a scraped lead. 
 * @returns the index of the match, or -1 if none is found.
 */
function thisIsInTheGoodList(obj)
{
    if (good.find((entity) => entity.email == obj.email))
    {
        index = good.findIndex((o) => o.email == obj.email);
        return index;
    }
    else
    {
        return -1;
    }
}

/**personify(data)
 * 
 * @param {*} data csv data string
 * @returns a json object representing a scraped lead.
 */
function personify(data){

    let newEntity = {
        name : data[0][0] ? data[0][0].toString().trim() : '',
        title : data[0][1] ? data[0][1].toString().trim() : '',
        company : data[0][2] ? data[0][2].toString().trim() : '',
        email : data[0][3] ? data[0][3].toString().trim() : '',
        location : data[0][4] ? data[0][4].toString().trim() : '',
        phone : data[0][5] ? data[0][5].toString().trim() : '',
        link : data[0][6] ? data[0][6].toString().trim() : ''
    }

    return newEntity;
}

//read in all the files
var allFiles = fs.readdirSync('.');

//get the clean files
let scrubbedFiles = [];
for(let i = 0; i < allFiles.length ; i++)
{
    if (allFiles[i].startsWith('Scrubbed') || allFiles[i].startsWith('Library')) 
    {
        scrubbedFiles.push(allFiles[i]);
    }
}

//double check clean items for dups.
let maxrows = 0;
let good = [];
for(let i = 0; i < scrubbedFiles.length; i++)
{
    var data = fs.readFileSync(scrubbedFiles[i], 'UTF-8');      
    rows = data.split(/\r?\n/);

    for(let j = 0; j < rows.length ; j ++)
    {
        let data = Papa.parse(rows[j]).data;

        if(data.length == 0)
        {
            continue;
        }

        newEntity = personify(data);

        let isPresent = thisIsInTheGoodList(newEntity);

        if(isPresent>=0)
        {
            continue;
        }
        else
        {
            good.push(newEntity);
        }
    }
}

console.log(good.length, ' rows in library.');

//get the new files.
let inputFiles = [];
let totalnew = 0;
let totalrecords = 0;
for(let i = 0; i < allFiles.length ; i++)
{
    if (allFiles[i].startsWith('output')) 
    {
        inputFiles.push(allFiles[i]);
    }
}


maxrows = 0;
let newItems = [];
for(let i = 0; i < inputFiles.length; i++)
{
    
    var data = fs.readFileSync(inputFiles[i], 'UTF-8');      
    rows = data.split(/\r?\n/);
    let rowcount = rows.length;
    maxrows += rowcount;
    let newcount = 0;
    
    for(let j = 0; j < rows.length ; j ++)
    {
        let data = Papa.parse(rows[j]).data;
        
        if(data.length == 0)
        {
            continue;
        }

        newEntity = personify(data);
       
        let isPresent = thisIsInTheGoodList(newEntity);

        if(isPresent>=0)
        {
            continue;
        }
        else
        {
            good.push(newEntity);
            newItems.push(newEntity);
            newcount ++
        }
    }

    totalnew += newcount;
    totalrecords += rowcount;

    console.log(inputFiles[i], newcount, ' of ', rowcount);
}

console.log("Adding " + totalnew + " of " + totalrecords + " new records.");
writeLibraryFile();

function writeLibraryFile()
{
        //write good[] out to a file.
        let today = new Date();
        let mon = (today.getMonth() + 1).toString().padStart(2,'0');
        let d = today.getDate().toString().padStart(2,'0');
        let h = today.getHours().toString().padStart(2,'0');
        let min = today.getMinutes().toString().padStart(2,'0');
        let y = today.getFullYear();
        let scrubfile = `Library - ${d}-${mon}-${y} ${h}-${min}.csv`;
        let newfile = `NewLeads - ${d}-${mon}-${y} ${h}-${min}.csv`
    
        output = fs.createWriteStream(scrubfile);
        counter = 0;
        //output.write('"NAME","TITLE","COMPANY","EMAIL","LOCATION","PHONE","LINK"\r\n');
        good.forEach((lead) => {
            let data = `"${lead.name}","${lead.title}","${lead.company}","${lead.email}","${lead.location}","${lead.phone}","${lead.link}"\r\n`;
            output.write(data); 
            counter++;
        });
        output.close();
        console.log(counter + " rows written to scrub file.");

}

if(doValidation)
{
    validation();
}
else
{
    writeFiles();
    console.log(newItems.length + " of "  + totalnew + " added as good records.");
    console.log('Finished!');
}


async function validation() {

    await axios
    .get(creditEndpoint)
    .then(res => {
        credits = res.data.credits;
        console.log(`${credits} verification credits available.`)
    })
    .catch(error => {
        console.log(error);
    }) 

    console.log("Validating " + newItems.length + " items.")
    asyncLoop(newItems, newItems.length -1, 0, async function (item, next)
    {
        let testaddress = item.email;
        let testEndpoint = `https://client.myemailverifier.com/verifier/validate_single/${testaddress}/${apikey}`

        if(credits <= 0){
            newItems.pop();
            return;
        } 

        await axios
            .get(testEndpoint)
            .then ( res => {       
                let response = res.data;     
                if(response.Status == "Valid") {
                    //good.push(goodOne);
                    //newleads.push(goodOne);
                }
                else
                {
                    newItems.pop();
                }

                if((response.Status == "Valid")||(response.Status == "Invalid"))
                {
                    credits--;
                }

                //console.log(response);

                console.log(response.Address, response.Status , credits);

                if (credits==0)
                {

                    console.log("Out of Verificaion Credits. :(")
                    return;
                }

            })
            .catch(error => {
                console.log(error);
                }) 
        next();
    }, function ()
    {
        writeFiles();
        console.log(newItems.length + " of "  + totalnew + " added as good records.");
        console.log('Finished!');
    });
}

function writeFiles()
{
    //write good[] out to a file.
    let today = new Date();
    let mon = (today.getMonth() + 1).toString().padStart(2,'0');
    let d = today.getDate().toString().padStart(2,'0');
    let h = today.getHours().toString().padStart(2,'0');
    let min = today.getMinutes().toString().padStart(2,'0');
    let y = today.getFullYear();
    let scrubfile = `Library - ${d}-${mon}-${y} ${h}-${min}.csv`;
    let newfile = `NewLeads - ${d}-${mon}-${y} ${h}-${min}.csv`

    //write newleads[] out to a file.
    output = fs.createWriteStream(newfile);
    counter = 0;
    output.write('"NAME","TITLE","COMPANY","EMAIL","LOCATION","PHONE","LINK"\r\n')
    newItems.forEach((lead) => {
        let data = `"${lead.name}","${lead.title}","${lead.company}","${lead.email}","${lead.location}","${lead.phone}","${lead.link}"\r\n`;
        output.write(data); 
        counter++;
    });
    output.close();
    console.log(counter + " rows written to new lead file.");
}


