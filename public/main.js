var ui = (function(){
    let guessString = document.querySelector(".guessString");
    let guessedLettersContainer = document.querySelector(".guessedLettersContainer");
    let counter = document.querySelector(".counter");
    function update(data){
	if(data.guess.newGuess == true) {
	    let div = document.createElement("div");
	    div.innerText = data.guess.letter;
	    guessedLettersContainer.appendChild(div);
	}

	guessString.innerText = data.session.guessString;
	counter.innerText = data.session.guessesLeft;
    }
    
    return {
	update: update
    };
})();

var input = (function(){
    function handleKeyInput(e){
	if(/^[a-zA-Z]{1}$/.test(e.key)){
	    let myHeaders = new Headers({
		"Content-Type": "application/json"});
	    window.fetch(`/guess/${e.key.toLowerCase()}`, {
		method: 'post',
		credentials: 'include',
		headers: myHeaders
	    }).then(data => {
		return data.json();
	    }).then(data => {
                if(data.session.guessesLeft < 1){
                    window.location.replace("/lose");
                }
                if(data.session.word == data.session.guessString){
                    window.location.replace("/win");
                }
		ui.update(data);
	    });
	}
    }
    
    function init(){
	window.addEventListener("keyup", e => handleKeyInput(e));
    }
    
    return {
	init: init
    };
})();

var core = (function(thisObj){
    let body = document.querySelector(".page");
    console.log("this is the body: ", body);


            function makeRandomColor(){
                return Math.floor(Math.random()*255);
            }
    
    
        let counter = 0;

    let curRed1=makeRandomColor();
        let nextRed1=makeRandomColor();
        let curGreen1=makeRandomColor();
        let nextGreen1=makeRandomColor();
    let curBlue1 = makeRandomColor();
    let nextBlue1 = makeRandomColor();

    let curRed2=makeRandomColor();
        let nextRed2=makeRandomColor();
        let curGreen2=makeRandomColor();
        let nextGreen2=makeRandomColor();
    let curBlue2 = makeRandomColor();
    let nextBlue2 = makeRandomColor();



    let cssString = "";

    function animate() {

            
        requestAnimationFrame(animate);

        if (counter % 60 === 0){
            console.log("colorset");
            counter = 0;
            curRed1 = nextRed1;
            curGreen1 = nextGreen1;
            curBlue1 = nextBlue1;
            nextRed1 = makeRandomColor();
            nextGreen1 = makeRandomColor();
            nextBlue1 = makeRandomColor();

            curRed2 = nextRed2;
            curGreen2 = nextGreen2;
            curBlue2 = nextBlue2;
            nextRed2 = makeRandomColor();
            nextGreen2 = makeRandomColor();
            nextBlue2 = makeRandomColor();
        }


        console.log("animate");
        let interRed1 = curRed1 + Math.floor(((nextRed1 - curRed1)/60)*counter);
        let interGreen1 = curGreen1 + Math.floor(((nextGreen1 - curGreen1)/60)*counter);
        let interBlue1 = curBlue1 + Math.floor(((nextBlue1 - curBlue1)/60)*counter);
        let interRed2 = curRed2 + Math.floor(((nextRed2 - curRed2)/60)*counter);
        let interBlue2 = curBlue2 + Math.floor(((nextBlue2 - curBlue2)/60)*counter);
        let interGreen2 = curGreen2 + Math.floor(((nextGreen2 - curGreen2)/60)*counter);
            
            cssString = `linear-gradient(to bottom right, rgb(${interRed1},${interGreen1},${interBlue1}), rgb(${interRed2},${interGreen2},${interBlue2}));`;
        
            body.setAttribute("style", `background: ${cssString}`);
        counter += 1;
        }

    

    function init(){
	input.init();
        animate();
    }

    return {
	init: init
    };
    
})(this);

core.init();
