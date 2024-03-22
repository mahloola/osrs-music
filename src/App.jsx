import React, { useRef } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "react-bootstrap/Button";
import RunescapeMap from "./RunescapeMap";
import { FaDiscord, FaGithub, FaDonate } from "react-icons/fa";
import { getRandomSong } from "./utils/getSong";
import { userGuessed } from "./MapClickHandler";

// TODO:
// rs-stylize the volume control and the start button. overlay volume control on top left of map vertically
// regenerate tile data for bigger zoom levels (maybe up to 7-8, and remove 0-1)
// difficulty settings

const initialSong = getRandomSong();

function App() {
  let replaying = false;
  const audioRef = useRef(null);
  const sourceRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(initialSong);
  const [totalPoints, setTotalPoints] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [guessResult, setGuessResult] = useState(0);
  const [startedGame, setStartedGame] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);

  const playSong = (songName) => {
    const src = `https://oldschool.runescape.wiki/images/${songName
      .trim()
      .replaceAll(" ", "_")}.ogg`;
    sourceRef.current.src = src;
    audioRef.current.load();
    audioRef.current.play();
  };

  

  const restartGame = () => {
    if (guessCount > 4) {
      replaying = true;
      setGuessCount(0);
      setTotalPoints(0);     
      setStartedGame(false);
    }
  }
  return (
    <div className="App">
      <div>
        <div
          style={{
            width: "100vw",
            height: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            position: "absolute",
            paddingBottom: "5vh",
          }}
        >
          {/* <div
            className="statistics"
            style={{ display: startedGame ? "block" : "none" }}
          >
            <table>
              <tr>
                <td>Guesses</td>
                <td style={{textAlign: "right"}}>
                  <GuessCountComponent />
                </td>
              </tr>
              <tr>
                <td>Users</td>
                <td style={{textAlign: "right"}}>4</td>
              </tr>
            </table>
          </div> */}
          <div
            className="ui-box"
            style={{ display: startedGame ? "block" : "none" }}
          >
            <div className="below-map">
              {/* guess button */}
              <Button
                className="button"
                variant={guessResult == 0 ? "info" : "success"}
                disabled={guessResult == 0 ? true : false}
                onClick={() => {
                  const newSongName = getRandomSong();
                  setCurrentSong(newSongName);
                  playSong(newSongName);
                  setGuessCount(guessCount+1);
                  setTotalPoints(totalPoints + guessResult)
                  restartGame();
                  userGuessed();           
                }}
              >
                {guessResult == 0 ? "Place your pin on the map" : `Guess ${guessCount}/5 | Total: ${totalPoints.toLocaleString()}`}
              </Button>
              <audio controls id="audio" ref={audioRef}>
                <source id="source" ref={sourceRef} type="audio/ogg"></source>
              </audio>
            </div>
            <div className="credits">
              <span>
                <a
                  className="icon"
                  href="https://github.com/mahloola/osrs-music"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
                <a className="icon" href="https://discord.gg/7sB8fyUS9W">
                  <FaDiscord />
                </a>
                <a className="icon" href="https://ko-fi.com/mahloola">
                  <FaDonate />
                </a>
              </span>
              <div>
                developed by{" "}
                <a href="https://twitter.com/mahloola" className="link">
                  mahloola
                </a>{" "}
                and{" "}
                <a href="https://twitter.com/FunOrange42" className="link">
                  FunOrange
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`${!startedGame ? "blur" : ""}`}>
          <RunescapeMap
            currentSong={currentSong}
            setGuessResult={setGuessResult}
            setResultVisible={setResultVisible}
            resultVisible={resultVisible}
            userGuessed={userGuessed}
          />
        </div>
        {!startedGame && (
          <Button
            variant="success"
            className="start-button"
            onClick={() => {
              setStartedGame(true);
              playSong(currentSong);
            }}
          >
            {replaying == true ? "Replay" : "Start Game"}
          </Button>
        )}

        <div
          className="alert result-message result-card"
          role="alert"
          style={{
            opacity: resultVisible ? 1 : 0
          }}
        >
          Score
          <br />
          {guessResult}
        </div>
      </div>
    </div>
  );
}

export default App;
