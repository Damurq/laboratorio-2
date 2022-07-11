import "./Home.css"
import Card from '../../components/Card/Card'
import db from "../../data/data"
import React from 'react'

const Home = ()=>{
    let photo = "Home/Afiche.jpg"
    const secions = Object.keys(db.components.Card)

    return (
        <div className="content">
            <div className="presentation">
                <img src={photo} alt="" className="cover" />
            </div>
            {secions.map((section,i) => {
                return (
                    <Card key={"card__"+section} section={section} animate={ i%2===0 ? "": "animate-left"}/>)
            })}
        </div>
    )
}

export default Home;