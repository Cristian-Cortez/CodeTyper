import {useState, useEffect} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import '../index.css'

export default function Login(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate()
    const textFieldStyle = {
        width: '300px',
    }
    const buttonStyle = {
        marginTop: 1,
    }


    const login = () => { navigate("/home") }


    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  gap: '1rem'}}>
            <h2>Please log in or create a new account</h2>
            <TextField sx = {textFieldStyle} required label="Username"></TextField>
            <TextField sx = {textFieldStyle} required label="Password"></TextField>
            <button sx = {buttonStyle} onClick={login}> Log in </button>
            <button sx = {buttonStyle}>Create new account</button>
        </div>
    )
}