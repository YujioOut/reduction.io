import { useState } from "react";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [processedLines, setProcessedLines] = useState([]);

  const processLyrics = () => {
    const lines = inputText.split("\n").map((line) =>
      line.split(/(\s+)/).map((word) => ({
        original: word,
        reduced: word.trim() ? word : " ", // Preserve spaces
        isReduced: false,
      }))
    );
    setProcessedLines(lines);
  };

  const toggleReduction = (lineIndex, wordIndex) => {
    setProcessedLines((prevLines) =>
      prevLines.map((line, lIndex) =>
        lIndex === lineIndex
          ? line.map((word, wIndex) =>
              wIndex === wordIndex
                ? {
                    ...word,
                    reduced:
                      word.isReduced || !word.original.trim()
                        ? word.original
                        : word.original[0] + " ",
                    isReduced: !word.isReduced && word.original.trim() !== "",
                  }
                : word
            )
          : line
      )
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        🎵 Song Reduction App
      </h1>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
        rows="6"
        placeholder="Paste lyrics here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button
        className="mt-3 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
        onClick={processLyrics}
      >
        Process
      </button>
      <div className="mt-6 text-lg text-left bg-white p-4 rounded-lg shadow">
        {processedLines.map((line, lineIndex) => (
          <div key={lineIndex} className="mb-2">
            {line.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="cursor-pointer px-1 text-blue-700 font-semibold hover:text-blue-900 transition"
                onClick={() => toggleReduction(lineIndex, wordIndex)}
              >
                {word.reduced + (word.original.trim() ? " " : "")}
              </span>
            ))}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
