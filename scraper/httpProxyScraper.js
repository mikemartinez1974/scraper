const debugging = false;
const useProxies = true;

const axios = require('axios');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
eval(fs.readFileSync('../utils.js')+'');

(async () => {

       
    let task;
    let nextUrl;
    let nextProxy;
    let nextAgent;
    createRequestOptions(false, false, true);
    
    /**ask what task we are performing. For now, only linkedin is supported. */
    async function getTask(){
        let url = "http://localhost:8888/task"
        if(debugging) console.log("getNextQuery()");
        
        let response = await axios.get(url);
        if (response.err) {console.log(response.err);}
        else { return response.data.query};
    }
    
    /** request the next search */
    async function getNextQuery(){
        let url = "http://localhost:8888/query"
        if(debugging) console.log("getNextQuery()");
        
        let response = await axios.get(url);
        if (response.err) {console.log(response.err);}
        else { return response.data.query};

        //makeRequest('http://localhost:8888/query');
    }

    /**returns next "proxyhost:port" from the server.
    * ex: proxy6.infatica.com:2309 */
    async function getNextProxy(){
        let url = "http://localhost:8888/proxy"
        if(debugging) console.log("getNextProxy()");
        //makeRequest('http://localhost:8888/proxy');
        
        let response = await axios.get(url);
        if (response.err) {console.log(response.err);}
        else { return response.data.proxy};
    }

    async function getNextAgent(){
        let url = "http://localhost:8888/agent"
        if(debugging) console.log("getNextAgent()");
        //makeRequest('http://localhost:8888/agent');
        let response = await axios.get(url);
        if (response.err) {console.log(response.err);}
        else { return response.data.agent};
    }


    async function createRequestOptions(lastpage = true, retry = false, start = false) {
        
        if(debugging) console.log(`createRequestOptions: lastpage=${arguments}`);

        if (start == true) 
        {
            nextUrl = await getNextQuery();
            nextProxy = await getNextProxy();
            nextAgent = await getNextAgent();
        }
        else if((retry == true))
        {
            // leave url as i is.
            nextProxy = await getNextProxy();
            nextAgent = await getNextAgent();
        }
        else
        {
            nextUrl = await getNextQuery();
            nextProxy = await getNextProxy();
            nextAgent = await getNextAgent();
        }

        if(nextUrl == "eof"){
            console.log('Search Completed.')
            return;
        }

        // make sure we get 100 results per page.
        let url = nextUrl + "&num=100;"

        // this returns results from the appropriate page
        if(pagenum > 1) {
            url = url + "&start=" + (pagenum-1)*100
        }

        let options = {}
        
        if(useProxies == true) {
            let proxy = nextProxy.split(":");           
            options.host = proxy[0];
            options.port = parseInt(proxy[1]);
            options.path = url;
            options.headers = {};
            options.headers.Host = "www.google.com";
            options.headers.Agent = nextAgent;
        }
        else {
            options = url;
        }

        if(debugging) console.log("returning: ",options);
        
        makeRequest(options);
    }

    /** Executes a search and sends the html to onRequestComplete() */
    function makeRequest(options) {
        if (debugging) console.warn("makeRequest()");
        
        const request = http.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });
        
            response.on('end', () => {
                onRequestComplete(data);
            });

            response.on('error', (error) => {
                console.error('RESPONSE ERROR:',error,options);
                retryRequest();
            })
        })
        
        request.on('error', (error) => {
            console.error('REQUEST ERROR:', error,options);
            retryRequest();

        });
        
        request.end() 
    }

    var pagenum = 1;
    var retry = false;
    let resUrl = "";
    let resProxy = "";
    let resAgent = "";
    function onRequestComplete(data)
    {
        if(debugging) console.log(`onRequestComplete(data[${data.length}])"`);

        if(String(data).indexOf('<title>400 Bad Request</title>') >= 0)
        {
            console.error(" -- BAD REQUEST --")
            retryRequest();
            return;
        }

        const $ = cheerio.load(data);
        
        let scrapedleads = [];
        let searchitems = $(".Gx5Zad.fP1Qef.xpd.EtOod.pkphOe")
        for(let i=0; i < searchitems.length; i++)
        {
            //console.log("results");
            let element = searchitems[i];
            let link = $(element).find(".egMi0").find("a").attr('href');
            link = link.substring(link.indexOf('=')+1,link.indexOf('&'));
            let headline = $(element).find(".egMi0").find("h3").text();
            let details = ""
            let stub = $(element).find(".BNeawe.s3v9rd.AP7Wnd > div > div > div").text();

            let newlead = createDataObject(link,headline,details,stub);
            if(typeof(newlead) == "object") {
                scrapedleads.push(newlead);
            }
        }

        let footerbutton = $(".nBDE1b.G5eFlf");
        let buttontext = footerbutton.text().trim();
        let arrow = (buttontext.substring(buttontext.length -1));
        let lastpage = true;
        switch(arrow)
        {
            case ">":
                lastpage = false;
                pagenum++;
                break;
            
            case "<":
                lastpage = true;
                pagenum = 1;
                break;
            
            default:
                lastpage = true;
                pagenum = 1;
                break;
                //console.log("no button here... new search.")
        }

        //console.log(`onRequestComplete: arrow=${arrow}   lastepage=${lastpage}`);
        writeLeads(scrapedleads, lastpage);

        if(lastpage == false) {
            pagenum++;
        }

        createRequestOptions(lastpage);
    }

    /** stores scraped data from the last search in an object array called ScrapedLeads */
    function createDataObject(link,headline,details,stub)
    {
        // capture this data....
        //let headline = item;
        //let LILink = link;
        let location = "";
        let title = "";
        let company = "";

        // the details here contain the company, position, and location
        // information for each linkedin search result (for a person).
        //const details = $(searchItem).find(".MUxGbd.wuQ4Ob.WZ8Tjf").find("span");

        // I'm extracting the data I need from the details here.
        // This is ugly, but it looks ugly in the markup,
        // so don't judge me.
        for(let j = 0; j < details.length; j++)
        {
            const detailItem = details;

            switch(j)
            {
                case 0:
                    location = detailItem;
                    break;
                case 4:
                    company = detailItem;
                    break;
                case 2:
                    title = detailItem;
                    break;
            }
        }

        // The stub is the little preview of text you get with each search result.
        //const stub = $(searchItem).find(".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf").find("span").text();

        // these are regular expressions to match email addresses and phone numbers.
        // the phone number regex could be better, I think, but it's getting the job done.
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        const phoneRegex = /(\+*\d{1,})*([ |\(])*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/

        // Here, we get our phone and email data.
        const email = stub.match(emailRegex);
        const phone = stub.match(phoneRegex);

        if(email)
        {
            // If there is no email, then we have nothing, and this iteration ends,
            // and we move to the next searchitem.

            // otherwise....
            let newlead = {};  // create an object to hold our data.
            newlead.headline = headline;
            newlead.link = link;
            newlead.location = location;
            newlead.title = title;
            newlead.company = company;
            newlead.email = email[0].trim().replace(/^\/\//,"").replace(/^email-/,"").replace(/^-/,"");

            newlead.phone = phone == null ? '' : phone[0]  // if we found a phone number, put it in, otherwise, an empty string.

            return newlead;
        }
    }

    /** Writes scraped data to file.  If lastpage is false, the same search will continue. */
    function writeLeads(scrapedLeads, lastpage = true){
        //let filename = `output - ${titles[tidx]} - ${industries[iidx]} - ${locales[lidx]}.csv`;
        
        let leadcount = 0;
        let leadsToWrite = [];

        //console.log("writing leads.....");
        //console.log("there are " + ScrapedLeads.length + "!");
        for(let i = 0; i < scrapedLeads.length; i++)
        {
            let lead = scrapedLeads[i];
            let headline = lead.headline;
            headline = headline.replace(" | LinkedIn","");
            headline = headline.replace(" - LinkedIn","");
            let fdi = headline.indexOf(" - ");
            let ldi = headline.lastIndexOf(" - ");

            if(ldi == fdi) { ldi = -1; }

            // this is our best-case scenario, where ldi is greater than fdi, that means we have two dashes
            // and we will assume that the second bit of information is the title.
            // and the last bit of information is the company (and we may still be wrong)
            if ((fdi >= 0) && (ldi >= 0))
            {
                lead.name = headline.substring(0,fdi);

                lead.title == "" ? lead.title = headline.substring(fdi+3,ldi ) : false
                
                lead.company == "" ? lead.company = headline.substring(ldi+3, headline.length) : false;
            }

            // so now, if there's only one dash, we don't know whether the second piece of information is a company or a position....
            if((fdi>=0) && (ldi<0))
            {
                lead.name = headline.substring(0,fdi);

                let t = headline.substring(fdi+3,headline.length);
                if(lead.title == "") {
                    //so if the lead doesn't have a title, we are going to use this second piece of information for a title...
                    lead.title = t;} 
                else { 
                    //and if there's no company, we'll use it for a company. 
                    if((lead.company == "") || (lead.company == "LinkedIn")) {
                        lead.company = t;
                    }}
            }

            //It's not impossible for this data to be duplicatedin both fields, but the important thing was the email, right?  Moving on....

            //these conditions indicate that this is not a good result
            //for our purposes. They are not "people" results.

            if(lead.name == undefined) { continue };
            if(lead.name.endsWith("'s Post")) { continue };
            if(lead.name.startsWith("Articles ")) { continue };
            if(lead.name.startsWith("Posts ")) { continue };
            if(lead.name.startsWith("Publicações ")) { continue };
            if(lead.link.includes("/posts/")) { continue };
            if(lead.link.includes("/pub/dir/")) { continue };
            if(lead.link.includes("/directory/")) { continue };

            leadsToWrite.push(lead);
            
        }

        if(leadsToWrite.length > 0)
        {
            let outputfile = `../output.csv`
            let output = fs.createWriteStream(outputfile,{flags:'a'});
            for(let i = 0; i < leadsToWrite.length; i++)
            {
                let lead = leadsToWrite[i];
                output.write(`"${lead.name}","${lead.title}","${lead.company}","${lead.email}","${lead.location}","${lead.phone}","${lead.link}"\n`);
            }
            output.close();
            console.log("\r\n   " + leadsToWrite.length + ` records written to ${outputfile}` );
        } 
        else
        {
            console.log("   -   ")
        }
        //console.log(`writeLeads(lastpage = true):  lastpage=${lastpage}`);
            
    }

    /** attempt the last request again with a different proxy. */
    function retryRequest() {
        createRequestOptions(retry = true);
    }

})();

