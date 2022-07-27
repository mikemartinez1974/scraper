const debugging = 1;


/** returns a object that contains a bunch of data arrays. */

    //  Begin Scraper Data.

const AI_TOPICS = ["artificial intelligence","machine learning","computer vision","deep learning","natural language processing","neural networks","gans"];

const AI_TITLES = ["AI VP", "AI Data", "AI Engineer", "AI Developer", "AI Programmer", "AI Scientist", "AI Investor", "AI Manger", "AI Senior", "AI Lead", 
        "AI Head", "AI Chief","CEO OR CTO OR CIO OR COO"];

const OLD_TITLES = ['VP of Applied AI', 'AI Project Lead', 'AI Project Manager', 'AI Project Director','AI Data Scientist','AI Software Engineer','AI Software Developer', 'AI Technology Investor'];

const NEW_AI_LIST = ["VP of Artificial Itelligence", "AI Project Manager", "AI Product Manager", "AI Director", "AI Team Lead", "AI Data Scientist", "AI Data Analyst", "NLP", 
        "Machine Learning", "AI Developer", "AI Researcher", "Deep Learning", "AI Engineer", "AI Investor", "AI Product Owner", "AI Analytics", "AI Architect", "AI CTO", 
        "AI CEO" , "AI Research Scientist"];

const JOB_GROUPS = ['("developer" OR "programmer" OR "engineer")', '("data analyst" OR "data scientist or "data engineer")', '("principal engineer" or "principal architect" or "researcher" OR "research scientist")', 
        '("project manager" OR "product manager")', '("ceo" OR "cto" OR "cio" OR "vp" OR "vice president")'];

const LARGEST_US_CITIES = ['New York City','Los Angeles','Chicago','Houston','Phoenix','San Antonio','Philadelphia','San Diego','Dallas','Austin',
        'San Jose','Fort Worth','Jacksonville','Charlotte','Columbus','Indianapolis','San Francisco','Seattle','Denver','Washington',
        'Boston','El Paso','Nashville','Oklahoma City','Las Vegas','Portland','Detroit','Memphis','Louisville','Milwaukee',
        'Baltimore','Albuquerque','Tucson','Mesa','Fresno','Atlanta','Sacramento','Kansas City','Colorado Springs','Raleigh',
        'Miami','Omaha','Long Beach','Virginia Beach','Oakland','Minneapolis','Tampa','Tulsa','Arlington','Aurora',
        'Wichita','Bakersfield','New Orleans','Cleveland','Henderson','Anaheim','Honolulu','Riverside','Santa Ana','Corpus Christi',
        'Lexington','San Juan','Stockton','St. Paul','Cincinnati','Irvine','Greensboro','Pittsburgh','Lincoln',
        'Durham','Orlando','St. Louis','Chula Vista','Plano','Newark','Anchorage','Fort Wayne','Chandler','Reno',
        'North Las Vegas','Scottsdale','St. Petersburg','Laredo','Gilbert','Toledo','Lubbock','Madison','Glendale','Jersey City',
        'Buffalo','Chesapeake','Winston-Salem','Fremont','Norfolk','Frisco','Paradise','Irving','Garland','Richmond',
        'Arlington','Boise','Spokane','Hialeah','Moreno Valley','Tacoma','Port St. Lucie','McKinney','Fontana','Modesto',
        'Fayetteville','Baton Rouge','San Bernardino','Santa Clarita','Cape Coral','Des Moines','Tempe','Huntsville','Oxnard','Spring Valley',
        'Birmingham','Rochester','Overland Park','Grand Rapids','Yonkers','Salt Lake City','Columbus','Augusta','Amarillo','Tallahassee',
        'Ontario','Montgomery','Little Rock','Akron','Huntington Beach','Grand Prairie','Glendale','Sioux Falls','Sunrise Manor','Aurora',
        'Vancouver','Knoxville','Peoria','Mobile','Chattanooga','Worcester','Brownsville','Fort Lauderdale','Newport News','Elk Grove',
        'Providence','Shreveport','Salem','Pembroke Pines','Eugene','Rancho Cucamonga','Cary','Santa Rosa','Fort Collins','Oceanside',
        'Corona','Enterprise','Garden Grove','Springfield','Clarksville','Murfreesboro','Lakewood','Bayamon','Killeen','Alexandria',
        'Midland','Hayward','Hollywood','Salinas','Lancaster','Macon','Surprise','Sunnyvale','Palmdale',
        'Bellevue','Springfield','Denton','Jackson','Escondido','Pomona','Naperville','Roseville','Thornton','Round Rock',
        'Pasadena','Joliet','Carrollton','McAllen','Paterson','Rockford','Waco','Bridgeport','Miramar','Olathe','Metairie'];

const LARGEST_LATAM_CITIES = ['São Paulo','Mexico City','Lima','Bogotá','Rio de Janeiro','Santiago','Caracas','Buenos Aires','Salvador',
        'Brasília','Fortaleza','Guayaquil','Quito','Belo Horizonte','Medellín','Cali','Havana','Manaus','Curitiba',
        'Ecatepec de Morelos','Maracaibo','Recife','Santa Cruz de la Sierra','Porto Alegre','Guadalajara','Belém','Puebla','Goiânia','Córdoba',
        'Juárez','Montevideo','León','Guarulhos','Tijuana','Barranquilla','Tegucigalpa','Zapopan','Campinas','Barquisimeto',
        'Monterrey','São Luís','Managua','Nezahualcóyotl','São Gonçalo','Maceió','Callao','Santo Domingo','Guatemala City','Port-au-Prince','Rosario'];

const LATAM_TECH_HUBS = ["Monterrey","Mexico City","San Juan","Caracas","Guatemala City","Medellin","Bogotá", "Manaus", "Recife", "Lima",
        "Belo Horizonte", "Rio de Janeiro", "Campinas","São Paulo", "Curitiba", "Santiago", "Buenos Aires"];

const EUROPEAN_TECH_HUBS = ["London", "Berlin", "Paris", "Amsterdam", "Barcelona", "Munich", "Madrid", "Stockholm", "Dublin", "Milan", 
        "Copenhagen", "Tallinn", "Zurich", "Helsinki", "Hamburg", "Athens", "Belfast", "Budapest", "Cambridge", "Edinburgh" , "Ghent",
        "Glasgow", "Kraków", "Limerick", "Lisbon", "Montpellier", "Oslo", "Porto", "Prague", "Riga", "Toulouse", "Vienna", "Vilnius",
        "Warsaw", "Zug"];

const US_TECH_HUBS = ["New York City", "Dallas", "Houston", "Colorado Springs", "Las Vegas", "Tulsa", "Atlanta", "Tampa", "Louisville", "Arlington",
        "Denver", "Los Angeles", "Austin", "Washington D.C.", "Minneapolis", "Nashville", "Kansas City", "Indianapolis", "Baltimore", "Chicago",
        "San Diego", "Columbus", "Boston", "Milwaukee", "Jacksonville", "San Francisco", "El Paso", "Oklahoma City", "San Jose", "Philadelphia",
        "Raleigh", "Memphis", "San Antonio", "Miami", "Tucson", "Albuquerque", "Phoenix", "Charlotte", "Detroit", "Fort Worth",
        "Omaha", "Seattle", "Mesa", "Virginia Beach", "Long Beach", "Sacramento", "Portland", "Fresno", "New Orleans", "Oakland"];

const LARGEST_EUROPEAN_CITIES = ["Istanbul","Moscow","London","Saint Petersburg","Berlin","Madrid","Kyiv","Rome","Bucharest","Paris","Minsk","Vienna","Hamburg",
        "Warsaw","Budapest","Belgrade","Barcelona","Munich","Kharkiv","Milan","Sofia","Prague","Kazan","Nizhny Novgorod","Samara","Birmingham","Rostov-on-Don","Ufa",
        "Cologne","Voronezh","Perm","Volgograd"];

const LARGEST_ASIAN_CITIEST = ["Shanghai","Karachi","Beijing","Mumbai","Delhi","Istanbul","Dhaka","Tokyo","Manila","Guangzhou","Shenzhen","Bangkok","Suzhou",
        "Jakarta","Lahore","Seoul","Ho Chi Minh City","Bengaluru","Dongguan","Chongqing","Nanjing","Tehran","Shenyang","Hanoi","Hong Kong","Baghdad","Chennai",
        "Changsha","Wuhan","Tianjin","Hyderabad","Faisalabad","Foshan","Zunyi","Chittagong","Riyadh","Ahmedabad","Singapore","Shantou","Ankara","Yangon","Chengdu",
        "Kolkata","Xi'an","Surat","Vadodara","Izmir","Zhengzhou","New Taipei City","Yokohama","Hangzhou","Xiamen","Quanzhou","Busan","Rawalpindi","Jeddah","Hyderabad",
        "Kabul","Hefei","Pyongyang","Peshawar","Zhongshan","Pune","Jaipur","Lucknow","Wenzhou","Incheon","Quezon City","Taichung","Kaohsiung","Surabaya","Taipei",
        "Osaka","Dubai","Bandung","Daegu","Nagpur","Nagoya","Baku","Phnom Penh","Kochi","Taoyuan","Medan","Sapporo","Tainan","Almaty","Kuala Lumpur","Davao City",
        "Novosibirsk","Caloocan","Kobe","Yekaterinburg","Khulna","Fukuoka","Kyoto","Kawasaki","Omsk","Ranchi","Chelyabinsk","Krasnoyarsk","Tbilisi","Yerevan",
        "Nur-Sultan","Shymkent"];

const LARGEST_AUSTRALIAN_CITIES = ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Canberra","Hobart","Darwin"];

const INDUSTRIES = ['software','automotive', 'biotechnology','ecommerce', 'healthcare','agriculture'];

const AI_DOMAINS = ["apple.com","aeye.com","algorithmia.com","ailmotive.com","amazon.com","digitaldreamlabs.com","appier.com","argo.ai","atomwise.com","automat.ai",
        "automationanywhere.com","ayasdi.com","bloomreach.com","bluerivertechnology.com","microsoft.com","butterflynetwork.com","capeanalytics.com","casetext.com",
        "cerebras.net","clarifai","cloudminds.com","cognitivescale.com","conversica.com","c3.ai","cyclicarx.com","blackberry.com","dataiku.com","dataminr.com",
        "datarobot.com","deepmind.com","descarteslabs.com","digitalgenius.com","drawbridge.com","linkedin.com","elementai.com","faceplusplus.com","fido.ai",
        "appen.com","fractal.ai","freenome.com","google.com","graphcore.ai","h2O.ai","ibm.com","insidesales.com","insilico.com","integrate.ai","iris-automation.com",
        "huma.com","kasisto.com","leapmind.io","lemonade.com","medopad.com","mindmeld.com","narrativescience.com","nauto.com","neurala.com","getnexar.com",
        "verint.com","aptiv.com","obsidiansecurity.com","oneconcern.com","onfido.com","orbitalinsight.com","owkin.com","perimeterx.com","persado.com","petuum.com",
        "pony.ai","precisionhawk.com","rapidminer.com","redpoints.com","salesforce.com","seamless.ai","sensely.com","sensetime.com","sentient.io","sentientai.com",
        "sherpa.ai","shift-technology.com","sift.com","soundhound.com","sparkcognition.com","sportlogiq.com","tableau.com","tamr.com","tempus.com","relativity.com",
        "trifacta.com","pragma.com","uipath.com","veritone.com","esentire.com","vicarious.com","vidado.ai","visenze.com","workfusion.com","yitutech.com",
        "nanox.vision","zest.ai","zoox.com","zymergen.com"];

//  End scraper data.




/** takes an array and a number.  Returns an array of arrays of the length specified length.*/ 
function makeGroups(myArray, length){
    
    if(debugging) console.warn(`makeGroups([${myArray.length}],${length})`);

    let retval = [];
    let source = [...myArray];
    source.reverse();
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

    if(debugging) console.warn(`elementsToOrClause([${myArray.length}])`);

    retval = myArray.join('" OR "');
    retval = '("' + retval + '")';
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

/** Writes scraped data to file.  If lastpage is false, the same search will continue. */
function writeLeads(lastpage = true){
    //let filename = `output - ${titles[tidx]} - ${industries[iidx]} - ${locales[lidx]}.csv`;
    
    let leadcount = 0;
    let leadsToWrite = [];

    //console.log("writing leads.....");
    //console.log("there are " + ScrapedLeads.length + "!");
    for(let i = 0; i < ScrapedLeads.length; i++)
    {
        let lead = ScrapedLeads[i];
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
        let outputfile = `output - ${locales[localeIndex]}.csv`
        let output = fs.createWriteStream(outputfile,{flags:'a'});
        for(let i = 0; i < leadsToWrite.length; i++)
        {
            let lead = leadsToWrite[i];
            output.write(`"${lead.name}","${lead.title}","${lead.company}","${lead.email}","${lead.location}","${lead.phone}","${lead.link}"\n`);
        }
        output.close();
        console.log("\r\n   " + leadsToWrite.length + ` records written to ${outputfile} ${titleIndex},${industryIndex},${localeIndex}` );
    } 

    ScrapedLeads = [];
    //console.log(`writeLeads(lastpage = true):  lastpage=${lastpage}`);
    createRequestOptions(lastpage);    
}

/** attempt the last request again with a different proxy. */
function retryRequest() {
    createRequestOptions(false,true);
}

/** called when a request returns an error */
function onError(error){
    console.error(error);
    retryRequest();
}

function onRequestComplete(data)
{
    //console.log("From external callback:");
    //console.log(data);

    if(data.indexOf('<title>400 Bad Request</title>') >= 0)
    {
        console.error(" -- BAD REQUEST --")
        retryRequest();
        return;
    }

    const $ = cheerio.load(data);
    
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

        createDataObject(link,headline,details,stub);
    }

    let footerbutton = $(".nBDE1b.G5eFlf");
    let buttontext = footerbutton.text().trim();

    let arrow = (buttontext.substring(buttontext.length -1));
    let lastpage = true;
    switch(arrow)
    {
        case ">":
            lastpage = false;
            break;
        
        case "<":
            lastpage = true;
            break;
        
        default:
            lastpage = true;
            break;
            //console.log("no button here... new search.")
    }

    //console.log(`onRequestComplete: arrow=${arrow}   lastepage=${lastpage}`);
    writeLeads(lastpage);
}

let ScrapedLeads = [];
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
        newlead.email = email[0].trim();
        newlead.phone = phone == null ? '' : phone[0]  // if we found a phone number, put it in, otherwise, an empty string.

        ScrapedLeads.push(newlead)
    }
}


var titles = [];
var industries = [];
var locales = [];
var domains = [];

var titleIndex = 0;
var industryIndex = 0;
var localeIndex = 0;
var domainIndex = 0;

titles = JOB_GROUPS;
//locales = locales = removeDuplicates(LARGEST_US_CITIES.concat(LARGEST_LATAM_CITIES,LARGEST_EUROPEAN_CITIES,LARGEST_ASIAN_CITIEST,LARGEST_AUSTRALIAN_CITIES));
//locales = locales.splice(1*(locales.length/5) - (locales.length/5), (locales.length/5))

domains = AI_DOMAINS;
domains = removeDuplicates(domains)
domains = makeGroups(domains,5);
for(let i = 0; i < domains.length; i++ )
{
    domains[i]=elementsToOrClause(domains[i]);
}

/** returns the URL of the next google search to scrape, based on available data.  If retry is true, it will return the last search performed. */
function getNextSearchURL (pageNumber = 1, retry = false) {
    console.warn(`getNextSearchURL(${pageNumber},${retry})`);
    

    if((pageNumber == 1) && (retry == false) )
    {
        titleIndex += 1;

        if (titleIndex > (titles.length -1))
        {
            titleIndex = 0;
            domainIndex += 1;

            if(domainIndex > (titles.length -1))
            {
                //console.log(titleIndex, titles.length);
                return "eof"
            }
        }
    }

    //console.log(`getNextSearchURL:, titles:${titles.length}/${titleIndex}, industries:${industries.length}/${industryIndex}, locales:${locales.length}/${localeIndex}`);

    let title = googlifyString(titles[titleIndex]);
    //let locale = googlifyString(locales[localeIndex]);
    let domain = googlifyString(domains[domainIndex]);

    let baseURL = "http://www.google.com/search?q=";
    //let query = `site.reddit.com ("artificial intelligence" OR "ai" OR "machine learning" OR "ml" OR "computer vision" OR "deep learning" OR "nlp" OR "natural language processing") AND "${locale}" AND ${title} AND "email" AND ("@gmail.com" OR "@yahoo.com" OR "@hotmail.com")`;
    //let query = `site:linkedin.com/in ("artificial intelligence" OR "ai" OR "machine learning" OR "ml" OR "computer vision" OR "deep learning" OR "nlp" OR "natural language processing") AND "${locale}" AND ${title} AND "email" AND ("@google.com" OR "@amazon.com" OR "@deepmind.com")`;
    let query = `site:linkedin.com/in ("artificial intelligence" OR "machine learning" OR "computer vision" OR "deep learning" OR "natural language processing") AND ${title} AND "email" AND ${domain}`;



    query = googlifyString(query);

    baseURL += query + "&num=100";

    if(pageNumber > 1) {
        baseURL += "&start=" + (pageNumber-1)*100
    }

    //console.log(`getNextSearchURL: pageNumber=${pageNumber}    retry=${retry}`);
    console.log(`${baseURL}`);
    return baseURL
}






