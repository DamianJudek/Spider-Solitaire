class Card {
    constructor(color, number, sign, id) {
        this.color = color;
        this.number = number % 13;
        this.sign = sign;
        this.id = id;
        this.src = `deck/${sign}/${this.number}.png`;
        this.srcSmall = `deck/${sign}-small/${this.number}.png`;
        this.node = (() => {
            const card = document.createElement("img");
            card.src = "deck/special/-1.png";
            card.dataset.color = color;
            card.dataset.number = this.number;
            card.dataset.id = id;
            card.dataset.visible = "false";
            return card;
        })();
    }

}