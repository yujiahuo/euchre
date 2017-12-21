/*****************************************************************************
 * Game object
 *****************************************************************************/

enum GameStage {
	Playing,
	Finished,
}

class Game {
	private __nsScore: number; //north south
	private __ewScore: number; //east west
	private __gameStage: GameStage;
	private __dealer: Player;
	private __settings: Settings;
	private __hand: Hand;
	private __aiPlayers: (EuchreAI | null)[];

	public nsScore(): number {
		return this.__nsScore;
	}
	public ewScore(): number {
		return this.__ewScore;
	}
	public gameStage(): number {
		return this.__gameStage;
	}

	/* constructor */
	constructor(settings: Settings) {
		this.__nsScore = 0;
		this.__ewScore = 0;
		this.__gameStage = GameStage.Playing;
		this.__settings = settings;
		this.__dealer = getNextDealer();
		this.__aiPlayers = this.__settings.aiPlayers;
	}

	/*******************************
	 * Private functions
	 ********************************/
	private advanceGame(): void {
		this.__hand = new Hand(this.__dealer, this.__aiPlayers, this.__settings);
		this.__hand.doHand();
		if (this.__hand.isFinished()) {
			this.handleEndHand();
			if (this.__nsScore >= 10 || this.__ewScore >= 10) {
				this.endGame();
			} else {
				this.__dealer = getNextDealer(this.__dealer);
			}
		}
	}

	private handleEndHand() {
		this.__nsScore += this.__hand.nsPointsWon();
		this.__ewScore += this.__hand.ewPointsWon();
	}

	private endGame() {
		this.__gameStage = GameStage.Finished;
		animShowText("Final score: " + this.__nsScore + " : " + this.__ewScore, MessageLevel.Game);
	}

	/*******************************
	 * Public functions
	 ********************************/

	//TODO: why does this just call doGame? Kind of pointless?
	public start(): void {
		this.doGame();
	}

	public doGame(): void {
		while (!this.isFinished()) {
			this.advanceGame();
		}
		return;
	}

	public isFinished(): boolean {
		return this.__gameStage === GameStage.Finished;
	}
}