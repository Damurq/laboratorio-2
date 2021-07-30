import React, {useState,useEffect} from 'react'
import { Bar } from 'react-chartjs-2';
import db from "../../data/filterData.json"
import { getDataBar } from '../../utils/fetch/searchData'

const Chart = ({section , label, optionsLabel}) => {
    let dataEmpty ={
        labels: [],
        datasets:[{
            label:"",
            backgroundColor:"rgba(0,255,0,1)",
            borderColor:"black",
            borderWidth:1,
            hoverBackgroundColor:"rgba(0,255,0,2)",
            hoverBorderColor: '#FF0000',
            data:[]
        }]
    }
    const [values, setValues] = useState(dataEmpty)
    const [change, setChange] = useState(false)

    let rawLabels = db[section].data


    const options = {
        maintainAspectRatio:false,
        responsive:true
    }



    useEffect(() => {
        if (values.datasets[0].data.length===0) {
            let data = dataEmpty
            let temporalData = []
            getDataBar(section,rawLabels,label)
                .then((response) => {
                    data.labels = optionsLabel
                    data.datasets[0].label = label
                    optionsLabel.forEach(() => {
                        temporalData.push(0)
                    });
                    response.forEach( (val)=> {
                        if (optionsLabel.includes(val)) {
                            if (optionsLabel.length===temporalData.length) {
                                temporalData[optionsLabel.indexOf(val)]++;
                            }
                        }
                    });
                    data.datasets[0].data = temporalData
                    setValues(data)
                    setChange(true)
               })
            }

    }, [])



    return (
        <div className="theme--2 chart">
            {change
            ? 
            (<div style={{width:"100%", height:"500px"}}>
                <Bar data={values} options={options}/>
            </div>)
            : <p>Generando...Esto puede demorar espere un momento.</p>}
        </div>
    )
}

export default Chart
