import {useState, useEffect} from 'react'
import TypingGameComponent from '../components/TypingGameComponent'
import Navbar from '../components/Navbar'


function Home() {
  const [text, setText] = useState()
  let initialLoad = false
  
  async function load() {
    setText('')
    const result = await fetch("http://localhost:3000/random-word")
      .then(r => r.json());

    setText(`${result.word} - ${result.definition} Ex. ${result.example}`);
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
      <h1 style={{marginTop: '3%'}}>Click and start typing</h1>
      {text? <TypingGameComponent text={text}/> : <h2 style={{color: '#1a1a1a'}}>Loading...</h2>}
      <button onClick={load}>Reset</button>
    </div>
  )
   
}

export default Home;
