
const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fs = require('fs');
const port = process.env.PORT || 4000;

var app = express();

const words = fs.readFileSync("./words", "utf-8").toLowerCase().split("\n");

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views/');

app.use(express.static('./public'));

app.use(session({
    secret: 'tone deaf opera farts',
    resave: false,
    cookie: {
	maxAge: 900000	
    }
}));

app.get("/", (req,res) => {

    if (req.session.data){
	if (req.session.data.guessesLeft < 1){
            return res.redirect("/lose");
        }
        if(req.session.data.guessString == req.session.data.word){
            return res.redirect("/win");
        }
    }
    else {
	let randomWord = words[Math.floor(Math.random()*words.length)];
	req.session.data = {
	    guessesLeft: 8,
	    status: "active",
	    word: randomWord,
	    guessString: new Array(randomWord.length).fill("_").join(""),
	    guessedLetters: []
	};
    }
    return res.render("index", {data: req.session.data});
});

app.get("/lose", (req,res)=>{
    if(!req.session.data){
        res.redirect("/");        
    }
    if(req.session.data.guessesLeft>0){
        res.redirect("/");
    }
    return res.render("lose", {word: req.session.data.word}); 
});

app.get("/win", (req,res)=>{
  if(!req.session.data){
        res.redirect("/");        
  }
    if(req.session.data.guessString != req.session.data.word)
        res.redirect("/");
    return res.render("win");
});

app.get("/restartGame", ((req,res) => {
    let randomWord = words[Math.floor(Math.random()*words.length)];
    req.session.data = {
        guessesLeft: 8,
        status: "active",
        word: randomWord,
        guessString: new Array(randomWord.length).fill("_").join(""),
        guessedLetters: []
    };
    return res.redirect("/");
}));

app.post("/guess/:letter", (req,res) => {
    let curReq = req.session.data;
    let guess = {
	letter: req.params.letter,
	newGuess: true,
	correctGuess: false,
	updatedGuessString: req.session.data.guessString
    };

    if(req.session.data.guessedLetters.indexOf(guess.letter) == -1)
	req.session.data.guessedLetters.push(guess.letter);
    else
	guess.newGuess = false;

    if(req.session.data.word.indexOf(guess.letter) > -1 && guess.newGuess == true){
	let matchingIndices = [];
	function findMatches(string, elem, offset){
	    let index = string.indexOf(elem);
	    if (index == -1)
		return matchingIndices;
	    else {
		matchingIndices.push(string.indexOf(elem)+offset);
		return findMatches(string.substring(index+1), elem, offset+index+1);
	    }
	}

	function replaceIndicesWithLetter(word, array, letter){
	    array.forEach(e => {
		word = word.substring(0,e) + letter + word.substring(e+1);
	    });
	    return word;
	}
	req.session.data.guessString = replaceIndicesWithLetter(req.session.data.guessString,
							   findMatches(
							       req.session.data.word,
							       guess.letter,
							       0
							   ),
							   guess.letter);
	guess.updatedGuessString = req.session.data.guessString;
    }
    else
	req.session.data.guessesLeft -= 1;

    console.log(JSON.stringify({guess: guess}));
    return res.send(JSON.stringify({
	guess: guess,
	session: req.session.data
	
    }));
});

app.listen(port, ()=>console.log("Server listening on port:", port));
 
