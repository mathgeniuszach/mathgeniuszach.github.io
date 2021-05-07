// Creates a deck of cards from a list of valid cards and some special code.
function makeDeck(deckStr, cardSet) {
    const deck = [];
    const suits = new Set();

    for (const line of deckStr.split(/(\r\n|\r|\n)+/g)) {
        if (line) {
            const data = line.split(/\s+/g);
            const count = parseInt(data[0]);
            for (const suit of data[1]) {
                for (const card of data[2]) {
                    const id = suit + card;
                    if (!cardSet.has(id)) throw Error(`unknown card ${id}`)
                    for (let i = 0; i < count; i++) deck.push(id);
                }
                suits.add(suit);
            }
        }
    }
    if (!deck.length) throw Error("Deck has no cards!");
    return [deck, suits];
}

// Adds a bunch of cards to the set
function makeCards(cardSet, suits, cards) {
    for (const suit of suits) {
        for (const card of cards) {
            cardSet.add(suit + card);
        }
    }
}