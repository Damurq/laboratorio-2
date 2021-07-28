import { Link, useLocation, useHistory } from "react-router-dom"
import { useEffect } from "react"
import "./Navbar.css";
import db from "../../data/data"

const Navbar = () => {
    //Desclaracion de los Hook
    const history = useHistory();
    let location = useLocation();
    const logo = "Navbar/Logo.png"
    //Archivo JSON donde se encuentra la informacion del componente
    const navbar = db.components.Navbar

    //Clase que tendran los li de la barra de navegacion
    const liClass = "menu-options__element theme--original"

    /* Función encargada de redirigir en caso de hacer click en una etiqueta "a" con href "#" */
    function clickHandler(e) {
        //redirigimos al inicio
        if (!(location.pathname === "/")) {
            history.push("/");
        }
        e.preventDefault();
        //Obtenemos la altura superior del elemento
        //setTimeout() 
        const href = this.getAttribute("href");
        
        const offsetTop = document.querySelector(href) ? document.querySelector(href).offsetTop : 0;
        //hacemos que se desplace al elemento de forma suave
        window.scroll({
            top: offsetTop - 50,
            behavior: "smooth"
        });
        //En caso de que sea una pantalla con menu desplegable hacemos que el menu se recoja

        const menuOptions = document.querySelector(".menu-options")
        if (menuOptions.classList.contains('menu-options-list-dropdown--enable')) {
            handleClick();
        }
    }

    /* Función encargada de subir el scroll cuando se renderiza una pagina */
    function clickHandlerRender(e) {
        window.scroll({
            top: 0,
            behavior: "smooth"
        });
        //En caso de que sea una pantalla con menu desplegable hacemos que el menu se recoja
        const menuOptions = document.querySelector(".menu-options")
        if (menuOptions.classList.contains('menu-options-list-dropdown--enable')) {
            handleClick();
        }
    }

    /*  - Añadimos el evento click a todos los link y asignamos la funcion correspondiente
        - Comprobamos la ubicacion de la pagina para el color del navbar
    */
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


    //Controla el menu desplegable
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
                        Rick y Morty
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
