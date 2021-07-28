import React from "react"
import "./Board.css"
import { useEffect, useState } from "react"
import { filterDataTable, request } from '../../utils/fetch/searchData'
import filterData from '../../data/filterData.json'
import Pagination from '../Pagination/Pagination'

const Board = ({ style }) => {
    const [data, setData] = useState([])//currentCountries
    const [value, setValue] = useState("Seleccione una opcion")

    //pagination
    const [currentPage, setCurrentPage] = useState(1) //currentPage
    const [totalRecords, setTotalRecords] = useState(21)
    const [pageLimit, setPageLimit] = useState(20)
    //otras
    const urlBase = "https://rickandmortyapi.com/api/"
    const menu = filterData[style]["menu"]


    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const onPageChanged = data => {
        setCurrentPage(data.currentPage);
        let url = data.currentPage === 1 ? urlBase + style : urlBase + style + "?page=" + data.currentPage
        request(url)
            .then((response) => {
                setTotalRecords(response["info"]["count"]);
                if (response.results.length > 0) {
                    setPageLimit(response.results.length);
                    let fdt = filterDataTable(filterData[style]["data"], response.results);
                    setData(fdt);
                }
            })
    }

    useEffect(() => {
        const ac = new AbortController();
        if (Object.keys(filterData).includes(style)) {
            let url = data.currentPage === 1 ? urlBase + style : urlBase + style + "?page=" + data.currentPage
        request(url)
            .then((response) => {
                setTotalRecords(response["info"]["count"]);
                if (response.results.length > 0) {
                    setPageLimit(response.results.length);
                    let fdt = filterDataTable(filterData[style]["data"], response.results);
                    setData(fdt);
                }
            })
        }
        return () => ac.abort();
    }, []);

    return (
        <div>
            <div className="menu">
                {Object.keys(menu).map((key) => {
                    return (
                        <div key={key} className="menu--page">
                            <h2 className="subtitle--1">{key}</h2>
                            <div className="menu__imputs">
                                {menu[key].map((i, index) => {
                                    return (
                                        <label key={key + index} htmlFor={i.label}>
                                            {i.label}
                                            {i.type !== "select"
                                                ? <input type={i.type} name={i.label} /> : <select name={i.label} value={value} onChange={handleChange}>
                                                    {i.options.map((l, index2) => {
                                                        return (
                                                            <option key={key + "__option" + index2} value={l}>{l}</option>)
                                                    })}
                                                </select>}
                                        </label>
                                    )
                                })}
                            </div>
                            {key === "search" ? <button className={"btn--" + key}>

                            </button> : <button className={"btn--" + key}>{key}</button>}
                        </div>)
                })}
                <div id="menu">

                </div>
                <div id="menu">

                </div>
            </div>
            <div id="board" className="board">

                {data.length > 0 ?
                    (<React.Fragment>
                        <div className="data">
                            <h2>{style.charAt(0).toUpperCase()+style.slice(1)+"s"}</h2>
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
                            <Pagination totalRecords={totalRecords} pageLimit={pageLimit} pageNeighbours={1} onPageChanged={onPageChanged} />
                        </div>
                    </React.Fragment>)
                    : <p className="error">NOT FOUND - 404</p>}

            </div>
        </div>

    );
}

export default Board;