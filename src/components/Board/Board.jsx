import React from "react"
import "./Board.css"
import { useEffect, useState } from "react"
import { getAll,filterDataTable, request ,filterD} from '../../utils/fetch/searchData'
import filterData from '../../data/filterData.json'
import Pagination from '../Pagination/Pagination'

const Board = ({ style }) => {
    const menu = filterData[style]["menu"]
    const [data, setData] = useState([])//currentCountries
    //const [value, setValue] = useState({order:"Seleccione una opcion",filter:objFilter()})
    const [value, setValue] = useState({order:"Seleccione una opcion"})

    //pagination
    const [totalData, settotalData] = useState([])
    const [currentPage, setCurrentPage] = useState(1) //currentPage
    const [totalRecords, setTotalRecords] = useState(21)
    const [pageLimit, setPageLimit] = useState(20)
    //otras
    const urlBase = "https://rickandmortyapi.com/api/"

    // function objFilter() {
    //     let objData = {}
    //     if (Object.keys(menu).includes("filter")){
    //         menu.filter.forEach((v) => {
    //             objData[v["label"]] = v["options"][0];
    //         })
    //     }
    //     return objData;
    // }

    const handleChange = (event) => {
        let obj = value
        //console.log(event.target)
        // if (event.target.key==="order") {
            obj[event.target.className] = event.target.value
        // } else {
        //     obj[event.target.className][event.target.name] = event.target.value
        // }
        setValue(obj)
    }

    function dataModification (event)   {
        event.preventDefault()
        const className = event.target.className;
        //console.log(event.target)
        //console.log(totalData)
        if (className.includes("order")) {
            //console.log(value)
            if ((value["order"]==="A-Z")||(value["order"]==="Z-A")) {
                if (totalData.length===0) {
                    getAll("https://rickandmortyapi.com/api/",style,filterData[style]["data"]).then((res) => {
                        settotalData(res.sort(sorted))
                    })
                } else {
                    settotalData(totalData.sort(sorted))
                }
            } 
        } else if (className.includes("filter")){
            //console.log(value)
            filterD("https://rickandmortyapi.com/api/",style,value["filter"]).then((res) => {
                //console.log(res)
                let fdt = filterDataTable(filterData[style]["data"], res.results);
                getAll(res.info.next,"",filterData[style]["data"]).then((r)=>{
                    fdt.push(...r)
                    settotalData(fdt)
                })
            })
        }
    }

    const select = (menu,name=null,name2=null)  => {
        if (menu==="order") {
            return value[menu]
        } else {
            return value[menu]
        }
    }

    function sorted(a, b) {
        const as=value["order"]==="A-Z"?1:-1
        if (a.name > b.name) {
          return 1*as;
        }
        if (a.name < b.name) {
          return -1*as;
        }
        // a must be equal to b
        return 0;
    };

    const onPageChanged = data => {
        //console.log(data)
        if (totalData.length===0) {
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
        } else {
            const offset = (data.currentPage - 1) * pageLimit;
            setTotalRecords(totalData.length);
            //console.log("vamos a ver")
            //console.log(offset)
            //console.log(pageLimit)
            setData(totalData.slice(offset, offset + pageLimit));
            //setPageLimit(offset + pageLimit);
            setCurrentPage(data.currentPage);
        }
    }

    useEffect(() => {
        //console.log("ya")
        //console.log(totalData)
        if (totalData.length===0) {
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
        } else {
            setTotalRecords(totalData.length);
            let final = totalData.length >= 20 ? 19 : totalData.length-1
            setData(totalData.slice(0,final));
            setCurrentPage(1)
        }
    }, [totalData]);

    return (
        <div>
            <div className="menu">
                {Object.keys(menu).map((key) => {
                    return (
                        <form key={key} className="menu--page">
                            <h2 className="subtitle--1">{key}</h2>
                            <div className="menu__imputs">
                                {menu[key].map((i, index) => {
                                    return (
                                        <label key={key + index} htmlFor={i.label}>
                                            {i.label}
                                            {i.type !== "select"
                                                ? <input type={i.type} name={i.label} /> : <select name={i.label} className={key} value={select(key)} onChange={handleChange}>
                                                    {i.options.map((l, index2) => {
                                                        return (
                                                            <option key={key + "__option" + index2} value={l}>{l}</option>)
                                                    })}
                                                </select>}
                                        </label>
                                    )
                                })}
                            </div>
                                <button id={"btn-sello-"+key} className={"btn--sello " + key} onClick={dataModification}>{key}</button>
                        </form>)
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
                            <div id="totalRecords" className="none" name={totalRecords} >{totalRecords}</div>
                            <Pagination totalRecords={totalRecords} pageLimit={pageLimit} pageNeighbours={1} onPageChanged={onPageChanged} />
                        </div>
                    </React.Fragment>)
                    : <p className="error">NOT FOUND - 404</p>}

            </div>
        </div>

    );


}

export default Board;