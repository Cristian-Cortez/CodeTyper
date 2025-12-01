import {useState } from 'react'
import { useNavigate } from "react-router-dom";
import { TextField, Button } from '@mui/material';
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const textFieldStyle = {
        width: '300px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#dfe0e8',  // optional: border color
              color: '#dfe0e8'
            },
            '&:hover fieldset': {
                borderColor: 'white', // border on hover
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white', // border when focused
            },
        },
        '& .MuiInputBase-input': {
            color: 'white',           // text color inside the field
        },
        '& .MuiInputLabel-root': {
            color: 'white',            // label text
          } 
    }


    const login = () => { navigate("/home") }


    return (
        <div>
            <Navbar sx = {{width: '100%', alignSelf: 'stretch'}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  gap: '1rem', width: '100%'}}>
                <h2 style={{color: '#dfe0e8', marginLeft: '0%'}}>Please log in or create a new account</h2>
                <TextField sx = {textFieldStyle} required label="Username" onChange={event => setUsername(event.target.value)}/>
                <TextField sx = {textFieldStyle} required label="Password" onChange={event => setPassword(event.target.value)}/>
                <button onClick={login}> Log in </button>
                <h3>Don't have an account?
                <Button sx={{color: '#646cff', fontFamily: 'monospace'}} component={Link} to="/create-account">Sign up</Button>
                </h3>
            </div>
        </div>
    )
}