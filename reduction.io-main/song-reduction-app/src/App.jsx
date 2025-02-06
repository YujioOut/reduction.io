import { useState } from "react";
import "./App.css";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [processedLines, setProcessedLines] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const processLyrics = () => {
    const lines = inputText.split("\n").map((line) =>
      line.split(/(\s+)/).map((word) => ({
        original: word,
        display: word.trim() ? word : " ", // Preserve spaces
        clickState: 0, // 0 = full, 1 = reduced, 2 = hidden checkbox, 3 = full again
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

  return (
    <div className="app-container">
      {/* Lyrics Section */}
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

      {/* YouTube Video Embed Section */}
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
    </div>
  );
}
