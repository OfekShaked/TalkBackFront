import React,{useEffect,useContext} from 'react'
import {logout} from '../../services/auth.service'
import { useHistory } from "react-router-dom";
import { SocketContext } from '../../context/socketContext';
import {Redirect} from 'react-router-dom';

const Logout =  (props:any) =>{

    const socket = useContext(SocketContext);

    useEffect(() => {
        const waitLogout = async() =>{
            await logout()
            await socket.emit("logout");
            props.setIsLoggedIn(false);            
        }
        waitLogout();
    },[])

    return (<Redirect to="/"/>)
}
export default Logout;