/*****************************************************************************
 * Game object
 *****************************************************************************/

enum GameStage {
	Playing,
	Finished,
};

class Game {
	private __startTime: number;

	private __nsScore: number; //north south
	private __ewScore: number; //east west
	private __gameStage: GameStage;
	private __dealer: Player;
	private __settings: Settings;
	private __hand: Hand;
	private __aiPlayers: (EuchreAI | null)[];

	public getNsScore(): number {
		return this.__nsScore;
	}
	public getEwScore(): number {
		return this.__ewScore;
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
		this.__hand = new Hand(this.__dealer, this.__aiPlayers);
		this.__hand.doHand;
		if (this.__hand.isFinished()) {
			this.endHand();
			if (this.isFinished()) {
				this.endGame();
			} else {
				this.__dealer = getNextDealer(this.__dealer);
			}
		}
	}

	private endHand() {
		this.__nsScore += this.__hand.nsPointsWon();
		this.__ewScore += this.__hand.ewPointsWon();
	}

	private endGame() {
		this.__gameStage = GameStage.Finished;
	}

	/*******************************
	 * Public functions
	 ********************************/

	public start(): void {
		this.__startTime = performance.now();
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