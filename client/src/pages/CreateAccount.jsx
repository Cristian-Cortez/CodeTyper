import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import Navbar from '../components/Navbar'

export default function CreateAccount(){
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const textFieldStyle = {
        width: '300px',
    }


    const create = () => { navigate("/home") }


    return (
        <div>
            <Navbar sx = {{width: '100%', alignSelf: 'stretch'}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  gap: '1rem', width: '100%'}}>
                <h2 style={{color: '#1a1a1a', marginLeft: '0%', marginBottom: '1%'}}>Create your account</h2>
                <TextField sx = {textFieldStyle} required label="First Name" onChange={event => setFirst(event.target.value)}/>
                <TextField sx = {textFieldStyle} required label="Last Name" onChange={event => setLast(event.target.value)}/>
                <TextField sx = {textFieldStyle} required label="Username" onChange={event => setUsername(event.target.value)}/>
                <TextField sx = {textFieldStyle} required label="Password" onChange={event => setPassword(event.target.value)}/>
                <button onClick={create}> Sign up </button>
            </div>
        </div>
    )
}