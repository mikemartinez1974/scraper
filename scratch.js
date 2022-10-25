const fs = require('fs');
eval(fs.readFileSync('c:/users/michael/documents/sourcecode/openai/askopenai.js') + '');
eval(fs.readFileSync('c:/users/michael/documents/sourcecode/data/datatools.js') + '');
eval(fs.readFileSync('c:/users/michael/documents/sourcecode/utils/utils.js') + '');

async function begin() {
    console.log(" * BEGIN * ");
    let myArray = await execute("select school from scraperdata.schools");
    //console.log(myArray);

    schools = await execute("select school from scraperdata.schools");
    let schoolGroups = makeGroups(schools,3);

    //console.log(schoolGroups)

    let table = "deans";

    let results;
    let prompt = ""
    for(let group in schoolGroups){
        let s = "";
        
        for(let school in schoolGroups[group]){

            s += "\n" + schoolGroups[group][school].school
        }
        let prompt = '`Give only truthful answers.\nList the deans at these schools:' + s + '\nTo answer, create JSON objects like this: { "school":"Charles Sturt University", "person":"Scott Bowman", "department":"science" }`';
        //console.log(prompt);

        results += await askDavinciList(prompt,[0],table)
    }
    
    console.log(results);
    process.exit();
}



begin().then(() => {
    process.exit();
});


