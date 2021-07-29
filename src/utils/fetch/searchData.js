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
    //console.log(data)
    return data.results
}

async function episode (){
    let data = await request("https://rickandmortyapi.com/api/episode")
    return data.results
}

async function location (){
    let data = await request("https://rickandmortyapi.com/api/location")
    return data.results
}
// filterD("https://rickandmortyapi.com/api/","character",{gender:"male"}).then((result)=>{
//      console.log(result)
//  })
// getAll("https://rickandmortyapi.com/api/","location",["id","name","type","dimension"]).then((result)=>{
//      let generos = result.map((gen)=>gen["dimension"])
//      console.log(generos)
// console.log(generos.filter((valor, indice) => {
//         return generos.indexOf(valor) === indice;
//       }))
// })
// getAll("https://rickandmortyapi.com/api/","character",["id","name","status","species","gender"]).then((result)=>{
//      let generos = result.map((gen)=>gen["gender"])
//      console.log(generos)
// console.log(generos.filter((valor, indice) => {
//         return generos.indexOf(valor) === indice;
//       }))
// })
// var da =[]
// character().then((result)=>{
//     console.log(result)
//     da = filterDataTable(["id","name","status","species","gender"],result)
//     console.log(da)
// })
// console.log(da)
module.exports = {
    request,
    filterD,
    getAll,
    character,
    episode,
    location,
    filterDataTable
}