import {useState, useEffect} from 'react'
import TypingGameComponent from './components/TypingGameComponent'


function App() {
  const [apiStatus, setAPIStatus] = useState()
  const [text, setText] = useState()
  async function load() {
    const result = await fetch("http://localhost:3000/random-word")
      .then(r => r.json());

    setText(`${result.word} - ${result.definition} Ex. ${result.example}`);
  }
  useEffect(() => {
    load();
  }, []);
  

  
  return (
    <div>
    <h1>Word Typer</h1>
    <TypingGameComponent text={text}/>
    <button onClick={load}>Reset</button>
    </div>
  )
   
}

export default App;
