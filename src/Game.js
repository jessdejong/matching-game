import { SiAirbnb } from "react-icons/si";
import { SiAdidas } from "react-icons/si";
import { SiAmazon } from "react-icons/si";
import { SiBitcoin } from "react-icons/si";
import { SiBurgerking } from "react-icons/si";
import { SiCnn } from "react-icons/si";
import { SiCplusplus } from "react-icons/si";
import { SiDropbox } from "react-icons/si";

import { useEffect, useState } from "react";
import Leaderboard from "./Leaderboard";
import { addGameRun, db } from "./firebase";

const ICONS = [
  <SiAirbnb class="h-16 w-16 fill-white" />,
  <SiAdidas class="h-16 w-16 fill-white" />,
  <SiAmazon class="h-16 w-16 fill-white" />,
  <SiBitcoin class="h-16 w-16 fill-white" />,
  <SiBurgerking class="h-16 w-16 fill-white" />,
  <SiCnn class="h-16 w-16 fill-white" />,
  <SiCplusplus class="h-16 w-16 fill-white" />,
  <SiDropbox class="h-16 w-16 fill-white" />,
];

const randomCardIconState = (numCards) => {
  const nums = [...Array(numCards / 2).keys(), ...Array(numCards / 2).keys()];
  return nums.sort(() => 0.5 - Math.random());
};

function Card(props) {
  const emptyIcon = <div class="h-16 w-16"></div>;

  return (
    <>
      {props.visible ? (
        <>
          {props.matched ? (
            <button
              type="button"
              class="shadow-xl rounded-xl bg-emerald-300 p-8 min-w-40 min-h-40 flex justify-center items-center"
              onClick={() => props.onCardClicked(props.cardNum)}
            >
              {props.icon}
            </button>
          ) : (
            <button
              type="button"
              class="shadow-xl rounded-xl bg-sky-400 p-8 min-w-40 min-h-40 flex justify-center items-center"
              onClick={() => props.onCardClicked(props.cardNum)}
            >
              {props.icon}
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          class="shadow-xl rounded-xl bg-gray-700 p-8 min-w-40 min-h-40 flex justify-center items-center"
          onClick={() => props.onCardClicked(props.cardNum)}
        >
          {emptyIcon}
        </button>
      )}
    </>
  );
}

const getFormattedTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const min = minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const sec = seconds.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return min + ":" + sec;
};

function StopWatch({ time, setTime, pause }) {
  useEffect(() => {
    let interval = null;

    if (!pause) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [pause]);

  return <p>{getFormattedTime(time)}</p>;
}

function Game() {
  const [icons, setIcons] = useState(randomCardIconState(16));
  const [matched, setMatched] = useState([...Array(16)].fill(false));
  const [visible, setVisible] = useState([...Array(16)].fill(false));
  const [numMatchesMade, setNumMatchesMade] = useState(0);
  const [numMoves, setNumMoves] = useState(0);
  const [firstCard, setFirstCard] = useState(-1);
  const [secondCard, setSecondCard] = useState(-1);
  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  const [nameEntered, setNameEntered] = useState(false);
  const [username, setUsername] = useState("anonymous");

  const makeVisible = (cardNum) => {
    const newVisibleArr = visible.map((visibility, index) => {
      if (index == cardNum) return true;
      else return visibility;
    });
    setVisible(newVisibleArr);
  };

  const makeInvisible = (cardOne, cardTwo) => {
    const newVisibleArr = visible.map((visibility, index) => {
      if (index == cardOne || index == cardTwo) return false;
      else return visibility;
    });
    setVisible(newVisibleArr);
  };

  const markAsMatched = (firstCard, secondCard) => {
    const newMatchedArr = matched.map((isMatched, index) => {
      if (index == firstCard || index == secondCard) return true;
      return isMatched;
    });
    setMatched(newMatchedArr);
  };

  const onCardClicked = (cardNum) => {
    // If the card isn't visible, then don't do anything.
    if (visible[cardNum]) return;
    // If a pair of cards have already been pressed, don't do anything.
    if (firstCard != -1 && secondCard != -1) return;
    // Otherwise, this is a card that can be flipped over.
    if (firstCard == -1) {
      setPause(false);
      setFirstCard(cardNum);
      makeVisible(cardNum);
    } else if (secondCard == -1) {
      // Flip this card over. If a match has been made. Mark both cards as matched.
      setSecondCard(cardNum);
      setNumMoves(numMoves + 1);
      makeVisible(cardNum);
      if (icons[firstCard] == icons[cardNum]) {
        markAsMatched(firstCard, cardNum);
        setNumMatchesMade(numMatchesMade + 1);
        setFirstCard(-1);
        setSecondCard(-1);

        if (numMatchesMade + 1 == 8) {
          setPause(true);

          // Log this run in the database
          let today = new Date();
          const dd = String(today.getDate()).padStart(2, "0");
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const yyyy = today.getFullYear();

          today = mm + "/" + dd + "/" + yyyy;
          const formattedTime = getFormattedTime(time);
          addGameRun(db, { username, "numMoves": numMoves + 1, time, today, formattedTime });
        }
      } else {
        // Mark both as not visible after 1 second.
        setTimeout(() => {
          makeInvisible(firstCard, cardNum);
          setFirstCard(-1);
          setSecondCard(-1);
        }, 500);
      }

      // Flip this card over for 1 second. After 1 second has passed, flip both
    }
  };

  const resetGame = () => {
    setTime(0);
    setPause(true);
    setNumMatchesMade(0);
    setNumMoves(0);
    setIcons(randomCardIconState(16));
    setMatched([...Array(16)].fill(false));
    setVisible([...Array(16)].fill(false));
    setFirstCard(-1);
    setSecondCard(-1);
  };

  const usernameInputChange = (e) => {
    if (e.target.value == "") setUsername("anonymous");
    else setUsername(e.target.value);
  };

  const usernameInputPage = (
    <div class="bg-teal-600 mx-auto mt-10 p-5 rounded-xl text-center flex flex-col items-center">
      <p class="text-white text-xl">Enter a username to play:</p>
      <br />
      <input
        class="shadow border rounded w-full py-2 px-3 leading-tight"
        placeholder="e.g. anonymous"
        onChange={usernameInputChange}
      ></input>
      <button
        type="button"
        class="w-full p-1 bg-sky-700 mt-2 rounded text-white hover:bg-sky-600"
        onClick={() => setNameEntered(true)}
      >
        Continue
      </button>
    </div>
  );

  return !nameEntered ? (
    usernameInputPage
  ) : (
    <>
      <div class="mx-auto flex flex-row space-x-8 mt-5">
        <p>{numMatchesMade}/8</p>
        <StopWatch time={time} setTime={setTime} pause={pause} />
        <p>{numMoves} Moves</p>
        <button type="button" class="text-blue-500" onClick={resetGame}>
          Reset
        </button>
      </div>
      <div class="mx-auto shadow-xl rounded-xl p-10 m-5 bg-gradient-to-b from-teal-500 to-teal-600 grid grid-cols-4 gap-4">
        {[...Array(16).keys()].map((element, index) => (
          <Card
            index={index}
            key={index}
            cardNum={element}
            onCardClicked={onCardClicked}
            icon={ICONS[icons[index]]}
            visible={visible[index]}
            matched={matched[index]}
          />
        ))}
      </div>
      <Leaderboard />
    </>
  );
}

export default Game;
