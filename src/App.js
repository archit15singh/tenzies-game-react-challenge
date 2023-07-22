import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const randomDiceValues = (valueCount, size) => {
    let randomValueArray = [];

    for (let i = 1; i <= size; i++) {
      let randomValue = Math.floor(Math.random() * valueCount) + 1;
      let value = {
        id: i,
        value: randomValue,
        selected: false,
      };
      randomValueArray.push(value);
    }

    return randomValueArray;
  };

  const initialState = randomDiceValues(6, 10);
  const [diceState, setDiceState] = useState(initialState);

  const [gameState, setGameState] = useState(false);

  const handleSelect = (event, diceId) => {
    setDiceState((prevState) => {
      const newState = prevState.map((dice) => {
        const {id, selected} = dice
        return id === diceId
          ? { ...dice, selected: !selected }
          : dice;
      });

      return newState;
    });
  };
  
  const isAllSelectedOfSameNumber = (dices, lastStage) => {
    let selectedDices = dices.filter((dice) => dice.selected === true)
    if (!(selectedDices.length > 0)) {
      return false
    }

    if (lastStage && selectedDices.length !== 10) {
      return false
    }

    let selectedNumber = selectedDices[0].value
    
    for (const selectedDice of selectedDices) {
      if (selectedDice.value !== selectedNumber) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    const areAllSelectedOfSameNumber = isAllSelectedOfSameNumber(diceState, true);
    
    if (areAllSelectedOfSameNumber) {
      setGameState(true);
    }
  }, [diceState]);

  const handleButtonClick = () => {
    if (gameState) {
      const initialState = randomDiceValues(6, 10);
      setDiceState(initialState);
      setGameState(false);
    }

    const randomValueDice = (dice) => {
      let randomValue = Math.floor(Math.random() * 6) + 1;
      return dice.selected ? dice : { ...dice, value: randomValue };
    };

    const randomValues = (prevState) => {
      return prevState.map(randomValueDice);
    };

    const areAllOfSameNumber = isAllSelectedOfSameNumber(diceState, false);
    
    let noneAreSelected = diceState.filter((dice) => dice.selected === true)
    noneAreSelected = noneAreSelected.length > 0 ? false : true

    if (areAllOfSameNumber || noneAreSelected) {
      setDiceState(randomValues);
    }
  };

  return (
    <main className="body">
      <div className="body__container">
        <section className="body__heading">
          <h1 className="heading__title">Tenzies</h1>
          <p className="heading__text">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
        </section>

        <section className="body__dies_container">
          {diceState.map((dice) => {
            const {id, selected, value} = dice
            return (
              <div
                className={`body__single_die ${selected ? "green" : ""}`}
                key={id}
                onClick={(event) => handleSelect(event, id)}
              >
                <div>{value}</div>
              </div>
            );
          })}
        </section>

        <button
          type="button"
          className="body__roll_button"
          onClick={handleButtonClick}
        >
          {gameState ? "Reset Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}

export default App;
