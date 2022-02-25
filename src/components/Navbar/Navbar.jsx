// React
import { Link, useLocation, useHistory } from "react-router-dom"
import { useEffect } from "react"
// CSS & JSON
import "./Navbar.css";
import db from "../../data/data"

const Navbar = () => {
    // Declaration of the Hooks
    const history = useHistory();
    let location = useLocation();
    // img
    const logo = "Navbar/Logo.png"
    // JSON file where the component information is located
    const navbar = db.components.Navbar
    // Class that the li of the navigation bar will have
    const liClass = "menu-options__element theme--original"

    /**
     * Redirect in case of clicking on a tag "a" with href "#"
     * @param {object} e evento
     */
    function clickHandler(e) {
        if (!(location.pathname === "/")) {
            history.push("/");
        }
        e.preventDefault();
        // Get the top height of the element
        const href = this.getAttribute("href");
        const offsetTop = document.querySelector(href) ? document.querySelector(href).offsetTop : 0;
        // Make the element scroll smoothly
        window.scroll({
            top: offsetTop - 50,
            behavior: "smooth"
        });
        // If it is a screen with a drop-down menu, we make the menu appear
        const menuOptions = document.querySelector(".menu-options")
        if (menuOptions.classList.contains('menu-options-list-dropdown--enable')) {
            handleClick();
        }
    }

    /**
     * Function in charge of raising the scroll when a page is rendered
     * @param {*} e 
     */
    function clickHandlerRender(e) {
        window.scroll({
            top: 0,
            behavior: "smooth"
        });
        // If it is a screen with a drop-down menu, we make the menu appear
        const menuOptions = document.querySelector(".menu-options")
        if (menuOptions.classList.contains('menu-options-list-dropdown--enable')) {
            handleClick();
        }
    }

    useEffect(() => {
        const links = document.querySelectorAll('a[href^="#"]');
        const linksRender = document.querySelectorAll('a[href^="/"]');
        for (const link of links) {
            link.addEventListener("click", clickHandler);
        }
        for (const linkR of linksRender) {
            linkR.addEventListener("click", clickHandlerRender);
        }
    },[location]);

    /**
     * Check the dropdown menu
     */
    const handleClick = () => {
        const menuOptions = document.querySelector(".menu-options")
        menuOptions.classList.toggle("menu-options-list-dropdown--disable");
        menuOptions.classList.toggle("slide-in-bottom");
        menuOptions.classList.toggle("menu-options-list-dropdown--enable");
        document.querySelector("nav").classList.toggle("menu-options-list-dropdown--enable");
        document.querySelector(".menu--X").classList.toggle("open");
        document.querySelector("div.logo").classList.toggle("menu-options-list-dropdown--disable");
    }

    return (
        <header>
            <div className="theme--1 navbar-Container">
                <div className="navbar">
                    <button className="dropdown-menu-button" onClick={handleClick}>
                        <div className="menu menu--X">
                            <span className="menu__bar"></span>
                        </div>
                    </button>
                    <div className="logo">
                        Rick & Morty
                    </div>
                </div>
            </div>
            <nav className="theme--1">
                <div className="menu-options menu-options-list-dropdown--disable">
                    <div className="logo--dropdown logo">
                        <img src={logo} alt="" className="logo__img" />
                    </div>
                    <ul className="menu-options-list">
                        {navbar.map((section, index) => {
                            return section.type === "Link" ? <li key={"nav-li-" + index} ><Link className={liClass} to={section.href}>{section.name}</Link></li> : <li key={"nav-li-" + index}><a className={liClass} href={section.href}>{section.name}</a></li>
                        })}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
