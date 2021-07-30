import React from 'react'
import db from "../../data/data.json"
import Chart from '../../components/Chart/Chart'

const Graphics = () => {
    const data = db.components["Chart"]
    const secions = Object.keys(db.components["Chart"])

    return (
        <div>
           <div className="Card theme--1">
           {secions.map((section,i) => {
                return (
                    <div key={section+"Chart"} >
                        <div className="">
                            <h2 className="title">
                                {section.charAt(0).toUpperCase()+section.slice(1)+"s"}
                            </h2>
                        </div>
                        <div className="">
                            <p className="mini-title">
                                {data[section].description}
                            </p>
                        </div>
                        <div className="">
                            <Chart section={section} label={data[section].label.name} optionsLabel={data[section].label.options} />
                        </div>
                    </div>)
            })}   
            </div> 
        </div>
    )
}

export default Graphics
