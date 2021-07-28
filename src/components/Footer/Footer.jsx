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
                <h3 className="text--center">Rick y Morty</h3>
            </div>
            <div className="footerSection--contact">
                    <div  >
                        <h3>Integrantes</h3>
                        <ul>
                            <li  className={liClass}>Michael Montero</li>
                            <li  className={liClass}>Yurisbellys Brizuella</li>
                            <li  className={liClass}>Marihec Miranda</li>
                        </ul>
                    </div>
            </div>
        </div>
        <div  >
            <h3 className="mini-title-2 text--center text-dark">Copyright El mejor equipo de Laboratorio 2 2021-Todos los derechos reservados</h3>
        </div>
    </footer>);
}

export default Footer;