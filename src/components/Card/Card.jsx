import db from "../../data/data"
import "./Card.css"

import { Link } from "react-router-dom"

const Card = ({ section,animate }) => {
    const data = db.components.Card[section]
    let photosrc=data.imgsrc

    return (
        <div id={section} className={"Card theme--1 home--" + section}>
            <div className={"Card-content animate "+ animate }>
                <div className="Card__sectionContent Card__section--first">
                    <h2 className="title">{data.title}</h2>
                    <p className="mini-title">
                        {data.text}
                    </p>
                </div>
                <div className="Card__sectionImage">
                    <img src={photosrc} alt="" />
                </div>
            </div>
            <div className="seeMore">
                <div className="line">
                </div>
                    <Link to={"/"+section} className="button-dark">more</Link>
                </div>
        </div>
    );
}

export default Card;
