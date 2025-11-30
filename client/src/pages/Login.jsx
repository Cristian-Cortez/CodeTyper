import {useState, useEffect} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import Navbar from '../components/Navbar'

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const textFieldStyle = {
        width: '300px',
    }


    const login = () => { navigate("/home") }


    return (
        <div>
            <Navbar sx = {{width: '100%', alignSelf: 'stretch'}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  gap: '1rem', width: '100%'}}>
                <h2>Please log in or create a new account</h2>
                <TextField sx = {textFieldStyle} required label="Username" onChange={event => setUsername(event.target.value)}/>
                <TextField sx = {textFieldStyle} required label="Password" onChange={event => setPassword(event.target.value)}/>
                <button onClick={login}> Log in </button>
                <button>Create new account</button>
            </div>
        </div>
    )
}