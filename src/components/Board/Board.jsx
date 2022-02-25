// React
import React from "react"
import { useEffect, useState } from "react"
// Components
import Pagination from '../Pagination/Pagination'
// Functions
import { getAll, filterDataObjectList, request, filterD } from '../../utils/fetch/searchData'
import { capitalice } from "../../utils/others/strModification"
// CSS and JSON
import filterData from '../../data/filterData.json'
import "./Board.css"

/**
 * clicks a button
 * @param {string} selector Query selector
 */
function clicFirstPage(selector) {
    let btn = document.querySelector(selector)
    if (btn) {
        btn.click();
    }
}

/**
 * Creates a new object where the attributes included in filterList are not present
 * @param {Object} obj Base object
 * @param {Array} filterList List of attributes to remove from the object
 * @returns new object
 */
function filterObject(obj, filterList) {
    let objData = {}
    Object.keys(obj).forEach((v) => {
        if (!(filterList.includes(obj[v]))) {
            objData[v] = obj[v];
        }
    })
    return objData;
}

const Board = ({ schema }) => {
    // Variables
    const menu = filterData[schema]["menu"]                         // Object that contains the search, sort and filter menus of each scheme
    const URL_BASE = "https://rickandmortyapi.com/api/" + schema      // API URL
    // States
    const [data, setData] = useState([])                    // Data to show in the current table
    const [loading, setloading] = useState(true)
    const [input, setinput] = useState("")                  // Lookup input value
    const [value, setValue] = useState({
        order: objSelect("order"), filter: objSelect("filter")
    })                                                      // Selects values
    //pagination
    const [totalData, setTotalData] = useState([])          // All records resulting from a search, filter or sort
    const [, setCurrentPage] = useState(1)                  // Current page
    const [totalRecords, setTotalRecords] = useState(21)    // Number of total records that must be paginated
    const [pageLimit, setPageLimit] = useState(20)          // Number of records to display in the current table

    /**
    * Returns an object where we have the first options of each select
    * @param {string} form section, "order" or "filter"
    * @returns {object}
     * @returns {object} 
    * @returns {object}
    * example
    * {gender: 'Male', status: 'Alive', species: 'Human'}
    */
    function objSelect(form) {
        let objData = {}
        if (Object.keys(menu).includes(form)) {
            menu[form].forEach((v) => {
                objData[v["label"]] = v["options"][0];
            })
        }
        return objData;
    }

    /**
    * Allows you to handle changes in the sort and filter selets
    * @param {object} event
     */
    const handleChange = (event) => {
        let obj = { ...value }
        obj[event.target.className][event.target.name] = event.target.value
        setValue(obj)
    }

    /**
    * Allows you to handle changes in the search input
    * @param {object} event
     */
    function handleChangeInput(e) {
        setinput(e.target.value);
    }

    /**
     * Sort the data alphabetically
     */
    function orderDataDisplay() {
        if ((value["order"]["name"] === "A-Z") || (value["order"]["name"] === "Z-A")) {
            if (totalData.length === 0) {
                getAll("https://rickandmortyapi.com/api/", schema, filterData[schema]["data"]).then((res) => {
                    setTotalData(res.sort(sorted))
                })
            } else {
                let result = []
                result = totalData.sort(sorted)
                totalData.length <= pageLimit ? setData(result.map((i) => i)) : setTotalData(result)
                clicFirstPage('button.page-link')
            }
        }
    }

    /**
     * Filter the data
     */
    function filterDataDisplay() {
        let filters = filterObject(value["filter"], ["Selececione una opción"])
        if (totalData.length === 0) {
            filterD("https://rickandmortyapi.com/api/", schema, filters).then((res) => {
                getAll(res, "", filterData[schema]["data"]).then((r) => {
                    r.length !== 0 ? setTotalData(r) : setData(r)
                })
            })
        } else {
            let result = []
            Object.keys(filters).forEach((lab, index) => {
                result = index === 0
                    ? totalData.filter(element => element[lab] === value["filter"][lab])
                    : result.filter(element => element[lab] === value["filter"][lab])
            })
            result.length !== 0 ? setTotalData(result) : setData(result)
        }
    }

    /**
     * Search by search input
     */
    function searchDataDisplay() {
        if (totalData.length === 0) {
            filterD("https://rickandmortyapi.com/api/", schema, { name: input }).then((res) => {
                getAll(res, "", filterData[schema]["data"]).then((r) => {
                    r.length !== 0 ? setTotalData(r) : setData(r)
                })
            })
        }
        else {
            let result = totalData.filter(element => element["name"].toLowerCase().includes(input.toLowerCase()))
            result.length !== 0 ? setTotalData(result) : setData(result)
        }
    }

    /**
     *  Identifies the button pressed and activates the corresponding action
     * @param {object} event
     */
    function dataModification(event) {
        event.preventDefault()
        const className = event.target.className;
        setloading(true)
        if (className.includes("order")) {
            orderDataDisplay()
        }
        else if (className.includes("filter")) {
            filterDataDisplay()
        }
        else if (className.includes("search")) {
            searchDataDisplay()
        }
        setloading(false)
    }

    /**
     * Sort A-Z or Z-A 2 items
     * @param {object} a 
     * @param {object} b 
     * @returns 
     */
    function sorted(a, b) {
        const as = value["order"]["name"] === "A-Z" ? 1 : -1
        if (a.name > b.name) {
            return 1 * as;
        }
        if (a.name < b.name) {
            return -1 * as;
        }
        // a must be equal to b
        return 0;
    };

    /**
     * Allow change the page
     * @param {object} dt
     *  dt = {
     *      currentPage,
     *      totalPages: this.totalPages,
     *      pageLimit: this.pageLimit,
     *      totalRecords: this.totalRecords
     * }
     */
    const onPageChanged = dt => {
        if (totalData.length === 0) {
            setCurrentPage(dt.currentPage);
            let url = dt.currentPage === 1 ? URL_BASE : URL_BASE + "?page=" + dt.currentPage
            request(url)
                .then((response) => {
                    setTotalRecords(response["info"]["count"]);
                    if (response.results.length > 0) {
                        setPageLimit(response.results.length);
                        let fdt = filterDataObjectList(filterData[schema]["data"], response.results);
                        setData(fdt);
                    }
                })
        } else {
            const offset = (dt.currentPage - 1) * dt.pageLimit;
            setTotalRecords(totalData.length);
            setData(totalData.slice(offset, offset + dt.pageLimit));
            setCurrentPage(dt.currentPage);
        }
    }

    useEffect(() => {
        // Verify if the data list where the set of all records is stored is empty       
        if (totalData.length === 0) {
            const con = new AbortController();
            let { signal } = con
            // Verify that the schema to show is in our list of schemas
            if (Object.keys(filterData).includes(schema)) {
                request(URL_BASE, signal)
                    .then((response) => {
                        setTotalRecords(response["info"]["count"]);
                        if (response.results.length > 0) {
                            setPageLimit(response.results.length);
                            let fdt = filterDataObjectList(filterData[schema]["data"], response.results);
                            setData(fdt);
                            setloading(false)
                        }
                    })
            }
            return () => con.abort();
        }
        else {
            setTotalRecords(totalData.length);
            let final = totalData.length >= 20 ? 19 : totalData.length
            // Data to show
            setData(totalData.slice(0, final));
            setCurrentPage(1);
            // Update the table
            clicFirstPage('button.page-link')
        }
    }, [totalData, schema, URL_BASE]);


    return (
        <div>
            <div className="menu">
                {Object.keys(menu).map((key) => {
                    return (
                        <form key={"form--" + key} className="menu--page">
                            <h2 className="subtitle--1">{capitalice(key)}</h2>
                            <div className="menu__imputs">
                                {menu[key].map((i, index) => {
                                    return (
                                        <label key={"label" + key + index} htmlFor={i.label}>
                                            {capitalice(i.label)}
                                            {i.type !== "select"
                                                ? <input value={input} onChange={handleChangeInput} className={key} type={i.type} name={i.label} />
                                                : <select name={i.label} className={key} value={value[key][i.label]} onChange={handleChange}>
                                                    {i.options.map((l, index2) => {
                                                        return (
                                                            <option key={key + "__option" + index2} value={l}>{l}</option>)
                                                    })}
                                                </select>}
                                        </label>
                                    )
                                })}
                            </div>
                            <div className="container__btn">
                                <button id={"btn-sello-" + key} className={"btn--sello " + key} onClick={dataModification}>{capitalice(key)}</button>
                            </div>
                        </form>)
                })}
            </div>
            <div className="container__btn">
                <button className="btn--sello" onClick={() => { setTotalData([]) }}>Reiniciar Busqueda</button>
            </div>
            <div id="board" className="board">
                <div className="data">
                    <h2>{schema.charAt(0).toUpperCase() + schema.slice(1) + "s"}</h2>
                    {loading
                        ? <div className="center-container"><div class="lds-facebook"><div></div><div></div><div></div></div></div>
                        : data.length > 0
                            ? (<React.Fragment>
                                <table>
                                    <thead>
                                        <tr>
                                            {Object.keys(data[0]).map((val, i) => {
                                                return (
                                                    <th key={val + "--" + i}>{val}</th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((obj) => {
                                            return (
                                                <tr key={"obj--" + obj.id}>
                                                    {Object.keys(obj).map((camp, ndx2) => {
                                                        return (<td key={"camp--" + ndx2 + camp + obj.id}>{obj[camp]}</td>)
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="">
                                    <div id="totalRecords" className="none" name={totalRecords} >{totalRecords}</div>

                                    {totalRecords > 20 ?
                                        <Pagination totalRecords={totalRecords} pageLimit={pageLimit} pageNeighbours={1} onPageChanged={onPageChanged} />
                                        : <p></p>
                                    }
                                </div>
                            </React.Fragment>)
                            : <p className="error">NOT DATA</p>}
                </div>
            </div>
        </div>
    );
}

export default Board;