import {useState, useEffect} from 'react'
import TypingGameComponent from '../components/TypingGameComponent'
import Navbar from '../components/Navbar'
import {TextField, MenuItem} from '@mui/material'


function Home() {
  const [text, setText] = useState()
  const [lang, setLang] = useState("javascript");
  let initialLoad = false
  
  // styling for textField
  const textFieldStyle = {
    '& .MuiInputBase-input': {
      color: 'white',            // text color inside field
      backgroundColor: '#27292c', // match dark background
    },
    '& .MuiInputLabel-root': {
      color: 'white',            // label color
    },
    '& .MuiInputLabel-asterisk': {
      color: 'white',            // required asterisk color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.5)', // border
      },
      '&:hover fieldset': {
        borderColor: 'white',    // border on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',    // border on focus
      },
    },
    '& .MuiSelect-icon': {
      color: 'white',             // dropdown arrow
    },
    '& .MuiMenu-paper': {
      backgroundColor: '#27292c', // dropdown background
      color: 'white',             // dropdown text
    },
    '& .MuiMenuItem-root': {
      color: 'white',             // menu item text
    }
  }

  async function load(newLang) {
    setText('')
    const result = await fetch(`http://localhost:3000/api/random-snippet?lang=${newLang}`)
      .then(r => r.json());

    setText(`${result.snippet}`);
  }

  useEffect(() => {
    // prvents useEffect from being run twice when the app is loaded
    if(initialLoad) return
    initialLoad = true
    load();
  }, []);
  

  
  return (
    <div>
      <Navbar/>
      <h1 style={{marginTop: '3%', fontSize: '3.2em'}}>Click and start typing</h1>

      {text? <TypingGameComponent text={text}/> : <h2>Loading...</h2>}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '8px',
        }}
      >
        <TextField sx = {textFieldStyle} select value={lang} label='Language' onChange={event => setLang(event.target.value)}>
          <MenuItem key='javascript' value='javascript'> Javascript </MenuItem>
          <MenuItem key='python' value='python'> Python </MenuItem>
          <MenuItem key='java' value='java'> Java </MenuItem>
          <MenuItem key='c++' value='c++'> C++ </MenuItem>
          <MenuItem key='go' value='go'> Go </MenuItem>
          <MenuItem key='rust' value='rust'> Rust </MenuItem>
          <MenuItem key='typescript' value='typescript'> Typescript </MenuItem>
          <MenuItem key='ruby' value='ruby'> Ruby </MenuItem>
          <MenuItem key='swift' value='swift'> Swift </MenuItem>
        </TextField>
        <button onClick={() => load(lang)}>Reset</button>
        </div>
      </div>
    </div>
  )
   
}

export default Home;
