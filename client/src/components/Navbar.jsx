import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Navbar() {
    const style = {
        backgroundColor: '#1a1a1a', 
        fontFamily: 'monospace'
    }

    return (
        <AppBar sx = {style} position="static" elevation={0}>
            <Toolbar sx = {style}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>
                Word Typer
                </Typography>
                <Button color="inherit" component={Link} to="/home">Home</Button>
                <Button color="inherit" component={Link} to="/">Login</Button>
                <IconButton color="inherit" component={Link} to="/profile"><AccountCircleIcon /></IconButton>
            </Toolbar>
        </AppBar>
    );
}
