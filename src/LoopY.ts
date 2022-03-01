namespace df {
	/**
	 * Y方向上图片的循环移动，适合背景，拉霸等
	 * @example
	 *	let loopY = new df.LoopY();
	 *	loopY.init([bg1, bg2], 1000);
	 *	loop() {
	 *		loopY.step(10);
	 *	}
	 */
	export class LoopY {
		public constructor() {
		}

		private _arr: Array<any>;
		private _limitY: number;
		/**
		 * 整个背景或拉霸的总高
		 */
		private _totalH: number;
		/**
		 * 
		 * @param arr 要循环移动的对象，请依次排列好
		 * @param limitY 若对象y值大于此值，就移动到头部
		 */
		public init(arr: Array<any>, limitY: number) {
			this._arr = arr;
			this._limitY = limitY;

			this._totalH = 0;
			for (let i = 0; i < this._arr.length; i++) {
				let item = this._arr[i];
				this._totalH += item.height;
			}
		}
		/**
		 * 将移动到头部的
		 */
		private _heads = [];
		/**
		 * 将移动到尾部的
		 */
		private _tails = [];
		/**
		 * 每次步长
		 * @param v 
		 */
		public step(v: number) {
			let realY = v % this._totalH;
			for (let i = 0; i < this._arr.length; i++) {
				let item = this._arr[i];
				item.y += realY;
			}
			if (realY > 0) { //尾部的移到头
				this._heads.length = 0;
				for (let i = 0; i < this._arr.length; i++) {
					let item = this._arr[i];
					if (item.y > this._limitY) { //移到头部
						this._heads.push(item);
					}
				}
				let head = this._arr[0];
				let headY = head.y;
				for (let i = this._heads.length - 1; i > -1; i--) {
					let item = this._heads[i];
					item.y = headY - item.height;
					headY = item.y;
				}
				ArrayUtil.cull(this._arr, this._heads);
				this._arr = this._heads.concat(this._arr);
			}
			else { //头部的移到尾
				this._tails.length = 0;
				for (let i = 0; i < this._arr.length; i++) {
					let item = this._arr[i];
					if (item.y + item.height < 0) { //移到尾部
						this._tails.push(item);
					}
				}
				let tail = this._arr[this._arr.length - 1];
				let tailY = tail.y + tail.height;
				for (let i = 0; i < this._tails.length; i++) {
					let item = this._tails[i];
					item.y = tailY;
					tailY += (item.y + item.height);
				}
				ArrayUtil.cull(this._arr, this._tails);
				this._arr = this._arr.concat(this._tails);
			}
		}
	}
}