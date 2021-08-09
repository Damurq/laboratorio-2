import { Link } from "react-router-dom"
import db from "../../data/data"
import "./Footer.css"


const Footer = () => {
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
                <h3 className="text--center">Follow us!</h3>
                <div className="row">
                    <img src="footer/facebook.png"></img>
                    <label>Follow us on Facebook</label>
                </div>
                <div className="row">
                    <img src="footer/instagram.png"></img>
                    <label>Follow us on Instagram</label>
                </div>
                <div className="row">
                    <img src="footer/twitter.png"></img>
                    <label>Follow us on Twitter</label>
                </div>
            </div>
            <div className="footerSection--contact">
                    <div  >
                        <h3  className="text--center">Team</h3>
                        <div className="row">
                            <img src="team/girl.png"></img>
                            <label>Yurisbellys Brizuela</label>
                        </div>
                        <div className="row">
                            <img src="team/boy.png"></img>
                            <label>Michael Montero</label>
                        </div>
                        <div className="row">
                            <img src="team/girl.png"></img>
                            <label>Marihec Miranda</label>
                        </div>
                    </div>
            </div>
        </div>
        <div  >
            <h3 className="mini-title-2 text--center text-dark">Copyright El mejor equipo de Laboratorio 2 2021-Todos los derechos reservados</h3>
        </div>
    </footer>);
}

export default Footer;