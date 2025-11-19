import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fetch from "node-fetch";
import { JSDOM } from "jsdom";


import { query } from './db/postgres.js';

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors())

// base route
app.get('/', (req, res) => {
    res.send("Welcome to the Job Application Tracker API!!!")
})


app.get('/up', (req, res) => {
  res.json({status: 'up'})
})

// documentation: https://api.stackexchange.com/docs/questions
app.get("/api/random-snippet", async (req, res) => {
  try {
    const url =
      "https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=javascript&site=stackoverflow&filter=withbody";

    const data = await fetch(url).then(r => r.json());

    const snippets = [];

    data.items.forEach(item => {
      const dom = new JSDOM(item.body);
      const codeBlocks = dom.window.document.querySelectorAll("pre code");

      codeBlocks.forEach(block => {
        snippets.push(block.textContent);
      });
    });

    if (snippets.length === 0) return res.json({ snippet: "// no snippets found" });

    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];

    res.json({ snippet: randomSnippet });
  } catch (err) {
    res.status(500).json({ error: "Error fetching snippet" });
  }
});


app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  