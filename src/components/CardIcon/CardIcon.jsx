import { faFacebookF, faInstagram, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import "./CardIcon.css"

const  CardIcon = () => {
    library.add(faFacebookF,faInstagram,faLinkedinIn,faGithub)
    return ( 
        <div className="icon--socialMedia">
            <a className="facebook" href="https://www.facebook.com/RickandMorty/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon className="icon" icon={['fab', 'facebook-f']}/>
            </a>
            <a className="instagram" href="https://www.instagram.com/rickandmorty/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon className="icon" icon={['fab', 'instagram']}/>
            </a>
        </div>
    );
}

export default CardIcon;