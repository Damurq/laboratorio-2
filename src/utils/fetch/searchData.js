var defaultObject ={
    info:{
        count: 0,
        next: null,
        pages: 0
    },
    results:[]
}


/**
 * 
 * @param {*} url 
 * @returns 
 */
async function request(url){
    try
    {const response = await fetch(url)
    if (!response.ok){   
        return defaultObject
    }
    else{
        const data = await response.text();
        const json = JSON.parse(data);
        return json;
    }}
    catch(e){
        return defaultObject
    }
}
/**
 * 
 * @param {*} labels 
 * @param {*} data 
 * @returns 
 */
function filterDataTable(labels,data){
    let newData = data.map((obj)=>{
        let objData = {}
        labels.forEach((label) => {
            objData[label] = obj[label];
        })
        return objData;
    })
    return newData
}

/**
 * 
 * @param {*} urlBase 
 * @param {*} schema 
 * @param {*} filters 
 */
async function filterD (urlBase="",schema="",filters={}){
    let newUrl = urlBase+schema 
    Object.keys(filters).forEach((element,index)=>{
        if (index==0){
            newUrl+="/?"+element+"="+filters[element];
        }
        else{
            newUrl+="&"+element+"="+filters[element];
        }
    })
    let data = await request(newUrl)
    //console.log(newUrl)
    return data
}

async function getAll (urlBase="",schema="",labels){
    let info =[]
    let next = typeof urlBase==="string" ? urlBase+schema:null 
    while (next!==null) {
        let data = await request(next)
        next= data.info.next
        info.push(...filterDataTable(labels,data.results));
    }
    return info;
}

async function character (){
    let data = await request("https://rickandmortyapi.com/api/character")
    return data.results
}

async function episode (){
    let data = await request("https://rickandmortyapi.com/api/episode")
    return data.results
}

async function getDataBar (section,labels,label){
    let result = await getAll("https://rickandmortyapi.com/api/",section,labels)
        let dta = result.map((d)=>d[label])
        return dta
   
}




module.exports = {
    getDataBar,
    request,
    filterD,
    getAll,
    character,
    episode,
    filterDataTable
}