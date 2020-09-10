class Action {
    constructor(type, cards, origin, destination, reveal) {
        (this.type = type),
            (this.cards = cards),
            (this.origin = origin),
            (this.destination = destination),
            (this.reveal = reveal);
    }
}
const game = {
    animatedCards: [],
    actions: [],

    addAction: function (type, cards, origin, destination, reveal) {
        switch (type) {
            case "addCards":
                {
                    this.actions.push(
                        new Action(type, cards, origin, destination, reveal)
                    );
                }
                break;
            case "changeColumn":
                {
                    this.actions.push(
                        new Action(type, cards, origin, destination, reveal)
                    );
                }
                break;
            default:
                {
                    this.actions.push(
                        new Action(type, cards, origin, destination, reveal)
                    );
                }
                break;
        }
    },
    undoMove: function () {
        if (this.actions.length) {
            const move = this.actions.pop();
            switch (move.type) {
                case "addCards":
                    {
                        if (deck.hiddenCards.length === 0) {
                            gameSettings.addCard.node.style.visibility =
                                "visible";
                        }
                        let cards = [];
                        for (const column of deck.columns) {
                            cards.push(column.pop());
                        }
                        const styles = gameSettings.addCard.node.getBoundingClientRect();
                        for (const card of cards) {
                            deck.hiddenCards.push(card);
                            card.node.style.top = styles.top + "px";
                            card.node.style.left = styles.left + "px";
                            card.node.style.zIndex = -1;
                        }
                    }
                    break;
                case "changeColumn":
                    {
                        let cards = deck.columns[move.destination].splice(
                            move.cards * -1
                        );
                        const lastIndex = deck.columns[move.origin].length - 1;

                        if (deck.columns[move.origin].length == 0) {
                            const styles = places[
                                move.origin
                            ].getBoundingClientRect();
                            cards.forEach((card, index) => {
                                deck.columns[move.origin].push(card);
                                card.node.style.top =
                                    styles.top +
                                    gameSettings.getInterspace() * index +
                                    "px";
                                card.node.style.left = styles.left + "px";
                            });
                        } else {
                            if (move.reveal) {
                                const lastCard =
                                    deck.columns[move.origin][lastIndex];
                                lastCard.node.dataset.visible = false;
                                lastCard.node.src =
                                    gameSettings.addCard.node.src;
                            }
                            const styles = deck.columns[move.origin][
                                lastIndex
                            ].node.getBoundingClientRect();
                            cards.forEach((card, index) => {
                                deck.columns[move.origin].push(card);
                                card.node.style.top =
                                    styles.top +
                                    gameSettings.getInterspace() * (index + 1) +
                                    "px";
                                card.node.style.left = styles.left + "px";
                            });
                        }
                        game.coverRenew(deck.columns[move.origin]);
                    }
                    break;
            }
        }
    },
    addCards: () => {
        let newCards = deck.hiddenCards.splice(0, places.length);
        let lastCard;
        let lastCardTop;
        let lastCardLeft;
        deck.columns.forEach((column, index) => {
            if (column.length - 1 < 0) {
                lastCard = places[index].getBoundingClientRect();
                lastCardTop = lastCard.top;
                lastCardLeft = lastCard.left;
                newCards[index].node.style.zIndex = 0;
                newCards[index].node.style.top = lastCardTop + "px";
            } else {
                lastCard = column[column.length - 1];
                lastCardTop = Number(lastCard.node.style.top.slice(0, -2));
                lastCardLeft = Number(lastCard.node.style.left.slice(0, -2));
                newCards[index].node.style.zIndex =
                    Number(lastCard.node.style.zIndex) + 1;
                newCards[index].node.style.top =
                    lastCardTop + gameSettings.getInterspace() + "px";
            }
            newCards[index].node.classList.add("moving");

            newCards[index].node.style.left = lastCardLeft + "px";
            setTimeout(function () {
                newCards[index].node.addEventListener("mouseup", move.moveEnd);
                newCards[index].node.addEventListener(
                    "mousedown",
                    move.moveStart
                );
                newCards[index].node.addEventListener("touchend", move.moveEnd);
                newCards[index].node.addEventListener(
                    "touchstart",
                    move.moveStart
                );
                newCards[index].node.classList.remove("moving");
                game.checkFull();
            }, 400);
            column.push(newCards[index]);
        });
        if (deck.hiddenCards.length == 0)
            gameSettings.addCard.node.style.visibility = "hidden";
        game.addAction("addCards");
    },
    getCards: (clickedCard) => {
        const id = clickedCard.dataset.id;
        let columnIndex = null;
        let cardIndex = null;
        const columns = deck.columns;
        columns.forEach((column, colIndex) => {
            column.forEach((card, Index) => {
                if (card.id == id) {
                    columnIndex = colIndex;
                    cardIndex = Index;
                    return 0;
                }
            });
        });
        const tabLength = columns[columnIndex].length;
        if (tabLength == cardIndex + 1) {
            moveActivator = true;
            choosedColumn = columnIndex;
            return columns[columnIndex].splice(cardIndex, cardIndex + 1);
        } else {
            for (let i = cardIndex; i < tabLength - 1; i++) {
                if (
                    !(
                        columns[columnIndex][i].number ==
                        columns[columnIndex][i + 1].number + 1
                    ) ||
                    columns[columnIndex][i].node.dataset.visible == "false"
                ) {
                    moveActivator = false;
                    return [];
                }
            }
            moveActivator = true;
            choosedColumn = columnIndex;
            return columns[columnIndex].splice(cardIndex);
        }
    },
    coverRenew: (cards) => {
        cards.forEach((card, index) => {
            card.node.style.zIndex = index;
        });
    },
    placeCards: (startX, startY, cards) => {
        cards.forEach((card, index) => {
            card.node.style.left = startX + "px";
            card.node.style.top =
                startY + index * gameSettings.getInterspace() + "px";
        });
    },
    ableToJump: (cards, choosedColumn) => {
        let lastCard, lastX, lastY, topCardX, topCardY, cords;
        let index = 0;
        let possibleDropzones = [];

        for (const column of deck.columns) {
            if (index == choosedColumn) {
                index++;
                continue;
            }

            if (deck.columns[index].length == 0) {
                lastX = places[index].getBoundingClientRect().left;
                lastY = places[index].getBoundingClientRect().top;
            } else {
                lastCard = column[column.length - 1].node;
                if (
                    Number(cards[0].node.dataset.number) + 1 !=
                    lastCard.dataset.number
                ) {
                    index++;
                    continue;
                }
                lastX = parseFloat(lastCard.style.left);
                lastY = parseFloat(lastCard.style.top);
            }

            topCardX = parseFloat(cards[0].node.style.left);
            topCardY = parseFloat(cards[0].node.style.top);

            if (
                Math.abs(lastX - topCardX) < gameSettings.fullCardWidth &&
                Math.abs(lastY - topCardY) < gameSettings.fullCardHeight
            ) {
                cords = {
                    x: Math.abs(lastX - topCardX),
                    y: Math.abs(lastY - topCardY),
                    newPosX: lastX,
                    newPosY:
                        deck.columns[index].length == 0
                            ? lastY
                            : lastY + gameSettings.getInterspace(),
                    columnIndex: index,
                };
                possibleDropzones.push(cords);
            }
            index++;
        }
        if (possibleDropzones.length != 0) {
            if (possibleDropzones.length == 1) {
                game.placeCards(
                    possibleDropzones[0].newPosX,
                    possibleDropzones[0].newPosY,
                    cards
                );
                deck.replaceColumns(cards, possibleDropzones[0].columnIndex);
                game.coverRenew(deck.columns[possibleDropzones[0].columnIndex]);
                game.addAction(
                    "changeColumn",
                    cards.length,
                    choosedColumn,
                    possibleDropzones[0].columnIndex
                );
                return true;
            } else {
                if (possibleDropzones[0].x <= possibleDropzones[1].x) {
                    game.placeCards(
                        possibleDropzones[0].newPosX,
                        possibleDropzones[0].newPosY,
                        cards
                    );
                    deck.replaceColumns(
                        cards,
                        possibleDropzones[0].columnIndex
                    );
                    game.coverRenew(
                        deck.columns[possibleDropzones[0].columnIndex]
                    );
                    game.addAction(
                        "changeColumn",
                        cards.length,
                        choosedColumn,
                        possibleDropzones[0].columnIndex
                    );
                    return true;
                } else {
                    game.placeCards(
                        possibleDropzones[1].newPosX,
                        possibleDropzones[1].newPosY,
                        cards
                    );
                    deck.replaceColumns(
                        cards,
                        possibleDropzones[1].columnIndex
                    );
                    game.coverRenew(
                        deck.columns[possibleDropzones[1].columnIndex]
                    );
                    game.addAction(
                        "changeColumn",
                        cards.length,
                        choosedColumn,
                        possibleDropzones[1].columnIndex
                    );
                    return true;
                }
            }
        } else {
            return false;
        }
    },
    checkFull: () => {
        let deleteFull = true;
        deck.columns.forEach((column, index) => {
            if (column.length >= 13) {
                let lastIndex = column.length - 1;
                if (
                    column[lastIndex].number == 0 &&
                    column[lastIndex - 12].number == 12 &&
                    column[lastIndex - 12].node.dataset.visible == "true"
                ) {
                    for (let i = 0; i <= 11; i++) {
                        if (
                            column[lastIndex - i].number + 1 !=
                            column[lastIndex - i - 1].number
                        ) {
                            deleteFull = false;
                        }
                    }

                    if (deleteFull === true) {
                        const cardToFall = column.splice(lastIndex - 12);
                        for (let i = 0; i <= 12; i++) {
                            cardToFall[12 - i].node.style.animation = `fall ${
                                gameSettings.fallingTime
                            }s ${0.1 * i}s linear forwards`;
                            cardToFall[i].node.removeEventListener(
                                "mousedown",
                                move.moveStart
                            );
                            cardToFall[i].node.removeEventListener(
                                "touchstart",
                                move.moveStart
                            );
                            cardToFall[i].node.removeEventListener(
                                "touchend",
                                move.moveEnd
                            );
                            cardToFall[i].node.removeEventListener(
                                "mouseup",
                                move.moveEnd
                            );
                            setTimeout(() => {
                                cardToFall[12 - i].node.remove();
                                cardToFall.pop();
                            }, gameSettings.fallingTime * 1000 + 100 * i);
                        }
                        game.actions = [];
                        setTimeout(() => {
                            if (game.endGame() === true) {
                                game.congratulations();
                                gameSettings.addCard.node.remove();
                            }
                        }, gameSettings.fallingTime * 1000 + 1200);
                        setTimeout(() => {
                            deck.revealLastCard(index);
                        }, gameSettings.fallingTime * 1000 + 1200);
                    } else deleteFull = true;
                }
            }
        });
    },
    refreshTiming: () => {
        clearInterval(gameSettings.refreshTimer);
        gameSettings.refreshTimer = setTimeout(deck.adjusting.bind(deck), 500);
    },
    endGame: () => {
        for (const column of deck.columns) {
            if (column.length > 0) return false;
        }
        if (deck.hiddenCards.length > 0) return false;
        else return true;
    },
    congratulations: () => {
        gameSettings.greet.style.display = "block";
        gameSettings.greet.classList.add("active");
        gameSettings.greet
            .querySelector("button")
            .removeEventListener("click", game.gameStart);
        gameSettings.greet
            .querySelector("button")
            .removeEventListener("click", game.cleanTheMess);
        gameSettings.greet
            .querySelector("button")
            .addEventListener("click", game.cleanTheMess);
        gameSettings.greet
            .querySelector("button")
            .addEventListener("click", game.gameStart);

        const cards = game.animatedCards;
        for (let i = 0; i < 12; i++) {
            cards.push(new Card("red", i, "heart", i));
            cards[i].node.src = cards[i].src;
            field.appendChild(cards[i].node);
            cards[i].node.style.top = "100%";
            cards[i].node.style.left = Math.random() * 100 + "%";
            setTimeout(() => {
                cards[i].node.style.animation = `cardFlip${
                    Math.random() > 0.5 ? "L" : "P"
                } 4s 0s infinite linear`;
            }, 800 * i);
        }
    },
    gameStart: function () {
        gameSettings.insertPatterCard();
        gameSettings.addCard.node.style.visibility = "visible";
        deck.deckGenerator();
        deck.shuffling(deck.cards);
        deck.division();
        deck.injectCards();
        deck.animateShuffling();
        deck.finishing();
        move.trackCards();
        gameSettings.addCard.node.addEventListener("click", game.addCards);
        window.addEventListener("resize", game.refreshTiming);
        gameSettings.greet.style.display = "none";
        gameSettings.greet.classList.remove("active");
    },
    cleanTheMess: function () {
        for (const column of deck.columns) {
            while (column.length) {
                column[0].node.remove();
                column.shift();
            }
        }
        while (deck.hiddenCards.length) {
            deck.hiddenCards[0].node.remove();
            deck.hiddenCards.shift();
        }
        deck.cards = [];
        for (const card of game.animatedCards) {
            card.node.remove();
        }
        game.animatedCards = [];
        game.actions = [];
    },
};
document.addEventListener("keydown", function (e) {
    if (e.keyCode === 90 && e.ctrlKey === true) {
        game.undoMove();
    }
});
