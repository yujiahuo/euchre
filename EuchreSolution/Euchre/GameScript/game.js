/*****************************************************************************
 * Game object
 *****************************************************************************/

function Game(){
    //#region Private variables

    //game
    var __nsScore; //north south
    var __ewScore; //east west

    //hand
    var __deck; //contains the shuffled deck or what's left of it after dealing
    var __gameStage; //bidding round 1, bidding round 2, or trick playing
    var __playersBid; //number of players who have bid so far
    var __hands; //2d array of everyone's hands
    var __trumpCandidateCard; //turned up card
    var __trumpSuit;	//current trump suit
    var __dealer;
    var __maker; //player who called trump
    var __alonePlayer;
    var __numPlayers; //players playing this hand; this is usually 4 but can be 3 or 2 depending on loners
    var __nsTricksWon;
    var __ewTricksWon;

    //trick
    var __trickNum; //what trick we're on
    var __trickPlayersPlayed; //how many players have played this trick
    var __trickSuitLead; //the suit that was lead
    var __trickPlayedCards; //array of cards that have been played this trick so far
    var __currentPlayer;

    //settings
    var __sound;
    var __openHands;
    var __defendAlong;
    var __noTrump;
    var __showTrickHistory;
    var __statMode;
    var __aiPlayers = [null, null, null, null];
    var __hasHooman; //if there is a human player
    //#endregion

    //#region Get functions
    this.getGameStage = function(){
        return __gameStage;
    }
    this.getPlayersBid = function(){
        return __playersBid;
    }
    this.getNsScore = function(){
        return __nsScore;
    }
    this.getEwScore = function(){
        return __ewScore;
    }
    this.getTrumpCandidateCard = function(){
        var card;

        card = new Card(__trumpCandidateCard.suit, __trumpCandidateCard.rank, __trumpCandidateCard.id);
        return card;
    }
    this.getTrumpSuit = function(){
        return __trumpSuit;
    }
    this.getDealer = function(){
        return __dealer;
    }
    this.getMaker = function(){
        return __maker;
    }
    this.getAlonePlayer = function(){
        return __alonePlayer;
    }
    this.getNumPlayers = function(){
        return __numPlayers;
    }
    this.getTrickNum = function(){
        return __trickNum;
    }
    this.getTrickPlayersPlayed = function(){
        return __trickPlayersPlayed;
    }
    this.getTrickSuit = function(){
        return __trickSuit;
    }
    this.getTrickPlayedCards = function(){
        var playedCards = [];
        var card;

        for(var i=0; i<__trickPlayedCards.length; i++){
            card = __trickPlayedCards[i];
            if(card === null){
                playedCards[i] = null;
            }
            else{
                playedCards[i] = new Card(card.suit, card.rank, card.id);
            }
        }
        return playedCards;
    }
    this.getCurrentPlayer = function(){
        return __currentPlayer;
    }
    this.getNsTricksWon = function(){
        return __nsTricksWon;
    }
    this.getEwTricksWon = function(){
        return __ewTricksWon;
    }
    this.isOpenHands = function(){
        return __openHands;
    }
    this.isStatMode = function(){
        return __statMode;
    }
    this.getAIPlayer = function(player){
        return (__aiPlayers[player]);
    }
    this.isAiPlayer = function (player) {
        return (__aiPlayers[player] !== null);
    }
    this.myHand = function(){
        var hand = [];
        var card;

        for(var i=0; i<__hands[__currentPlayer].length; i++){
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
        grabSettings();
        initGame();
        doStep();
    }

    function doStep() {
        switch (__gameStage) {
            case gameStages.NEWHAND:
                initHand();
                break;
            case gameStages.BID1:
                if (!isAiPlayer(__currentPlayer)){
                    letHumanBid(1);
                    return;
                }
                getBid();
                break;
            case gameStages.BID2:
                if (!isAiPlayer(__currentPlayer)){
                    letHumanBid(2);
                    return;
                }
                getBid();
                break;
            case gameStages.HDISCARD:
                letHumanAct();
                return;
            case gameStages.NEWTRICK:
                initTrick();
                break;
            case gameStages.PLAYTRICK:
                if (!isAiPlayer(__currentPlayer)){
                    letHumanClickCards();
                    return;
                }
                playTrickStep();
                break;
        }

        doStep();
    }

    //#region Setup
    function grabSettings(){
        //checkbox settings
        __sound = document.getElementById("chkSound").checked;
        __openHands = document.getElementById("chkOpenHands").checked;
        __defendAlong = document.getElementById("chkDefendAlone").checked;
        __noTrump = document.getElementById("chkNoTrump").checked;
        __showTrickHistory = document.getElementById("chkShowHistory").checked;

        //ai settings
        __statMode = document.getElementById("chkStatMode").checked;; //4 AIs play against each other
        __aiPlayers = [null, new DecentAI(), new DecentAI(), new DecentAI()];
        __hasHooman = __aiPlayers.indexOf(null) > -1;
    }

    //just sets scores to 0
    function initGame() {
        __nsScore = 0;
        __ewScore = 0;
        __gameStage = gameStages.NEWHAND;
    }

    //resets variables, gets dealer, shuffles deck, inits empty hands, sets currentplayer to left of dealer
    function initHand() {
        __playersBid = 0;
        __trumpCandidateCard = null;
        __trumpSuit = null;
        __rightID = null;
        __leftID = null;
        __maker = players.NONE;
        __alonePlayer = players.NONE;
        __numPlayers = 0;
        __nsTricksWon = 0;
        __ewTricksWon = 0;

        __dealer = getDealer(players.NONE);
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
        __gameStage = gameStages.BID1;
    }

    //resets variables, sets currentplayer to left of dealer
    function initTrick() {
        __trickNum = 0;
        __trickPlayersPlayed = 0;
        __trickSuit = null;
        __trickPlayedCards = [null, null, null, null];
        __currentPlayer = nextPlayer(__dealer);
        __gameStage = gameStages.PLAYTRICKS;
    }
    //#endregion

    //get a bid
    function getBid() {
        var suit;
        var alone;
        var discard;

        //do round 1 stuff
        suit = getAIBid(__currentPlayer);

        if (suit) {
            if (getGoAlone(__currentPlayer)) {
                alone = true;
            }
            setTrump(__trumpSuit, __currentPlayer, alone);
            if (__gameStage === gameStages.BID1) {
                if (!isAiPlayer(__dealer)){
                    __gameStage = gameStages.HDISCARD;
                }
                else{
                    discard = getAIDiscard(__dealer);
                    discardCard(discard);
                    __gameStage = gameStages.NEWTRICK;
                }
            }
        }

        __playersBid++;

        if (__playersBid === 4) {
            if (__gameStage === gameStages.BID1) {
                __gameStage = gameStages.BID2;
            }
            else {
                __gameStage = gameStages.NEWHAND;
            }
        }
        else {
            __currentPlayer = nextPlayer(__currentPlayer);
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
        rightID = __trumpSuit + ranks.JACK;
        DECKDICT[rightID].rank = ranks.RIGHT;
        leftID = suits.props[__trumpSuit].opposite + ranks.JACK;
        DECKDICT[leftID].suit = __trumpSuit;
        DECKDICT[leftID].rank = ranks.LEFT;

        __maker = player;
        if (alone) {
            __alonePlayer = player;
        }
    }

    function getDiscard(){
        if(!isAiPlayer(__dealer)){
            letHumanClickCards();
        }
    }

    function discardCard(toDiscard) {
        removeFromHand(__dealer, toDiscard);
        __hands[__dealer].push(__trumpCandidate);
    }


    function playTrickStep() {
        var card;

        card = __aiPlayers[__currentPlayer].pickCard();

        if(!isValidPlay(card)){
            //TODO: play shit
            return;
        }

        playCard(__currentPlayer, card);
    }

    function playCard(player, card) {
        //play card, store played card, iterate num players played
        //check if hand ended, then check if game ended
    }

    function endGame() {

    }

    function addToHand(player, card){
        __hands[player].push(card);
    }

    //finds index of given ID inefficiently
    //splice removes 1 at a given index
    //fails silently if card isn't found, which should never happen
    function removeFromHand(player, card){
        var cardID = card.id;

        for(var i=0; i<__hands[player].length; i++){
            if(__hands[player][i].id === cardID){
                __hands[player].splice(i, 1);
            }
        }
    }


    /*******************************
 	* Public functions
 	********************************/

    this.start = function(){
        startNewGame();
    }
}