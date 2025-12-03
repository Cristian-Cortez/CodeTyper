import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar() {
    const style = {
        backgroundColor: '#27292c', 
        fontFamily: 'monospace',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
    }
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    const isAdmin = user?.isadmin;

    return (
        <AppBar sx = {style} position="static" elevation={0}>
            <Toolbar sx = {style}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>
                Code Typer
                </Typography>
                <Button color="inherit" component={Link} to="/home">Home</Button>
                <Button color="inherit" component={Link} to="/leaderboard">Leaderboard</Button>
                {isAdmin && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
                <Button color="inherit" component={Link} to="/">Login</Button>
                <IconButton color="inherit" component={Link} to="/profile"><AccountCircleIcon /></IconButton>
            </Toolbar>
        </AppBar>
    );
}
