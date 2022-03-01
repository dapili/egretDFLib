var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * df命名空间
 */
var df;
(function (df) {
    /**
     * 测试基类
     */
    class TestComponent {
        constructor() {
            console.log("TestComponent create");
        }
    }
    df.TestComponent = TestComponent;
    __reflect(TestComponent.prototype, "df.TestComponent");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 泡泡龙相关算法
     *
     * demo见https://github.com/dapili/bubbleShooter
     */
    class BubbleAlgo {
        constructor() {
            this.startX = 50;
            this.startY = 50;
            this.gapX = 3;
            this.gapY = 2;
            this.row = 8;
            this.col = 10;
            this.bubbles = [];
            this._radius = 25;
            this._diameter = this._radius * 2;
            this._addLineIndex = -1;
            this._unites = [];
            this._scans = [];
        }
        /**
         * 初始泡泡摆放
         * @param startX 起点xy
         * @param startY
         * @param gapX 列间距
         * @param gapY 行间距
         * @param row 行
         * @param col 列
         */
        initConfig(startX, startY, gapX, gapY, row, col) {
            this.startX = startX;
            this.startY = startY;
            this.gapX = gapX;
            this.gapY = gapY;
            this.row = row;
            this.col = col;
        }
        /**
         * 初始泡泡
         * @param r 泡泡半径
         * @param type 共几种类型泡泡
         * @param Class 泡泡类，非实例，锚点在圆心
         * @returns 泡泡对象数组
         */
        initBubbles(r, type, Class) {
            this._radius = r;
            this._type = type;
            this._class = Class;
            this._addLineIndex = -1;
            this.bubbles.length = 0;
            let sx;
            this._startY = this._radius + this.startY;
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    if (i % 2 == 0) {
                        sx = this._radius + this.startX;
                    }
                    else {
                        sx = this._diameter + this.startX;
                    }
                    let bubble = this.createBubble();
                    bubble.row = i;
                    bubble.x = sx + j * (this._diameter + this.gapX);
                    bubble.y = this._startY + i * (this._diameter + this.gapY);
                    this.bubbles.push(bubble);
                }
            }
            return this.bubbles;
        }
        /**
         * 创建泡泡
         * @returns 泡泡对象
         */
        createBubble() {
            let bubble = new this._class();
            bubble.type = df.MathUtil.randomInt(0, this._type - 1);
            return bubble;
        }
        /**
         * 顶部新加一行
         * @returns 新加泡泡对象数组
         */
        addBubbleLine() {
            for (let i = 0; i < this.bubbles.length; i++) {
                this.bubbles[i].y += (this._diameter + this.gapY);
            }
            let line = [];
            let sx;
            for (let j = 0; j < this.col; j++) {
                if (this._addLineIndex % 2 == 0) {
                    sx = this._radius + this.startX;
                }
                else {
                    sx = this._diameter + this.startX;
                }
                let bubble = this.createBubble();
                bubble.row = this._addLineIndex;
                bubble.x = sx + j * (this._diameter + this.gapX);
                bubble.y = this._startY;
                this.bubbles.push(bubble);
                line.push(bubble);
            }
            this._addLineIndex--;
            return line;
        }
        /**
         * 连接泡泡并摆放到合适的位置
         * @param linked 被连接的泡泡，参照物
         * @param link 连接泡泡，最终会在参照物六方向中的一个位置
         */
        linkBubble(linked, link) {
            let gpx = this.gapX;
            let gpy = this.gapY;
            let r = this._radius;
            let d = this._diameter;
            let roundPoints = [
                { x: linked.x + d + gpx, y: linked.y, row: linked.row },
                { x: linked.x - (d + gpx), y: linked.y, row: linked.row },
                { x: linked.row % 2 == 0 ? linked.x - (r + gpx) : linked.x - r, y: linked.y - (d + gpy), row: linked.row - 1 },
                { x: linked.row % 2 == 0 ? linked.x - (r + gpx) : linked.x - r, y: linked.y + d + gpy, row: linked.row + 1 },
                { x: linked.row % 2 == 0 ? linked.x + r : linked.x + r + gpx, y: linked.y - (d + gpy), row: linked.row - 1 },
                { x: linked.row % 2 == 0 ? linked.x + r : linked.x + r + gpx, y: linked.y + d + gpy, row: linked.row + 1 } // 右下
            ];
            for (let i = 0; i < roundPoints.length; i++) {
                let p = roundPoints[i];
                let dis = df.MathUtil.dis(p, link);
                p.dis = dis;
            }
            df.ArrayUtil.sortAscBy("dis", roundPoints);
            link.x = roundPoints[0].x;
            link.y = roundPoints[0].y;
            link.row = roundPoints[0].row;
            this.bubbles.push(link);
        }
        /**
         * 掉落的泡泡
         * @returns 掉落泡泡数组
         */
        getFallBubbles() {
            let fallBubbles = [];
            for (let i = 0; i < this.bubbles.length; i++) {
                if (this.bubbles[i].visible) {
                    let unites = this.getUniteBubbles(this.bubbles[i], false);
                    let root = false;
                    for (let j = 0; j < unites.length; j++) {
                        if (unites[j].y == this._startY) {
                            root = true;
                            break;
                        }
                    }
                    if (!root) {
                        for (let j = 0; j < unites.length; j++) {
                            if (fallBubbles.indexOf(unites[j]) == -1) {
                                fallBubbles.push(unites[j]);
                            }
                        }
                    }
                }
            }
            return fallBubbles;
        }
        /**
         * 选择同色或不同色的一块泡泡
         * @returns 泡泡数组
         */
        getUniteBubbles(bubble, color) {
            this._unites.length = 0;
            this._scans.length = 0;
            this.scanUniteBubbles(bubble, color);
            return this._unites;
        }
        scanUniteBubbles(bubble, color) {
            if (bubble.visible && this._scans.indexOf(bubble) == -1) {
                this._scans.push(bubble);
                if (this._unites.indexOf(bubble) == -1) {
                    this._unites.push(bubble);
                    let roundBubbles = this.selectRoundBubbles(bubble);
                    for (let i = 0; i < roundBubbles.length; i++) {
                        if (color) {
                            if (roundBubbles[i].type == bubble.type) {
                                this.scanUniteBubbles(roundBubbles[i], true);
                            }
                        }
                        else {
                            this.scanUniteBubbles(roundBubbles[i], false);
                        }
                    }
                }
            }
        }
        selectRoundBubbles(bubble) {
            let gpx = this.gapX;
            let gpy = this.gapY;
            let r = this._radius;
            let d = this._diameter;
            let roundPoints = [
                { x: bubble.x + d + gpx, y: bubble.y },
                { x: bubble.x - (d + gpx), y: bubble.y },
                { x: bubble.row % 2 == 0 ? bubble.x - (r + gpx) : bubble.x - r, y: bubble.y - (d + gpy) },
                { x: bubble.row % 2 == 0 ? bubble.x - (r + gpx) : bubble.x - r, y: bubble.y + d + gpy },
                { x: bubble.row % 2 == 0 ? bubble.x + r : bubble.x + r + gpx, y: bubble.y - (d + gpy) },
                { x: bubble.row % 2 == 0 ? bubble.x + r : bubble.x + r + gpx, y: bubble.y + d + gpy } // 右下
            ];
            let roundBubbles = [];
            for (let i = 0; i < this.bubbles.length; i++) {
                let pop = this.bubbles[i];
                for (let j = 0; j < roundPoints.length; j++) {
                    let round = roundPoints[j];
                    if (pop.x == round.x && pop.y == round.y) {
                        roundBubbles.push(pop);
                    }
                }
            }
            return roundBubbles;
        }
    }
    df.BubbleAlgo = BubbleAlgo;
    __reflect(BubbleAlgo.prototype, "df.BubbleAlgo");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 下落包装器，下落呈正弦运动
     * @example
     *	let fw = new FallWraper();
     *	fw.init(entity, 2, 0.01);
     *	yourLoop {
     *		fw.move();
     *	}
     */
    class FallWrapper {
        constructor() {
            this._startAngel = Math.random() * 360;
        }
        /**
         *
         * @param entity 下落对象
         * @param vy
         * @param angelStep 用于正弦变化的角度值，推荐取较小的值如0.01；
         */
        init(entity, vy, angelStep) {
            this._entity = entity;
            this._vy = vy;
            this._angelStep = angelStep;
        }
        move() {
            this._entity.y += this._vy;
            this._startAngel += this._angelStep;
            this._entity.x += Math.sin(this._startAngel);
        }
        get x() {
            return this._entity.x;
        }
        set x(v) {
            this._entity.x = v;
        }
        set y(v) {
            this._entity.y = v;
        }
        get y() {
            return this._entity.y;
        }
        get width() {
            return this._entity.width;
        }
        get height() {
            return this._entity.height;
        }
        get visible() {
            return this._entity.visible;
        }
        set visible(v) {
            this._entity.visible = v;
        }
        /**
         * 下落对象
         */
        get entity() {
            return this._entity;
        }
    }
    df.FallWrapper = FallWrapper;
    __reflect(FallWrapper.prototype, "df.FallWrapper");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 动态加载声音播放
     * @example
     *	df.GameSound.instance.bgmOpen = true; //先打开开关
     *	df.GameSound.instance.playBgm(url);
     *	df.GameSound.instance.audioOpen = true; //先打开开关
     *	df.GameSound.instance.playAudio(url);
     */
    class GameSound {
        constructor() {
            this._audioCache = {};
            this._bgmCache = {};
        }
        static get instance() {
            if (!this._instance) {
                this._instance = new GameSound();
            }
            return this._instance;
        }
        /**
         * 播放音效
         * @param url
         * @param volume
         */
        playAudio(url, volume = 1) {
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
        loadAudio(url, volume = 1) {
            let sound = new egret.Sound();
            sound.type = egret.Sound.EFFECT;
            sound.addEventListener(egret.Event.COMPLETE, (event) => {
                if (this.audioOpen) {
                    sound.play(0, 1).volume = volume;
                }
                this._audioCache[url] = { sound };
            }, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event) => {
                console.log(`${url} load error!`);
            }, this);
            sound.load(url);
        }
        /**
         * 播放bgm
         * @param url
         * @param volume
         */
        playBgm(url, volume = 1) {
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
        loadBgm(url, volume = 1) {
            let sound = new egret.Sound();
            sound.type = egret.Sound.MUSIC;
            sound.addEventListener(egret.Event.COMPLETE, (event) => {
                if (this.bgmOpen) {
                    this._curBgm = sound.play(0);
                    this._curBgm.volume = volume;
                    this._curBgmData = this._bgmCache[url];
                }
                this._bgmCache[url] = { sound };
            }, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event) => {
                console.log(`${url} load error!`);
            }, this);
            sound.load(url);
        }
        /**
         * 暂停播放；若要设置bgm关闭,请将bgmOpen也设为false;
         */
        pauseBgm() {
            if (this._curBgm) {
                this._bgmPosition = this._curBgm.position;
                this._curBgm.stop();
            }
        }
        resumeBgm() {
            if (this.bgmOpen && this._curBgmData) {
                this._curBgm = this._curBgmData.sound.play(this._bgmPosition);
            }
        }
    }
    df.GameSound = GameSound;
    __reflect(GameSound.prototype, "df.GameSound");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * H5 new Audio()方式播放声音，动态加载
     * @example
     *	df.H5Sound.instance.bgmOpen = true; //先打开开关
     *	df.H5Sound.instance.playBgm(url);
     *	df.H5Sound.instance.audioOpen = true; //先打开开关
     *	df.H5Sound.instance.playAudio(url);
     */
    class H5Sound {
        constructor() {
        }
        static get instance() {
            if (!this._instance) {
                this._instance = new H5Sound();
            }
            return this._instance;
        }
        /**
         * 播放bgm
         * @param url
         * @param volume
         * @returns
         */
        playBgm(url, volume = 1) {
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
        pauseBgm() {
            if (this._bgm) {
                this._bgm.pause();
            }
        }
        resumeBgm() {
            if (this._bgm && this.bgmOpen) {
                this._bgm.play();
            }
        }
        /**
         * 播放音效
         * @param url
         * @param volume
         */
        playAudio(url, volume = 1) {
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
    df.H5Sound = H5Sound;
    __reflect(H5Sound.prototype, "df.H5Sound");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * Y方向上图片的循环移动，适合背景，拉霸等
     * @example
     *	let loopY = new df.LoopY();
     *	loopY.init([bg1, bg2], 1000);
     *	loop() {
     *		loopY.step(10);
     *	}
     */
    class LoopY {
        constructor() {
            /**
             * 将移动到头部的
             */
            this._heads = [];
            /**
             * 将移动到尾部的
             */
            this._tails = [];
        }
        /**
         *
         * @param arr 要循环移动的对象，请依次排列好
         * @param limitY 若对象y值大于此值，就移动到头部
         */
        init(arr, limitY) {
            this._arr = arr;
            this._limitY = limitY;
            this._totalH = 0;
            for (let i = 0; i < this._arr.length; i++) {
                let item = this._arr[i];
                this._totalH += item.height;
            }
        }
        /**
         * 每次步长
         * @param v
         */
        step(v) {
            let realY = v % this._totalH;
            for (let i = 0; i < this._arr.length; i++) {
                let item = this._arr[i];
                item.y += realY;
            }
            if (realY > 0) {
                this._heads.length = 0;
                for (let i = 0; i < this._arr.length; i++) {
                    let item = this._arr[i];
                    if (item.y > this._limitY) {
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
                df.ArrayUtil.cull(this._arr, this._heads);
                this._arr = this._heads.concat(this._arr);
            }
            else {
                this._tails.length = 0;
                for (let i = 0; i < this._arr.length; i++) {
                    let item = this._arr[i];
                    if (item.y + item.height < 0) {
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
                df.ArrayUtil.cull(this._arr, this._tails);
                this._arr = this._arr.concat(this._tails);
            }
        }
    }
    df.LoopY = LoopY;
    __reflect(LoopY.prototype, "df.LoopY");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 对象池工具. 单例工具类
     */
    class Pool {
        constructor() {
            this._pool = {};
        }
        static get instance() {
            if (!this._instance) {
                this._instance = new Pool();
            }
            return this._instance;
        }
        /**
         * 拿取对象
         * @param cls 传入类名
         * @returns 对象
         */
        getFrom(cls) {
            if (this._pool[cls.prototype["__class__"]]) {
                return this._pool[cls.prototype["__class__"]].pop();
            }
            else {
                return new cls();
            }
        }
        /**
         * 归还对象
         * @param instance 实例对象，非类名
         */
        backTo(instance) {
            if (!this._pool[instance.__proto__["__class__"]]) {
                this._pool[instance.__proto__["__class__"]] = [];
            }
            this._pool[instance.__proto__["__class__"]].push(instance);
        }
        /**
         * 清空整个对象池
         */
        clear() {
            this._pool = {};
        }
        /**
         * 测试，对象池打印
         */
        debug() {
            console.log(this._pool);
        }
    }
    df.Pool = Pool;
    __reflect(Pool.prototype, "df.Pool");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 四叉树
     *
     * 实现完全参照https://github.com/timohausmann/quadtree-js
     *
     * 由于原版在动态的情况下会不停的生成Quadtree对象，故封装了对象池优化，这部分对用户不可见，仅见属性root注释
     *
     */
    class Quadtree {
        constructor() {
            this._objects = [];
            this._nodes = [];
            /**
             * @重要**标示是否为最上层的根节点，若是则不会被对象池回收，请勿更改**
             */
            this.root = true;
        }
        /**
         * 初始化四叉树
         * @param bounds 此四叉树边界
         * @param max_objects (可选)此树能容纳的最大数目，超过时此树进一步分成4子树(默认：10)
         * @param max_levels (可选)最大划分深度(默认：4)
         * @param level (可选)当前深度(默认：0)
         */
        init(bounds, max_objects, max_levels, level) {
            this._max_objects = max_objects || 10;
            this._max_levels = max_levels || 4;
            this._level = level || 0;
            this._bounds = bounds;
            this._objects.length = 0;
            this._nodes.length = 0;
        }
        ;
        /**
         * 分裂成四子树
         */
        split() {
            var nextLevel = this._level + 1, subWidth = this._bounds.width / 2, subHeight = this._bounds.height / 2, x = this._bounds.x, y = this._bounds.y;
            //右上区，第一象限
            this._nodes[0] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[0].root = false;
            this._nodes[0].init({
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);
            //左上区，第二象限
            this._nodes[1] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[1].root = false;
            this._nodes[1].init({
                x: x,
                y: y,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);
            //左下区，第三象限
            this._nodes[2] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[2].root = false;
            this._nodes[2].init({
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);
            //右下区，第四象限
            this._nodes[3] = df.Pool.instance.getFrom(Quadtree);
            this._nodes[3].root = false;
            this._nodes[3].init({
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this._max_objects, this._max_levels, nextLevel);
        }
        ;
        /**
         * 获得此对象属于那几个象限
         * @param pRect
         * @returns
         */
        getIndex(pRect) {
            var indexes = [], verticalMidpoint = this._bounds.x + (this._bounds.width / 2), horizontalMidpoint = this._bounds.y + (this._bounds.height / 2);
            var startIsNorth = pRect.y < horizontalMidpoint, startIsWest = pRect.x < verticalMidpoint, endIsEast = pRect.x + pRect.width > verticalMidpoint, endIsSouth = pRect.y + pRect.height > horizontalMidpoint;
            //top-right quad
            if (startIsNorth && endIsEast) {
                indexes.push(0);
            }
            //top-left quad
            if (startIsWest && startIsNorth) {
                indexes.push(1);
            }
            //bottom-left quad
            if (startIsWest && endIsSouth) {
                indexes.push(2);
            }
            //bottom-right quad
            if (endIsEast && endIsSouth) {
                indexes.push(3);
            }
            return indexes;
        }
        ;
        /**
         * 插入对象
         * @param pRect
         * @returns
         */
        insert(pRect) {
            var i = 0, indexes;
            //if we have subnodes, call insert on matching subnodes
            if (this._nodes.length) {
                indexes = this.getIndex(pRect);
                for (i = 0; i < indexes.length; i++) {
                    this._nodes[indexes[i]].insert(pRect);
                }
                return;
            }
            //otherwise, store object here
            this._objects.push(pRect);
            //max_objects reached
            if (this._objects.length > this._max_objects && this._level < this._max_levels) {
                //split if we don't already have subnodes
                if (!this._nodes.length) {
                    this.split();
                }
                //add all objects to their corresponding subnode
                for (i = 0; i < this._objects.length; i++) {
                    indexes = this.getIndex(this._objects[i]);
                    for (var k = 0; k < indexes.length; k++) {
                        this._nodes[indexes[k]].insert(this._objects[i]);
                    }
                }
                //clean up this node
                this._objects = [];
            }
        }
        ;
        /**
         * 取回有哪些相邻的对象
         * @param pRect
         * @returns
         */
        retrieve(pRect) {
            var indexes = this.getIndex(pRect), returnObjects = this._objects;
            //if we have subnodes, retrieve their objects
            if (this._nodes.length) {
                for (var i = 0; i < indexes.length; i++) {
                    returnObjects = returnObjects.concat(this._nodes[indexes[i]].retrieve(pRect));
                }
            }
            //remove duplicates
            returnObjects = returnObjects.filter(function (item, index) {
                return returnObjects.indexOf(item) >= index;
            });
            return returnObjects;
        }
        ;
        /**
         * 清空此四叉树
         */
        clear() {
            this._objects.length = 0;
            for (var i = 0; i < this._nodes.length; i++) {
                if (this._nodes.length) {
                    this._nodes[i].clear();
                }
            }
            this._nodes.length = 0;
            if (!this.root) {
                df.Pool.instance.backTo(this);
            }
        }
        ;
    }
    df.Quadtree = Quadtree;
    __reflect(Quadtree.prototype, "df.Quadtree");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 一个简单的镜头Y方向控制算法，适用向上跳跃且始终不会超出某一限定位置的需求
     * @example
     *	let cy = new CameraY();
     *	cy.cameraActY = 500;
     *	cy.roleRealY = 600;
     *	cy.originBgY = 0
     *	yourLogic(cy.roleRealY, cy.roleY, cy.nowBgY)
     */
    class CameraY {
        constructor() {
        }
        /**
         * 角色屏幕位置
         */
        get roleY() {
            let disY = this.roleRealY - this.cameraActY;
            if (disY >= 0) {
                disY = 0;
            }
            return this.roleRealY - disY;
        }
        get nowBgY() {
            let disY = this.roleRealY - this.cameraActY;
            if (disY < 0) {
                return this.originBgY - disY;
            }
            return this.originBgY;
        }
    }
    df.CameraY = CameraY;
    __reflect(CameraY.prototype, "df.CameraY");
})(df || (df = {}));
/// <reference path="TestComponent.ts" />
var df;
(function (df) {
    /**
     * 测试子类
     */
    class TestUI extends df.TestComponent {
        constructor() {
            super();
            console.log("TestUI create");
        }
    }
    df.TestUI = TestUI;
    __reflect(TestUI.prototype, "df.TestUI");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 4*4斗兽棋算法
     * @example
     *	let ac = new df.ACAlgo();
     *	ac.initGrids();
     *
     *	df.EventBus.instance.addEventListener(df.ACAlgo.FLOP, flop, this);
     *	df.EventBus.instance.addEventListener(df.ACAlgo.EATING, eat, this);
     *	df.EventBus.instance.addEventListener(df.ACAlgo.MOVE, move, this);
     *	df.EventBus.instance.addEventListener(df.ACAlgo.WIN, win, this);
     *
     *	flop(event) {ac.flop(event);}
     *	eat(event) {ac.eat(event);}
     *	move(event) {ac.move(event);}
     *	win(event) {ac.win(event);}
     *
     *	ac.auto(0);
     *	ac.auto(1);
     */
    class ACAlgo {
        constructor() {
            this._animalNames = ["鼠", "猫", "狐", "狼", "豹", "虎", "狮", "象"];
            this._winSteps = [];
            this._failSteps = [];
            this._tieSteps = [];
        }
        /**
         * 初始化随机棋盘
         */
        initGrids() {
            if (!this.grids) {
                this.grids = [];
            }
            else {
                this.grids.length = 0;
            }
            for (let i = 0; i < 16; i++) {
                let grid = new df.ACGrid();
                grid.num = i % 8;
                grid.isEmpty = false;
                grid.isAsk = true;
                grid.isMe = i > 7 ? false : true;
                this.grids.push(grid);
            }
            df.ArrayUtil.random(this.grids);
            for (let i = 0; i < this.grids.length; i++) {
                let grid = this.grids[i];
                grid.gridX = i % 4;
                grid.gridY = Math.floor((i / 4));
            }
        }
        print() {
            let line = 0;
            let str = "";
            for (let i = 0; i < this.grids.length; i++) {
                let grid = this.grids[i];
                if (line != grid.gridY) {
                    line = grid.gridY;
                    str += "\n";
                }
                if (grid.isEmpty) {
                    str += "_ ";
                }
                else if (grid.isAsk) {
                    str += "? ";
                }
                else if (grid.isMe) {
                    str += `${this.getAnimalName(grid.num)} `;
                }
                else {
                    str += `${grid.num} `;
                }
            }
            console.log(str);
            console.log("*************************************");
        }
        getAnimalName(num) {
            if (num == -1) {
                return "无";
            }
            return this._animalNames[num];
        }
        /**
         * 自动下棋，双方皆可
         * @param camp 0代表我方，1代表对方
         */
        auto(camp) {
            this._camp = camp;
            this._winSteps = [];
            this._failSteps = [];
            this._tieSteps = [];
            let win = [];
            let fail = [];
            let tie = [];
            for (let i = 0; i < this.grids.length; i++) {
                let enemy = this.grids[i];
                if (!enemy.isMe && !enemy.isEmpty && !enemy.isAsk) {
                    let roundGrids = this.selectRoundGrid(enemy);
                    for (let j = 0; j < roundGrids.length; j++) {
                        let me = roundGrids[j];
                        if (me.isMe && !me.isEmpty && !me.isAsk) {
                            if (this._camp == 1) {
                                this.winFailArr(enemy, me, win, fail, tie); //对手看待的胜负
                            }
                            else {
                                this.winFailArr(me, enemy, win, fail, tie); //我看待的胜负
                            }
                        }
                    }
                }
            }
            this._winSteps.sort((a, b) => {
                if (a.me.num > b.me.num) {
                    return -1;
                }
                else if (a.me.num < b.me.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            this._failSteps.sort((a, b) => {
                if (a.enemy.num > b.enemy.num) {
                    return -1;
                }
                else if (a.enemy.num < b.enemy.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            this._tieSteps.sort((a, b) => {
                if (a.enemy.num > b.enemy.num) {
                    return -1;
                }
                else if (a.enemy.num < b.enemy.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            this._winMax = df.ArrayUtil.maxNum(win);
            this._failMax = df.ArrayUtil.maxNum(fail);
            this._tieMax = df.ArrayUtil.maxNum(tie);
            let opt;
            if (this._winMax > this._failMax) {
                opt = ACCampOpt.EAT;
            }
            else if (this._winMax < this._failMax) {
                opt = ACCampOpt.RUN;
                if (this._winSteps[0] && (this._winSteps[0].enemy.num == this._failMax)) {
                    opt = ACCampOpt.EAT;
                }
            }
            else if (this._winMax == this._failMax && this._winMax != -1) {
                opt = ACCampOpt.EAT; // 优先吃
            }
            else {
                if (this._tieMax != -1) {
                    opt = ACCampOpt.TIE;
                }
                else {
                    opt = ACCampOpt.FLOP;
                }
            }
            if (!this.isFloped()) {
                opt = ACCampOpt.FLOP;
            }
            console.log(`胜_${this.getAnimalName(this._winMax)}`, `负_${this.getAnimalName(this._failMax)}`, `平_${this.getAnimalName(this._tieMax)}`);
            this.action(opt);
        }
        winFailArr(enemy, me, win, fail, tie) {
            let vsr = this.checkVSR(enemy, me); //对手看待的胜负
            switch (vsr) {
                case ACChessVS.WIN:
                    if (!this.isInQueue(enemy, me, this._winSteps)) {
                        this._winSteps.push({ enemy, me });
                    }
                    if (!df.ArrayUtil.includes(win, me.num)) {
                        win.push(me.num);
                    }
                    break;
                case ACChessVS.FAIL:
                    if (!this.isInQueue(enemy, me, this._failSteps)) {
                        this._failSteps.push({ enemy, me });
                    }
                    if (!df.ArrayUtil.includes(fail, enemy.num)) {
                        fail.push(enemy.num);
                    }
                    break;
                case ACChessVS.TIE:
                    if (!this.isInQueue(enemy, me, this._tieSteps)) {
                        this._tieSteps.push({ enemy, me });
                    }
                    if (!df.ArrayUtil.includes(tie, enemy.num)) {
                        tie.push(enemy.num);
                    }
                    break;
                default:
                    break;
            }
        }
        checkVSR(me, enemy) {
            let vsr;
            if (me.num > enemy.num) {
                vsr = ACChessVS.WIN;
                if (me.num == 7 && enemy.num == 0) {
                    vsr = ACChessVS.FAIL;
                }
            }
            else if (me.num == enemy.num) {
                vsr = ACChessVS.TIE;
            }
            else if (me.num < enemy.num) {
                vsr = ACChessVS.FAIL;
                if (me.num == 0 && enemy.num == 7) {
                    vsr = ACChessVS.WIN;
                }
            }
            return vsr;
        }
        isInQueue(enemy, me, arr) {
            let r = false;
            for (let i = 0; i < arr.length; i++) {
                if ((arr[i].enemy.gridX == enemy.gridX) &&
                    (arr[i].enemy.gridY == enemy.gridY) &&
                    (arr[i].me.gridX == me.gridX) &&
                    (arr[i].me.gridY == me.gridY)) {
                    r = true;
                    break;
                }
            }
            return r;
        }
        /**
         * 是否开过牌，全是？号
         * @returns
         */
        isFloped() {
            let r = false;
            for (let i = 0; i < this.grids.length; i++) {
                if (!this.grids[i].isAsk) {
                    r = true;
                    break;
                }
            }
            return r;
        }
        /**
         * 还有未翻的牌，尚有？号
         * @returns
         */
        hasAsk() {
            let r = false;
            for (let i = 0; i < this.grids.length; i++) {
                if (this.grids[i].isAsk) {
                    r = true;
                    break;
                }
            }
            return r;
        }
        action(opt) {
            switch (opt) {
                case ACCampOpt.EAT:
                    console.log(`阵营_${this._camp} 吃`);
                    let win = this._winSteps[0];
                    let enemy = win.enemy;
                    let me = win.me;
                    df.EventBus.instance.emit(ACAlgo.EATING, { eating: enemy, eated: me });
                    break;
                case ACCampOpt.RUN:
                    console.log(`阵营_${this._camp} 跑`);
                    this.chessRun();
                    break;
                case ACCampOpt.TIE:
                    console.log(`阵营_${this._camp} 拼`);
                    if (this._tieMax != -1) {
                        let tie = this._tieSteps[0];
                        df.EventBus.instance.emit(ACAlgo.EATING, { eating: tie.enemy, eated: tie.me });
                    }
                    else {
                        this.action(ACCampOpt.FLOP);
                    }
                    break;
                case ACCampOpt.FLOP:
                    console.log(`阵营_${this._camp} 翻`);
                    let asks = [];
                    for (let i = 0; i < this.grids.length; i++) {
                        if (this.grids[i].isAsk) {
                            asks.push(this.grids[i]);
                        }
                    }
                    df.ArrayUtil.random(asks);
                    if (asks.length > 0) {
                        df.EventBus.instance.emit(ACAlgo.FLOP, { flop: asks[0] });
                    }
                    else {
                        this.action(ACCampOpt.MOVE);
                    }
                    break;
                default:// 瞎走一步；
                    console.log(`阵营_${this._camp} 瞎`);
                    this.moveRandom();
                    break;
            }
        }
        /**
         * 吃子
         * @param event
         */
        eat(event) {
            let eating = event.data.eating;
            let eated = event.data.eated;
            console.log(`阵营_${this._camp}${this.getAnimalName(eating.num)}去吃${this.getAnimalName(eated.num)}`);
            let vsr = this.checkVSR(eating, eated);
            switch (vsr) {
                case ACChessVS.WIN:
                    eated.num = eating.num;
                    eated.isMe = eating.isMe;
                    eating.isEmpty = true;
                    break;
                case ACChessVS.FAIL:
                    eating.isEmpty = true;
                    break;
                case ACChessVS.TIE:
                    eated.isEmpty = eating.isEmpty = true;
                    break;
            }
            this.print();
            this.checkRoundVS();
        }
        chessRun() {
            let maySafe = [];
            for (let i = 0; i < this._failSteps.length; i++) {
                let enemy;
                enemy = this._failSteps[i].enemy;
                let gridDatas = this.selectRoundGrid(enemy);
                for (let j = 0; j < gridDatas.length; j++) {
                    if (gridDatas[j].isEmpty) {
                        gridDatas[j].num = enemy.num;
                        gridDatas[j].isEmpty = false;
                        enemy.isEmpty = true;
                        //查看是否还有危险；
                        if (!this.dangerous(gridDatas[j])) {
                            maySafe.push({ enemy, grid: gridDatas[j] });
                        }
                        //数据还原
                        gridDatas[j].isEmpty = true;
                        enemy.isEmpty = false;
                    }
                }
            }
            maySafe.sort((a, b) => {
                if (a.enemy.num > b.enemy.num) {
                    return -1;
                }
                else if (a.enemy.num < b.enemy.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            let valueSafe;
            this._valueRun = false;
            if (maySafe.length > 0) {
                for (let i = 0; i < maySafe.length; i++) {
                    if (this._winMax < maySafe[i].enemy.num) {
                        this._valueRun = true;
                        valueSafe = maySafe[i];
                        break;
                    }
                }
            }
            this._canRun = false;
            if (maySafe.length > 0 && !this._valueRun) {
                this._canRun = true;
            }
            if (this._valueRun) {
                df.EventBus.instance.emit(ACAlgo.MOVE, { src: valueSafe.enemy, target: valueSafe.grid });
            }
            else if (this._canRun) {
                df.EventBus.instance.emit(ACAlgo.MOVE, { src: maySafe[0].enemy, target: maySafe[0].grid });
            }
            else {
                this.action(ACCampOpt.TIE);
            }
        }
        selectRoundGrid(chess) {
            let r = [];
            for (let i = 0; i < this.grids.length; i++) {
                let data = this.grids[i];
                if (chess.gridX == data.gridX && chess.gridY == data.gridY + 1) {
                    data.dir = ACGridWay.UP;
                    r.push(data);
                }
                if (chess.gridX == data.gridX && chess.gridY == data.gridY - 1) {
                    data.dir = ACGridWay.DOWN;
                    r.push(data);
                }
                if (chess.gridX == data.gridX + 1 && chess.gridY == data.gridY) {
                    data.dir = ACGridWay.LEFT;
                    r.push(data);
                }
                if (chess.gridX == data.gridX - 1 && chess.gridY == data.gridY) {
                    data.dir = ACGridWay.RIGHT;
                    r.push(data);
                }
            }
            return r;
        }
        dangerous(me) {
            let r = false;
            let gridDatas = this.selectRoundGrid(me);
            for (let i = 0; i < gridDatas.length; i++) {
                let enemy = gridDatas[i];
                if (!enemy.isEmpty && !enemy.isAsk && enemy.isMe != me.isMe) {
                    let vsr = this.checkVSR(me, enemy);
                    if (vsr == ACChessVS.FAIL) {
                        r = true;
                        break;
                    }
                }
            }
            return r;
            ;
        }
        /**
         * 移动
         * @param event
         */
        move(event) {
            let src = event.data.src;
            let target = event.data.target;
            console.log(`阵营_${this._camp} ${this.getAnimalName(src.num)}移动${target.gridX}_${target.gridY}`);
            src.isEmpty = true;
            target.isEmpty = false;
            target.isMe = src.isMe;
            target.num = src.num;
            this.print();
        }
        /**
         * 翻子
         * @param event
         */
        flop(event) {
            let flop = event.data.flop;
            console.log(`${flop.gridX}_${flop.gridY} 翻到阵营_${flop.isMe ? 0 : 1} ${this.getAnimalName(flop.num)}`);
            flop.isAsk = false;
            this.print();
            this.checkRoundVS();
        }
        /**
         * 任走一步安全路线，若安全路线无，依然任走一步
         */
        moveRandom() {
            let maySafe = [];
            let mayDangerous = [];
            for (let i = 0; i < this.grids.length; i++) {
                let enemy = this.grids[i];
                let condition;
                if (this._camp == 1) {
                    condition = !enemy.isMe;
                }
                else {
                    condition = enemy.isMe;
                }
                if (condition && !enemy.isAsk && !enemy.isEmpty) {
                    let gridDatas = this.selectRoundGrid(enemy);
                    for (let j = 0; j < gridDatas.length; j++) {
                        if (gridDatas[j].isEmpty) {
                            gridDatas[j].num = enemy.num;
                            gridDatas[j].isEmpty = false;
                            enemy.isEmpty = true;
                            //查看是否还有危险；
                            if (!this.dangerous(enemy)) {
                                maySafe.push({ enemy, grid: gridDatas[j] });
                            }
                            //数据还原
                            gridDatas[j].isEmpty = true;
                            enemy.isEmpty = false;
                        }
                    }
                }
            }
            if (maySafe.length > 0) {
                let sr = Math.floor(maySafe.length * Math.random());
                df.EventBus.instance.emit(ACAlgo.MOVE, { src: maySafe[sr].enemy, target: maySafe[sr].grid });
            }
            else if (mayDangerous.length > 0) {
                // 已无安全路线
                let dr = Math.floor(mayDangerous.length * Math.random());
                df.EventBus.instance.emit(ACAlgo.MOVE, { src: mayDangerous[dr].enemy, target: mayDangerous[dr].grid });
            }
            else {
                console.log("僵局！！！");
            }
        }
        /**
         * 判断本局胜负
         * @returns
         */
        checkRoundVS() {
            if (this.hasAsk()) {
                return;
            }
            let enemy = [];
            let me = [];
            for (let i = 0; i < this.grids.length; i++) {
                let chess = this.grids[i];
                if (!chess.isEmpty && !chess.isAsk) {
                    if (chess.isMe) {
                        me.push(chess);
                    }
                    else {
                        enemy.push(chess);
                    }
                }
            }
            let ac;
            if (enemy.length == 1 && me.length != 0) {
                let w = true;
                let flag = true;
                for (let i = 0; i < me.length; i++) {
                    let vsr = this.checkVSR(enemy[0], me[i]);
                    if (vsr != ACChessVS.WIN && flag) {
                        flag = false;
                        w = false;
                    }
                    if (vsr == ACChessVS.FAIL) {
                        ac = ACRoundVS.WIN; //对手失败
                        break;
                    }
                    else if (vsr == ACChessVS.TIE) {
                        if (me.length == 1) {
                            ac = ACRoundVS.TIE;
                            break;
                        }
                        else {
                            ac = ACRoundVS.WIN;
                            break;
                        }
                    }
                }
                if (w) {
                    ac = ACRoundVS.FAIL;
                }
                if (ac == undefined) {
                    ac = ACRoundVS.FAIL; //对手胜利
                }
            }
            else if (me.length == 1 && enemy.length != 0) {
                let w = true;
                let flag = true;
                for (let i = 0; i < enemy.length; i++) {
                    let vsr = this.checkVSR(me[0], enemy[i]);
                    if (vsr != ACChessVS.WIN && flag) {
                        flag = false;
                        w = false;
                    }
                    if (vsr == ACChessVS.FAIL) {
                        ac = ACRoundVS.FAIL; //我方失败
                        break;
                    }
                    else if (vsr == ACChessVS.TIE) {
                        if (enemy.length == 1) {
                            ac = ACRoundVS.TIE;
                            break;
                        }
                        else {
                            ac = ACRoundVS.FAIL;
                            break;
                        }
                    }
                }
                if (w) {
                    ac = ACRoundVS.WIN;
                }
                if (ac == undefined) {
                    ac = ACRoundVS.FAIL; //对手胜利
                }
            }
            else if (me.length == 0) {
                ac = ACRoundVS.FAIL;
            }
            else if (enemy.length == 0) {
                ac = ACRoundVS.WIN;
            }
            switch (ac) {
                case ACRoundVS.WIN:
                    df.EventBus.instance.emit(ACAlgo.WIN, { win: 0 });
                    break;
                case ACRoundVS.FAIL:
                    df.EventBus.instance.emit(ACAlgo.WIN, { win: 1 });
                    break;
                case ACRoundVS.TIE:
                    df.EventBus.instance.emit(ACAlgo.WIN, { win: -1 });
                    break;
            }
        }
        /**
         * 输出结果胜负
         * @param event event.data.win表胜利方 -1平局
         */
        win(event) {
            let win = event.data.win;
            if (win == -1) {
                console.log("---平局---");
            }
            else {
                console.log(`阵营_${win}_获胜`);
            }
        }
        /**
         * 获得棋子可走方向
         * @param chess
         * @returns
         */
        getMoveDirs(chess) {
            let r = this.selectRoundGrid(chess);
            let canMove = [];
            for (let i = 0; i < r.length; i++) {
                if (r[i].isEmpty || (!r[i].isAsk && r[i].isMe != chess.isMe)) {
                    let dir = r[i].dir;
                    canMove.push(dir);
                }
            }
            return canMove;
        }
        /**
         * 翻子
         * @param gridX
         * @param gridY
         */
        flopXy(gridX, gridY) {
            let grid = this.getGrid(gridX, gridY);
            this.flop({ data: { flop: grid } });
        }
        /**
         * 吃子
         * @param eating
         * @param eated
         */
        eatXy(eating, eated) {
            let eatingGrid = this.getGrid(eating.gridX, eating.gridY);
            let eatedGrid = this.getGrid(eated.gridX, eated.gridY);
            this.eat({ data: { eating: eatingGrid, eated: eatedGrid } });
        }
        /**
         * 移动
         * @param src
         * @param target
         */
        moveXy(src, target) {
            let srcGrid = this.getGrid(src.gridX, src.gridY);
            let targetGrid = this.getGrid(target.gridX, target.gridY);
            this.move({ data: { src: srcGrid, target: targetGrid } });
        }
        /**
         * 取子
         * @param gridX
         * @param gridY
         * @returns
         */
        getGrid(gridX, gridY) {
            for (let i = 0; i < this.grids.length; i++) {
                let grid = this.grids[i];
                if (grid.gridX == gridX && grid.gridY == gridY) {
                    return grid;
                }
            }
            return;
        }
    }
    ACAlgo.EATING = "acalgo_eating";
    ACAlgo.MOVE = "acalgo_move";
    ACAlgo.FLOP = "acalgo_flop";
    ACAlgo.WIN = "acalgo_win";
    df.ACAlgo = ACAlgo;
    __reflect(ACAlgo.prototype, "df.ACAlgo");
    let ACGridWay;
    (function (ACGridWay) {
        ACGridWay[ACGridWay["UP"] = 0] = "UP";
        ACGridWay[ACGridWay["DOWN"] = 1] = "DOWN";
        ACGridWay[ACGridWay["LEFT"] = 2] = "LEFT";
        ACGridWay[ACGridWay["RIGHT"] = 3] = "RIGHT";
    })(ACGridWay = df.ACGridWay || (df.ACGridWay = {}));
    /**
     * 阵营操作--> 吃，跑，翻
     */
    let ACCampOpt;
    (function (ACCampOpt) {
        ACCampOpt[ACCampOpt["EAT"] = 0] = "EAT";
        ACCampOpt[ACCampOpt["RUN"] = 1] = "RUN";
        ACCampOpt[ACCampOpt["TIE"] = 2] = "TIE";
        ACCampOpt[ACCampOpt["MOVE"] = 3] = "MOVE";
        ACCampOpt[ACCampOpt["FLOP"] = 4] = "FLOP";
    })(ACCampOpt || (ACCampOpt = {}));
    /**
     * 两棋子胜负
     */
    let ACChessVS;
    (function (ACChessVS) {
        ACChessVS[ACChessVS["WIN"] = 0] = "WIN";
        ACChessVS[ACChessVS["FAIL"] = 1] = "FAIL";
        ACChessVS[ACChessVS["TIE"] = 2] = "TIE";
    })(ACChessVS || (ACChessVS = {}));
    /**
     * 整局胜负
     */
    let ACRoundVS;
    (function (ACRoundVS) {
        ACRoundVS[ACRoundVS["WIN"] = 0] = "WIN";
        ACRoundVS[ACRoundVS["FAIL"] = 1] = "FAIL";
        ACRoundVS[ACRoundVS["TIE"] = 2] = "TIE";
    })(ACRoundVS || (ACRoundVS = {}));
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 斗兽棋数据格
     */
    class ACGrid {
        constructor() {
        }
    }
    df.ACGrid = ACGrid;
    __reflect(ACGrid.prototype, "df.ACGrid");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 事件总线
     * @example
     *	df.EventBus.instance.addEventListener("test", this.onTest, this);
     *	private onTest(event) {
     *		console.log(event.data)// {foo:"abc"}
     *	}
     *	df.EventBus.instance.emit("test", {foo:"abc"});
     *	df.EventBus.instance.removeEventListener("test", this.onTest, this);
     */
    class EventBus {
        constructor() {
            this._listeners = {};
        }
        static get instance() {
            if (!this._instance) {
                this._instance = new EventBus();
            }
            return this._instance;
        }
        /**
         * 注册事件
         * @param type 事件类型
         * @param callback 事件响应回调
         * @param scope 作用域
         */
        addEventListener(type, callback, scope) {
            var args = [];
            var numOfArgs = arguments.length;
            for (var i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            args = args.length > 3 ? args.splice(3, args.length - 1) : [];
            if (typeof this._listeners[type] != "undefined") {
                this._listeners[type].push({ scope: scope, callback: callback, args: args });
            }
            else {
                this._listeners[type] = [{ scope: scope, callback: callback, args: args }];
            }
        }
        /**
         * 移除注册事件
         * @param type
         * @param callback
         * @param scope
         */
        removeEventListener(type, callback, scope) {
            if (typeof this._listeners[type] != "undefined") {
                var numOfCallbacks = this._listeners[type].length;
                var newArray = [];
                for (var i = 0; i < numOfCallbacks; i++) {
                    var listener = this._listeners[type][i];
                    if (listener.scope == scope && listener.callback == callback) {
                    }
                    else {
                        newArray.push(listener);
                    }
                }
                this._listeners[type] = newArray;
            }
        }
        /**
         * 派发事件
         * @param type
         * @param data
         */
        emit(type, data) {
            var event = {
                type,
                data
            };
            var args = [];
            var numOfArgs = arguments.length;
            for (var i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            ;
            args = args.length > 2 ? args.splice(2, args.length - 1) : [];
            args = [event].concat(args);
            if (typeof this._listeners[type] != "undefined") {
                var listeners = this._listeners[type].slice();
                var numOfCallbacks = listeners.length;
                for (var i = 0; i < numOfCallbacks; i++) {
                    var listener = listeners[i];
                    if (listener && listener.callback) {
                        var concatArgs = args.concat(listener.args);
                        listener.callback.apply(listener.scope, concatArgs);
                    }
                }
            }
        }
    }
    df.EventBus = EventBus;
    __reflect(EventBus.prototype, "df.EventBus");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 泡泡龙瞄准线
     *
     * demo见https://github.com/dapili/bubbleRay
     */
    class BubbleRay {
        constructor() {
            /**
             * 定义矩形范围
             */
            this.rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            /**
             * 射线起点
             */
            this.start = {
                x: 0,
                y: 0
            };
            /**
             * 不能让射线一直反射
             */
            this.limit = 0;
            /**
             * 射线交点
             */
            this.rayPoints = [];
        }
        /**
         * 计算射线反射相交的点
         * @param angle 起始角度，单位度
         * @param type 0 起点 -1 右侧 1 左侧
         */
        calPoints(angle, type) {
            angle = Math.abs(angle);
            let bHeight;
            let bY;
            if (angle < 90 - 1) {
                if (type == 0) {
                    this.rayPoints.length = 0;
                    bHeight = this.start.x * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rect.height - bHeight;
                    this.rayPoints.push({ x: this.start.x, y: this.start.y });
                    this.rayPoints.push({ x: this.rect.width + this.rect.x, y: bY });
                    this.calPoints(angle, -1);
                }
                else if (type == -1) {
                    bHeight = this.rect.width * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rayPoints[this.rayPoints.length - 1].y - bHeight;
                    if (bY < this.limit) {
                        return;
                    }
                    this.rayPoints.push({ x: this.rect.x, y: bY });
                    this.calPoints(angle, 1);
                }
                else if (type == 1) {
                    bHeight = this.rect.width * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rayPoints[this.rayPoints.length - 1].y - bHeight;
                    if (bY < this.limit) {
                        return;
                    }
                    this.rayPoints.push({ x: this.rect.width + this.rect.x, y: bY });
                    this.calPoints(angle, -1);
                }
            }
            else if (angle > 90 + 1) {
                if (type == 0) {
                    angle = 180 - angle;
                    this.rayPoints.length = 0;
                    bHeight = (this.start.x - this.rect.x) * Math.tan(df.MathUtil.angle2radian(angle));
                    bY = this.rect.height - bHeight;
                    this.rayPoints.push({ x: this.start.x, y: this.start.y });
                    this.rayPoints.push({ x: this.rect.x, y: bY });
                    this.calPoints(angle, 1);
                }
            }
        }
    }
    df.BubbleRay = BubbleRay;
    __reflect(BubbleRay.prototype, "df.BubbleRay");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 消灭星星算法
     * @example
     *	let ps = new df.PSAlgo();
     *	ps.colors = 4;
     *	ps.initGrids();
     *
     *	let randomStar:df.PSGrid; // 任选一个可消除的星星
     *	let uniteStars = ps.getUniteStars(randomStar); // 取得同色星星
     *	ps.move(uniteStars); // 下落左移
     *	ps.print();
     */
    class PSAlgo {
        constructor() {
            /**行 */
            this.row = 10;
            /**列 */
            this.col = 10;
            this.colors = 4;
            this.grids = [];
            this._hasSelected = [];
            this._uniteStars = [];
        }
        initGrids() {
            this.grids.length = 0;
            for (let i = 0; i < this.row * this.col; i++) {
                let grid = new df.PSGrid();
                grid.num = df.MathUtil.randomInt(1, this.colors);
                grid.gridX = i % this.col;
                grid.gridY = Math.floor(i / this.col);
                this.grids.push(grid);
            }
            if (this.gameOver()) {
                this.initGrids();
            }
            else {
                this.print();
            }
        }
        test() {
            let data = [
                [0, 0, 0, 2, 0, 0, 2, 0, 0, 1],
                [0, 3, 1, 2, 0, 3, 1, 0, 1, 0]
            ];
            this.row = data.length;
            this.col = data[0].length;
            this.grids.length = 0;
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    let grid = new df.PSGrid();
                    grid.num = data[i][j];
                    grid.gridX = j;
                    grid.gridY = i;
                    this.grids.push(grid);
                }
            }
            this.print();
        }
        print() {
            let str = "";
            let line = 0;
            for (let i = 0; i < this.grids.length; i++) {
                let grid = this.grids[i];
                if (line != grid.gridY) {
                    line = grid.gridY;
                    str += "\n";
                }
                if (grid.num == 0) {
                    str += "_ ";
                }
                else {
                    str += `${grid.num} `;
                }
            }
            console.log(str);
            console.log("*********************************");
        }
        auto() {
            if (this.gameOver()) {
                console.log("游戏结束!!!");
            }
            else {
                let tip = this.tip();
                let randomStar = df.ArrayUtil.getRandomItem(tip);
                let uniteStars = this.getUniteStars(randomStar);
                this.move(uniteStars);
                this.print();
            }
        }
        /**
         * 下落左移
         * @param stars
         * @returns 下落和左移的格子数据
         */
        move(stars) {
            let obj = this.getDisCol(stars);
            let move = { down: [], left: [] };
            for (let i = 0; i < obj.gridsX.length; i++) {
                let data = obj.gridsX[i];
                let gridXStars = this.getGridXstars(data.key);
                df.ArrayUtil.sortDesBy("gridY", gridXStars);
                if (gridXStars.length == 0) {
                    data.clean = true;
                }
                let allGirdsX = this.getGridsByX(data.key);
                df.ArrayUtil.sortDesBy("gridY", allGirdsX);
                for (let j = 0; j < this.row; j++) {
                    if (gridXStars[j]) {
                        let dis = this.row - j - gridXStars[j].gridY - 1;
                        if (dis != 0) {
                            move.down.push({
                                gridX: gridXStars[j].gridX,
                                girdY: gridXStars[j].gridY,
                                dis
                            });
                        }
                        allGirdsX[j].num = gridXStars[j].num;
                    }
                    else {
                        allGirdsX[j].num = 0;
                    }
                }
            }
            this.formatLeft(obj, move);
            console.log(move);
            for (let i = 0; i < obj.gridsX.length; i++) {
                let data = obj.gridsX[i];
                if (data.clean) {
                    for (let j = data.key + 1; j < this.col; j++) {
                        for (let k = 0; k < this.row; k++) {
                            let leftGrid = this.getGrid(j - 1, k);
                            let cur = this.getGrid(j, k);
                            leftGrid.num = cur.num;
                            cur.num = 0;
                        }
                    }
                }
            }
            return move;
        }
        getGridXstars(gridX) {
            let stars = [];
            for (let i = 0; i < this.grids.length; i++) {
                if (this.grids[i].gridX == gridX && this.grids[i].num != 0) {
                    stars.push(this.grids[i]);
                }
            }
            return stars;
        }
        getGridsByX(gridX) {
            let grids = [];
            for (let i = 0; i < this.grids.length; i++) {
                if (this.grids[i].gridX == gridX) {
                    grids.push(this.grids[i]);
                }
            }
            return grids;
        }
        getGrid(gridX, gridY) {
            for (let i = 0; i < this.grids.length; i++) {
                let grid = this.grids[i];
                if (grid.gridX == gridX && grid.gridY == gridY) {
                    return grid;
                }
            }
            return;
        }
        /**
         * 消失的星星所在列
         */
        getDisCol(stars) {
            let obj = { gridsX: [] };
            for (let i = 0; i < stars.length; i++) {
                let star = stars[i];
                star.num = 0;
                let has = false;
                for (let i = 0; i < obj.gridsX.length; i++) {
                    if (obj.gridsX[i].key == star.gridX) {
                        has = true;
                        break;
                    }
                }
                if (!has) {
                    obj.gridsX.push({ key: star.gridX });
                }
            }
            df.ArrayUtil.sortDesBy("key", obj.gridsX);
            return obj;
        }
        /**
         * 格式化左移项
         */
        formatLeft(obj, move) {
            for (let i = 0; i < obj.gridsX.length; i++) {
                let data = obj.gridsX[i];
                if (data.clean) {
                    for (let j = data.key + 1; j < this.col; j++) {
                        let gridXStars = this.getGridXstars(j);
                        for (let k = 0; k < gridXStars.length; k++) {
                            move.left.push({
                                gridX: gridXStars[k].gridX,
                                gridY: gridXStars[k].gridY,
                            });
                        }
                    }
                }
            }
            let left = [];
            for (let i = 0; i < move.left.length; i++) {
                let m = move.left[i];
                let has = false;
                for (let j = 0; j < left.length; j++) {
                    if (left[j].gridX == m.gridX && left[j].gridY == m.gridY) {
                        left[j].dis++;
                        has = true;
                    }
                }
                if (!has) {
                    m.dis = 1;
                    left.push(m);
                }
            }
            move.left = left;
        }
        /**
         * 取整块同颜色的星星
         * @param star
         * @returns
         */
        getUniteStars(star) {
            this._hasSelected.length = 0;
            this._uniteStars.length = 0;
            this.scanUniteStars(star);
            return this._uniteStars;
        }
        /**
         * 扫描同颜色的星星
         * @param star
         */
        scanUniteStars(star) {
            if (this._hasSelected.indexOf(star) == -1) {
                this._hasSelected.push(star);
                if (this._uniteStars.indexOf(star) == -1) {
                    this._uniteStars.push(star);
                }
                let rounds = this.selectRoundGrid(star);
                for (let i = 0; i < rounds.length; i++) {
                    if (rounds[i].num == star.num) {
                        this.scanUniteStars(rounds[i]);
                    }
                }
            }
        }
        /**
         * 选择上下左右的格子
         * @param star
         * @returns
         */
        selectRoundGrid(star) {
            let r = [];
            for (let i = 0; i < this.grids.length; i++) {
                let data = this.grids[i];
                if (star.gridX == data.gridX && star.gridY == data.gridY + 1) {
                    r.push(data);
                }
                if (star.gridX == data.gridX && star.gridY == data.gridY - 1) {
                    r.push(data);
                }
                if (star.gridX == data.gridX + 1 && star.gridY == data.gridY) {
                    r.push(data);
                }
                if (star.gridX == data.gridX - 1 && star.gridY == data.gridY) {
                    r.push(data);
                }
            }
            return r;
        }
        /**
         * 给出可消除提示
         * @returns
         */
        tip() {
            let tipStars;
            for (let i = 0; i < this.grids.length; i++) {
                if (this.grids[i].num != 0) {
                    tipStars = this.getUniteStars(this.grids[i]);
                    if (tipStars && tipStars.length >= 2) {
                        break;
                    }
                }
            }
            return tipStars;
        }
        /**
         * 判断游戏是否结束
         * @returns
         */
        gameOver() {
            let tipStars = this.tip();
            if (tipStars && tipStars.length >= 2) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    df.PSAlgo = PSAlgo;
    __reflect(PSAlgo.prototype, "df.PSAlgo");
})(df || (df = {}));
var df;
(function (df) {
    class PSGrid {
        constructor() {
        }
    }
    df.PSGrid = PSGrid;
    __reflect(PSGrid.prototype, "df.PSGrid");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 数组工具，静态工具类
     */
    class ArrayUtil {
        constructor() {
        }
        /**
         * 随机打乱数组
         * @param arr
         * @returns 打乱后的数组
         */
        static random(arr) {
            arr.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            return arr;
        }
        static getRandomItem(arr) {
            return arr[Math.floor(arr.length * Math.random())];
        }
        /**
         * 若arr1中存在有arr2的元素，则从arr1中剔除
         * @param arr1
         * @param arr2
         * @returns 返回剔除后的arr1
         */
        static cull(arr1, arr2) {
            let index = -1;
            for (let i = 0; i < arr2.length; i++) {
                index = arr1.indexOf(arr2[i]);
                if (index != -1) {
                    arr1.splice(index, 1);
                }
            }
            return arr1;
        }
        /**
         * 按对象的key,升序排序；
         * @param key
         * @param arr
         * @returns 排序后数组
         */
        static sortAscBy(key, arr) {
            arr.sort((a, b) => {
                if (a[key] < b[key]) {
                    return -1;
                }
                else if (a[key] > b[key]) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            return arr;
        }
        /**
         * 按对象的key,降序排序；
         * @param key
         * @param arr
         * @returns 排序后数组
         */
        static sortDesBy(key, arr) {
            return this.sortAscBy(key, arr).reverse();
        }
        static includes(arr, item) {
            return arr.indexOf(item) != -1;
        }
        static maxNum(arr) {
            let r = -1;
            for (let i = 0; i < arr.length; i++) {
                if (r < arr[i]) {
                    r = arr[i];
                }
            }
            return r;
        }
    }
    df.ArrayUtil = ArrayUtil;
    __reflect(ArrayUtil.prototype, "df.ArrayUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 连续碰撞检测，静态工具类
     *
     * 默认步进为1，根据需要可适当加大以提升性能表现；无论结果是否碰撞，双方位置都会根据速度进行改变；
     *
     * 矩形锚点在左上角，圆锚点在圆心
     */
    class CCDUtil {
        constructor() {
        }
        /**
         * 矩形同矩形的ccd
         * @param rect1
         * @param rect2
         * @param step
         * @returns
         */
        static rect2rect(rect1, rect2, step = 1) {
            return this.a2b(Object.assign({}, rect1, { shape: this.RECT, r: 0 }), Object.assign({}, rect2, { shape: this.RECT, r: 0 }), step);
        }
        static a2b(a, b, step) {
            let loop = this.getLoop(a.speed, b.speed, step);
            let aStepSpeed = this.getStepSpeed(a.speed, loop);
            let bStepSpeed = this.getStepSpeed(b.speed, loop);
            let collision;
            for (let i = 0; i < loop; i++) {
                a.x += aStepSpeed.vx;
                a.y += aStepSpeed.vy;
                b.x += bStepSpeed.vx;
                b.y += bStepSpeed.vy;
                if (a.shape == b.shape && b.shape == this.RECT) {
                    if (df.CollisionUtil.rect2rect(a, b)) {
                        collision = true;
                        break;
                    }
                }
                else if (a.shape == b.shape && b.shape == this.CIRCLE) {
                    if (df.CollisionUtil.circle2Circle(a, b)) {
                        collision = true;
                        break;
                    }
                }
                else if (a.shape == this.RECT && b.shape == this.CIRCLE) {
                    if (df.CollisionUtil.rect2Circle(a, b)) {
                        collision = true;
                        break;
                    }
                }
            }
            return collision;
        }
        static getLoop(speed1, speed2, step) {
            let loop = Math.max(Math.abs(speed1.vx), Math.abs(speed1.vy), Math.abs(speed2.vx), Math.abs(speed2.vy)) / step;
            return Math.ceil(loop);
        }
        static getStepSpeed(speed, step) {
            let stepSpeed;
            stepSpeed.vx = speed.vx / step;
            stepSpeed.vy = speed.vy / step;
            return stepSpeed;
        }
        static rect2Circle(rect, circle, step = 1) {
            return this.a2b(Object.assign({}, rect, { shape: this.RECT, r: 0 }), Object.assign({}, circle, { shape: this.CIRCLE, width: 0, height: 0 }), step);
        }
        static circle2Circle(circle1, circle2, step = 1) {
            return this.a2b(Object.assign({}, circle1, { shape: this.CIRCLE, width: 0, height: 0 }), Object.assign({}, circle2, { shape: this.CIRCLE, width: 0, height: 0 }), step);
        }
    }
    CCDUtil.RECT = "rect";
    CCDUtil.CIRCLE = "circle";
    df.CCDUtil = CCDUtil;
    __reflect(CCDUtil.prototype, "df.CCDUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 碰撞检测，静态工具类
     *
     * 提供矩形与矩形，矩形与圆，圆与圆的检测，不支持旋转
     *
     * 矩形锚点在左上角，圆锚点在圆心
     */
    class CollisionUtil {
        constructor() {
        }
        /**
         * 矩形同矩形的碰撞
         * @param rect1
         * @param rect2
         * @returns
         */
        static rect2rect(rect1, rect2) {
            if (rect1.x + rect1.width < rect2.x ||
                rect1.y + rect1.height < rect2.y ||
                rect2.x + rect2.width < rect1.x ||
                rect2.y + rect2.height < rect1.y) {
                return false;
            }
            else {
                // 仅考虑一个动态的垂直4方向碰撞，判断rect1的上下左右被碰撞
            }
            return true;
        }
        static rect2Circle(rect, circle) {
            if (df.MathUtil.dis(rect, circle) <= circle.r ||
                df.MathUtil.dis({ x: rect.x + rect.width, y: rect.y }, circle) <= circle.r ||
                df.MathUtil.dis({ x: rect.x + rect.width, y: rect.y + rect.height }, circle) <= circle.r ||
                df.MathUtil.dis({ x: rect.x, y: rect.y + rect.height }, circle) <= circle.r) {
                return true;
            }
            else {
                if (this.rect2rect(rect, { x: circle.x - circle.r, y: circle.y - circle.r, width: 2 * circle.r, height: 2 * circle.r })) {
                    if (circle.x < rect.x && circle.y < rect.y ||
                        circle.x > rect.x + rect.width && circle.y < rect.y ||
                        circle.x > rect.x + rect.width && circle.y > rect.y + rect.height ||
                        circle.x < rect.x && circle.y > rect.y + rect.height) {
                        return false;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        static circle2Circle(c1, c2) {
            return df.MathUtil.dis(c1, c2) < c1.r + c2.r;
        }
    }
    df.CollisionUtil = CollisionUtil;
    __reflect(CollisionUtil.prototype, "df.CollisionUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * Get Post 请求工具.静态工具类
     */
    class HttpUtil {
        constructor() {
        }
        /**
         * 发送Post请求
         * @param url 请求url
         * @param params json对象，无参传空null
         * @param success 成功回调
         * @param fail 失败回调
         */
        static sendPostRequest(url, params, success, fail) {
            this.getRequest(url, params, success, fail, egret.HttpMethod.POST);
        }
        /**
         *
         * @param url
         * @param params 始终传空null
         * @param success
         * @param fail
         */
        static sendGetRequest(url, params, success, fail) {
            this.getRequest(url, null, success, fail, egret.HttpMethod.GET);
        }
        static sendDeleteRequest(url, params, success, fail) {
            this.getRequest(url, params, success, fail, "DELETE");
        }
        static getRequest(url, params, success, fail, type) {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, type);
            //设置响应头
            if (params) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            }
            else if (type != egret.HttpMethod.GET) {
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            request.send(params);
            request.addEventListener(egret.Event.COMPLETE, success, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, fail, this);
            // request.addEventListener(egret.ProgressEvent.PROGRESS,this.onPostProgress,this); //侦听进度
        }
        /**
         * 获取请求响应数据
         * @param event egret.Event
         * @returns ""或json对象
         */
        static getResponseData(event) {
            var request = event.currentTarget;
            let res = request.response;
            if (res == "") {
                return "";
            }
            else {
                return JSON.parse(res);
            }
        }
    }
    df.HttpUtil = HttpUtil;
    __reflect(HttpUtil.prototype, "df.HttpUtil");
})(df || (df = {}));
var df;
(function (df) {
    class ImgUtil {
        /**
         * @param callback (arraybuffer)=> {console.log(arraybuffer)}
         */
        static getArraybufferByUrl(src, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if (xhr.status == 200) {
                    var uInt8Array = new Uint8Array(xhr.response);
                    callback.call(this, uInt8Array);
                }
            };
            xhr.send();
        }
    }
    df.ImgUtil = ImgUtil;
    __reflect(ImgUtil.prototype, "df.ImgUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 数学工具，静态工具类
     */
    class MathUtil {
        constructor() {
        }
        /**
         * 角度转弧度
         * @param angle
         * @returns
         */
        static angle2radian(angle) {
            return angle / 180 * Math.PI;
        }
        /**
         * 弧度转角度
         * @param radian
         * @returns
         */
        static radian2angle(radian) {
            return radian / Math.PI * 180;
        }
        /**
         * 源对象与目标对象的夹角
         * @param source
         * @param target
         * @returns 角度
         */
        static pointerAngle(source, target) {
            let radians = Math.atan2(target.y - source.y, target.x - source.x);
            return df.MathUtil.radian2angle(radians);
        }
        /**
         * egret的指向方法
         * @param source
         * @param target
         */
        static egretToward(source, target) {
            source.rotation = this.pointerAngle(source, target) + 90;
        }
        /**
         * cocosCreator的指向方法
         * @param source
         * @param target
         */
        static cocosToward(source, target) {
            source.angle = this.pointerAngle(source, target) - 90;
        }
        static dis(p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }
        static equalInRange(a, b, range = 1e-4) {
            if (Math.abs(Math.abs(a) - Math.abs(b)) < range) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * 随机整数，取闭区间[min, max]
         * @param min
         * @param max
         * @returns
         */
        static randomInt(min, max) {
            return min + Math.round((max - min) * Math.random());
        }
        /**
         * 直线同圆的交点；x1,x2表直线点,x3,r表圆,锚点在圆心
         * @returns 空数组或有两个交点的数组
         */
        static getLineCircleIntersectP(x1, y1, x2, y2, x3, y3, r) {
            if (x1 == x2) {
                let Y = r * r - (x1 - x3) * (x1 - x3);
                if (Y < 0) {
                    return [];
                }
                else {
                    return [{ x: x1, y: Math.sqrt(Y) + y3 }, { x: x1, y: -Math.sqrt(Y) + y3 }];
                }
            }
            // 直线y = kx + b;
            let k = (y1 - y2) / (x1 - x2);
            let b = y1 - k * x1;
            // 圆(x - x3)*(x - x3) + (y - y3)*(y - y3) = r*r; 转倾成Ax*x + Bx + C = 0求解;
            let A = k * k + 1;
            let B = 2 * k * b - 2 * x3 - 2 * k * y3;
            let C = x3 * x3 + y3 * y3 + b * b - r * r - 2 * b * y3;
            let delta = B * B - 4 * A * C;
            if (delta < 0) {
                return [];
            }
            else {
                let r1x = (-B + Math.sqrt(delta)) / (2 * A);
                let r1y = k * r1x + b;
                let r2x = (-B - Math.sqrt(delta)) / (2 * A);
                let r2y = k * r2x + b;
                return [{ x: r1x, y: r1y }, { x: r2x, y: r2y }];
            }
        }
        /**
         * 直线同矩形的交点；x1,x2表直线点，x,widht表矩形,锚点在左上角；
         * @returns 空数组或有不定交点的数组
         */
        static getLineRectIntersectP(x1, y1, x2, y2, x, y, width, height) {
            let rectLines = [
                [x, y, x + width, y],
                [x, y, x, y + height],
                [x, y + height, x + width, y + height],
                [x + width, y, x + width, y + height],
            ];
            let interP = [];
            for (let i = 0; i < rectLines.length; i++) {
                let line = rectLines[i];
                let p = this.getLineLineIntersectP(x1, y1, x2, y2, line[0], line[1], line[2], line[3]);
                if (p != 1 && p != -1) {
                    if (this.isPointInRectSo(p.x, p.y, x, y, width, height)) {
                        interP.push(p);
                    }
                }
            }
            return interP;
        }
        /**
         * 直线同直线的交点；x1,x2表直线1，x3,x4表直线2；
         * @returns 一个交点对象或1(同一直线)或-1(平行直线)
         */
        static getLineLineIntersectP(x1, y1, x2, y2, x3, y3, x4, y4) {
            let k1, k2, b1, b2;
            if (x1 == x2) {
                if (x3 == x4) {
                    if (x1 == x3) {
                        return 1;
                    }
                    return -1;
                }
                else {
                    k2 = (y3 - y4) / (x3 - x4);
                    b2 = y3 - k2 * x3;
                    return { x: x1, y: k2 * x1 + b2 };
                }
            }
            else if (x3 == x4) {
                if (x1 == x2) {
                    if (x3 == x1) {
                        return 1;
                    }
                    return -1;
                }
                else {
                    k1 = (y1 - y2) / (x1 - x2);
                    b1 = y1 - k1 * x1;
                    return { x: x3, y: k1 * x3 + b1 };
                }
            }
            k1 = (y1 - y2) / (x1 - x2);
            b1 = y1 - k1 * x1;
            k2 = (y3 - y4) / (x3 - x4);
            b2 = y3 - k2 * x3;
            if (k1 == k2) {
                if (b1 == b2) {
                    return 1;
                }
                return -1;
            }
            let interX = (b2 - b1) / (k1 - k2);
            let interY = k1 * interX + b1;
            return { x: interX, y: interY };
        }
        /**
         * 点是否在矩形上；pX表点，x,width表矩形，锚点在左上角
         * @returns
         */
        static isPointInRect(pX, pY, x, y, width, height) {
            return (pX >= x) && (pX <= x + width) && (pY >= y) && (pY <= y + height);
        }
        /**
         * 点是否在矩形上；pX表点，x,width表矩形，锚点在左上角
         * ***非精确0.0001误差***
         * @returns
         */
        static isPointInRectSo(pX, pY, x, y, width, height) {
            return (pX >= x || this.equalInRange(pX, x)) &&
                (pX <= x + width || this.equalInRange(pX, x + width)) &&
                (pY >= y || this.equalInRange(pY, y)) &&
                (pY <= y + height || this.equalInRange(pY, y + height));
        }
        /**
         * 同toFixed(),但向下floor
         * @param num
         * @param fixed
         * @returns
         */
        static toFixedFloor(num, fixed) {
            let numStr = num.toString();
            let dotIndex = numStr.indexOf(".");
            if (dotIndex != -1) {
                for (let i = 0; i < fixed; i++) {
                    numStr += "0";
                }
                numStr = numStr.slice(0, dotIndex + fixed + 1);
            }
            else {
                numStr = num.toFixed(fixed);
            }
            return numStr;
        }
    }
    df.MathUtil = MathUtil;
    __reflect(MathUtil.prototype, "df.MathUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 字符串工具.静态工具类
     */
    class StringUtil {
        /**
         * 据字节长度截取字符串（英文一个字节，汉字两个字节）
         * @param length 字节长度
         * @param str 原字符串
         * @returns 截取后的字符串，过长会添加'..'结尾
         */
        static getStrByByteLen(length, str) {
            var count = 0;
            var index = str.length - 1;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    count += 2;
                }
                else {
                    count++;
                }
                if (count >= length) {
                    index = i;
                    break;
                }
            }
            if (index >= str.length - 1) {
                return str;
            }
            return str.substr(str, index + 1) + '..' || str;
        }
        /**
         * 反转字符串
         * @param str
         * @returns 反转后的字符串
         */
        static reverse(str) {
            return str.split("").reverse().join("");
        }
        /**
         * 去掉字符串所有的回车换行
         * @param str
         * @returns 无回车换行的字符串
         */
        static removeEnter(str) {
            return str.replace(/[\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))]/g, "");
        }
        /**
         * 获取url参数值
         * @param key
         * @returns
         */
        static getUrlValueByKey(key = "") {
            if (!key)
                return "";
            let url = window.location.href;
            let str = url.split("?")[1];
            let val = "";
            if (str) {
                let arr = str.split("&");
                for (let qst of arr) {
                    if (qst.search(key) >= 0) {
                        if (qst.search("=") >= 0) {
                            val = qst.split("=")[1];
                        }
                        else {
                            val = "default";
                        }
                        break;
                    }
                }
            }
            return val;
        }
        /**
         * 获取base64编码
         * @param str
         * @returns
         */
        static getBase64(str) {
            // 对字符串进行编码
            var encode = encodeURIComponent(str);
            // 对编码的字符串转化base64
            var base64 = btoa(encode);
            return base64;
        }
    }
    df.StringUtil = StringUtil;
    __reflect(StringUtil.prototype, "df.StringUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 时间工具，静态工具类
     */
    class TimeUtil {
        constructor() {
        }
        /**
         * 判断当前是否在某一时间范围
         * @param start 开始时间，年月日时，24小时制
         * @param end 结束时间
         * @returns
         * @example
         *	如当前时间2021年7月21日14时，以下活动时间开始于2021年7月21日早8点，结束于下午3点
         *	let start = '2021 7 21 8:00';
         *	let end = '2021 7 21 15:00';
         *	df.TimeUtil.inTimeRange(start, end) //结果true
         */
        static inTimeRange(start, end) {
            let now = new Date().getTime();
            let startTime = new Date(start).getTime();
            let endTime = new Date(end).getTime();
            if (startTime <= now && now <= endTime) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * 时分秒(99:59:59)
         * @param time 秒
         * @returns
         */
        static hms(time) {
            let hour = Math.floor(time / 3600);
            let minute = Math.floor(time / 60) % 60;
            let second = time % 60;
            let hstr = hour > 9 ? hour : "0" + hour;
            let mstr = minute > 9 ? minute : "0" + minute;
            let sstr = second > 9 ? second : "0" + second;
            return hstr + ":" + mstr + ":" + sstr;
        }
        /**
         * 分秒(99:59)
         * @param time 秒
         * @returns
         */
        static ms(time) {
            let minute = Math.floor(time / 60);
            let second = time % 60;
            let mstr = minute > 9 ? minute : "0" + minute;
            let sstr = second > 9 ? second : "0" + second;
            return mstr + ":" + sstr;
        }
    }
    df.TimeUtil = TimeUtil;
    __reflect(TimeUtil.prototype, "df.TimeUtil");
})(df || (df = {}));
var df;
(function (df) {
    /**
     * 其它工具类
     */
    class ToolUtil {
        constructor() {
        }
        /**防连点 */
        static CLICK(context, callBack, time = 1000, param = "_canClick") {
            if (context[param] == undefined) {
                context[param] = true;
            }
            if (context[param]) {
                context[param] = false;
                setTimeout(() => {
                    context[param] = true;
                }, time);
                callBack();
            }
            else {
                console.log("Cant click now! Wait!");
            }
        }
    }
    df.ToolUtil = ToolUtil;
    __reflect(ToolUtil.prototype, "df.ToolUtil");
})(df || (df = {}));
