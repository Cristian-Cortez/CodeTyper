import { useState, useEffect, useRef } from "react";
import TypingGameComponent from "../components/TypingGameComponent";
import Navbar from "../components/Navbar";
import { TextField, MenuItem } from "@mui/material";

function Home() {
  const [text, setText] = useState();
  const [lang, setLang] = useState("javascript");
  const hasLoaded = useRef(false);

  // user state
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // styling for textField
  const textFieldStyle = {
    "& .MuiInputBase-input": {
      color: "white", // text color inside field
      backgroundColor: "#27292c", // match dark background
    },
    "& .MuiInputLabel-root": {
      color: "white", // label color
    },
    "& .MuiInputLabel-asterisk": {
      color: "white", // required asterisk color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.5)", // border
      },
      "&:hover fieldset": {
        borderColor: "white", // border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // border on focus
      },
    },
    "& .MuiSelect-icon": {
      color: "white", // dropdown arrow
    },
    "& .MuiMenu-paper": {
      backgroundColor: "#27292c", // dropdown background
      color: "white", // dropdown text
    },
    "& .MuiMenuItem-root": {
      color: "white", // menu item text
    },
  };

  async function load(newLang) {
    setText("");
    const result = await fetch(`http://localhost:3000/api/random-snippet?lang=${newLang}`).then((r) => r.json());

    setText(`${result.snippet}`);
  }

  // calls /api/users/:id/best-wpm
  const handlePerfectFinish = async (finalWpm) => {
    console.log("Perfect run WPM:", finalWpm);

    // no logged-in user = nothing to do
    if (!user) {
      console.warn("No user logged in; skipping best_wpm update");
      return;
    }

    const currentBest = user.best_wpm ?? 0;

    // only update if we actually beat the high score
    if (finalWpm <= currentBest) {
      console.log("Final WPM not higher than current best, no update");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}/best-wpm`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wpm: finalWpm }),
      });

      if (!res.ok) {
        console.error("Failed to update best_wpm", await res.text());
        return;
      }

      const patchResult = await res.json();
      // Merge what came back from the server into the existing user object
      const mergedUser = { ...user, ...patchResult };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));

      console.log("Best WPM updated!", mergedUser.best_wpm);
    } catch (err) {
      console.error("Error updating best_wpm:", err);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    load(lang); // pass current lang
  }, [lang]);

  return (
    <div>
      <Navbar />
      <h1 style={{ marginTop: "3%", fontSize: "3.2em" }}>Start typing</h1>

      {text ? <TypingGameComponent text={text} onPerfectFinish={handlePerfectFinish} /> : <h2>Loading...</h2>}

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
        >
          <TextField
            sx={textFieldStyle}
            select
            value={lang}
            label="Language"
            onChange={(event) => setLang(event.target.value)}
          >
            <MenuItem key="javascript" value="javascript">
              {" "}
              Javascript{" "}
            </MenuItem>
            <MenuItem key="python" value="python">
              {" "}
              Python{" "}
            </MenuItem>
            <MenuItem key="java" value="java">
              {" "}
              Java{" "}
            </MenuItem>
            <MenuItem key="c++" value="c++">
              {" "}
              C++{" "}
            </MenuItem>
            <MenuItem key="go" value="go">
              {" "}
              Go{" "}
            </MenuItem>
            <MenuItem key="rust" value="rust">
              {" "}
              Rust{" "}
            </MenuItem>
            <MenuItem key="typescript" value="typescript">
              {" "}
              Typescript{" "}
            </MenuItem>
            <MenuItem key="ruby" value="ruby">
              {" "}
              Ruby{" "}
            </MenuItem>
            <MenuItem key="swift" value="swift">
              {" "}
              Swift{" "}
            </MenuItem>
          </TextField>
          <button onClick={() => load(lang)}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
