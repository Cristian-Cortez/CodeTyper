import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Profile from './pages/Profile'

// this app structure uses pages
function App() {
  return (
    <Router>
      <Routes>
        {/* the home page is where the user will select the category and difficulty */}
        <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/create-account" element={<CreateAccount />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  )
}

export default App
