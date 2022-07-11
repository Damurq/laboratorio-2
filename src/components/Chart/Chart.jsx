import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import { chartData } from '../../utils/fetch/searchData.js'

// API URL
const URL_BASE = "https://rickandmortyapi.com/api/" 
// options of the bar graph
const options = {
    maintainAspectRatio: false,
    responsive: true
}
// Base object of the bar graph data
let dataEmpty = {
    labels: [],
    datasets: [{
        label: "",
        backgroundColor: "rgba(0,255,0,1)",
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0,255,0,2)",
        hoverBorderColor: '#FF0000',
        data: []
    }]
}

const Chart = ({ section, label }) => {

    // States
    const [values, setValues] = useState(dataEmpty)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (values.datasets[0].data.length === 0) {
            let data = {...dataEmpty}
            chartData(URL_BASE, section, label)
                .then((res) => {
                    data.labels = res[0]
                    data.datasets[0].label = label
                    data.datasets[0].data = res[1]
                    setValues(data)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <div className="theme--2 chart">
            {loading
                ? <div className="center-container"><div className="lds-facebook"><div></div><div></div><div></div></div></div>
                : (<div style={{ width: "100%", height: "500px" }}>
                    {values 
                    ? <Bar data={values} options={options} />
                    : Error - 404}
                </div>)}
        </div>
    )
}

export default Chart
