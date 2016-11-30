/*****************************************************************************
 * Game object
 *****************************************************************************/

function Game() {
    //#region Private variables

    //game
    var __currentPlayer: Player;
    var __nsScore: number; //north south
    var __ewScore: number; //east west

    //hand
    var __deck: Card[]; //contains the shuffled deck or what's left of it after dealing
    var __gameStage: GameStage; //bidding round 1, bidding round 2, or trick playing
    var __playersBid: number; //number of players who have bid so far
    var __hands: Card[][]; //2d array of everyone's hands
    var __trumpCandidateCard: Card; //turned up card
    var __trumpSuit: Suit;	//current trump suit
    var __dealer: Player;
    var __maker: Player; //player who called trump
    var __alonePlayer: Player;
    var __numPlayers: number; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
    var __nsTricksWon: number;
    var __ewTricksWon: number;

    //trick
    var __trickNum: number; //what trick we're on
    var __trickPlayersPlayed: number; //how many players have played this trick
    var __trickSuitLead: Suit; //the suit that was lead
    var __trickPlayedCards: PlayedCard[]; //array of cards that have been played this trick so far

    //settings
    var __sound: boolean;
    var __openHands: boolean;
    var __defendAlone: boolean;
    var __noTrump: boolean;
    var __showTrickHistory: boolean;
    var __statMode: boolean;
    var __aiPlayers: EuchreAI[];
    var __hasHooman: boolean; //if there is a human player
    //#endregion

    //#region Get functions
    this.getGameStage = function () {
        return __gameStage;
    }
    this.getPlayersBid = function () {
        return __playersBid;
    }
    this.getNsScore = function () {
        return __nsScore;
    }
    this.getEwScore = function () {
        return __ewScore;
    }
    this.getTrumpCandidateCard = function () {
        var card;

        card = new Card(__trumpCandidateCard.suit, __trumpCandidateCard.rank);
        return card;
    }
    this.getTrumpSuit = function () {
        return __trumpSuit;
    }
    this.getDealer = function () {
        return __dealer;
    }
    this.getMaker = function () {
        return __maker;
    }
    this.getAlonePlayer = function () {
        return __alonePlayer;
    }
    this.getNumPlayers = function () {
        return __numPlayers;
    }
    this.getTrickNum = function () {
        return __trickNum;
    }
    this.getTrickPlayersPlayed = function () {
        return __trickPlayersPlayed;
    }
    this.getTrickSuit = function () {
        return __trickSuitLead;
    }
    this.getTrickPlayedCards = function () {
        var playedCards: PlayedCard[] = [];
        var card: Card;
        var cardCopy: Card;

        for (var i = 0; i < __trickPlayedCards.length; i++) {
            card = __trickPlayedCards[i].card;

            //make deep copy of cards
            cardCopy = new Card(card.suit, card.rank);
            playedCards.push({ player: __trickPlayedCards[i].player, card: cardCopy });
        }
        return playedCards;
    }
    this.getCurrentPlayer = function () {
        return __currentPlayer;
    }
    this.getNsTricksWon = function () {
        return __nsTricksWon;
    }
    this.getEwTricksWon = function () {
        return __ewTricksWon;
    }
    this.isOpenHands = function () {
        return __openHands;
    }
    this.isStatMode = function () {
        return __statMode;
    }
    this.getAIPlayer = function (player) {
        return (__aiPlayers[player]);
    }
    this.myHand = function () {
        var hand = [];
        var card;

        for (var i = 0; i < __hands[__currentPlayer].length; i++) {
            card = __hands[__currentPlayer][i];
            hand[i] = new Card(card.suit, card.rank, card.id);
        }

        return hand;
    }

    //#endregion

    /*******************************
 	* Private functions
 	********************************/

    function startNewGame() {
        animShowText("STAGE: start");
        grabSettings();
        initGame();
        doStep();
    }

    //TODO: implement these!
    function letHumanBid(param) { }
    function letHumanClickCards() { }

    function doStep() {
        animShowText("STAGE: " + GameStage[__gameStage]);
        switch (__gameStage) {
            case GameStage.NewHand:
                initHand();
                break;
            case GameStage.BidRound1:
                if (!__aiPlayers[__currentPlayer]) {
                    letHumanBid(1);
                    return;
                }
                handleBid();
                break;
            case GameStage.BidRound2:
                if (!__aiPlayers[__currentPlayer]) {
                    letHumanBid(2);
                    return;
                }
                handleBid();
                break;
            case GameStage.Discard:
                if (!__aiPlayers[__dealer]) {
                    letHumanClickCards();
                    return;
                }
                discardCard(__aiPlayers[__dealer].pickDiscard());
                break;
            case GameStage.PlayTricks:
                if (!__aiPlayers[__currentPlayer]) {
                    letHumanClickCards();
                    return;
                }
                playTrickStep();
                break;
            default:
                return;
        }
        doStep();
    }

    //#region Setup
    function grabSettings() {
        //checkbox settings
        __sound = (document.getElementById("chkSound") as HTMLInputElement).checked;
        __openHands = true //(document.getElementById("chkOpenHands") as HTMLInputElement).checked;
        __defendAlone = (document.getElementById("chkDefendAlone") as HTMLInputElement).checked;
        __noTrump = (document.getElementById("chkNoTrump") as HTMLInputElement).checked;
        __showTrickHistory = (document.getElementById("chkShowHistory") as HTMLInputElement).checked;

        //ai settings
        __statMode = true //(document.getElementById("chkStatMode") as HTMLInputElement).checked; //4 AIs play against each other
        __aiPlayers = [new DecentAI(), new IdiotAI(), new DecentAI(), new IdiotAI()];
        __hasHooman = __aiPlayers.indexOf(null) > -1;
    }

    //just sets scores to 0
    function initGame() {
        __nsScore = 0;
        __ewScore = 0;
        __gameStage = GameStage.NewHand;
    }

    //resets variables, gets dealer, shuffles deck, inits empty hands, sets currentplayer to left of dealer
    function initHand() {
        __playersBid = 0;
        __trumpCandidateCard = null;
        __trumpSuit = null;
        __maker = null;
        __alonePlayer = null;
        __numPlayers = 0;
        __nsTricksWon = 0;
        __ewTricksWon = 0;
        __trickNum = 0;

        __dealer = getDealer();
        animPlaceDealerButt()

        __deck = getShuffledDeck();
        __hands = new Array(4);
        for (i = 0; i < 4; i++) {
            __hands[i] = new Array(5);
        }

        __currentPlayer = nextPlayer(__dealer);

        dealHands(__deck, __hands, __dealer);
        __trumpCandidateCard = __deck.pop();
        animDeal(__hands);

        //let AIs initialize
        for (i = 0; i < 4; i++) {
            __currentPlayer = i;
            if (__aiPlayers[i] !== null) {
                __aiPlayers[i].init();
            }
        }

        __currentPlayer = nextPlayer(__dealer);
        __gameStage = GameStage.BidRound1;
    }

    //called at the beginning of each trick
    function initTrick() {
        __trickPlayersPlayed = 0;
        __trickSuitLead = null;
        __trickPlayedCards = [];
    }
    //#endregion

    //get a bid
    function handleBid() {
        var suit;
        var alone;
        var discard;
        var aiPlayer = __aiPlayers[__currentPlayer];

        //see if AI bids
        suit = getAIBid(aiPlayer, __gameStage);
        if (suit !== null) {
            alone = aiPlayer.chooseGoAlone();
            endBidding(suit, alone);
            return;
        }
        animShowText(__currentPlayer + " passed.", 1);
        advanceBidding();
    }

    function advanceBidding() {
        __playersBid++;
        __currentPlayer = nextPlayer(__currentPlayer);

        //everyone bid, round is over
        if (__playersBid >= 4) {
            if (__gameStage === GameStage.BidRound1) {
                __playersBid = 0;
                __gameStage = GameStage.BidRound2;
            }
            else {
                __gameStage = GameStage.NewHand;
            }
        }
    }

    function endBidding(suit: Suit, alone: boolean) {
        animShowText(__currentPlayer + " " + Suit[suit] + " " + alone, 1);
        setTrump(suit, __currentPlayer, alone);
        //if round 1, dealer also needs to discard
        if (__gameStage === GameStage.BidRound1) {
            __gameStage = GameStage.Discard;
        }
        else {
            startTricks();
        }
    }

    //sets trumpSuit, left/right nonsense, maker, and alone player
    function setTrump(suit, player, alone) {
        var rightID;
        var leftID;

        __trumpSuit = suit;

        //This chunk is for changing the rank and suit of the right and left bowers
        //for the duration of the hand.
        //Note: The cards' IDs stay the same
        rightID = Suit[__trumpSuit] + Rank.Jack;
        DECKDICT[rightID].rank = Rank.Right;
        leftID = Suit[getOppositeSuit(__trumpSuit)] + Rank.Jack;
        DECKDICT[leftID].suit = __trumpSuit;
        DECKDICT[leftID].rank = Rank.Left;

        __maker = player;
        if (alone) {
            __alonePlayer = player;
        }
    }

    function discardCard(toDiscard) {
        animShowText(Player[__currentPlayer] + " discarded " + toDiscard.id, 1);
        removeFromHand(__dealer, toDiscard);
        __hands[__dealer].push(__trumpCandidateCard);

        startTricks();
    }

    function startTricks() {
        __gameStage = GameStage.PlayTricks;
        initTrick();
    }

    function playTrickStep(): void {
        var card: Card;
        var hand: Card[] = __hands[__currentPlayer];

        card = __aiPlayers[__currentPlayer].pickCard();

        if (!isValidPlay(hand, card, __trickSuitLead)) {
            card = getFirstLegalCard(hand);
        }
        playCard(__currentPlayer, card);

        advanceTrick();
    }

    function advanceTrick() {
        __trickPlayersPlayed++;
        __currentPlayer = nextPlayer(__currentPlayer);

        //everyone played, end trick
        if (__trickPlayersPlayed >= 4) {
            endTrick();
        }
    }

    function endTrick() {
        for (i = 0; i < 4; i++) {
            if (__aiPlayers[i] !== null) {
                __aiPlayers[i].trickEnd();
            }
        }
        let trickWinner = getBestCardPlayed(__trickPlayedCards, __trumpSuit).player;
        scoreTrick(trickWinner);
        if (__trickNum >= 4) {
            endHand();
        }
        else {
            initTrick();
            __currentPlayer = trickWinner;
            __trickNum++;
        }
    }

    function playCard(player, card) {
        removeFromHand(player, card);
        __trickPlayedCards.push({ player: player, card: card });
        animShowText(Player[player] + " played " + card.id, 1);
        //play card, store played card, iterate num players played
        //check if hand ended, then check if game ended
    }
    function scoreTrick(trickWinner) {
        if (trickWinner === Player.North || trickWinner === Player.South) {
            __nsTricksWon++;
            animShowText("NS won this trick", 2);
        }
        else {
            __ewTricksWon++;
            animShowText("EW won this trick", 2);
        }
    }

    function endHand() {
        resetJacks();
        updateScore();
        if (__nsScore >= 10 || __ewScore >= 10) {
            endGame();
        }
        else {
            __gameStage = GameStage.NewHand;
        }
    }

    function resetJacks() {
        var rightID;
        var leftID;

        rightID = Suit[__trumpSuit] + Rank.Jack;
        DECKDICT[rightID].rank = Rank.Jack;
        leftID = Suit[getOppositeSuit(__trumpSuit)] + Rank.Jack;
        DECKDICT[leftID].suit = getOppositeSuit(__trumpSuit);
        DECKDICT[leftID].rank = Rank.Jack;
    }

    function updateScore() {
        var isMaker;
        var alone = (__alonePlayer !== null);

        if (__nsTricksWon > __ewTricksWon) {
            isMaker = (__maker === Player.North || __maker === Player.South);
            __nsScore += calculatePointGain(__nsTricksWon, isMaker, alone);
        }

        else {
            isMaker = (__maker === Player.East || __maker === Player.West);
            __ewScore += calculatePointGain(__ewTricksWon, isMaker, alone);
        }

        animShowText("Score: " + __nsScore + " : " + __ewScore);
    }

    function endGame() {
        animShowText("Final score: " + __nsScore + " : " + __ewScore);
        __gameStage = null;
    }

    function addToHand(player, card) {
        __hands[player].push(card);
    }

    //finds index of given ID inefficiently
    //splice removes 1 at a given index
    //fails silently if card isn't found, which should never happen
    function removeFromHand(player, card) {
        var cardID = card.id;

        for (var i = 0; i < __hands[player].length; i++) {
            if (__hands[player][i].id === cardID) {
                __hands[player].splice(i, 1);
            }
        }
    }


    /*******************************
 	* Public functions
 	********************************/

    this.start = function () {
        startNewGame();
    }
}
