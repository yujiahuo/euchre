// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//

//tslint:disable:no-bitwise

class XorGen {
	private w: number;
	private X: number[];
	private i: number;

	constructor(seed: Uint16Array) {
		let t: number;
		let v: number;
		let i: number;
		let j: number;
		let w: number = 0;
		const X: number[] = [];
		let limit = 128;
		v = 0;
		limit = Math.max(limit, seed.length);
		// Initialize circular array and weyl value.
		for (i = 0, j = -32; j < limit; ++j) {
			// Put the seed fragments into the array, and shuffle them.
			v ^= seed[j + 32];
			// After 32 shuffles, take v as the starting w value.
			if (j === 0) { w = v; }
			v ^= v << 10;
			v ^= v >>> 15;
			v ^= v << 4;
			v ^= v >>> 13;
			if (j >= 0) {
				w = w + 0x61c88647;           // Weyl.
				t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
				i = (0 === t) ? i + 1 : 0;     // Count zeroes.
			}
		}
		// We have detected all zeroes; make the key nonzero.
		if (i >= 128) {
			X[seed.length & 127] = -1;
		}
		// Run the generator 512 times to further mix the state before using it.
		// Factoring this as a function slows the main generator, so it is just
		// unrolled here.  The weyl generator is not advanced while warming up.
		i = 127;
		for (j = 4 * 128; j > 0; --j) {
			v = X[(i + 34) & 127];
			t = X[i = ((i + 1) & 127)];
			v ^= v << 13;
			t ^= t << 17;
			v ^= v >>> 15;
			t ^= t >>> 12;
			X[i] = v ^ t;
		}
		// Storing state as object members is faster than using closure variables.
		this.w = w;
		this.X = X;
		this.i = i;
	}

	public next(): number {
		let w = this.w;
		const X = this.X;
		let i = this.i;

		// Update Weyl generator.
		this.w = w = (w + 0x61c88647) | 0;
		// Update xor generator.
		let v = X[(i + 34) & 127];
		let t = X[i = ((i + 1) & 127)];
		v ^= v << 13;
		t ^= t << 17;
		v ^= v >>> 15;
		t ^= t >>> 12;
		// Update Xor generator array state.
		v = X[i] = v ^ t;
		this.i = i;
		// Result is the combination.
		return (v + (w ^ (w >>> 16))) | 0;
	}

	public nextInRange(minimum: number, maximum: number): number {
		const size = maximum - minimum + 1;
		let next = this.next() % size;
		if (next < 0) {
			next += size;
		}
		return next + minimum;
	}
}

let rng: XorGen;
{
	const seed = new Uint16Array(128);
	//tslint:disable-next-line:strict-boolean-expressions -- can't trust the TS types on older browsers
	if (!seed.join) {
		seed.join = Array.prototype.join;
	}
	//tslint:disable-next-line:strict-boolean-expressions -- can't trust the TS types on older browsers
	const cryptoObj = window.crypto || ((window as any).msCrypto as Crypto);

	let done = false;
	const pageParameters = window.location.search;
	if (pageParameters) {
		const url = new URL(window.location.href);
		const randomSeedString = url.searchParams.get("randomseed");
		if (randomSeedString) {
			randomSeedString.split(",").map((value, index) => seed[index] = parseInt(value, 10));
			done = true;
		}
	}
	if (!done) {
		//tslint:disable-next-line:strict-boolean-expressions -- can't trust the TS types on older browsers
		if (cryptoObj && cryptoObj.getRandomValues) {
			cryptoObj.getRandomValues(seed);
		} else {
			// Not as good, but we can't actually end up with enough randomness
			// unless we include something outside of just Math.random
			seed[0] = new Date().getTime() % (2 ** 16);
			for (let i = 1; i < seed.length; i++) {
				seed[i] = Math.floor(Math.random() * (2 ** 16));
			}
		}
	}
	//tslint:disable-next-line:no-console -- needed to debug issues
	console.log("Random seed: " + seed.join(","));
	rng = new XorGen(seed);
}
