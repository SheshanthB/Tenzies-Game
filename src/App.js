import React from 'react';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './style.css';

export default function App() {
  const [dice, setDice] = React.useState(allDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);
  const [score, setScore] = React.useState(rollCount);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const allSame = dice.every((die) => die.value === dice[0].value);
    allHeld && allSame && setTenzies(true);
  }, [dice]);

  score === 0
    ? tenzies && setScore(rollCount)
    : tenzies && score > rollCount && setScore(rollCount);

  function generateDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }
  function allDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateDice());
    }
    return newDice;
  }

  function rollDice() {
    tenzies
      ? (setTenzies(false), setDice(allDice()), setRollCount(0))
      : (setDice((prevDice) =>
          prevDice.map((die) => {
            return die.isHeld ? die : generateDice();
          })
        ),
        setRollCount((prev) => prev + 1));
  }
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies Game</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <h1 className="score">High Score : {score}</h1>
      <h2 className="score">Number of Rolls : {rollCount}</h2>
      <div className="die-container">
        {dice.map((die) => (
          <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            onHold={() => holdDice(die.id)}
          />
        ))}
      </div>
      <button onClick={rollDice} className="roll-dice">
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}
