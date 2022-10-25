const debugging = false;
const useProxies = true;

const util = require('util');
const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
eval(fs.readFileSync('c:/users/michael/documents/sourcecode/utils/utils.js')+'');
eval(fs.readFileSync('c:/users/michael/documents/sourcecode/data/DataTools.js')+'');

(async () => {

    let pagesize = 100;
    let nextUrl = "http://localhost:8888/query";
    let nextProxy;
    let nextAgent;
    createRequestOptions(false, false, true);
    
    /**ask what task we are performing. For now, only linkedin is supported. */
    async function getTask(){
        let url = "http://localhost:8888/task"
        if(debugging) console.log("getNextQuery()");
        
        let response = await axios.get(url);
        if (response.err) {console.log(response.err.code);}
        else { return response.data.query};
    }
    
    /** request the next search */
    async function getNextQuery(){
        let url = "http://localhost:8888/query"
        if(debugging) console.log("getNextQuery()");
        
        let response = await axios.get(url);
        if (response.err) {
            console.log("\t - Error: -- Axios Response Error in getNextQuery()");
        }
        else { 
            let q = response.data.query;
            try{
                if(q.match(/&numitems=\d{1,3}$/)){
                    pagesize = q.match(/\d{1,3}/)
                }
            }catch(e) {

            }
            
            nextUrl = q;

            return q;
        };
    }

    /**returns next "proxyhost:port" from the server.
    * ex: proxy6.infatica.com:2309 */
    async function getNextProxy(){
        let url = "http://localhost:8888/proxy"
        if(debugging) console.log("getNextProxy()");
        
        let response = await axios.get(url);
        if (response.err) {console.log(response.err.code);}
        else { return response.data.proxy};
    }

    async function getNextAgent(){
        let url = "http://localhost:8888/agent"
        if(debugging) console.log("getNextAgent()");
        let response = await axios.get(url);
        if (response.err) {console.log(response.err.code);}
        else { return response.data.agent};
    }

    async function getOutputTable(){
        let url = "http://localhost:8888/output"
        let response = await axios.get(url);
        if (response.err) {console.log(response.err.code);}
        else { return response.data.message};
    }

    async function createRequestOptions(lastpage = true, retry = false, start = true) {
        
        let url;
        let action = "";
        //console.log(`createRequestOptions(${lastpage}, ${retry}, ${start})`);

        if((retry == true)){
            start = false;
            //action = "\t- Retrying: Page " + pagenum;
            //console.log("\t- Retrying: ");
        } 

        if (start == true) 
        {
            nextUrl = await getNextQuery();
            console.log(" + New Search: " + nextUrl);
            pagenum  = 1;
        }

        nextProxy = await getNextProxy();
        nextAgent = await getNextAgent();
        if(nextUrl == "eof"){
            console.log('Search Completed.')
            process.exit();
            return;
        }

        if(pagenum == 1) {
            url = nextUrl;
        }
        else {
            url = nextUrl + "&start=" + ((pagenum - 1) * pagesize);
        }

        let options = {}
        
        if(useProxies == true) {
            //nextProxy = "geo.iproyal.com:22323:googlescraper521:googlescraper521"
            let proxy = nextProxy.split(":");
            
            if(proxy.length > 2)
            {
                //options.host = nextProxy;
                options.host = proxy[0];
                options.port = parseInt(proxy[1]);
                options.username = proxy[2];
                options.password = proxy[3]; 
            }
            else
            {
                options.host = proxy[0];
                options.port = parseInt(proxy[1]);
                
            }
            
            options.path = url;
            options.headers = {};
            options.headers.Host = "www.google.com";
            options.headers.Agent = nextAgent;
        }
        else {
            if(nextUrl.indexOf("https://") > -1)
            {

                options = url || nextUrl;
            
            }
            else
            {
                options = url || nextUrl;
            }
            
        }

        makeRequest(options);
    }

    /** Executes a search and sends the html to onRequestComplete() */
    function makeRequest(options) {

        if (debugging) {
            console.warn("makeRequest()");
            console.log(options);
        }

        let request;
        if(String(options.url).indexOf("https://") == 0){
            
            request = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data = data + chunk.toString();
                });
            
                response.on('end', () => {
                    onRequestComplete(data);
                });

                response.on('error', (error) => {
                    console.error('\t - RESPONSE ERROR:',error,options);
                    retryRequest();
                });
            })
            
            request.on('error', (error) => {
                console.log("\t - HTTPS Error: -- Connection Reset --");
                console.log(error);
                retryRequest();
            });
            
            request.end() 
        }
        else
        {
            //console.log('Request => ... ');
            request = http.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data = data + chunk.toString();
                });
            
                response.on('end', () => {
                    onRequestComplete(data);
                });

                response.on('error', (error) => {
                    console.error('\t - RESPONSE ERROR:',error,options);
                    retryRequest();
                });
            })
            
            request.on('error', (error) => {

                console.log("\t - HTTP Error: -- Connection Reset --");

                retryRequest();
            });
            
            request.end() 
        }
    }

    function pageHasErrors(data)
    {

        if(data.indexOf('<title>400 Bad Request</title>') >= 0)
        {
            console.error("\t - Error: -- BAD REQUEST --");
            return true;
        }

        if(data.indexOf('Our systems have detected unusual traffic') >= 0 )
        {
            console.error("\t - Error: -- Unusual Traffic --");
            return true;
        }

        if(data.indexOf('<TITLE>302 Moved</TITLE>') >= 0 )
        {
            console.error("\t - Error: -- Document Moved --");
            return true;
        }

        if(data.indexOf('connect: connection refused') >= 0 )
        {
            console.error("\t - Error: -- Connection Refused --");
            return true;
        }

        if(data.indexOf(': username/password authentication failed') >= 0) {
            console.error("\t - Error: -- Proxy Authentication Failure -- ");
            return true;
        }

        if(data.indexOf(': unknown error connection refused') >= 0) {
            console.error("\t - Error: -- Unknown error or Connection Refused --");
            return true;
        }

        if(data.indexOf('- non ha prodotto risultati in nessun documento.') >= 0) {
            console.error("\t - Error: -- No Matching Documents --");
            return true;
        }

        if(data.indexOf(': EOF') >= 0) {
            console.error("\t - Error: -- EOF --");
            return true;
        }

        if(data.indexOf('403 Status Forbidden') >= 0) {
            console.error("\t - Error: -- Forbidden --");
            return true;
        }

        if(data.indexOf('Proxy Authentication Required') >= 0) {
            console.error("\t - Error: -- Proxy Authentication Required --");
            return true;
        }

        return false;
    }

    var pagenum = 1;
    async function onRequestComplete(data)
    {
        //console.log('... Response <=')
        data = String(data);

        if(debugging) {
            console.log(`onRequestComplete(data[${data.length}])`);
            console.log("Data:")
            console.log(data);
            console.log("... End data.----")
        }

        if(pageHasErrors(data)) {
            retryRequest();
            return;
        } 

        const $ = cheerio.load(data);
        
        let noResultsImage = $(".mnr-c");//checking for the no results page. .mnr-c is the first div that selected it.
        if (noResultsImage.length > 0){
            console.error("\t - Error: -- No matches --")
            pagenum = 1;
            createRequestOptions(true,false,true);
            return;
        }

        let scrapedleads = [];


        //This code parses data from a schools list.
        /*
        let items = $("h2.h4.font-weight-bold");
        let text = "";
        let link = "";
        for(let item of items) {
            link = $(item).find("a");
            text = link.text();
            scrapedleads.push({ "school" : text})
        }
        */


        // This code scrapes linkedin profiles from google search results.
        
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
        
        //Write any data we have found.
        if(scrapedleads.length > 0)
        {
            await writeData(scrapedleads);
            scrapedleads = [];
        }
        else
        {
            console.log(" - No matching data.")
        }

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

        //There's nothing to return.  Our work here is done.
        return;

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

    let outputTable = await getOutputTable();
    /** writeData(leadsToWrite as array of JSON objects) */
    async function writeData(recordsToWrite) {
        
        //console.log(leadsToWrite);

        if(recordsToWrite.length > 0)
        {
            //We're writing to a database. If the table doesn't exist, create it first.
            let sql = `CREATE TABLE IF NOT EXISTS ${outputTable} (`;
            
            
            for(field of Object.keys(recordsToWrite[0])) {
                sql += `${field} varchar(255),`
            }
            sql += `);`
            sql = sql.replace(`,);`,`);`)

            let result = await execute(sql);

            for(let i = 0; i < recordsToWrite.length; i++)
            {
                //console.log(leadsToWrite[i]);

                let lead = recordsToWrite[i];
                let insertQuery = `insert into scraperdata.\`${outputTable}\` ( `;
                for(let field of Object.keys(lead)) {
                    insertQuery += `${field}, `
                }
                insertQuery += `) `
                insertQuery = replaceAll(insertQuery,", )"," ) ");
                insertQuery += ` values (`;
                for(let value of Object.values(lead)) {

                    insertQuery += `"${value}", `
                }
                insertQuery += `) `
                insertQuery = replaceAll(insertQuery, ", )" , " ) ");

                await insert(insertQuery);
            }

            console.log("\t√ " + currentTime() + " " + recordsToWrite.length + ` records written to [scraperdata].[${outputTable}] (from page ${pagenum})` );
        } 
    }

    /** attempt the last request again with a different proxy. */
    function retryRequest() {
        createRequestOptions(true,true,false);
    }

})();

