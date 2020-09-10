const deck = {
    cards: [],
    columns: [],
    deckGenerator: function (type = 1) {
        if (window.innerWidth < 750) {
            gameSettings.cardType = "small";
        } else {
            gameSettings.cardType = "big";
        }
        switch (type) {
            case 1:
                {
                    for (let i = 0; i < 104; i++) {
                        this.cards.push(new Card("red", i, "heart", i));
                    }
                }
                break;
            // case 2:
            //     {
            //         for (let i = 0; i < 52; i++) {
            //             this.cards.push(new Card("red", i, "heart", i));
            //         }
            //         for (let i = 52; i < 104; i++) {
            //             this.cards.push(new Card("black", i, "clubs", i));
            //         }
            //     }
            //     break;
            // case 3:{
            //     for(let i=0; i<13; i++){
            //         this.cards.push(new Card("red", i, "heart", i));
            //     }
            //     for(let i=13; i<26; i++){
            //         this.cards.push(new Card("black", i, "clubs", i));
            //     }
            //     for(let i=26; i<39; i++){
            //         this.cards.push(new Card("red", i, "diamonds", i));
            //     }
            //     for(let i=39; i<52; i++){
            //         this.cards.push(new Card("black", i, "spades", i));
            //     }
            // }break;
            default: {
                for (let i = 0; i < 104; i++) {
                    this.cards.push(new Card("red", i, "heart", i));
                }
            }
        }
    },
    injectCards: function () {
        for (const card of this.hiddenCards) {
            field.appendChild(card.node);
        }
        for (const column of this.columns) {
            for (const card of column) {
                field.appendChild(card.node);
            }
        }
    },
    animateShuffling: () => {
        const top = gameSettings.addCard.node.offsetTop;
        const left = gameSettings.addCard.node.offsetLeft;
        for (const column of deck.columns) {
            for (const card of column) {
                card.node.style.top = top + "px";
                card.node.style.left = left + "px";
                card.node.classList.add("movingSlow");
            }
        }
        deck.adjusting();
        for (const column of deck.columns) {
            for (const card of column) {
                setTimeout(() => {
                    card.node.classList.remove("movingSlow");
                }, 820);
            }
        }
    },
    adjusting: function () {
        gameSettings.recalculateCardSize();
        const screenSize = window.innerWidth;
        if (screenSize < 750 && gameSettings.cardType === "big") {
            gameSettings.cardType = "small";
            for (const card of deck.cards) {
                if (card.node.dataset.visible === "true") {
                    card.node.src = card.srcSmall;
                }
            }
            for (const cards of deck.columns) {
                for (const card of cards) {
                    if (card.node.dataset.visible === "true") {
                        card.node.src = card.srcSmall;
                    }
                }
            }
        } else if (screenSize >= 750 && gameSettings.cardType === "small") {
            gameSettings.cardType = "big";
            for (const card of deck.cards) {
                if (card.node.dataset.visible === "true") {
                    card.node.src = card.src;
                }
            }
            for (const cards of deck.columns) {
                for (const card of cards) {
                    if (card.node.dataset.visible === "true") {
                        card.node.src = card.src;
                    }
                }
            }
        }
        const addCard = gameSettings.addCard.node;
        const cardHeight = gameSettings.getInterspace();

        let top = addCard.offsetTop;
        let left = addCard.offsetLeft;
        for (const card of this.hiddenCards) {
            card.node.style.top = top + "px";
            card.node.style.left = left + "px";
            card.node.style.zIndex = "-1";
        }

        this.columns.forEach((column, index) => {
            top = places[index].offsetTop;
            left = places[index].offsetLeft;
            turn = 0;
            for (const card of column) {
                card.node.style.top = top + cardHeight * turn + "px";
                card.node.style.left = left + "px";
                card.node.style.zIndex = turn;
                turn++;
            }
        });
    },
    shuffling: function (tab) {
        tab.sort(function () {
            return 0.5 - Math.random();
        });
    },
    division: function () {
        this.hiddenCards = this.cards.slice(0, 60);
        this.columns[0] = this.cards.slice(60, 61);
        this.columns[1] = this.cards.slice(61, 62);
        this.columns[2] = this.cards.slice(62, 64);
        this.columns[3] = this.cards.slice(64, 66);
        this.columns[4] = this.cards.slice(66, 70);
        this.columns[5] = this.cards.slice(70, 75);
        this.columns[6] = this.cards.slice(75, 81);
        this.columns[7] = this.cards.slice(81, 88);
        this.columns[8] = this.cards.slice(88, 96);
        this.columns[9] = this.cards.slice(96, 104);
    },
    finishing: function () {
        if (gameSettings.cardType === "big") {
            for (const column of this.columns) {
                column[column.length - 1].node.src =
                    column[column.length - 1].src;
                column[column.length - 1].node.dataset.visible = "true";
            }
            for (const card of this.hiddenCards) {
                card.node.src = card.src;
                card.node.dataset.visible = "true";
            }
        } else {
            for (const column of this.columns) {
                column[column.length - 1].node.src =
                    column[column.length - 1].srcSmall;
                column[column.length - 1].node.dataset.visible = "true";
            }
            for (const card of this.hiddenCards) {
                card.node.src = card.srcSmall;
                card.node.dataset.visible = "true";
            }
        }
    },
    replaceColumns: function (cards, columnId) {
        for (const card of cards) {
            this.columns[columnId].push(card);
        }
    },
    revealLastCard: (columnId) => {
        const lastCardIndex = deck.columns[columnId].length - 1;
        if (lastCardIndex >= 0) {
            const lastCard = deck.columns[columnId][lastCardIndex];
            if (gameSettings.cardType === "small") {
                lastCard.node.src = lastCard.srcSmall;
            } else {
                lastCard.node.src = lastCard.src;
            }

            if (lastCard.node.dataset.visible == "true") {
                return false;
            } else {
                lastCard.node.dataset.visible = "true";
                return true;
            }
        }
        return false;
    },
};
