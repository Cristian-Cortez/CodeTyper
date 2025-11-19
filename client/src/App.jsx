import {useState, useEffect} from 'react'
import TypingGameComponent from './components/TypingGameComponent'


function App() {
  const [apiStatus, setAPIStatus] = useState()
  const [text, setText] = useState()
  async function load() {
    const result = await fetch("http://localhost:3000/api/random-snippet")
      .then(r => r.json());

    setText(result.snippet);
  }
  useEffect(() => {
    load();
  }, []);
  

  useEffect(() => {
    fetch('http://localhost:3000/up')
    .then(res => res.json())
    .then(result => {
      console.log(result.status)
      setAPIStatus(result)
  })
  }, [])

  
  return (
    <div>
    <h1>To get started, begin editing SRC/App.js</h1>
    {apiStatus ? <h2>Testing app end point: <div style={{color: apiStatus.status === 'up' ? 'green':'red'}}>{apiStatus.status}</div></h2>:null }
    <TypingGameComponent text={text}/>
    <button onClick={load}>Reset</button>
    </div>
  )
   
}

export default App;
