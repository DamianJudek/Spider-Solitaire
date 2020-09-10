let moveActivator = false;
let mouseX;
let mouseY;
let cardOffsetX;
let cardOffsetY;
let caughtedCards;
let startPosX;
let startPosY;
let clickedCard;
let choosedColumn;

const move = {
    moveStart: function (e) {
        e.preventDefault();
        if (e.type == "touchstart") {
            clickedCard = e.touches[0].target;
            cardOffsetX =
                e.touches[0].pageX - e.target.getBoundingClientRect().left;
            cardOffsetY =
                e.touches[0].pageY - e.target.getBoundingClientRect().top;
        } else {
            clickedCard = e.target;
            cardOffsetX = e.offsetX;
            cardOffsetY = e.offsetY;
        }
        startPosX = parseFloat(clickedCard.style.left);
        startPosY = parseFloat(clickedCard.style.top);

        caughtedCards = game.getCards(clickedCard);
    },
    moving: function (e) {
        e.preventDefault();
        if (moveActivator) {
            if (e.type == "touchmove") {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            caughtedCards.forEach((card, index) => {
                card.node.style.left = mouseX - cardOffsetX + "px";
                card.node.style.top =
                    mouseY -
                    cardOffsetY +
                    index * gameSettings.getInterspace() +
                    "px";
                card.node.style.zIndex = 100 + index;
            });
        }
    },

    moveEnd: function () {
        if (moveActivator) {
            moveActivator = false;
            if (game.ableToJump(caughtedCards, choosedColumn)) {
                deck.revealLastCard(choosedColumn) == true
                    ? (game.actions[game.actions.length - 1].reveal = true)
                    : (game.actions[game.actions.length - 1].reveal = false);
                game.checkFull();
            } else if (caughtedCards !== null) {
                move.safeMovement(caughtedCards);
                game.placeCards(startPosX, startPosY, caughtedCards);
                deck.replaceColumns(caughtedCards, choosedColumn);
                game.coverRenew(deck.columns[choosedColumn]);
                caughtedCards = [];
            }
        }
    },
    trackCards: () => {
        for (const column of deck.columns) {
            for (const card of column) {
                card.node.addEventListener("mouseup", move.moveEnd);
                card.node.addEventListener("mousedown", move.moveStart);
                card.node.addEventListener("touchend", move.moveEnd);
                card.node.addEventListener("touchstart", move.moveStart);
            }
        }
    },
    safeMovement: function (tab) {
        for (const card of tab) {
            card.node.classList.add("moving");
            card.node.removeEventListener("mousedown", move.moveStart);
            card.node.removeEventListener("touchstart", move.moveStart);
        }
        setTimeout(() => {
            for (const card of tab) {
                card.node.addEventListener("mousedown", move.moveStart);
                card.node.addEventListener("touchstart", move.moveStart);
                card.node.classList.remove("moving");
            }
        }, gameSettings.transitionTime);
    },
};
field.addEventListener("mousemove", move.moving);
field.addEventListener("touchmove", move.moving);
field.addEventListener(
    "mouseleave",
    () => {
        if (moveActivator) move.moveEnd();
    },
    false
);
