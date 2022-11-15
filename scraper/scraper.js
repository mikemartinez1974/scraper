const debugging = false;
const useProxies = false;

const util = require('util');
const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const utils = require('./../utils')
const myRegex = require('./myRegex');
const myRequests = require('./myRequests')

const MYSQL = require('mysql2');
let host = "localhost";
let port = 9999;
let database = "scraperdata";
let user = "Mike";
let pass = "[Mysql521]";
let mysql = MYSQL.createConnection({"host":host,"port":port,"database":database,"user":user,"password":pass});



(async () => {

    let pagesize = 100;
    let nextUrl = "http://localhost:8888/query";
    let nextProxy;
    let nextAgent;
    let currentTask;

    //let task = await getNextTask();
    begin();

    function begin() {

        getNextTask();
    }

    function getNextTask () {
 
        mysql.execute("call get_next()",(err,result)=>{
            if(err) {
                console.log(err.message)
                process.exit();
            } else {
                currentTask = result[0][0];
                makeRequest(currentTask);
            }
            
        })
    }


    /** Executes a search and sends the html to onRequestComplete() */
    async function makeRequest(task,retry) {
        //if(!retry) console.log("\n\t" + task.name + " of " + task.country + " with " + task.company);

        if(task == "EOF"){
            console.log('Search Completed.')
            process.exit();
        }

        try{
            if(task.url.trim() == "") {
                getNextTask();
                return;
            }
        }catch(e) {
            console.log("Finished.")
            process.exit();
        }
        
        console.log(task);
        console.log(task.url);

        let url = new URL(task.url)
        
        let htmldoc = await myRequests.makeRequest(url,false,true);
        onRequestComplete(htmldoc);
        
        // let options = {}
        // if(useProxies == true) {
        //     nextProxy = "geo.iproyal.com:12321:rongphunu:googlescraper521"
        //     let proxy = nextProxy.split(":");
            
        //     if(proxy.length > 2)
        //     {
        //         //options.host = nextProxy;
        //         options.host = proxy[0];
        //         options.port = parseInt(proxy[1]);
        //         options.username = proxy[2];
        //         options.password = proxy[3]; 
        //     }
        //     else {
        //         options.host = proxy[0];
        //         options.port = parseInt(proxy[1]);
        //     }
        
        //     options.path = url.href;
        //     options.headers = {};
        //     options.headers.Host = "google.com"; //url.host;
        //     options.headers.Agent = getNextAgent();
        // }else {
        //     options = url.href;
        // }

        // let request;

        // if(url.protocol == "https:"){
        //     if(debugging) console.log("\t√\tmakeRequest('https')");
        //     request = https.request(options, (response) => {
        //         let data = '';
        //         response.on('data', (chunk) => {
        //             data = data + chunk.toString();
        //         });
            
        //         response.on('end', () => {
        //             onRequestComplete(data);
        //         });

        //         response.on('error', (error) => {
        //             console.error('\t -- RESPONSE ERROR --');
        //             console.log(options);
        //             //console.error('\t - RESPONSE ERROR:',error,options);
        //             retryRequest();
        //         });
        //     })
            
        //     request.on('error', (error) => {
        //         console.log("\t -- HTTPS Error: -- Connection Reset --");
        //         console.log(error);
        //         console.log(options);
        //         retryRequest();
        //     });
            
        //     request.end() 
        // }else if(url.protocol = "http:"){
        //     //if(debugging) console.log("\t√\tmakeRequest('http')");
        //     request = http.request(options, (response) => {
        //         let data = '';
        //         response.on('data', (chunk) => {
        //             data = data + chunk.toString();
        //         });
            
        //         response.on('end', () => {
        //             onRequestComplete(data);
        //         });

        //         response.on('error', (error) => {
        //             console.error('\t -- RESPONSE ERROR --');
        //             //console.error('\t - RESPONSE ERROR:',error,options);
        //             retryRequest();
        //         });
        //     })
            
        //     request.on('error', (error) => {
        //         console.log("\t - HTTP Error: -- Connection Reset --");
        //         retryRequest();
        //     })
            
        //     request.end() 
        // }
    }




    async function createRequestOptions(retry = false) {
        getNextTask();
    }

    var pagenum = 1;
    async function onRequestComplete(data)
    {
        if(debugging) console.log(__function,__line)
        // console.log('... Response <=')
        // console.log(data);
        data = String(data);

        if(debugging) {
            console.log(`onRequestComplete(data[${data.length}])`);
            if(data.length > 50000 ){
                // console.log(data);
                fs.writeFileSync("../scratch copy.htm",data)
            } 

            //console.log("Data:")
            //console.log(data);
            //console.log("... End data.----")
        }

        if(pageHasErrors(data)) {
            retryRequest();
            return;
        }
        else
        {
            returnData(data);
        } 

        //There's nothing to return.  Our work here is done.        
    }

    async function returnData(data){
        if(debugging) console.log(__function,__line)
        if((data != undefined) && (data.length) > 0){
            evaluate(data);
            getNextTask();
        }
    }

    function evaluate(htmlData) {
        if(debugging) console.log(__function, __line);
        //console.log("\tEvaluating HTML Data")
        // Return your records as an array from here.  Whatever is in the objects will be written to the database.

        const the_task_at_hand = require("./THE_TASK_AT_HAND")
        
        let newRecords = the_task_at_hand.getRecords(currentTask,htmlData);

        writeData(newRecords)
        
        //parseGoogleResults(data);
        //parseCambridgeDirectory(data);
        //parseETHZurichDirectory(data);

        //This code parses data from a schools list.
        /*
        // let items = $("h2.h4.font-weight-bold");
        // let text = "";
        // let link = "";
        // for(let item of items) {
        //     link = $(item).find("a");
        //     text = link.text();
        //     scrapedleads.push({ "school" : text})
        // }
        */

    }

    let outputTable = await getOutputTable();
    /** writeData(leadsToWrite as array of JSON objects) */
    async function writeData(recordsToWrite) {
        if(debugging) console.log(__function,__line);
        let outputTable = "output"
        if(debugging)console.log("Records to Write: " + recordsToWrite.length);
        //console.log("\n\tWriting " + recordsToWrite.length + " new records.")
        for(let i=0; i<recordsToWrite.length; i++){
            if(recordsToWrite[i] == {}) recordsToWrite = recordsToWrite.splice(i, 1);
        }

        //console.log(recordsToWrite); process.exit();

        if(recordsToWrite.length > 0)
        {
            //We're writing to a database. If the table doesn't exist, create it first.
            let sql = `CREATE TABLE IF NOT EXISTS scraperdata.${outputTable} (`;
            
            for(field of Object.keys(recordsToWrite[0])) {
                sql += `${field} varchar(255),`
            }
            //sql = sql.substring(0,sql.lastIndexOf(","))
            sql += `);`
            sql = sql.replace(`,);`,`);`)

            //let result = await execute(sql);
            mysql.execute(sql);

            //console.log(sql);
            //console.log(result);

            for(let i = 0; i < recordsToWrite.length; i++)
            {
                //console.log(leadsToWrite[i]);

                let lead = recordsToWrite[i];
                let insertQuery = `insert into scraperdata.\`${outputTable}\` ( `;
                for(let field of Object.keys(lead)) {
                    insertQuery += `${field}, `
                }
                insertQuery += `) `
                insertQuery = utils.replaceAll(insertQuery,", )"," )");
                insertQuery += ` values (`;
                for(let value of Object.values(lead)) {
                    insertQuery += `"${value}", `
                }
                insertQuery += `) `
                insertQuery = utils.replaceAll(insertQuery, ", )" , " )");
    
                mysql.execute(insertQuery,(err,results) => {
                    if(err){
                        console.log(err);
                        process.exit();
                    }else{
                        //console.log(results.affectedRows);
                    }
                })
                
                console.log("\t\t√ " + " " + recordsToWrite.length + ' records written.');
            }

            
        } 
    }





    


    /** stores scraped data from the last search in an object array called ScrapedLeads */
    let requireEmail = false;
    function createDataObject(link,headline,details,stub)
    {

        // The stub is the little preview of text you get with each search result.
        //let stub = $(searchItem).find(".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf").find("span").text();

        // these are regular expressions to match email addresses and phone numbers.
        // the phone number regex could be better, I think, but it's getting the job done.
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        //const phoneRegex = /(\+*\d{1,})*([ |\(])*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/
        //const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
        const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/

        // Here, we get our phone and email data.
        let email = getEmailInText(stub);
        let phone = getPhoneInText(phoneRegex);

        if(util.isNull(email)) email = "";
        if(util.isNull(phone)) phone = "";
        email = String(email).trim().replace(/^\/\//,"").replace(/^email-/,"").replace(/^-/,"");

        //(requireEmail && email) || (!requireEmail)
        if((requireEmail && (email!="")) || (!requireEmail))
        {
            // create an object to hold our data.
            let td = headline.replace(" | LinkedIn", "");
            td = headline.replace(" - LinkedIn", "");
            td = td.split("-");
            td.map((e,i,a) => { e=String(e).trim(); })
            
            let lead = {
                name : '',
                title : '',
                company : '',
                phone : phone,
                email : email,
                link : link
            }

            switch(td.length) {
                case 0:
                    break;
                case 1:
                    lead.name = String(td[0]).trim();
                    break;
                case 2:
                    lead.name = String(td[0]).trim();
                    lead.company = String(td[1]).trim();
                    break;
                default:
                    lead.name = String(td[0]).trim();
                    lead.title = String(td[1]).trim();
                    lead.company = String(td[2]).trim(); 
            }
            lead.company = lead.company.replace(' | LinkedIn','');


            return lead;
        }
    }

    function pageHasErrors(htmlPage)
    {

        if(htmlPage.indexOf('400 Bad Request') >= 0)
        {
            console.error("\t - Error: -- BAD REQUEST --");
            return true;
        }

        if(htmlPage.indexOf('Our systems have detected unusual traffic') >= 0 )
        {
            console.error("\t - Error: -- Unusual Traffic --");
            return true;
        }

        if(htmlPage.indexOf('<TITLE>302 Moved</TITLE>') >= 0 )
        {
            //console.error("\t - Error: -- Document Moved --");
            return true;
        }

        if(htmlPage.indexOf('connect: connection refused') >= 0 )
        {
            console.error("\t - Error: -- Connection Refused --");
            return true;
        }

        if(htmlPage.indexOf(': username/password authentication failed') >= 0) {
            console.log(htmlPage);
            console.error("\t - Error: -- Proxy Authentication Failure -- ");
            return true;
        }

        if(htmlPage.indexOf(': unknown error connection refused') >= 0) {
            console.error("\t - Error: -- Unknown error or Connection Refused --");
            return true;
        }

        if(htmlPage.indexOf('- non ha prodotto risultati in nessun documento.') >= 0) {
            console.error("\t - Error: -- No Matching Documents --");
            //return true;
        }

        if(htmlPage.indexOf(': EOF') >= 0) {
            console.error("\t - Error: -- EOF --");
            return true;
        }

        if(htmlPage.indexOf('403 Status Forbidden') >= 0) {
            console.error("\t - Error: -- Forbidden --");
            // console.error(currentTask.url);
            // console.log(currentTask);
            return true;
        }

        if(htmlPage.indexOf('Proxy Authentication Required') >= 0) {
            console.log(htmlPage);
            console.error("\t - Error: -- Proxy Authentication Required --");
            return true;
        }

        return false;
    }

    /** attempt the last request again with a different proxy. */
    function retryRequest() {
        //console.log("\tRetrying...")
        makeRequest(currentTask,true);
    } 

    /** request the next search */
    // async function getNextQuery(){
    //     let url = "http://localhost:8888/query"
    //     if(debugging) console.log("getNextQuery()");
        
    //     let response = await axios.get(url);
    //     if (response.err) {
    //         console.log("\t - Error: -- Axios Response Error in getNextQuery()");
    //     }
    //     else { 
    //         let q = response.data.query;
    //         try{
    //             if(q.match(/&numitems=\d{1,3}$/)){
    //                 pagesize = q.match(/\d{1,3}/)
    //             }
    //         }catch(e) {

    //         }
            
    //         nextUrl = q;

    //         return q;
    //     };
    // }

    /**returns next "proxyhost:port" from the server.
    * ex: proxy6.infatica.com:2309 */
    async function getNextProxy(){
        let url = "http://localhost:8888/proxy"
        //if(debugging) console.log("getNextProxy()");
        
        let response;
        try {
            response = await axios.get(url);
        } catch(e) {
            console.log('\t->\tError thrown from response in getNextProxy()\t<-');
        }
        if (response.err) {
            console.log('\t->\tError in getNextProxy()\t<-');
            console.log(response.err.error.message);
            //console.log(response.err.code);
        }
        else {
            let retval = response.data.proxy;
            if(debugging) console.log("\t" + retval); 
            return response.data.proxy
        };
    }

    async function getOutputTable(){
        return "`scraperdata`.`output`"
    }







    async function parseGoogleResults(html)
    {
        let scrapedleads = [];
        const $ = cheerio.load(html);
         // This code scrapes linkedin profiles from google search results.
         let noResultsImage = $(".mnr-c");//checking for the no results page. .mnr-c is the first div that selected it.
         if (noResultsImage.length > 0){
             console.error("\t - Error: -- No matches --")
             pagenum = 1;
             let newtask = await getNextTask(__function,__line);
             makeRequest(newtask);
             return;
         }
 
         let element;
         let link;
         let headline;
         let details;
         let stub;
         let items = $(".Gx5Zad.fP1Qef.xpd.EtOod.pkphOe");
         if (items.length > 0) {
             
             if(debugging) console.log("debugging: searchitems = " + searchitems.length)
             for(let i=0; i < items.length; i++)
             {
  
                 element = items[i];
                 link = $(element).find(".egMi0").find("a").attr('href');
                 link = link.substring(link.indexOf('=')+1,link.indexOf('&'));
                 headline = $(element).find(".egMi0").find("h3").text();
                 details = ""
                 stub = $(element).find(".BNeawe.s3v9rd.AP7Wnd > div > div > div").text();
 
                 let newlead = createDataObject(link,headline,details,stub);
 
                 
                 if(newlead) scrapedleads.push(newlead);
             }
         }

         //returnData(scrapedleads)
         writeData(scrapedleads);
         //createRequestOptions();
 
         return;
         //Now that we have finished withe page,
         //we need to figure out how to proceed.
         //examine the footer for paging info.
         //is Is his the last page?  What page are we on?
 
         let footerbutton = $(".nBDE1b.G5eFlf");
         let buttontext = footerbutton.text().trim();
         let arrow = (buttontext.substring(buttontext.length -1));
         let retry = false;
         let start = true;
         switch(arrow)
         {
             case ">":
                 pagenum++;
                 lastpage = false;
                 retry = true;
                 start = false;
                 break;
             
             case "<":
                 pagenum = 1;
                 lastpage = true;
                 retry = false;
                 start = true;
                 break;
             
             default:
                 pagenum = 1;
                 lastpage = true;
                 retry = false;
                 start = true;
                 break;
         }
 
         // if(data.indexOf("In order to show you the most relevant results,") > -1) {
         //     console.log("*");
         //     lastpage = true;
         //     pagenum = 1;
         //     retry = false;
         //     start = true;
         // }
 
         //based on the information we gathered from the footer,
         //this call will decide the next page we navigate to.
         createRequestOptions(lastpage,retry,start);
    }

    async function parseCambridgeDirectory(html) {

        const $ = cheerio.load(html);

        let name = $(".campl-recessed-sub-title .campl-sub-title"); 
        name = $(name).text();
        let title = $(".cst-job-titles ul li")[0];
        title = $(title).text();
        let phone = $("#block-ds-extras-sd-contact .field-name-field-sd-office-phone .field-item")[0];
        phone = $(phone).text();
        let email = $("#block-ds-extras-sd-contact .field-name-field-sd-email-text .field-item")[0];
        email = $(email).text();

        let data = {
            "name":name,
            "company":"Cambridge University - Computer Science Dept.",
            "title":title,
            "phone":phone,
            "email":email
        }

        //returnData(data);
        writeData([data]);
        //createRequestOptions();
    }

    async function parseETHZurichDirectory(html) {
        let $=cheerio.load(html);
        let data = [];

        let tableRows = $("tr");
        for(let tr = 0; tr < tableRows.length; tr++){
            
            let cells = $(tableRows[tr]).find("td");
            
            let dataitem = {};
            for(let c = 0; c < cells.length; c++) {

                let prefix = $(cells[0]).text();
                let email = $($(cells[1]).find("a")[1]).text();
                let name = prefix + $(cells[1]).find("a").text().replace(email,"").replace("&nbsp;", " ");
                let phone = $(cells[2]).text();
                let title = $(cells[4]).find("a").text().trim();

                dataitem = {
                    "name":name,
                    "email":email,
                    "phone":phone,
                    "title":title,
                    "company":"ETH Zurich"
                }
            }
            data.push(dataitem);
            console.log(dataitem);
        }

        //returnData(data)
        writeData(data);
        //createRequestOptions(true,false,true);
    }

        /** returns an array of html divs containing google result items */
        function getGoogleRows(html){
            let $ = cheerio.load(html);
    
            let GoogleResultsDiv = $("div#main");
            console.log("results div:" + GoogleResultsDiv.length);
            //let ResultsMarkup = $(GoogleResultsDiv).find("div.MjjYud")
            //let resultRows = $(ResultsMarkup).find("div.kvH3mc.BToiNc.UK95Uc")
            let data = [];
            let googleRowData = {};
            let resultRows = $(GoogleResultsDiv).find("div.fP1Qef")
            console.log(resultRows.length)
            for(let i = 0; i < resultRows.length; i++){
                googleRowData = {};
                let thisrow = $(resultRows[i]);
                //$("div.sCuL3").innerText
                //console.log(Object.keys(thisrow));
                googleRowData.header = $(thisrow).find("div.sCuL3").innerText
                googleRowData.link = $(thisrow).find("div.egMi0 a").href;
                googleRowData.linkText = $(thisrow).find("div.egMi0 a h3").textContent;
                googleRowData.blurb = $(thisrow).find("div.BNeawe.s3v9rd.AP7Wnd div.BNeawe.s3v9rd.AP7Wnd").textContent
                data.push(googleRowData);
            }
    
            if(debugging) console.log("Google Rows")
            if(debugging) console.log(googleRowData)
    
            if(resultRows.length > 0)
                return resultRows
            else
                return []
        }
    
        /** Returns an array of JSON objects containing google result items. */
        function getGoogleResults(html) {
            let $=cheerio.load(html);
            let data = [];
            //let rows = getGoogleRows(html);
            let rows = $("div.fP1Qef")
            //let $ = cheerio.load(rows);
            for(let i = 0; i < rows.length; i++){
                let googleRowData = {};
                let thisrow = $(rows[i]);
                //$("div.sCuL3").innerText
                //console.log(Object.keys(thisrow));
                googleRowData.header =thisrow.find("div.egMi0 div.j039Wc").text()
                
                let link = thisrow.find("div.egMi0.kCrYT a").attr("href")
                link = link.replace("/url?q=","")
                link = link.substring(0,link.indexOf("&"))
                googleRowData.link = link;
    
    
                googleRowData.linkText = thisrow.find("div.egMi0 a h3").text();
                
                googleRowData.blurb = thisrow.find("div.BNeawe.s3v9rd.AP7Wnd div.BNeawe.s3v9rd.AP7Wnd").text()
                
                data.push(googleRowData);
            }
    
            //console.log("Results Found:" + data.length)
    
            if(data.length > 0){
                //console.log(data.length + " / " + rows.length)
                return data
            } else {
                return []
            }
                
        }
    
        function findEmailOnPage(html) {
            let mailRegex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
            let matches = String(html).match(mailRegex);
            return matches;
        }
    
    
        function findLinkedIn(html) {
            if(debugging) console.log(__function,__line)
            let tName = RegExp(currentTask.name);
            let tCompany = RegExp(currentTask.company);
            let LinkedIn = myRegex.linkedin.profile.regex
    
            let rows = getGoogleResults(html);
            let retval = "N / A";
            for(let i =0; i < rows.length; i++ ) {
                searchResult = rows[i];
                
                // Is this result a linkedIn link?  If not, we can skip it.
                //console.log(searchResult);
                let linkedInMatches = searchResult.link.match(LinkedIn)
                if(!linkedInMatches) continue;
    
                //Does the name on the linked account match the name is our current task?
                let nameMatches = searchResult.linkText.match(tName)
                if(!nameMatches) continue;
    
                //Does the company in the current task appear in this search result?
                let companyMatchesLinkText = String(searchResult.linkText).match(tCompany);
                let companyMatchesBlurb = String(searchResult.blurb).match(tCompany)
                
                if(!companyMatchesLinkText && !companyMatchesBlurb) {
                    continue;
                } else {
                    retval = searchResult.link;
                    console.log("\t\t√ - LinkedIn page identified.")
                    break;
                }
            }
            //console.log(retval);
            return retval;
        }
    
        function findTwitter(html){
            if(debugging) console.log(__function,__line);
            let tName = RegExp(currentTask.name)
            let tCompany = RegExp(currentTask.company);
            let Twitter = myRegex.twitter.user.regex;
    
            let rows = getGoogleResults(html);
            let retval = "N/A"
            for(let i = 0; i < rows.length; i++ ) {
                let searchResult = rows[i];
    
                // Is this result a twitter link?  If not, we can skip it.
                let twittermatches = searchResult.link.match(Twitter);
                if(!twittermatches) continue;
    
                //Does the name on the twitter account match the name is our current task?
                let nameMatches = searchResult.linkText.match(tName)
                if(!nameMatches){
                    continue;
                } else {
                    retval = searchResult.link;
                    console.log("\t\t√ - Twitter page identified.")
                    break;
                }
            }
    
            return retval;
    
        }

})();


/(?:https?:)?\/\/(?:[A-z]+\.)?twitter\.com\/@?(?!home|share|privacy|tos)([A-z0-9_]+)\/?/

// async function getNextAgent(){
//     let url = "http://localhost:8888/agent"
//     //if(debugging) console.log("getNextAgent()");
//     let response = await axios.get(url);
//     if (response.err) {console.log(response.err.code);}
//     else { return response.data.agent};
// }

let nextAgentIndex =0;
function getNextAgent() {
    //nextAgentIndex = 1;
    let agent = AGENT_LIST[nextAgentIndex];
    nextAgentIndex++;
    if(nextAgentIndex >= (AGENT_LIST.length -1)) {
      nextAgentIndex = 0;
    }
    return agent;
  }

  const AGENT_LIST = ["Windows 10/ Edge browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"   ,
  "Windows 7/ Chrome browser: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
  "Linux PC/Firefox browser: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
  "Chrome OS/Chrome browser: Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19577",
  "Mozilla/5.0 (X11) AppleWebKit/62.41 (KHTML, like Gecko) Edge/17.10859 Safari/452.6",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14931",
  "Chrome (AppleWebKit/537.1; Chrome50.0; Windows NT 6.3) AppleWebKit/537.36 (KHTML like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2919.83 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2866.71 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2820.59 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2762.73 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2656.18 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/44.0.2403.155 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:77.0) Gecko/20190101 Firefox/77.0"];

//let facebookRegex = /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/ig
