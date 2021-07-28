
async function request(url){
    const response = await fetch(url)
    if (!response.ok){   
        throw new Error("WARN", response.status);
    }
    const data = await response.text();
    const json = JSON.parse(data);
    return json;
}

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
//console.log(character())

//console.log(filterDataTable(["id","name","status","species","gender"],character()))

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
// var da =[]
// character().then((result)=>{
//     console.log(result)
//     da = filterDataTable(["id","name","status","species","gender"],result)
//     console.log(da)

// })
// console.log(da)
module.exports = {
    request,
    character,
    episode,
    location,
    filterDataTable
}