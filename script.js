class Blackjack {
    constructor() {
        this.dealerSum = 0;
        this.yourSum = 0;
        this.dealerAceCount = 0;
        this.yourAceCount = 0;
        this.hidden = null;
        this.deck = [];
        this.canHit = true;

        this.setupUI();
    }

    setupUI() {
        document.getElementById("startButton").addEventListener("click", () => this.startGame());
        document.getElementById("rules").addEventListener("click", this.showRules);
        document.getElementById("restart").addEventListener("click", () => this.restartGame());

        document.getElementById("gameArea").style.display = "none";
    }

    showRules() {
        alert("Blackjack Rules:\n- Get as close to 21 without going over.\n- Face cards (J, Q, K) are worth 10.\n- Aces can be 1 or 11.\n- Dealer hits until 17+.\n- Click 'Hit' to draw, 'Stay' to stop.");
    }

    startGame() {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameArea").style.display = "block";

        this.buildDeck();
        this.shuffleDeck();
        this.dealCards();

        document.getElementById("hit").addEventListener("click", () => this.hit());
        document.getElementById("stay").addEventListener("click", () => this.stay());
    }

    buildDeck() {
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let types = ["C", "D", "H", "S"];
        this.deck = [];

        for (let type of types) {
            for (let value of values) {
                this.deck.push(value + "-" + type);
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        this.hidden = this.deck.pop();
        this.dealerSum += this.getValue(this.hidden);
        this.dealerAceCount += this.checkAce(this.hidden);

        while (this.dealerSum < 17) {
            let card = this.deck.pop();
            this.addCard("dealer-cards", card);
            this.dealerSum += this.getValue(card);
            this.dealerAceCount += this.checkAce(card);
        }

        for (let i = 0; i < 2; i++) {
            let card = this.deck.pop();
            this.addCard("your-cards", card);
            this.yourSum += this.getValue(card);
            this.yourAceCount += this.checkAce(card);
        }
    }

    addCard(containerId, card) {
        let cardImg = document.createElement("img");
        cardImg.src = `./cards/${card}.png`;
        document.getElementById(containerId).append(cardImg);
    }

    hit() {
        if (!this.canHit) {
            return;
        }
        
        let cardImg = document.createElement("img");
        let card = this.deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        this.yourSum += this.getValue(card);
        this.yourAceCount += this.checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        
        if (this.reduceAce(this.yourSum, this.yourAceCount) > 21) {
            this.canHit = false;
            document.getElementById("hit").style.backgroundColor = "#808080";
        }
    
    }

    stay() {
        this.dealerSum = this.reduceAce(this.dealerSum, this.dealerAceCount);
        this.yourSum = this.reduceAce(this.yourSum, this.yourAceCount);
        this.canHit = false;
        document.getElementById("hidden").src = `./cards/${this.hidden}.png`;

        let message = this.getResultMessage();
        document.getElementById("dealer-sum").innerText = this.dealerSum;
        document.getElementById("your-sum").innerText = this.yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("hit").style.backgroundColor = "#808080";
    }

    getResultMessage() {
        if (this.yourSum > 21) return "You Lose!";
        if (this.dealerSum > 21) return "You Win!";
        if (this.yourSum === this.dealerSum) return "Tie!";
        return this.yourSum > this.dealerSum ? "You Win!" : "You Lose!";
    }

     getValue(card) {
        let data = card.split("-"); // "4-C" -> ["4", "C"]
        let value = data[0];
    
        if (isNaN(value)) { //A J Q K
            if (value == "A") {
                return 11;
            }
            return 10;
        }
        return parseInt(value);
    }
    
     checkAce(card) {
        if (card[0] == "A") {
            return 1;
        }
        return 0;
    }
    
     reduceAce(playerSum, playerAceCount) {
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }

    restartGame() {
        document.getElementById("dealer-cards").innerHTML = "<img id='hidden' src='./cards/BACK.png'>";
        document.getElementById("your-cards").innerHTML = "";
        document.getElementById("dealer-sum").innerText = "";
        document.getElementById("your-sum").innerText = "";
        document.getElementById("results").innerText = "";

        this.dealerSum = 0;
        this.yourSum = 0;
        this.dealerAceCount = 0;
        this.yourAceCount = 0;
        this.canHit = true;

        this.buildDeck();
        this.shuffleDeck();
        this.dealCards();

        document.getElementById("hit").replaceWith(document.getElementById("hit").cloneNode(true));
        document.getElementById("hit").style.backgroundColor = "#4CAF50";
        document.getElementById("stay").replaceWith(document.getElementById("stay").cloneNode(true));

        document.getElementById("hit").addEventListener("click", () => this.hit());
        document.getElementById("stay").addEventListener("click", () => this.stay());
    }
};

window.onload = () => new Blackjack();
