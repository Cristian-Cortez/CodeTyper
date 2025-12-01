// Code apated from react typing game hook library documentation
// link here: https://www.npmjs.com/package/react-typing-game-hook
import React from 'react';
// import it
import useTypingGame, { CharStateType } from 'react-typing-game-hook';

const TypingGameComponent = ({ text }) => {

  const {
    states: {
      chars,
      charsState,
      currIndex,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping }
  } = useTypingGame(text);

  const handleKey = (key) => {
    if (key === "Escape") {
      resetTyping();
      return;
    }
    if (key === "Backspace") {
      deleteTyping(false);
      return;
    }
    if (key === "Enter") {
      insertTyping("\n");
      return;
    }
    if (key === "Tab") {
      console.log('tab');
      insertTyping(" ");
      insertTyping(" ");
      insertTyping(" ");
      insertTyping(" ");
      return;
    }
    if (key.length === 1) {
      insertTyping(key);
    }
  };

  // Calculate WPM only when finished typing
  const getWPM = () => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    const minutes = (end - startTime) / 1000 / 60;

    // WPM = correct characters / 5 / minutes
    return Math.round((correctChar / 5) / minutes);
  };

  return (
    <div style={{ fontFamily: "monospace"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <pre
          onKeyDown={(e) => {
            handleKey(e.key);
            e.preventDefault();
          }}
          tabIndex={0}
          className = 'codeBox'
          
        >
          {chars.split('').map((char, index) => {
            let state = charsState[index];
            let color =
              state === CharStateType.Incomplete
                ? '#dfe0e8'
                : state === CharStateType.Correct
                ? 'green'
                : 'red';

            const isNext = index === currIndex + 1;

            return (
              <span
                key={char + index}
                style={{
                  color,
                  textDecoration: isNext ? "underline" : "none",
                }}
              >
                {char}
              </span>
            );
          })}
        </pre>
      </div>

      {/* Stats Section */}
      <div style={{ marginTop: "10px", fontSize: "18px", color: '#1a1a1a', marginLeft: '7%'}}>
        <h3>Incorrect letters: {errorChar}</h3>
        {correctChar? <h3>Accuracy: {Math.round ((correctChar / (correctChar + errorChar)) * 100)}%</h3> : <h3>Accuracy: None</h3>}
        <h3>WPM: {getWPM()}</h3>
      </div>
    </div>
  );
};

export default TypingGameComponent;