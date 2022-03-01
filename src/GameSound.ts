namespace df {
    /**
     * 动态加载声音播放
     * @example
     *	df.GameSound.instance.bgmOpen = true; //先打开开关  
     *	df.GameSound.instance.playBgm(url);
     *	df.GameSound.instance.audioOpen = true; //先打开开关  
     *	df.GameSound.instance.playAudio(url);
     */
    export class GameSound {
        private constructor() {
        }
        private static _instance: GameSound;
        public static get instance() {
            if (!this._instance) {
                this._instance = new GameSound();
            }

            return this._instance;
        }

        /**
         * audio开关,默认关闭，须先打开才能播放；
         */
        public audioOpen: boolean;
        private _audioCache = {};

        /**
         * 播放音效
         * @param url 
         * @param volume 
         */
        public playAudio(url, volume = 1) {
            let soundData = this._audioCache[url];
            if (soundData) {
                if (this.audioOpen) {
                    soundData.sound.play(0, 1).volume = volume;
                }
            }
            else {
                this.loadAudio(url, volume);
            }
        }

        private loadAudio(url, volume = 1) {
            let sound: egret.Sound = new egret.Sound();
            sound.type = egret.Sound.EFFECT;
            sound.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
                if (this.audioOpen) {
                    sound.play(0, 1).volume = volume;
                }
                this._audioCache[url] = { sound };
            }, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
                console.log(`${url} load error!`);
            }, this);
            sound.load(url);
        }

        /**
         * bgm开关,默认关闭，须先打开才能播放；
         */
        public bgmOpen: boolean;
        private _bgmCache = {};
        private _curBgm: egret.SoundChannel;
        private _curBgmData;

        /**
         * 播放bgm
         * @param url 
         * @param volume 
         */
        public playBgm(url, volume = 1) {
            let soundData = this._bgmCache[url];
            if (soundData) {
                if (this.bgmOpen) {
                    this._curBgm.stop();
                    this._curBgm = soundData.sound.play(0);
                    this._curBgm.volume = volume;
                    this._curBgmData = soundData;
                }
            }
            else {
                this.loadBgm(url, volume);
            }
        }

        private loadBgm(url, volume = 1) {
            let sound: egret.Sound = new egret.Sound();
            sound.type = egret.Sound.MUSIC;
            sound.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
                if (this.bgmOpen) {
                    this._curBgm = sound.play(0);
                    this._curBgm.volume = volume;
                    this._curBgmData = this._bgmCache[url];
                }
                this._bgmCache[url] = { sound };
            }, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
                console.log(`${url} load error!`);
            }, this);
            sound.load(url);
        }

        private _bgmPosition;

        /**
         * 暂停播放；若要设置bgm关闭,请将bgmOpen也设为false;
         */
        public pauseBgm() {
            if (this._curBgm) {
                this._bgmPosition = this._curBgm.position;
                this._curBgm.stop();
            }
        }

        public resumeBgm() {
            if (this.bgmOpen && this._curBgmData) {
                this._curBgm = this._curBgmData.sound.play(this._bgmPosition);
            }
        }

    }
}