import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';

import { Link } from "react-router-dom"
import db from "../../data/data"
import "./Footer.css"
import CardIcon from "../CardIcon/CardIcon"


const Footer = () => {
    library.add(faPhoneAlt,faEnvelope)
    const navbar = db.components.Navbar
    const liClass = "menu-options__element menu-options__element--footer "
    return (
    <footer className="theme--1">
        <div className="footer-elements">
            <div className="footerSection--nav">
                <ul className="menu-options-list">
                    {navbar.map((section, index) => {
                            return section.type === "Link" ? <li key={"nav-li-"+index} ><Link className={liClass} to={section.href}>{section.name}</Link></li> : <li key={"nav-li-"+index}><a className={liClass} href={section.href}>{section.name}</a></li>
                        })}
                </ul>
            </div>
            <div className="footerSection--SocialMedia">
                <h3 className="text--center">Social Media</h3>
                <CardIcon />
            </div>
            <div className="footerSection--contact">
                    <div  >
                        <h3  >
                            <FontAwesomeIcon className="icon" icon={['fas', 'envelope']}/> 
                            michaeldamurq@gmail.com
                        </h3>
                    </div>
                    <div  >
                        <h3  >
                            <FontAwesomeIcon className="icon" icon={['fas', 'phone-alt']}/> 
                            +58 416 654 16 76
                        </h3>
                    </div>
            </div>
        </div>

        <div  >
            <h3 className="mini-title-2 text--center text-dark">Personal Project - Rick & Morty API</h3>
        </div>
    </footer>);
}

export default Footer;