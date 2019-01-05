/// <reference path="../@types/index.d.ts" />

export class Queue {
	pending: number = 0
	cb: Function

	constructor (cb: Function) {
		this.cb = cb;
	}

	add (...args: any[]) {
		if (this.pending == -1) return;
		this.pending += 1;

		var fun = args.pop();

		args.push(function (err) {
			if (this.pending == -1) return;
			if (err) {
				this.pending = -1;

				return this.cb(err);
			}
			if (--this.pending === 0) {
				return this.cb();
			}
		}.bind(this));

		fun.apply(null, args);

		return this;
	}

	check () {
		if (this.pending === 0) {
			return this.cb();
		}
	}
}
