import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Navbar from "../components/Navbar";

export default function CreateAccount() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteWord, setFavoriteWord] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const textFieldStyle = {
    "width": "300px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#dfe0e8", //  border color
        color: "#dfe0e8",
      },
      "&:hover fieldset": {
        borderColor: "white", // border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // border when focused
      },
    },
    "& .MuiInputBase-input": {
      color: "white", // text color inside the field
    },
    "& .MuiInputLabel-root": {
      color: "white", // label text
    },
  };

  const create = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first,
          last_name: last,
          username,
          password,
          favorite_word: favoriteWord || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create account");
        return;
      }

      const user = await res.json();

      // simple "session": store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch (e) {
      console.error(e);
      setError("Network error");
    }
  };

  return (
    <div>
      <Navbar sx={{ width: "100%", alignSelf: "stretch" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
        <h2 style={{ color: "#dfe0e8", marginLeft: "0%", marginBottom: "1%" }}>Create your account</h2>
        <TextField sx={textFieldStyle} required label="First Name" onChange={(e) => setFirst(e.target.value)} />
        <TextField sx={textFieldStyle} required label="Last Name" onChange={(e) => setLast(e.target.value)} />
        <TextField sx={textFieldStyle} required label="Username" onChange={(e) => setUsername(e.target.value)} />
        <TextField
          sx={textFieldStyle}
          required
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField sx={textFieldStyle} label="Favorite word" onChange={(e) => setFavoriteWord(e.target.value)} />
        <button onClick={create}> Sign up </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
