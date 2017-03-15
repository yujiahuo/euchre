/*****************************************************************************
 * Game object
 *****************************************************************************/

enum GameStage {
	NewGame,
	OutsideGame,
};

class Game {
	//#region Private variables

	//multi-game
	private __numGamesToPlay: number;
	private __gameCounter: number;
	private __nsGamesWon: number;
	private __ewGamesWon: number;
	private __nsTotalScore: number;
	private __ewTotalScore: number;

	private __startTime: number;

	//game
	private __nsScore: number; //north south
	private __ewScore: number; //east west
	private __gameStage: GameStage;

	//hand
	//private __hand: Hand; //a hand of the game

	//settings
	private __sound: boolean;
	private __openHands: boolean;
	private __defendAlone: boolean;
	private __noTrump: boolean;
	private __showTrickHistory: boolean;
	private __statMode: boolean;
	private __messageLevel: MessageLevel;
	private __aiPlayers: (EuchreAI | null)[];
	private __hasHooman: boolean; //if there is a human player
	//#endregion

	public logText = "";

	//#region Get functions
	public getNsScore(): number {
		return this.__nsScore;
	}
	public getEwScore(): number {
		return this.__ewScore;
	}
	public isOpenHands(): boolean {
		return this.__openHands;
	}
	public isStatMode(): boolean {
		return this.__statMode;
	}
	public getMessageLevel(): MessageLevel {
		return this.__messageLevel;
	}
	public getAIPlayer(player: Player): EuchreAI | null {
		return (this.__aiPlayers[player]);
	}

	//#endregion

	/*******************************
	 * Private functions
	 ********************************/

	private startPlaying(): void {
		let playGame: boolean = true;

		this.grabSettings();
		this.initPlay();
		while (playGame) {
			this.doStep();
			if (this.__gameStage === GameStage.OutsideGame) {
				playGame = false;
			}
		}
		if (this.isStatMode()) {
			updateLog(this.logText, true);
		}
	}

	private initPlay(): void {
		this.__gameCounter = 1;
		this.__nsGamesWon = 0;
		this.__ewGamesWon = 0;
		this.__nsTotalScore = 0;
		this.__ewTotalScore = 0;
		this.__gameStage = GameStage.NewGame;
	}

	//TODO: implement these!
	/*private letHumanBid(stage: HandStage.BidRound1 | HandStage.BidRound2): void {
		if (stage == HandStage.BidRound1) {

		}
	}
	private letHumanClickCards(): void { }*/

	private doStep(): void {
		//let aiPlayer: EuchreAI | null;

		animShowText("STAGE: " + GameStage[this.__gameStage], MessageLevel.Step);
		switch (this.__gameStage) {
			case GameStage.NewGame:
				this.initGame();
				break;
			/*case GameStage.NewHand:
				this.initHand();
				break;
			case HandStage.BidRound1:
				aiPlayer = this.__aiPlayers[this.__currentPlayer];
				if (!aiPlayer) {
					this.letHumanBid(HandStage.BidRound1);
					return;
				}
				this.handleBid(aiPlayer);
				break;
			case HandStage.BidRound2:
				aiPlayer = this.__aiPlayers[this.__currentPlayer];
				if (!aiPlayer) {
					this.letHumanBid(HandStage.BidRound2);
					return;
				}
				this.handleBid(aiPlayer);
				break;
			case HandStage.Discard:
				this.__currentPlayer = this.__dealer;
				aiPlayer = this.__aiPlayers[this.__dealer];
				if (!aiPlayer) {
					this.letHumanClickCards();
					return;
				}
				this.discardCard(aiPlayer.pickDiscard());
				break;
			case HandStage.PlayTricks:
				if (this.__trick.isFinished()) {
					this.endTrick();
					return;
				}

				aiPlayer = this.__aiPlayers[this.__currentPlayer];
				if (!aiPlayer) {
					this.letHumanClickCards();
					return;
				}
				let card = Card.safeCard(aiPlayer.pickCard());
				card = this.__trick.playCard(card);
				this.removeFromHand(this.__currentPlayer, card as Card);
				this.__currentPlayer = nextPlayer(this.__currentPlayer);
				break;*/
			default:
				break;
		}
	}

	//#region Setup
	private grabSettings(): void {
		//checkbox settings
		this.__sound = (document.getElementById("chkSound") as HTMLInputElement).checked;
		this.__openHands = true //(document.getElementById("chkOpenHands") as HTMLInputElement).checked;
		this.__defendAlone = (document.getElementById("chkDefendAlone") as HTMLInputElement).checked;
		this.__noTrump = (document.getElementById("chkNoTrump") as HTMLInputElement).checked;
		this.__showTrickHistory = (document.getElementById("chkShowHistory") as HTMLInputElement).checked;

		//ai settings
		this.__statMode = true //(document.getElementById("chkStatMode") as HTMLInputElement).checked; //4 AIs play against each other
		if (this.__statMode) {
			this.__numGamesToPlay = 1;
			this.__gameCounter = 1;
			this.__messageLevel = MessageLevel.Step;
		}
		//else this.__messageLevel = (document.getElementById("chkStatMode") as HTMLInputElement).checked;
		this.__aiPlayers = [new DecentAI(), new IdiotAI(), new DecentAI(), new IdiotAI()];
		this.__hasHooman = this.__aiPlayers.indexOf(null) > -1;
	}

	//just sets scores to 0
	private initGame(): void {
		this.__nsScore = 0;
		this.__ewScore = 0;
		this.__gameStage = GameStage.NewGame;
	}
	//#endregion


	/*private endGame(): void {
		animShowText("Final score: " + this.__nsScore + " : " + this.__ewScore, MessageLevel.Game);
		if (this.__nsScore > this.__ewScore) this.__nsGamesWon++;
		else this.__ewGamesWon++;
		this.__nsTotalScore += this.__nsScore;
		this.__ewTotalScore += this.__ewScore;

		if (this.__numGamesToPlay > this.__gameCounter) {
			this.__gameCounter++;
			this.__gameStage = GameStage.NewGame;
		}
		else {
			this.__gameStage = GameStage.OutsideGame;
			animShowText("Games won: " + this.__nsGamesWon + " : " + this.__ewGamesWon, MessageLevel.Multigame);
			animShowText("Total score: " + this.__nsTotalScore + " : " + this.__ewTotalScore, MessageLevel.Multigame);
			animShowText("Total time: " + (performance.now() - this.__startTime).toFixed(2) + "ms", MessageLevel.Multigame);
		}
	}*/


	/*******************************
	 * Public functions
	 ********************************/

	public start(): void {
		this.__startTime = performance.now();
		this.startPlaying();
	}
}

//orphaned pieces of code
//if (this.__nsScore >= 10 || this.__ewScore >= 10) {
//	this.endGame();
//}
//else {
//	this.__gameStage = GameStage.NewHand;
//}

//this.setTrump(suit, this.__currentPlayer, alone);
////if round 1, dealer also needs to discard
//if (this.__gameStage === BidStage.Round1) {
//	this.addToHand(this.__dealer, this.__trumpCandidate as Card);
//	this.__gameStage = HandStage.Discard;
//}

//public doNextBid(): void {
//	if(this.isFinished()) return;

//	let suit;
//	let alone;
//	let aiPlayer = this.__aiPlayers[this.__currentPlayer];

//	//TODO: human stuff
//	if(!aiPlayer) return;

////see if AI bids
//suit = getAIBid(aiPlayer, this.__bidStage, this.__trumpCandidate);
//if (suit !== null && hasSuit(this.__playerHands[this.__currentPlayer], suit)) {
//	alone = aiPlayer.chooseGoAlone();
//	this.endBidSuccess(suit, alone);
//	return;
//}

//animShowText(this.__currentPlayer + " passed.", MessageLevel.Step, 1);
//this.advanceBidding();
//	}

//public playerHand(player: Player): Card[] {
//	let hand: Card[] = [];
//	let card;

//	for (let i = 0; i < this.__playerHands[player].length; i++) {
//		card = this.__playerHands[player][i];
//		hand[i] = new Card(card);
//	}
//	return hand;
//}

//let AIs initialize
//for (let i = 0; i < 4; i++) {
//	this.__currentPlayer = i;
//	let aiPlayer = this.__aiPlayers[i];
//	if (aiPlayer !== null) {
//		aiPlayer.init();
//	}
//}
