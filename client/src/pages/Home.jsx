import {useState, useEffect} from 'react'
import TypingGameComponent from '../components/TypingGameComponent'
import Navbar from '../components/Navbar'


function Home() {
  const [text, setText] = useState()
  const [lang, setLang] = useState("javascript");
  let initialLoad = false
  

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
      <h1 style={{marginTop: '3%'}}>Click and start typing</h1>

      {text? <TypingGameComponent text={text}/> : <h2>Loading...</h2>}
      <button onClick={() => load(lang)}>Reset</button>
      <div style={{ marginTop: "20px" }}>
        <select
          value={lang}
          onChange={(e) => {
            const newLang = e.target.value;
            setLang(newLang);
            load(newLang); // reload snippet in new language
          }}
          style={{
            padding: "8px",
            fontSize: "16px",
            marginBottom: "20px",
            cursor: "pointer"
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c#">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
          <option value="swift">Swift</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
        </select>
      </div>
    </div>
  )
   
}

export default Home;
