import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

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
            </Toolbar>
        </AppBar>
    );
}
