import React from 'react'
import Board from '../../components/Board/Board'
import { useLocation } from "react-router-dom"
import './Information.css'

const Information = () => {
    let location = useLocation();
    let path = location.pathname.replace("/","")    
    
    return (
        <div className={"information "+"information--"+path }>
            <Board schema={path} />
        </div>
    )
}

export default Information
