/**
 * @param {string} str :  string que se capitalizará
 * @returns {string} string con la primera letra en mayuscula 
 */
function capitalice(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = {
    capitalice
}