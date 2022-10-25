const debugging = false;


const fs = require('fs');
const http = require('http');
eval(fs.readFileSync(__dirname + '/../utils/utils.js')+'');
eval(fs.readFileSync(__dirname + '/data.js')+'');
eval(fs.readFileSync(__dirname + '/../Data/DataTools.js')+'');


const TASK = "linkedin";
var itemsPerPage = 100; 

let sqldata = [];
let proxyList = [];
let nextProxyIndex = 0;
let querylist = [];
let nextQueryIndex = 0;
let nextAgentIndex = 0;
const USESEARCHFILE = false;
let targetTable;



const args = process.argv;
if(args.length == 2)
{
    //no args
    //console.log ("Usage:  node FindContacts.js company name");
}
else if (args.length == 3)
{
    nextQueryIndex = args[2];
} 

const requestListener = function (req, res) {

  //listen until we run out of searches, then exit.

  let data = {};
  switch(req.url) {
    case '/':
      break;
    case '/query':
      data.type = "newquery";
      data.query = getQuery();
      data.proxy = getProxy();
      data.agent = getAgent();
      //console.log(JSON.stringify(data));
      break;
    case '/proxy':
      data.type = "newproxy";
      data.proxy = getProxy();
      data.agent = getAgent();
      break;
    case '/agent':
      data.type = "newagent"
      data.agent = getAgent();
      break;
    case '/reset':
      nextQueryIndex = 0;
      proxyList = [];
      loadProxies();
      nextProxyIndex = 0;
      data.type = "response"
      data.message = "Queries and Proxies have been reset." 
      break;
    case '/output':
      data.type = "result"
      data.message = getTargetTable();
      break;
    case '/task':
      data.task = TASK;
      break;
    case '/target':
      let targetdata = getTarget();
      data.type = "target";
      data.query = targetdata.url;
      data.target = targetdata.target;
      data.proxy = getProxy();
      data.agent = getAgent();
      break;
    }

  data = JSON.stringify(data);
  res.writeHead(200,
    {
      'content-type':'text',
      'content-length':data.length
    });
  res.end(data);
  if(data.query == "eof") {
    process.exit();
  }
}


//This query defines the dataset that will be used to generate searches.
//let query = "select distinct a.person, a.school, b.domains from openai.deans a join scraperdata.universities b on a.school = b.name where person is not null order by a.person asc;";
//let query = "select distinct company from dao_companies"
let query = "select * from scraperdata.vw_scraper_datasource";

initilizeData(query)
.then(() => {
  /** start listening */
  const portnumber = 8888;
  const server = http.createServer(requestListener);
  server.listen(portnumber);
  console.log(`Listening on port ${portnumber}.`);

  // for(let i = 0; i<5; i++) {
  //   console.log(sqldata[i]);
  // }
  // console.log(getTarget());
  // console.log(getTarget());
  // console.log(getTarget());
  // console.log(getTarget());
  // console.log(getTarget());
});

async function getSqlData(sqlQuery) {
  console.log("Getting sql data... Please wait.");
  
  //target table is where the data is written.
  targetTable = "output";

  let retval = [];
  //eventually we want the sql query to come from somewhere else.
  retval = await execute(sqlQuery);
  sqldata = retval;  //save an extra copy of it, just in case.
  sqldata.reverse(); //the querylist will be reversed in processing, so this allows to rows to match up.
  if(debugging) console.log("getCompanies() returns: \r" + retval[10]);
  return retval;
}

/** The purpose of this function is to set up the queryList.
 *  The querylist is an array of (eg. "OR") clauses which can be used to construct
 *  a google search.  
 */
async function initilizeData(sqlQuery) {


  //If a searchfile is used, then we can just return the lines from the file to the scraper.
  //but if it's a google search, the url needs to be constructed.
  if (USESEARCHFILE) {
    //Read the file into an array of lines called urls.
    let searchfile = "searchlist.txt";
    let lines = String(fs.readFileSync(searchfile));
    urls = String(lines).split('\n');
  
    //we only want to return urls, so remove any empty lines the urls array.
    for(let i = urls.length -1; i >= 0; i--) {
      //if the line is empty
      if(String(urls[i]).trim().length == 0) {
        //remove it from the array
        urls.splice(i,1)
      } else {
        urls[i] = urls[i].trim();
      }
    }
    
    //The list of urls is stored in a global variable called querylist
    //to be called by the scraper.
    querylist = urls;

    //And now the querylist is ready to be served to the scrapers.

  }
  else //USESEARCHFILE == False 
  {
    //If usesearchfile is false, then we have to build the query that goes to the scraper manually,
    //ultimately creating the ulr of a google search.
    
    //It also means that queries are coming from a database.

    //The query we are building is this: "( (A||B) AND (C||D||E) ) AND (F?||G?||H?)
    //Where F,G,H will be variable.  "Show me x and y from any of these search targets"
    //and where 'these search targets' comes from teh database. Companies or Schools or places.
    //Where A,B,C,D,E are fixed, and F,G,H will be variable.

    //let fixed = '("Professor" OR "Dean" OR "Faculty") AND ("Artificial Intelligence" OR "Machine Learning" OR "Computer Science") AND "email" AND ';
    let fixed = 'site:linkedin.com/in ';

    //To make the variable section, we take some number search targets and make an OR clause
    //out of them.  Agan, search for X and Y from any of these search. (thisplace or thisplace or thisplace)

    //so the variable section starts as a list of companies. 
    let variable = await getSqlData(sqlQuery);  //saving a copy in case we can use it elsewhere.

    //Then, strip any puncation wich might foul up a google search,
    //and then truncate the search term to 5 words to avoid unweildy searches.
    for(let row in variable) {
      for(let field of Object.values(row)){
        field = replaceAll(field,'"','');
        field = replaceAll(field," - ", " ");
        field = replaceAll(field," & ", " ")
        //field = replaceAll(field,',','');
      }
      //console.log(variable[row]);
      variable[row] = variable[row].company;
    }

    //To make an OR clause of out the list of search targets, we need to divide it into groups
    variable = makeGroups(variable, 1);

    //then make an OR clause from each group
    let orClauseArray = [];
    for(let group of variable) {

      // let domains = [];
      // let universities = [];
      // let people = [];
      // for (let school in group){
      //   let d = group[school].domains.split(',');
      //   let u = group[school].school;
      //   let p = group[school].person;
      //   domains = domains.concat(d);
      //   universities = universities.concat(u);
      //   people = people.concat(p);
      // }

      //console.log(variable);

      let t = elementsToOrClause(group)
      //let t = '("gmail.com" OR "hotmail.com" OR "yahoo.com" OR ' + elementsToOrClause(domains) + ') AND ' + elementsToOrClause(universities) + ' AND ' + elementsToOrClause(people);
      //let t = '("gmail.com" OR "hotmail.com" OR "yahoo.com" OR ' + elementsToOrClause(domains) + '))) AND ' + elementsToOrClause(people) + ' AND ' + elementsToOrClause(universities);

      orClauseArray.push(t);

    }

    variable = orClauseArray;
    //console.log(variable);

    //Now we've got a fixed section and variable sections.  
    let allTheSearches = [];
    //allTheSearches = cartesianProduct([fixed,variable]);
    for(let vclause in variable){
      //console.log(vclause);
      let a_search = fixed + variable[vclause];
      allTheSearches.push(a_search)
    }

    //allTheSearches is our list of queries.  Assign it to querylist.
    querylist = allTheSearches;

    //Report the number of searches created.  
    //for(let i = 0; i < querylist.length; i++) console.log(querylist[i]);
    //console.log(querylist);
    console.log(" * Pages to scrape: " + querylist.length);

  }    
}

let historicalSearches = [];
function historicalSearch(topic) {
  let sites = SOCIAL_MEDIA_DOMAINS;
  let dtcs = getTimeCommands(getDayList(2020));

  //console.log(dtcs);
  
  let hs = cartesianProduct([sites,[topic],dtcs])
  querylist = hs;
  //console.log(hs);
  //for(let i = 0; i < hs.length; i++) {
  //  console.log(hs[0],hs[1],hs[2]);
  //  historicalSearches.push(`site:${hs[0][i]}`)
  //}
  //console.log(hs);
}
//historicalSearch("Trump");
//console.log(historicalSearches);


function getTarget() {
  let listLength = querylist.length

  if(nextQueryIndex >= querylist.length){
    console.log("   *** END OF SEARCH ***   ");
    return "eof"
  }  

  let target = sqldata[nextQueryIndex].person;
  let query = getQuery().replace("site%3Alinkedin.com%2Fin++","");
  nextQueryIndex++;
  return {"query":query, "target":target}
}

function getQuery() {

  let listLength = querylist.length

  if(nextQueryIndex >= querylist.length){
    console.log("   *** END OF SEARCH ***   ");
    return "eof"
  }

  if(USESEARCHFILE)
  {
    //If we're using a searchfile, the item in the querylist is just a URL
    query = querylist[nextQueryIndex]
  }
  else
  {
    //if we're not using a search item, then the querylist contains an array of fixed sections and variable sections
    //that together could be used to build a google search.

    let fixed = querylist[nextQueryIndex][0];
    let variable = querylist[nextQueryIndex][1];
    
    //query = site + fixed + variable
    query = querylist[nextQueryIndex]; 
    
    query = googlifyString(query);

    let url = "http://www.google.com/search?q=" + query;
    if(itemsPerPage > 0){
      url += "&num=" + itemsPerPage;
    }
    
    //just for output...
    let snip1 = String(fixed).substring(0,20);
    let snip2 = String(variable).substring(0,20);

    console.log(`${currentTime()} : ${nextQueryIndex + 1} of ${listLength} : ${snip1}...  ${snip2}...`);
    query = url;
  }
  
  nextQueryIndex++;
  return query;
}

function getProxy() {
  loadProxies();
  
  nextProxyIndex++;

  if(nextProxyIndex >= (proxyList.length -1)) {
    nextProxyIndex = 0;
  }

  let proxy = proxyList[nextProxyIndex];

  return proxy;
}

function getAgent() {
  let agent = AGENT_LIST[nextAgentIndex];
  nextAgentIndex++;
  if(nextAgentIndex >= (AGENT_LIST.length -1)) {
    nextAgentIndex = 0;
  }
  return agent;
}

function getTargetTable() {
  return targetTable; 
}

/** Read the proxies into an array.
* filename is a text file that contains rows of data like "prox5.proxyhost.net:12345", one per line. */
function loadProxies(filename = "proxylist.txt") {
  try {
      // read contents of the file
      proxyList = fs.readFileSync(filename).toString().split(/\r\n/);
      }
  catch (err) {
      console.error(err);
      }
  //console.log(proxyList.length + " proxies loaded.");
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