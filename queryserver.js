const debugging = false;

const fs = require('fs');
const http = require('http');
eval(fs.readFileSync(__dirname + '/utils.js')+'');
//eval(fs.readFileSync(__dirname + '/eduDomainData.js')+'');
eval(fs.readFileSync(__dirname + '/data.js')+'');

//  Begin Scraper Data.
const AI_TITLES = ["AI VP", "AI Data", "AI Engineer", "AI Developer", "AI Programmer", "AI Scientist", "AI Investor", "AI Manger", "AI Senior", "AI Lead", 
    "AI Head", "AI Chief","CEO OR CTO OR CIO OR COO"];

const OLD_TITLES = ['VP of Applied AI', 'AI Project Lead', 'AI Project Manager', 'AI Project Director','AI Data Scientist','AI Software Engineer','AI Software Developer', 'AI Technology Investor'];
    
const NEW_AI_LIST = ["VP of Artificial Itelligence", "AI Project Manager", "AI Product Manager", "AI Director", "AI Team Lead", "AI Data Scientist", "AI Data Analyst", "NLP", 
    "Machine Learning", "AI Developer", "AI Researcher", "Deep Learning", "AI Engineer", "AI Investor", "AI Product Owner", "AI Analytics", "AI Architect", "AI CTO", 
    "AI CEO" , "AI Research Scientist"];

const JOB_GROUPS = ['("developer" OR "programmer" OR "engineer")', 
    '("data analyst" OR "data scientist OR "data engineer")', 
    '("principal engineer" OR "principal architect" OR "researcher" OR "research scientist")', 
    '("project manager" OR "product manager" OR "product owner")', 
    '("ceo" OR "cto" OR "cio" OR "vp" OR "vice president")',
    '("technology" OR "student" OR "investor")',
    '("bod" OR "president" OR "director" OR "manager")',
    '("front end" OR "back end" OR "full stack")',
    '("computer science" OR "solution" OR "applied AI")',
    '("postdoc" OR "professor")'];

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
    "Warsaw", "Zug"]

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

const AI_DOMAINS = ["apple.com","aeye.com","algorithmia.com","aimotive.com","amazon.com","digitaldreamlabs.com","appier.com","argo.ai","atomwise.com","automat.ai",
"automationanywhere.com","ayasdi.com","bloomreach.com","bluerivertechnology.com","microsoft.com","butterflynetwork.com","capeanalytics.com","casetext.com",
"cerebras.net","clarifai","cloudminds.com","cognitivescale.com","conversica.com","c3.ai","cyclicarx.com","blackberry.com","dataiku.com","dataminr.com",
"datarobot.com","deepmind.com","descarteslabs.com","digitalgenius.com","drawbridge.com","linkedin.com","elementai.com","faceplusplus.com","fido.ai",
"appen.com","fractal.ai","freenome.com","google.com","graphcore.ai","h2O.ai","ibm.com","insidesales.com","insilico.com","integrate.ai","iris-automation.com",
"huma.com","kasisto.com","leapmind.io","lemonade.com","medopad.com","mindmeld.com","narrativescience.com","nauto.com","neurala.com","getnexar.com",
"verint.com","aptiv.com","obsidiansecurity.com","oneconcern.com","onfido.com","orbitalinsight.com","owkin.com","perimeterx.com","persado.com","petuum.com",
"pony.ai","precisionhawk.com","rapidminer.com","redpoints.com","salesforce.com","seamless.ai","sensely.com","sensetime.com","sentient.io","sentientai.com",
"sherpa.ai","shift-technology.com","sift.com","soundhound.com","sparkcognition.com","sportlogiq.com","tableau.com","tamr.com","tempus.com","relativity.com",
"trifacta.com","pragma.com","uipath.com","veritone.com","esentire.com","vicarious.com","vidado.ai","visenze.com","workfusion.com","yitutech.com",
"nanox.vision","zest.ai","zoox.com","zymergen.com",'zuru.ai','zoundream.com','zoox.com','zignallabs.com','zibra.ai','zegami.com','xccelerate.co','deloitte.com',
'deloitte.com','zoho.com','zineone.com','zillow.com','zensar.com','zebra-med.com','worldbank.org','wordspath.com','wizeline.com','wiz.ai','wipro.com',
'winwire.com','whetstone.ai','welocalize.com','vw.com','voxelmaps.com','voix.ai','vinsys.com','vicarioussurgical.com','veritone.com','verint.com',
'venconsolutions.com','vedadata.com','valeo.com','vale.com','upgrad.com','uniphore.com','unilever.com','uhc.com','uchicago.edu','tum-ai.com','truthset.io',
'tricentis.com','tri.global','transperfect.com','tooploox.com','ti8m.com','thoughtexchange.com','thebimengineers.com','the-mtc.org','tenz.ai','tempus.com',
'telusinternational.com','techmahindra.com','tcs.com','tcl.com','tataelxsi.com','talentica.com','szjialan.com','sysmex-europe.com','syngenta.com','syglass.io',
'svi.edu.au','sutherlandglobal.com','supportlogic.io','suki.ai','sterblue.com','stellaautomotive.com','sprinklr.com','soundhound.com','sorcero.com',
'softbankrobotics.com','sofiasalud.com','soco.ai','smartia.tech','signifyd.com','signaturescience.com','sigma-alimentos.com','siemens.com','siemens-healthineers.com',
'sharecare.com','shaip.com','sgsinc.net','sgs.com','sensetime.com','sensely.com','sensat.co','schaeffler.com','sas.com','sap.com','samyak.com','samsungsds.com',
'samsungsds.com','samsung.com','samespace.com','sama.com','rws.com','rootstrap.com','rolls-royce.com','ringcentral.com','rgare.com','rev.com','remedyhealthmedia.com',
'recogn.ai','rappi.com.mx','rapidai.com','radii.sg','qualcomm.com','qlarityimaging.com','pypestream.com','pymetrics.ai','preferred.jp','posh.tech','pinterest.com',
'pharmacity.vn','persistent.com','persado.com','perceptiveautomata.com','pepsico.com','palexy.com','orb-data.com','orange.es','oracle.com','ontotext.com',
'omniaz.io','oculus.com','nvidia.com','nuro.ai','nuro.ai','numerator.com','nuance.com','nuance.com','nrf.gov.sg','novartis.com','nissan-global.com',
'nice.com','neweraai.com','nestle.com','neatcommerce.com','nauto.com','natcen.ac.uk','nashtechglobal.com','nanox.vision','mulesoft.com','monex.com.mx',
'moh.gov.sa','mldataocean.com','mindsay.com','mile.cloud','microsoft.com','michaelpage.com','medcase.health','mckinsey.com','mcgowantranscriptions.co.uk',
'maxar.com','massgeneral.org','marlabs.com','manpowergroup.com.mx','magicdatatech.com','lydia.ai','logicmonitor.com','liveperson.com','linkedin.com','linkedin.com',
'linkedin.com','leidos.com','legato.com','languagescientific.com','lala.com.mx','laion.ai','kyndryl.com','kriptos.io','konux.com','kmlvision.com','kitware.com',
'kensho.com','kena.ai','juristat.com','jpmorganchase.com','jpl.jobs','jobhopin.com','jnj.com','jampp.com','itau.com','ishir.com','ironsystems.com','iqvia.com',
'involve.ai','intuitionrobotics.com','interactions.com','intelliway.com.br','innotech.co.jp','infosearchbpo.com','improbable.io','impendianalytics.com','idexcel.com',
'icertis.com','ibm.com','ibm.com','hyperlinkinfosystem.com','hikrobotics.com','healius.com.au','haptik.ai','gruposalinas.com','grupogigante.com.mx','groove-x.com',
'grammarly.com','gnp.com.mx','globalvoices.com','globalizationpartners.com','gep.com','geotab.com','genmab.com','genesys.com','genesys.com','generalblockchain.com',
'geekplus.com','gaiadesign.com.mx','freenome.com','freed.group','focusfwd.com','flatworldsolutions.com','five9.com','filament.ai','fidelity.com','exo-metrics.com',
'evolution.ai','ericsson.com','epicgames.com','enterprisebot.ai','elpuertodeliverpool.mx','electrifai.net','effectiff.com','edgetier.com','edgecase.ai','ecinnovations.com',
'dynata.com','dnsfilter.com','dixa.com','disperse.io','dialpad.com','dell.com','defined.ai','deepset.ai','deepen.ai','deepc.ai','deepbrainai.io','deacero.com',
'datatobiz.com','datatang.ai','datarobot.com','datapure.co','datalabeler.com','dataart.com','cygnet-infotech.com','cspsolutions.com','crestdatasys.com','createcareers.com.au',
'crayondata.com','cpall.co.th','coverahealth.com','coppel.com','conxai.com','conversationdesigninstitute.com','continental.com','concentrix.com','commonwealthcarealliance.org',
'colgatepalmolive.com.mx','cognizant.com','cognigy.com','cognicor.com','cogitotech.com','clustertech.com','cloudminds.com','clarabridge.com','circulohealth.com',
'choiceworx.com','cemex.com','casepoint.com','capillarytech.com','capestart.com','calyx.ai','builder.ai','bridgewell.com','botsify.com','boost.ai','bmwgroup.com',
'bix-tech.com','biomatterdesigns.com','binah.ai','beyondanalysis.info','benevolent.com','bbva.mx','banorte.com','banamex.com','automationanywhere.com','atomwise.com',
'ateliersai.com','astrazeneca.com','ascentregtech.com','asapp.com','argo.ai','aquabyte.ai','aptiv.com','apple.com','anomalo.com','anomalo.com','annotateit.com',
'ampol.com.au','americamovil.com','althea-group.com','alten.com','altada.com','alpha-sense.com','almuradgroup.com','algolia.com','aivo.co','aitomatic.com','airudder.com',
'airbus.com','aims.ai','aigora.de','aidlab.hk','aidatainnovations.com','aicrowd.com','aicra.org','ai.sony','ai.se','ai-ms.com','aeye.ai','adec-innovations.com',
'ada.cx','acusis.com','active.ai','accenture.com','accenture.com','accenture.com','accenture.com','aboutschwab.com','abbott.com','a-star.edu.sg','a-star.edu.sg',
'8x8.com','3m.com','247.ai','woebothealth.com','willdom.com','whereismytransport.com','waymo.com','waverleysoftware.com','waabi.ai','vtcc.vn','viso.ai','vintra.io',
'verbit.ai','velodynelidar.com','us.eisai.com','urbint.com','upfield.com','ubiai.tools','twoimpulse.com','tryolabs.com','trigma.com','tri.global','towardsai.net',
'titanx.ai','tissini.com','tion - Website','thewaltdisneycompany.com','thelevel.ai','thehive.ai','terstock.com','tec.mx','taiger.com','t.com','symphonyhealth.com','symbl.ai',
'sutrixgroup.com','super.ai','sunix.in','summalinguae.com','successkpi.com','stpc.ai','stermedia.ai','social.abb','silo.ai','sigmoidal.io','sift.com','se.biz',
'scribe.com','s.com','riskified.com','revolveai.com','resumepuppy.com','refraction.ai','recursiveai.co.jp','rdassetmanagement.com','precysecodingsolutions.com',
'policybazaar.com','playment.io','plainsight.ai','picnichealth.com','phrasee.co','people.ai','osai.ai','orbit.health','optellum.com','omdena.com',
'oecd.ai','objectcomputing.com','nubank.com.br','ntechlab.com','nrglab.asia','nnaisense.com','nexocode.com','nearshore.perficient.com','mvetec.com','multilingualconnections.com',
'mty.ai','motional.com','mostly.ai','moove-it.com','momo.vn','mobike.com','mobidev.biz','missiontranslate.com','mindy-support.com','measurable.ai','mabe.cc',
'lxt.ai','loconav.com','linguistixtank.com','lilt.com','lightyear.one','landing.ai','kore.ai','konverge.ai','kodiak.ai','kili-technology.com','keyreply.com','kata.ai',
'karakuri.mx','kama.ai','jina.ai','io','intetics.com','intersog.com','Intelligence Inspection Limited','integrio.net','insurify.com','innodata.com','ineuron.ai','indatalabs.com',
'inbvesthk.gov.hk','improveandgo.com','imerit.net','imedx.com','iflytek.com','hqsoftwarelab.com','hotmart.com','hotg.ai','hospitalonmobile.com','home.kpmg','hexaware.com',
'heligate.com.vn','hatchworks.com','h2o.ai','grupobimbo.com','lazada.com','bureauveritas.com','gridpredict.jp','axon.com','geopi.pe','foxglove.dev','flo.health',
'fireflies.ai','feedzai.com','facil.ai','eyris.io','evam.com','emagevisionpl.com','e.ai','dualbootpartners.com','dmetrics.com','digitate.com','digitalinsights.qiagen.com',
'digital-nirvana.com','diffco.us','dida.do','delvi.tech','deepxhub.com','deeperinsights.com','deep6.ai','dayta.ai','datatonic.com','dataloop.ai','datalab-munich.com',
'Dataiku.com','databricks.com','cyracom.com','curiousthing.io','creative-ai.tech','converseon.com','coca-colafemsa.com','cloud.google.com','clip.mx','clario.com',
'cinnamon.is','cherre.com','cccis.com','cccis.com','cariad.technology','careers.sportsbet.com.au','c3dti.ai','builtin.com','buddi.ai','broutonlab.com','bridgei2i.com',
'book.com, https:','blueoceans.ai','bitso.com','bigvision.ai','bbva.csod.com','bal.com','avantusfederal.com','avaamo.ai','authid.ai','aurora.tech','audiotranscriptioncenter.com',
'atos.net','atonarp.com','arturo.ai','arevo.com','app.spare5.com','anotherbrain.ai','amplify.ai','amantyatech.com','aitouch.in','aisuperior.com','aisera.com',
'aimultiple.com','aimotive.com','aimexico.org','ai-tech.io','afry.com','achievion.com','4dmedical.com'];

const MORE_DOMAINS = ["walmart.com","amazon.com","apple.com","cvshealth.com","unitedhealthgroup.co","berkshirehathaway.com","mckesson.com","amerisourcebergen.com","alphabet.com",
"corporate.exxonmobil.com","att.com","costco.com","cigna.com","cardinalhealth.com","microsoft.com","walgreensbootsalliance.com","kroger.com","homedepot.com",
"jpmorganchase.com","verizon.com","corporate.ford.com","gm.com","anthem.com","centene.com","fanniemae.com","corporate.comcast.com","chevron.com","delltechnologies.com",
"bankofamerica.com","target.com","lowes.com","marathonpetroleum.com","citigroup.com","fb.com","ups.com","jnj.com","wellsfargo.com","ge.com","joenachbaur.com",
"intel.com","humana.com","ibm.com","us.pg.com","pepsico.com","fedex.com","metlife.com","freddiemac.com","phillips66.com","lockheedmartin.com","thewaltdisneycompany.com",
"adm.com","albertsons.co","valero.com","boeing.com","prudential.com","hp.com","rtx.com","stonex.com","goldmansachs.com","sysco.com","morganstanley.com",
"hcahealthcare.co","cisco.com","corporate.charter.com","merck.com","bestbuy.com","newyorklife.com","abbvie.com","publix.com","allstate.com","libertymutual.co",
"aig.com","tysonfoods.com","progressive.co","bms.com","nationwide.com","pfizer.com","caterpillar.com","tiaa.org","oracle.com","energytransfer.com","dow.com",
"americanexpress.com","gd.com","nike.com","northropgrumman.com","usaa.com","deere.com","abbott.com","northwesternmutual.com","dollargeneral.com","exeloncorp.com",
"coca-cola.com","honeywell.com","thermofisher.com","3m.com","tjx.com","travelers.com","capitalone.com","tesla.com","pmi.com","arrow.com","chsinc.com","jabil.com",
"enterpriseproducts.com","hpe.com","unfi.com","mondelezinternational.com","viacomcbs.com","kraftheinzcompany.com","dollartree.com","amgen.com","usbank.com","pfgc.com",
"netflix.com","gilead.com","tdsynnex.com","lilly.com","truist.com","pnc.com","broadcom.com","cbre.com","massmutual.com","qualcomm.com","starbucks.com","duke-energy.co",
"lainsallamerican.com","usfoods.com","lennar.com","danaher.com","aflac.com","riteaid.com","visa.co","stor.pypl.com","micron.com","carmax.com","salesforce.com",
"altria.com","lumen.com","bakerhughes.com","internationalpaper.com","thehartford.com","penskeautomotive.com","dupont.com","autonation.com","southernrailway.com",
"wfscorp.co","drhorton.com","nucor.com","cummins.com"];

const SOCIAL_MEDIA_DOMAINS = ["facebook.com", "twitter.com", "instagram.com", "tiktok.com", "pinterest.com", "youtube.com"]

const NEWS_DOMAINS = ["cnn.com", "msnbc.com", "foxnews.com", "usatoday.com","reuters.com","washingtonpost.com","c-span.org","weather.com","ap.org","bloomberg.com",
  "forbes.com", "theatlantic.com", "wn.com", "yahoo.com", "go.com", "thenation.com", "newrepublic.com","time.com","newsweek.com","politico.com"];

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

const AI_KEYWORDS = ["algorithm","artificial intelligence","automatic learning","autonomous","big data","chatbot","cognitive computing","computational learning theory",
    "computer vision","cluster analysis","data mining","decision tree","deep learning","game ai","knowledge engineering","machine intelligence","machine learning",
    "machine perception","machine translation","natural language processing","natural language understanding","neural network","pattern recognition","predictive analysis",
    "reinforcement learning","semantic annotation","strong ai","supervised learning","training data","transfer learning","unsupervised learning"];



const TASK = "linkedin";

let eduDomains = []

let proxyList = [];
let nextProxyIndex = 0;
loadProxies('iproyal.txt');
let querylist = [];
let nextQueryIndex = 0;
let nextAgentIndex = 0;


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
    case '/task':
      data.task = TASK;
      break;
    }

  data = JSON.stringify(data);
  res.writeHead(200,
    {
      'content-type':'text',
      'content-length':data.length
    });
  res.end(data);
}

/** start listening */
const portnumber = 8888;
const server = http.createServer(requestListener);
server.listen(portnumber);
console.log(`Listening on port ${portnumber}.`);



function initilizeData() {
  
  //let us1000 = [...getFortune1k2022()];
  //let eu1000 = [...getFT1kEurope2022()];
  //let ap500 = [...getFT500AsiaPacific2021()];
  //let companies = us1000.concat(eu1000,ap500);

  //let companies = companiesByIndustry("automotive");
  //companies = companies.filter(company => parseInt(company.current_headcount,0) > 25);
  //let names = [];
  //companies.forEach((company) => {
  //  names.push(company.name);
  //})

  //names.forEach((name) => {
  //  if(name.split(" ").length > 5)
  //  {
  //    name = name.split(" ").splice(0,5).join(" ");
  //  }
  //});

  let names = ["ibm","cisco","oracle","microsoft"];
  let titles = [...JOB_GROUPS];

  let topics = ['("artificial intelligence" OR "machine learning" OR "computer vision")', '("deep learning" OR "natural language processing" OR "big data")'];

  //querylist = cartesianProduct([topics,names,titles]);
  //querylist = shuffleArray(querylist);
  querylist = cartesianProduct([topics,titles,US_TECH_HUBS]);

  console.log(querylist[0]);
  console.log(querylist.length);
  /*   If you start to get confused, this is the way this is supposed to work....
  let titles = [...JOB_GROUPS];
  let domains = removeDuplicates([...AI_DOMAINS])
  domains = makeGroups(domains,3);
  for(let i=0; i<domains.length; i++) {
    let orclause = elementsToOrClause(domains[i]);
    domains[i] = orclause;
  }
  querylist = cartesianProduct([titles,domains]);
  */
  //console.log(querylist);

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

initilizeData();

function getQuery() {

  if(nextQueryIndex >= querylist.length -1){
    console.log("   *** END OF SEARCH ***   ")
    return "eof"
  }
  
  let site = "site:linkedin.com/in";
  let topic = querylist[nextQueryIndex][0]
  let title = querylist[nextQueryIndex][2];
  let company = querylist[nextQueryIndex][1];
  //console.log(domain);
  //let query = `${site} ${topic} AND "${title}" AND ${domain} AND "email"`;
  let query = `${site} ${topic} AND ${title} AND "${company}" AND "email" AND ("com" OR "net" OR "org" OR "ai" OR "io") -recruiter -"human" -sales -marketing -account`;
  query = googlifyString(query);
  query = "http://www.google.com/search?q=" + query;
  
  console.log(`${nextQueryIndex +1} of ${querylist.length}  `, topic, title, company);
  
  nextQueryIndex++;
  return query;
}

function getProxy() {
  let proxy = proxyList[nextProxyIndex];
  nextProxyIndex++;
  if(nextProxyIndex >= (proxyList.length -1)) {
    nextProxyIndex = 0;
  }
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
  console.log(proxyList.length + " proxies loaded.");
}


