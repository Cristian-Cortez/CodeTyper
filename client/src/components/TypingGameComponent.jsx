// Code apated from react typing game hook library documentation
// link here: https://www.npmjs.com/package/react-typing-game-hook
import React from 'react';
// import it
import useTypingGame, { CharStateType } from 'react-typing-game-hook';

const TypingGameComponent = ({text}) => {
  // Call the hook
  const {
    states: { chars, charsState },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame(text);

  // Capture and display!
  return (
    <h1
      onKeyDown={e => {
        e.preventDefault();
        const key = e.key;
        if (key === 'Escape') {
          resetTyping();
          return;
        }
        if (key === 'Backspace') {
          deleteTyping(false);
          return;
        }
        if (key.length === 1) {
          insertTyping(key);
        }
      }}
      tabIndex={0}
    >
      {chars.split('').map((char, index) => {
        let state = charsState[index];
        let color =
          state === CharStateType.Incomplete
            ? 'black'
            : state === CharStateType.Correct
            ? 'green'
            : 'red';
        return (
          <span key={char + index} style={{ color }}>
            {char}
          </span>
        );
      })}
    </h1>
  );
};
export default TypingGameComponent;