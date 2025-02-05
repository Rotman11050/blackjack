class Blackjack {
    constructor() {
        this.dealerSum = 0;
        this.yourSum = 0;
        this.dealerAceCount = 0;
        this.yourAceCount = 0;
        this.hidden = null;
        this.deck = [];
        this.canHit = true;
        
        this.init();
    }
    
    init() {
        this.buildDeck();
        this.shuffleDeck();
        this.startGame();
        document.getElementById("restart").addEventListener("click", () => this.restartGame());
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
    
    startGame() {
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
        
        document.getElementById("hit").addEventListener("click", () => this.hit());
        document.getElementById("stay").addEventListener("click", () => this.stay());
    }
    
    addCard(containerId, card) {
        let cardImg = document.createElement("img");
        cardImg.src = `./cards/${card}.png`;
        document.getElementById(containerId).append(cardImg);
    }
    
    hit() {
        if (!this.canHit) return; 
    
        let card = this.deck.pop();
        this.addCard("your-cards", card);
        this.yourSum += this.getValue(card);
        this.yourAceCount += this.checkAce(card);
    
        
        this.yourSum = this.reduceAce(this.yourSum, this.yourAceCount);
    
        if (this.yourSum > 21) {
            this.canHit = false; 
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
    }
    
    getResultMessage() {
        if (this.yourSum > 21) return "You Lose!";
        if (this.dealerSum > 21) return "You Win!";
        if (this.yourSum === this.dealerSum) return "Tie!";
        return this.yourSum > this.dealerSum ? "You Win!" : "You Lose!";
    }
    
    getValue(card) {
        let value = card.split("-")[0];
        return isNaN(value) ? (value === "A" ? 11 : 10) : parseInt(value);
    }
    
    checkAce(card) {
        return card.startsWith("A") ? 1 : 0;
    }
    
    reduceAce(sum, aceCount) {
        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }
        return sum;
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
        this.startGame();
    
        document.getElementById("hit").replaceWith(document.getElementById("hit").cloneNode(true));
        document.getElementById("stay").replaceWith(document.getElementById("stay").cloneNode(true));
    
        document.getElementById("hit").addEventListener("click", () => this.hit());
        document.getElementById("stay").addEventListener("click", () => this.stay());
    }
    
}

window.onload = () => new Blackjack();
