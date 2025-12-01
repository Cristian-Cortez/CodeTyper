// Code apated from react typing game hook library documentation
// link here: https://www.npmjs.com/package/react-typing-game-hook
import React, { useEffect, useRef } from "react";
// import it
import useTypingGame, { CharStateType } from "react-typing-game-hook";

const TypingGameComponent = ({ text, onPerfectFinish }) => {
  const {
    states: {
      chars,
      charsState,
      currIndex,
      correctChar,
      errorChar, // total mistakes made
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame(text);

  const codeBoxRef = useRef(null);
  const hasReportedRef = useRef(false);

  // Focus on new text / reset “already reported” flag
  useEffect(() => {
    hasReportedRef.current = false;
    if (codeBoxRef.current) {
      codeBoxRef.current.focus();
    }
  }, [text]);

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
      console.log("tab");
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

  // WPM based on total correct chars and elapsed time
  const getWPM = () => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    const minutes = (end - startTime) / 1000 / 60;
    return Math.round(correctChar / 5 / minutes);
  };

  // Detect *perfect* completion using live incorrect count
  useEffect(() => {
    if (!chars.length || !endTime) return;

    // Count how many characters are CURRENTLY incorrect
    const liveIncorrectCount = charsState.filter((s) => s === CharStateType.Incorrect).length;

    // All characters have been typed if none are Incomplete
    const allTyped = charsState.every((s) => s !== CharStateType.Incomplete);

    const isPerfect = allTyped && liveIncorrectCount === 0;

    if (!isPerfect || hasReportedRef.current) return;

    hasReportedRef.current = true;
    const finalWpm = getWPM();

    if (typeof onPerfectFinish === "function") {
      onPerfectFinish(finalWpm);
    }
  }, [chars, charsState, endTime]); // react will compare arrays by identity each render

  return (
    <div style={{ fontFamily: "monospace" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <pre
          ref={codeBoxRef}
          onKeyDown={(e) => {
            handleKey(e.key);
            e.preventDefault();
          }}
          tabIndex={0}
          className="codeBox"
        >
          {chars.split("").map((char, index) => {
            const state = charsState[index];
            const color =
              state === CharStateType.Incomplete ? "#dfe0e8" : state === CharStateType.Correct ? "green" : "red";

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
      <div
        style={{
          marginTop: "10px",
          fontSize: "18px",
          color: "#1a1a1a",
          marginLeft: "7%",
        }}
      >
        <h3>Mistakes: {errorChar}</h3>
        {correctChar ? (
          <h3>Accuracy: {Math.round((correctChar / (correctChar + errorChar)) * 100)}%</h3>
        ) : (
          <h3>Accuracy: None</h3>
        )}
        <h3>WPM: {getWPM()}</h3>
      </div>
    </div>
  );
};

export default TypingGameComponent;
