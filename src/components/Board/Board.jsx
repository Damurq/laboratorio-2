import React from "react"
import "./Board.css"
import { useEffect, useState } from "react"
import { getAll, filterDataObjectList, request, filterD } from '../../utils/fetch/searchData'
import filterData from '../../data/filterData.json'
import Pagination from '../Pagination/Pagination'
import { capitalice } from "../../utils/others/strModification"

const Board = ({ schema }) => {
    //vars
    const menu = filterData[schema]["menu"]                 // objeto que contiene los menu de busqueda, ordenar y filtro de cada esquema
    //states
    const [data, setData] = useState([])                    // Data a mostrar en la tabla
    const [value, setValue] = useState({ 
        order: menu["order"]["options"], filter: objFilter() 
    })                                                      // Valores de los selects
    const [input, setinput] = useState("")
    //pagination
    const [totalData, setTotalData] = useState([])
    const [currentPage, setCurrentPage] = useState(1) 
    const [totalRecords, setTotalRecords] = useState(21)    //?? N° de registros totales que se deben paginar
    const [pageLimit, setPageLimit] = useState(20)          //?? N° de registros a mostrar en la tabla actual
    //otras
    const urlBase = "https://rickandmortyapi.com/api/"

    /**
     * retorna un objeto donde tenemos las primeras opciones de cada filtro
     * @returns {object} 
     * ejemplo
     * {gender: 'Male', status: 'Alive', species: 'Human'}
     */
    function objFilter() {
        let objData = {}
        if (Object.keys(menu).includes("filter")) {
            menu.filter.forEach((v) => {
                objData[v["label"]] = v["options"][0];
            })
        }
        return objData;
    }

    /**
     * Permite manejar los cambios en los selets de ordenar y filtrar
     * @param {object} event Evento
     */
    const handleChange = (event) => {
        let obj = {...value}
        switch (event.target.className) {
            case "order":
                obj[event.target.className] = event.target.value
                break;
            case "filter":
                obj[event.target.className][event.target.name] = event.target.value
                break;
        }
        setValue(obj)
    }

    function dataModification(event) {
        event.preventDefault()
        const className = event.target.className;
        //console.log(event.target)
        //console.log(totalData)
        if (className.includes("order")) {
            //console.log(value)
            if ((value["order"] === "A-Z") || (value["order"] === "Z-A")) {
                if (totalData.length === 0) {
                    getAll("https://rickandmortyapi.com/api/", schema, filterData[schema]["data"]).then((res) => {
                        setTotalData(res.sort(sorted))
                    })
                } else {
                    setTotalData(totalData.sort(sorted))
                }
            }
        } else if (className.includes("filter")) {
            //console.log(value)
            if (totalData.length === 0) {
                filterD("https://rickandmortyapi.com/api/", schema, value["filter"]).then((res) => {
                    if (res.results.length === 0) {
                        setData([])
                    }
                    else {
                        let fdt = filterDataObjectList(filterData[schema]["data"], res.results);
                        getAll(res.info.next, "", filterData[schema]["data"]).then((r) => {
                            fdt.push(...r)
                            setTotalData(fdt)
                        })
                    }
                })
            } else {
                let result = []
                Object.keys(value["filter"]).forEach((lab, index) => {
                    result = index === 0
                        ? totalData.filter(element => element[lab] === value["filter"][lab])
                        : result.filter(element => element[lab] === value["filter"][lab])
                })
                if (result.length === 0) {
                    setData([])
                } else {
                    setTotalData(result)
                }
            }

        }
        else if (className.includes("search")) {
            if (totalData.length === 0) {
                filterD("https://rickandmortyapi.com/api/", schema, { name: input }).then((res) => {
                    console.log(res)
                    if (res.results.length === 0) {
                        setData([])
                    }
                    else {
                        let fdt = filterDataObjectList(filterData[schema]["data"], res.results);
                        getAll(res.info.next, "", filterData[schema]["data"]).then((r) => {
                            fdt.push(...r)
                            setTotalData(fdt)
                        })
                    }
                })
            } else {
                let result = totalData.filter(element => element["name"].toLowerCase().includes(input.toLowerCase()))
                if (result.length === 0) {
                    setData([])
                } else {
                    setTotalData(result)
                }
            }
        }
    }

    const select = (menu, name = null) => {
        if (menu === "order") {
            return value[menu]
        } else if (menu === "filter") {
            return value[menu][name]
        }
    }

    function handleChangeInput(e) {
        setinput(e.target.value);
    }


    function sorted(a, b) {
        const as = value["order"] === "A-Z" ? 1 : -1
        if (a.name > b.name) {
            return 1 * as;
        }
        if (a.name < b.name) {
            return -1 * as;
        }
        // a must be equal to b
        return 0;
    };

    const onPageChanged = dt => {
        if (totalData.length === 0) {
            setCurrentPage(dt.currentPage);
            let url = dt.currentPage === 1 ? urlBase + schema : urlBase + schema + "?page=" + dt.currentPage
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
            const offset = (dt.currentPage - 1) * pageLimit;
            setTotalRecords(totalData.length);
            //console.log("vamos a ver")
            //console.log(offset)
            //console.log(pageLimit)
            setData(totalData.slice(offset, offset + pageLimit));
            //setPageLimit(offset + pageLimit);
            setCurrentPage(dt.currentPage);
        }
    }

    function reset(event) {
        setTotalData([])
    }

    // 
    useEffect(() => {
        // Verificamos si la lista de datos donde se almacena el conjunto de todos los registros esta vacia
        // ??
        if (totalData.length === 0) {
            const con = new AbortController();
            let { signal } = con
            // Verificamos que el schema a mostrar este en nuestra lista de schemas
            if (Object.keys(filterData).includes(schema)) {
                // ??
                // Esta linea no hace nada
                let url = ((data.currentPage === 1) || (data.currentPage === undefined)) ? urlBase + schema : urlBase + schema + "?page=" + data.currentPage
                request(url, signal)
                    .then((response) => {
                        setTotalRecords(response["info"]["count"]);
                        if (response.results.length > 0) {
                            setPageLimit(response.results.length);
                            let fdt = filterDataObjectList(filterData[schema]["data"], response.results);
                            setData(fdt);
                        }
                    })
            }
            return () => con.abort();
        }
        //??
        else {
            setTotalRecords(totalData.length);
            let final = totalData.length >= 20 ? 19 : totalData.length
            setData(totalData.slice(0, final));
            setCurrentPage(1);
            let btn = document.querySelector('button.page-link')
            if (btn) {
                btn.click();
            }
        }
    }, [totalData]);

    return (
        <div>
            <div className="menu">
                {Object.keys(menu).map((key) => {
                    return (
                        <form key={"form--"+key} className="menu--page">
                            <h2 className="subtitle--1">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                            <div className="menu__imputs">
                                {menu[key].map((i, index) => {
                                    return (
                                        <label key={"label" + key+ index} htmlFor={i.label}>
                                            {i.label}
                                            {i.type !== "select"
                                                ? <input value={input} onChange={handleChangeInput} className={key} type={i.type} name={i.label} />
                                                : <select name={i.label} className={key} value={select(key, i.labe)} onChange={handleChange}>
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
                                <button id={"btn-sello-" + key} className={"btn--sello " + key} onClick={dataModification}>{key}</button>
                            </div>
                        </form>)
                })}
            </div>
            <div className="container__btn">
                <button className="btn--sello" onClick={reset}>Reiniciar Busqueda</button>
            </div>
            <div id="board" className="board">

                {data.length > 0 ?
                    (<React.Fragment>
                        <div className="data">
                            <h2>{schema.charAt(0).toUpperCase() + schema.slice(1) + "s"}</h2>
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
                        </div>
                        <div className="">
                            <div id="totalRecords" className="none" name={totalRecords} >{totalRecords}</div>

                            {totalRecords > 20 ?
                                <Pagination totalRecords={totalRecords} pageLimit={pageLimit} pageNeighbours={1} onPageChanged={onPageChanged} />
                                : <p></p>
                            }
                        </div>
                    </React.Fragment>)
                    : <p className="error">NOT FOUND - 404</p>}

            </div>
        </div>

    );


}

export default Board;