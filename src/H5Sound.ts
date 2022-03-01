namespace df {
	/**
	 * H5 new Audio()方式播放声音，动态加载
	 * @example
	 *	df.H5Sound.instance.bgmOpen = true; //先打开开关  
	 *	df.H5Sound.instance.playBgm(url);
	 *	df.H5Sound.instance.audioOpen = true; //先打开开关  
	 *	df.H5Sound.instance.playAudio(url);
	 */
	export class H5Sound {
		private constructor() {
		}
		private static _instance: H5Sound;
		public static get instance() {
			if (!this._instance) {
				this._instance = new H5Sound();
			}

			return this._instance;
		}

		/**
		 * bgm开关,默认关闭，须先打开才能播放；
		 */
		public bgmOpen: boolean;
		private _bgm: HTMLAudioElement;

		/**
		 * 播放bgm
		 * @param url 
		 * @param volume 
		 * @returns 
		 */
		public playBgm(url, volume = 1) {
			if (!this._bgm) {
				this._bgm = new Audio();
				this._bgm.loop = true;
				this._bgm.setAttribute("webkit-playsinline", "true");
				this._bgm.setAttribute("playsinline", "true");
			}

			this._bgm.src = url;
			this._bgm.volume = volume;

			if (!this.bgmOpen) {
				return;
			}

			this._bgm.play();
		}

		/**
		 * 暂停播放；若要设置bgm关闭,请将bgmOpen也设为false;
		 */
		public pauseBgm() {
			if (this._bgm) {
				this._bgm.pause();
			}
		}

		public resumeBgm() {
			if (this._bgm && this.bgmOpen) {
				this._bgm.play();
			}
		}

		/**
		 * audio开关,默认关闭，须先打开才能播放；
		 */
		public audioOpen: boolean;

		/**
		 * 播放音效
		 * @param url 
		 * @param volume 
		 */
		public playAudio(url, volume = 1) {
			let audio = new Audio();
			audio.src = url;
			audio.volume = volume;
			audio.setAttribute("webkit-playsinline", "true");
			audio.setAttribute("playsinline", "true");

			if (this.audioOpen) {
				audio.play();
			}
		}

	}
}