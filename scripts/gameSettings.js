const field = document.querySelector("div.field");
const places = field.querySelectorAll(".places div");
const gameSettings = {
    addCard: new Card("special", -1, "special", -1),
    leftSide: field.querySelector(".leftSide"),
    fallingTime: 1.4,
    transitionTime: 400,
    refreshTimer: null,
    greet: document.querySelector("div.endGameScreen"),

    insertPatterCard: function () {
        this.leftSide.appendChild(this.addCard.node);
        this.recalculateCardSize();
    },
    recalculateCardSize: function () {
        this.fullCardHeight = this.addCard.node.getBoundingClientRect().height;
        this.fullCardWidth = this.addCard.node.getBoundingClientRect().width;
    },
    getInterspace: function () {
        if (this.cardType === "big") return this.fullCardHeight / 5;
        else return this.fullCardHeight / 3.4;
    },
};
