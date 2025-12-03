import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import he from "he";

import { query } from "./db/postgres.js";
import crypto from "crypto";

// helper to do a very basic hash+salt
function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

// create the app
const app = express();
// it's nice to set the port number so it's always the same
app.set("port", process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json());
// set up some midlleware to handle cors
app.use(cors());

// base route
app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!!!");
});

app.get("/up", (req, res) => {
  res.json({ status: "up" });
});

// documentation: https://api.stackexchange.com/docs/questions
app.get("/api/random-snippet", async (req, res) => {
  try {
    const lang = req.query.lang || "javascript";
    //Questions are actually more reliable than answers as answers are often 80% comments
    const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=${lang}&site=stackoverflow&filter=withbody`;

    const data = await fetch(url).then((r) => r.json());

    const snippets = [];

    data.items.forEach((item) => {
      const dom = new JSDOM(item.body);
      const codeBlocks = dom.window.document.querySelectorAll("pre code");

      codeBlocks.forEach((block) => {
        let snippet = he.decode(block.textContent); // <-- decode HTML entities

        snippet = snippet.replace(/\t/g, "    "); // convert tabs to spaces
        snippet = snippet.replace(/\r\n/g, "\n"); // normalize line endings

        snippets.push(snippet);
      });
    });

    if (snippets.length === 0) return res.json({ snippet: "// no snippets found" });

    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];

    res.json({ snippet: randomSnippet });
  } catch (err) {
    res.status(500).json({ error: "Error fetching snippet" });
  }
});

app.get("/random-word", async (req, res) => {
  try {
    const letters = "abcdefghijklmnopqrstuvwxyz";

    async function fetchValidWord() {
      let ct = 0;
      while (true) {
        ct++;
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];

        // Fetch MANY words for randomness
        const wordRes = await fetch(`https://api.datamuse.com/words?sp=${randomLetter}*&max=500`);
        const wordData = await wordRes.json();
        if (!wordData.length) continue;

        const randomEntry = wordData[Math.floor(Math.random() * wordData.length)];
        const word = randomEntry.word;

        // Fetch dictionary data
        const defRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const defData = await defRes.json();
        if (defData.title === "No Definitions Found") continue;

        const meaning = defData[0].meanings?.[0];
        if (!meaning) continue;

        const definitionObj = meaning.definitions?.[0];
        if (!definitionObj) continue;

        const definition = definitionObj.definition;
        const example = definitionObj.example || null;

        if (!definition) continue;
        if (!example) continue;
        console.log(ct);
        return { word, definition, example };
      }
    }

    const result = await fetchValidWord();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/users: create account
app.post("/api/users", async (req, res) => {
  try {
    const { first_name, last_name, username, password, favorite_word } = req.body;

    if (!first_name || !last_name || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const password_hash = hashPassword(password, salt);

    const result = await query(
      `insert into users
        (first_name, last_name, username, password_hash, salt, favorite_word)
       values ($1, $2, $3, $4, $5, $6)
       returning id, first_name, last_name, username, favorite_word, best_wpm, isadmin`,
      [first_name, last_name, username, password_hash, salt, favorite_word || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // unique violation
      return res.status(409).json({ error: "Username already taken" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const result = await query("select * from users where username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    console.log(user);
    const computedHash = hashPassword(password, user.salt);

    if (computedHash !== user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // TODO later: issue a session token / JWT instead of just returning user
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      favorite_word: user.favorite_word,
      best_wpm: user.best_wpm,
      isadmin: user.isadmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/users/:id/best-wpm: can only increase best_wpm
app.patch('/api/users/:id/best-wpm', async (req, res) => {
  try {
    const { id } = req.params;
    const { wpm } = req.body;

    if (typeof wpm !== 'number' || wpm < 0) {
      return res.status(400).json({ error: 'Invalid wpm' });
    }

    const result = await query(
      `update users
       set best_wpm = greatest(coalesce(best_wpm, 0), $1)
       where id = $2
       returning id, best_wpm`,
      [wpm, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leaderboard?n=10
// Returns array of { username, best_wpm } ordered highest to lowest wpm
app.get('/api/leaderboard', async (req, res) => {
  try {
    const nParam = req.query.n;
    const n = nParam ? Number(nParam) : null;

    const baseQs = `SELECT username, COALESCE(best_wpm, 0) AS best_wpm FROM users ORDER BY best_wpm DESC NULLS LAST`;

    let result;
    if (n && Number.isInteger(n) && n > 0) {
      result = await query(baseQs + ' LIMIT $1', [n]);
    } else {
      result = await query(baseQs);
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users?adminId=123  (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const adminId = req.query.adminId;
    if (!adminId) return res.status(400).json({ error: 'adminId required' });

    const check = await query('select isadmin from users where id = $1', [adminId]);
    if (check.rows.length === 0 || !check.rows[0].isadmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await query('select id, username, first_name, last_name, best_wpm, isadmin from users order by id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id?adminId=123  (admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.query.adminId;
    if (!adminId) return res.status(400).json({ error: 'adminId required' });

    const check = await query('select isadmin from users where id = $1', [adminId]);
    if (check.rows.length === 0 || !check.rows[0].isadmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await query('delete from users where id = $1 returning id, username', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ deleted: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(app.get("port"), () => {
  console.log("App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});
