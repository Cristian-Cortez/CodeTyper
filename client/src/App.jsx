import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

// this app structure uses pages
function App() {
  return (
    <Router>
      <Routes>
        {/* the home page is where the user will select the category and difficulty */}
        <Route path="/" element={<Login />} /> 
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </Router>
  )
}

export default App
