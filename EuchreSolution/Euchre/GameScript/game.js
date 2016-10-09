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
    var __rightID; //ID of right bower (not affected by change in rank)
    var __leftID; //ID of left bower (not affected by change in rank)
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
    this.getRightID = function(){
        return __rightID;
    }
    this.getLeftID = function(){
        return __leftID;
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
        __aiPlayers = [new DecentAI(), new DecentAI(), new DecentAI(), new DecentAI()];
        __hasHooman = __aiPlayers.indexOf(null) > -1;
    }

    function initGame() {
        __nsScore = 0;
        __ewScore = 0;
    }

    function initHand() {
        __gameStage = gameStages.BID1;
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
        __deck = getShuffledDeck();
        __hands = new Array(4);
        for (i = 0; i < 4; i++) {
            __hands[i] = new Array(5);
        }

        __currentPlayer = nextPlayer(__dealer);
    }

    function initTrick() {
        __trickNum = 0;
        __trickPlayersPlayed = 0;
        __trickSuit = null;
        __trickPlayedCards = [null, null, null, null];
        __currentPlayer = players.NONE; //TODO: init current player for realz?
    }
    //#endregion

    function playGame(init) {
        if (init) {
            grabSettings();
            initGame();
        }
        while(__nsScore < 10 && __ewScore < 10){
            playHand(true);
        }
        endGame();
    }

    function playHand(init) {
        var bidSuccessful;

        if (init) {
            initHand();

            dealHands(__deck, __hands, __dealer);
            __trumpCandidateCard = __deck.pop();
            animDeal(__hands);

            for (i = 0; i < 4; i++) {
                __currentPlayer = i; //AIs need to know who they are so they can get their hands
                if (__aiPlayers[i] !== null) {
                    __aiPlayers[i].init();
                }
            }
        }
        
        if (__gameStage !== gameStages.TRICKS) {
            doBidding();
        }
        
        if (bidSuccessful) {
            while (__trickNum < 5) {
                playTrick();
                __trickNum--;
            }
        }
    }

    //get a bid
    function getBid(round) {
        var bidSuccessful;

        //do round 1 stuff
        bidSuccessful = getAIBid(__currentPlayer);

        if (bidSuccessful) {
            setMakers(__currentPlayer);
            if (getGoAlone(__currentPlayer)) {
                setGoAlone();
            }
        }
    }

    function setMakers(player) {

    }

    function setGoAlone(player) {

    }

    function playTrick() {

    }

    function endGame() {

    }

    /*******************************
 	* Public functions
 	********************************/

    this.start = function(){
        playGame();
    }
}