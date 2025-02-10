import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [processedLines, setProcessedLines] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [repertoire, setRepertoire] = useState([]);

  useEffect(() => {
    const savedRepertoire = localStorage.getItem("repertoire");
    if (savedRepertoire) {
      setRepertoire(JSON.parse(savedRepertoire));
    }
  }, []);

  useEffect(() => {
    if (repertoire.length > 0) {
      localStorage.setItem("repertoire", JSON.stringify(repertoire));
    }
  }, [repertoire]);

  const processLyrics = () => {
    const lines = inputText.split("\n").map((line) =>
      line.split(/(\s+)/).map((word) => ({
        original: word,
        display: word.trim() ? word : " ",
        clickState: 0,
      }))
    );
    setProcessedLines(lines);
  };

  const cycleWordState = (lineIndex, wordIndex) => {
    setProcessedLines((prevLines) =>
      prevLines.map((line, lIndex) =>
        lIndex === lineIndex
          ? line.map((word, wIndex) => {
              if (wIndex === wordIndex) {
                let newState = (word.clickState + 1) % 4;
                let newDisplay =
                  newState === 1
                    ? word.original[0]
                    : newState === 2
                    ? "⬜"
                    : newState === 3
                    ? word.original
                    : word.original;
                return { ...word, display: newDisplay, clickState: newState };
              }
              return word;
            })
          : line
      )
    );
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : "";
  };

  const saveToRepertoire = () => {
    if (!inputText.trim()) return;

    const songTitle = inputText.split("\n")[0];
    const newSong = {
      lyrics: inputText,
      processed: processedLines,
      youtubeUrl,
    };

    setRepertoire((prevRepertoire) => {
      const existingIndex = prevRepertoire.findIndex(
        (song) => song.lyrics.split("\n")[0] === songTitle
      );

      if (existingIndex !== -1) {
        // Update existing song
        const updatedRepertoire = [...prevRepertoire];
        updatedRepertoire[existingIndex] = newSong;
        return updatedRepertoire;
      }

      // Add new song
      return [...prevRepertoire, newSong];
    });
  };

  const deleteSong = (index) => {
    setRepertoire((prevRepertoire) => {
      const updatedRepertoire = prevRepertoire.filter((_, i) => i !== index);
      localStorage.setItem("repertoire", JSON.stringify(updatedRepertoire));
      return updatedRepertoire;
    });
  };

  const addNewSong = () => {
    setInputText("");
    setProcessedLines([]);
    setYoutubeUrl("");
  };

  const loadSong = (song) => {
    setInputText(song.lyrics);
    setProcessedLines(song.processed);
    setYoutubeUrl(song.youtubeUrl);
  };

  return (
    <div className="app-container">
      <div className="lyrics-container">
        <h1>🎵 Song Reduction App</h1>
        <textarea
          className="lyrics-input"
          rows="6"
          placeholder="Paste lyrics here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        <button onClick={processLyrics}>Process</button>
        <button onClick={saveToRepertoire}>Save to Repertoire</button>
        <div>
          {processedLines.map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="word"
                  onClick={() => cycleWordState(lineIndex, wordIndex)}
                >
                  {word.display + (word.original.trim() ? " " : "")}
                </span>
              ))}
              <br />
            </div>
          ))}
        </div>
      </div>

      <div className="youtube-container">
        <h2>🎥 YouTube Video</h2>
        <input
          type="text"
          className="youtube-input"
          placeholder="Paste YouTube URL..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        {extractVideoId(youtubeUrl) && (
          <iframe
            className="youtube-frame"
            src={`https://www.youtube.com/embed/${extractVideoId(youtubeUrl)}`}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <div className="repertoire-container">
        <h2>📜 My Repertoire</h2>
        {repertoire.length === 0 ? (
          <p>No saved songs yet.</p>
        ) : (
          <ul>
            {repertoire.map((song, index) => (
              <li key={index} className="repertoire-item">
                <span
                  onClick={() => deleteSong(index)}
                  className="delete-button"
                >
                  ✖
                </span>
                <button onClick={() => loadSong(song)}>
                  🎶 {song.lyrics.split("\n")[0]}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="add-song-container">
          <button onClick={addNewSong} className="add-song-button">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
