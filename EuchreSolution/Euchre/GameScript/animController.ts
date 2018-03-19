enum AnimType {
	NoDelay,
	DealHands,
	PlayCard,
	Discard,
	WinTrick,
}

interface Animation {
	readonly delay: number;
	readonly delegate: () => void;
}

const delays = {
	[AnimType.NoDelay]: 0,
	[AnimType.DealHands]: 200,
	[AnimType.PlayCard]: 500,
	[AnimType.Discard]: 500,
	[AnimType.WinTrick]: 500,
};

class AnimController {
	private static queuedAnimations: Animation[] = [];
	private static running = false;
	private static doDelays = true;

	public static setDoDelays(doDelays: boolean): void {
		this.doDelays = doDelays;
	}

	public static queueAnimation(animType: AnimType, delegate: () => void): void {
		if (!this.doDelays) {
			delegate();
			return;
		}
		const animation: Animation = { delay: delays[animType], delegate };
		this.queuedAnimations.push(animation);
		this.executeNextAnimation();
	}

	private static executeNextAnimation(): void {
		if (this.queuedAnimations.length <= 0) {
			this.running = false;
			return;
		}
		if (this.running) {
			return;
		}

		this.running = true;

		const animation = this.queuedAnimations.shift() as Animation;
		const wrapper = () => {
			animation.delegate();
			this.running = false;
			this.executeNextAnimation();
		};
		setTimeout(wrapper, animation.delay);
	}
}
