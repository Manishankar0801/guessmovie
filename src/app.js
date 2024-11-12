const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Define a port
const PORT = process.env.PORT || 3000;

// Define a route
app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const readMovieNames = () => {
  const contents = fs.readFileSync("movies.txt", "utf8");
  return contents.split("\n");
};

const allMovies = readMovieNames();
let randomIdx = Math.floor(Math.random(0, 1) * allMovies.length);
let movieToGuess = allMovies[randomIdx];
let charsUsedSet = {};
let count = 0;

const validateInput = (req, res, next) => {
  let { letter } = req.body;
  letter = letter.trim().toLowerCase();
  if (charsUsedSet[letter]) {
    return res.status(400).json({ error: "letter already used" });
  }
  req.letter = letter;
  next();
};

const postFunction = (req, res, next) => {
  const { letter } = req;
  console.log(letter);
  charsUsedSet[letter] = true;
  res.status(202).send(`Hello`);
};

app.post("/guess", validateInput, postFunction);
app.get("/guess", (req, res) => {
  let moviesSoFar = "";
  if (charsUsedSet.size >= 9) {
    return res.status(200).send("Hey, you lost");
  }
  for (let i = 0; i < movieToGuess.length; i++) {
    let ch = movieToGuess.charAt(i).toLowerCase();
    if (charsUsedSet[ch]) {
        if (i === 0) {
            moviesSoFar += ch.toUpperCase();
        } else {
            moviesSoFar += ch;
        }
    } else {
      moviesSoFar += " _ ";
    }
    console.log(moviesSoFar, movieToGuess)
  }
  if (moviesSoFar === movieToGuess) {
    return res.status(200).send("Hurray you guessed the movie");
  }
  return res.status(200).json(moviesSoFar);
});
