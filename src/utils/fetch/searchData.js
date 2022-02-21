var defaultObject = {
    info: {
        count: 0,
        next: null,
        pages: 0
    },
    results: []
}

/**
 * Hace una solicitud a una api y retornar el resultado como un objeto
 * @param {string} url :  url a la que se ralizará la petición
 * @param {object | null} signal :  objeto con una instancia de AbourtController 
 * @param {obj | null} def : objeto a retornar en caso de petición incorrecta, valor por defecto
 * { info: {count: 0, next: null, pages: 0 }, results: []}
 * @returns {object} objeto con la data devuelta por la api o un objeto vacio
 */
async function request(url, signal=null, def = null) {
    try {
        const response = (signal !== null) ? await fetch(url, {signal}) : await fetch(url)
        if (response.ok) {
            const data = await response.text();
            const json = JSON.parse(data);
            return json;
        }
        else {
            console.warn(response)
            return (def !== null) ? def : defaultObject
        }
    }
    catch (e) {
        console.error(e)
        return (def !== null) ? def : defaultObject
    }
}

/**
 * Filtra los datos de objetos en una lista de objetos y devuelve una lista con todos los objetos
 * pero con los datos filtrados 
 * @param {list} labels Lista de los nombre de los atributos a mantener
 * @param {list} data Lista de objetos a filtrar
 * @returns {list}
 */
function filterDataObjectList(labels, data) {
    let newData = data.map((obj) => {
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
 * @param {string} urlBase El Url base para hacer consultas a la API 
 * @param {string} schema  El Schema al que se va consultar
 * @param {object} filters Un objeto, donde los atributos son los campos a filtrar y los valores asociados
 * son los elementos por los que se buscará. Example: {name:"rick"}
 * @param {object | null} signal :  objeto con una instancia de AbourtController 
 * @return
 */
async function filterD(urlBase, schema, filters = {}, signal=null) {
    let newUrl = urlBase + schema
    Object.keys(filters).forEach((element, index) => {
        if (index == 0) {
            newUrl += "/?" + element + "=" + filters[element];
        }
        else {
            newUrl += "&" + element + "=" + filters[element];
        }
    })
    let data = await request(newUrl,signal)
    return data
}

/**
 * Obtiene todos los resultados de una consulta general a una API con paginación y devulvelve una lista,
 * además filtra los atributos de los objetos de la lista
 * @param {string} urlBase La url base de la api a consultar, debe tener el formato:
 * url.com/?schema
 * @param {string} schema Esquema a consultar 
 * @param {list} labels Lista de los nombre de los atributos a mantener
 * @param {boolean} chart 
 * @param {object | null} signal :  objeto con una instancia de AbourtController 
 * @returns {list} Lista de resultados
 */
async function getAll(urlBase = "", schema = "", labels, chart = false, signal=null) {
    let info = []
    let next = typeof urlBase === "string" ? urlBase + schema : null
    while (next !== null) {
        let data = await request(next,signal)
        next = data.info.next
        info.push(...filterDataObjectList(labels, data.results));
    }
    if (chart){
        let dta = info.map((d)=>d[labels])
        return dta
    }
    return info;
}

module.exports = {
    request,
    filterD,
    getAll,
    filterDataObjectList
}