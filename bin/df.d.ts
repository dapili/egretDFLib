/**
 * df命名空间
 */
declare namespace df {
    /**
     * 测试基类
     */
    class TestComponent {
        constructor();
    }
}
declare namespace df {
    /**
     * 泡泡龙相关算法
     *
     * demo见https://github.com/dapili/bubbleShooter
     */
    class BubbleAlgo {
        constructor();
        startX: number;
        startY: number;
        gapX: number;
        gapY: number;
        row: number;
        col: number;
        /**
         * 初始泡泡摆放
         * @param startX 起点xy
         * @param startY
         * @param gapX 列间距
         * @param gapY 行间距
         * @param row 行
         * @param col 列
         */
        initConfig(startX: any, startY: any, gapX: any, gapY: any, row: any, col: any): void;
        bubbles: Array<BubbleInterface>;
        private _radius;
        private _diameter;
        private _startY;
        private _class;
        private _type;
        /**
         * 初始泡泡
         * @param r 泡泡半径
         * @param type 共几种类型泡泡
         * @param Class 泡泡类，非实例，锚点在圆心
         * @returns 泡泡对象数组
         */
        initBubbles<T extends BubbleInterface>(r: number, type: number, Class: {
            new (): T;
        }): BubbleInterface[];
        /**
         * 创建泡泡
         * @returns 泡泡对象
         */
        createBubble(): any;
        private _addLineIndex;
        /**
         * 顶部新加一行
         * @returns 新加泡泡对象数组
         */
        addBubbleLine(): any[];
        /**
         * 连接泡泡并摆放到合适的位置
         * @param linked 被连接的泡泡，参照物
         * @param link 连接泡泡，最终会在参照物六方向中的一个位置
         */
        linkBubble(linked: BubbleInterface, link: BubbleInterface): void;
        /**
         * 掉落的泡泡
         * @returns 掉落泡泡数组
         */
        getFallBubbles(): any[];
        private _unites;
        private _scans;
        /**
         * 选择同色或不同色的一块泡泡
         * @returns 泡泡数组
         */
        getUniteBubbles(bubble: BubbleInterface, color: boolean): BubbleInterface[];
        private scanUniteBubbles(bubble, color);
        private selectRoundBubbles(bubble);
    }
    interface BubbleInterface {
        type: number;
        row: number;
        x: number;
        y: number;
        visible: boolean;
        alpha: number;
    }
}
declare namespace df {
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
        constructor();
        private _entity;
        private _vy;
        private _angelStep;
        /**
         *
         * @param entity 下落对象
         * @param vy
         * @param angelStep 用于正弦变化的角度值，推荐取较小的值如0.01；
         */
        init(entity: any, vy: number, angelStep: number): void;
        private _startAngel;
        move(): void;
        x: number;
        y: number;
        readonly width: number;
        readonly height: number;
        visible: boolean;
        /**
         * 下落对象
         */
        readonly entity: any;
    }
}
declare namespace df {
    /**
     * 动态加载声音播放
     * @example
     *	df.GameSound.instance.bgmOpen = true; //先打开开关
     *	df.GameSound.instance.playBgm(url);
     *	df.GameSound.instance.audioOpen = true; //先打开开关
     *	df.GameSound.instance.playAudio(url);
     */
    class GameSound {
        private constructor();
        private static _instance;
        static readonly instance: GameSound;
        /**
         * audio开关,默认关闭，须先打开才能播放；
         */
        audioOpen: boolean;
        private _audioCache;
        /**
         * 播放音效
         * @param url
         * @param volume
         */
        playAudio(url: any, volume?: number): void;
        private loadAudio(url, volume?);
        /**
         * bgm开关,默认关闭，须先打开才能播放；
         */
        bgmOpen: boolean;
        private _bgmCache;
        private _curBgm;
        private _curBgmData;
        /**
         * 播放bgm
         * @param url
         * @param volume
         */
        playBgm(url: any, volume?: number): void;
        private loadBgm(url, volume?);
        private _bgmPosition;
        /**
         * 暂停播放；若要设置bgm关闭,请将bgmOpen也设为false;
         */
        pauseBgm(): void;
        resumeBgm(): void;
    }
}
declare namespace df {
    /**
     * H5 new Audio()方式播放声音，动态加载
     * @example
     *	df.H5Sound.instance.bgmOpen = true; //先打开开关
     *	df.H5Sound.instance.playBgm(url);
     *	df.H5Sound.instance.audioOpen = true; //先打开开关
     *	df.H5Sound.instance.playAudio(url);
     */
    class H5Sound {
        private constructor();
        private static _instance;
        static readonly instance: H5Sound;
        /**
         * bgm开关,默认关闭，须先打开才能播放；
         */
        bgmOpen: boolean;
        private _bgm;
        /**
         * 播放bgm
         * @param url
         * @param volume
         * @returns
         */
        playBgm(url: any, volume?: number): void;
        /**
         * 暂停播放；若要设置bgm关闭,请将bgmOpen也设为false;
         */
        pauseBgm(): void;
        resumeBgm(): void;
        /**
         * audio开关,默认关闭，须先打开才能播放；
         */
        audioOpen: boolean;
        /**
         * 播放音效
         * @param url
         * @param volume
         */
        playAudio(url: any, volume?: number): void;
    }
}
declare namespace df {
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
        constructor();
        private _arr;
        private _limitY;
        /**
         * 整个背景或拉霸的总高
         */
        private _totalH;
        /**
         *
         * @param arr 要循环移动的对象，请依次排列好
         * @param limitY 若对象y值大于此值，就移动到头部
         */
        init(arr: Array<any>, limitY: number): void;
        /**
         * 将移动到头部的
         */
        private _heads;
        /**
         * 将移动到尾部的
         */
        private _tails;
        /**
         * 每次步长
         * @param v
         */
        step(v: number): void;
    }
}
declare namespace df {
    /**
     * 对象池工具. 单例工具类
     */
    class Pool {
        private constructor();
        private static _instance;
        static readonly instance: Pool;
        private _pool;
        /**
         * 拿取对象
         * @param cls 传入类名
         * @returns 对象
         */
        getFrom(cls: any): any;
        /**
         * 归还对象
         * @param instance 实例对象，非类名
         */
        backTo(instance: any): void;
        /**
         * 清空整个对象池
         */
        clear(): void;
        /**
         * 测试，对象池打印
         */
        debug(): void;
    }
}
declare namespace df {
    /**
     * 四叉树
     *
     * 实现完全参照https://github.com/timohausmann/quadtree-js
     *
     * 由于原版在动态的情况下会不停的生成Quadtree对象，故封装了对象池优化，这部分对用户不可见，仅见属性root注释
     *
     */
    class Quadtree {
        constructor();
        private _max_objects;
        private _max_levels;
        private _level;
        private _bounds;
        private _objects;
        private _nodes;
        /**
         * 初始化四叉树
         * @param bounds 此四叉树边界
         * @param max_objects (可选)此树能容纳的最大数目，超过时此树进一步分成4子树(默认：10)
         * @param max_levels (可选)最大划分深度(默认：4)
         * @param level (可选)当前深度(默认：0)
         */
        init(bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, max_objects?: number, max_levels?: number, level?: number): void;
        /**
         * 分裂成四子树
         */
        private split();
        /**
         * 获得此对象属于那几个象限
         * @param pRect
         * @returns
         */
        private getIndex(pRect);
        /**
         * 插入对象
         * @param pRect
         * @returns
         */
        insert(pRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }): void;
        /**
         * 取回有哪些相邻的对象
         * @param pRect
         * @returns
         */
        retrieve(pRect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }): any[];
        /**
         * @重要**标示是否为最上层的根节点，若是则不会被对象池回收，请勿更改**
         */
        root: boolean;
        /**
         * 清空此四叉树
         */
        clear(): void;
    }
}
declare namespace df {
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
        constructor();
        /**
         * 镜头活动位置,限制位置
         */
        cameraActY: number;
        /**
         * 角色实际位置，世界位置
         */
        roleRealY: number;
        /**
         * 角色屏幕位置
         */
        readonly roleY: number;
        /**
         * 原始bg位置
         */
        originBgY: number;
        readonly nowBgY: number;
    }
}
declare namespace df {
    /**
     * 测试子类
     */
    class TestUI extends TestComponent {
        constructor();
    }
}
declare namespace df {
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
        constructor();
        /**
         * 棋盘数据，可按长度16成4*4行列设置
         */
        grids: Array<ACGrid>;
        /**
         * 初始化随机棋盘
         */
        initGrids(): void;
        private print();
        private _animalNames;
        getAnimalName(num: number): string;
        private _winSteps;
        private _failSteps;
        private _tieSteps;
        private _winMax;
        private _failMax;
        private _tieMax;
        private _camp;
        /**
         * 自动下棋，双方皆可
         * @param camp 0代表我方，1代表对方
         */
        auto(camp: number): void;
        private winFailArr(enemy, me, win, fail, tie);
        private checkVSR(me, enemy);
        private isInQueue(enemy, me, arr);
        /**
         * 是否开过牌，全是？号
         * @returns
         */
        private isFloped();
        /**
         * 还有未翻的牌，尚有？号
         * @returns
         */
        private hasAsk();
        static EATING: string;
        static MOVE: string;
        static FLOP: string;
        static WIN: string;
        private action(opt);
        /**
         * 吃子
         * @param event
         */
        eat(event: any): void;
        private _valueRun;
        private _canRun;
        private chessRun();
        private selectRoundGrid(chess);
        private dangerous(me);
        /**
         * 移动
         * @param event
         */
        move(event: any): void;
        /**
         * 翻子
         * @param event
         */
        flop(event: any): void;
        /**
         * 任走一步安全路线，若安全路线无，依然任走一步
         */
        private moveRandom();
        /**
         * 判断本局胜负
         * @returns
         */
        private checkRoundVS();
        /**
         * 输出结果胜负
         * @param event event.data.win表胜利方 -1平局
         */
        win(event: any): void;
        /**
         * 获得棋子可走方向
         * @param chess
         * @returns
         */
        getMoveDirs(chess: ACGrid): ACGridWay[];
        /**
         * 翻子
         * @param gridX
         * @param gridY
         */
        flopXy(gridX: number, gridY: number): void;
        /**
         * 吃子
         * @param eating
         * @param eated
         */
        eatXy(eating: {
            gridX: number;
            gridY: number;
        }, eated: {
            gridX: number;
            gridY: number;
        }): void;
        /**
         * 移动
         * @param src
         * @param target
         */
        moveXy(src: {
            gridX: number;
            gridY: number;
        }, target: {
            gridX: number;
            gridY: number;
        }): void;
        /**
         * 取子
         * @param gridX
         * @param gridY
         * @returns
         */
        getGrid(gridX: number, gridY: number): ACGrid;
    }
    enum ACGridWay {
        UP = 0,
        DOWN = 1,
        LEFT = 2,
        RIGHT = 3,
    }
}
declare namespace df {
    /**
     * 斗兽棋数据格
     */
    class ACGrid {
        constructor();
        gridX: number;
        gridY: number;
        /**是否为空 */
        isEmpty: boolean;
        /**是否盖牌 */
        isAsk: boolean;
        /**是否我方或者阵营0 */
        isMe: boolean;
        /**
         *
         * 象>狮>虎>豹>狼>狐>猫>鼠>象
         *
         * 鼠，0
         * 猫，1
         * 狐，2
         * 狼，3
         * 豹，4
         * 虎，5
         * 狮，6
         * 象，7
         */
        num: number;
        /**方向 */
        dir: df.ACGridWay;
    }
}
declare namespace df {
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
        private constructor();
        private static _instance;
        static readonly instance: EventBus;
        private _listeners;
        /**
         * 注册事件
         * @param type 事件类型
         * @param callback 事件响应回调
         * @param scope 作用域
         */
        addEventListener(type: string, callback: Function, scope: any): void;
        /**
         * 移除注册事件
         * @param type
         * @param callback
         * @param scope
         */
        removeEventListener(type: string, callback: Function, scope: any): void;
        /**
         * 派发事件
         * @param type
         * @param data
         */
        emit(type: string, data?: any): void;
    }
}
declare namespace df {
    /**
     * 泡泡龙瞄准线
     *
     * demo见https://github.com/dapili/bubbleRay
     */
    class BubbleRay {
        constructor();
        /**
         * 定义矩形范围
         */
        rect: {
            x;
            y;
            width;
            height;
        };
        /**
         * 射线起点
         */
        start: {
            x;
            y;
        };
        /**
         * 不能让射线一直反射
         */
        limit: number;
        /**
         * 射线交点
         */
        rayPoints: any[];
        /**
         * 计算射线反射相交的点
         * @param angle 起始角度，单位度
         * @param type 0 起点 -1 右侧 1 左侧
         */
        calPoints(angle: any, type: number): void;
    }
}
declare namespace df {
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
        constructor();
        /**行 */
        row: number;
        /**列 */
        col: number;
        colors: number;
        grids: Array<PSGrid>;
        initGrids(): void;
        test(): void;
        print(): void;
        auto(): void;
        /**
         * 下落左移
         * @param stars
         * @returns 下落和左移的格子数据
         */
        move(stars: Array<PSGrid>): {
            down: any[];
            left: any[];
        };
        private getGridXstars(gridX);
        private getGridsByX(gridX);
        private getGrid(gridX, gridY);
        /**
         * 消失的星星所在列
         */
        private getDisCol(stars);
        /**
         * 格式化左移项
         */
        private formatLeft(obj, move);
        private _hasSelected;
        private _uniteStars;
        /**
         * 取整块同颜色的星星
         * @param star
         * @returns
         */
        getUniteStars(star: PSGrid): PSGrid[];
        /**
         * 扫描同颜色的星星
         * @param star
         */
        private scanUniteStars(star);
        /**
         * 选择上下左右的格子
         * @param star
         * @returns
         */
        private selectRoundGrid(star);
        /**
         * 给出可消除提示
         * @returns
         */
        tip(): PSGrid[];
        /**
         * 判断游戏是否结束
         * @returns
         */
        gameOver(): boolean;
    }
}
declare namespace df {
    class PSGrid {
        constructor();
        gridX: number;
        gridY: number;
        /**
         * 0表示空；1,2,3...
         */
        num: number;
    }
}
declare namespace df {
    /**
     * 数组工具，静态工具类
     */
    class ArrayUtil {
        constructor();
        /**
         * 随机打乱数组
         * @param arr
         * @returns 打乱后的数组
         */
        static random(arr: Array<any>): any[];
        static getRandomItem(arr: Array<any>): any;
        /**
         * 若arr1中存在有arr2的元素，则从arr1中剔除
         * @param arr1
         * @param arr2
         * @returns 返回剔除后的arr1
         */
        static cull(arr1: Array<any>, arr2: Array<any>): Array<any>;
        /**
         * 按对象的key,升序排序；
         * @param key
         * @param arr
         * @returns 排序后数组
         */
        static sortAscBy(key: string, arr: Array<any>): any[];
        /**
         * 按对象的key,降序排序；
         * @param key
         * @param arr
         * @returns 排序后数组
         */
        static sortDesBy(key: string, arr: Array<any>): any[];
        static includes(arr: Array<any>, item: any): boolean;
        static maxNum(arr: any): number;
    }
}
declare namespace df {
    /**
     * 连续碰撞检测，静态工具类
     *
     * 默认步进为1，根据需要可适当加大以提升性能表现；无论结果是否碰撞，双方位置都会根据速度进行改变；
     *
     * 矩形锚点在左上角，圆锚点在圆心
     */
    class CCDUtil {
        constructor();
        private static readonly RECT;
        private static readonly CIRCLE;
        /**
         * 矩形同矩形的ccd
         * @param rect1
         * @param rect2
         * @param step
         * @returns
         */
        static rect2rect(rect1: {
            x;
            y;
            width;
            height;
            speed: {
                vx;
                vy;
            };
        }, rect2: {
            x;
            y;
            width;
            height;
            speed: {
                vx;
                vy;
            };
        }, step?: number): boolean;
        private static a2b(a, b, step);
        private static getLoop(speed1, speed2, step);
        private static getStepSpeed(speed, step);
        static rect2Circle(rect: {
            x;
            y;
            width;
            height;
            speed: {
                vx;
                vy;
            };
        }, circle: {
            x;
            y;
            r;
            speed: {
                vx;
                vy;
            };
        }, step?: number): boolean;
        static circle2Circle(circle1: {
            x;
            y;
            r;
            speed: {
                vx;
                vy;
            };
        }, circle2: {
            x;
            y;
            r;
            speed: {
                vx;
                vy;
            };
        }, step?: number): boolean;
    }
}
declare namespace df {
    /**
     * 碰撞检测，静态工具类
     *
     * 提供矩形与矩形，矩形与圆，圆与圆的检测，不支持旋转
     *
     * 矩形锚点在左上角，圆锚点在圆心
     */
    class CollisionUtil {
        constructor();
        /**
         * 矩形同矩形的碰撞
         * @param rect1
         * @param rect2
         * @returns
         */
        static rect2rect(rect1: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, rect2: {
            x: number;
            y: number;
            width: number;
            height: number;
        }): boolean;
        static rect2Circle(rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        }, circle: {
            x: number;
            y: number;
            r: number;
        }): boolean;
        static circle2Circle(c1: {
            x: number;
            y: number;
            r: number;
        }, c2: {
            x: number;
            y: number;
            r: number;
        }): boolean;
    }
}
declare namespace df {
    /**
     * Get Post 请求工具.静态工具类
     */
    class HttpUtil {
        constructor();
        /**
         * 发送Post请求
         * @param url 请求url
         * @param params json对象，无参传空null
         * @param success 成功回调
         * @param fail 失败回调
         */
        static sendPostRequest(url: string, params: any, success: Function, fail: Function): void;
        /**
         *
         * @param url
         * @param params 始终传空null
         * @param success
         * @param fail
         */
        static sendGetRequest(url: string, params: any, success: Function, fail: Function): void;
        static sendDeleteRequest(url: string, params: any, success: Function, fail: Function): void;
        private static getRequest(url, params, success, fail, type);
        /**
         * 获取请求响应数据
         * @param event egret.Event
         * @returns ""或json对象
         */
        static getResponseData(event: any): any;
    }
}
declare namespace df {
    class ImgUtil {
        /**
         * @param callback (arraybuffer)=> {console.log(arraybuffer)}
         */
        static getArraybufferByUrl(src: any, callback: any): void;
    }
}
declare namespace df {
    /**
     * 数学工具，静态工具类
     */
    class MathUtil {
        constructor();
        /**
         * 角度转弧度
         * @param angle
         * @returns
         */
        static angle2radian(angle: number): number;
        /**
         * 弧度转角度
         * @param radian
         * @returns
         */
        static radian2angle(radian: number): number;
        /**
         * 源对象与目标对象的夹角
         * @param source
         * @param target
         * @returns 角度
         */
        static pointerAngle(source: {
            x: number;
            y: number;
        }, target: {
            x: number;
            y: number;
        }): number;
        /**
         * egret的指向方法
         * @param source
         * @param target
         */
        static egretToward(source: any, target: any): void;
        /**
         * cocosCreator的指向方法
         * @param source
         * @param target
         */
        static cocosToward(source: any, target: any): void;
        static dis(p1: {
            x: number;
            y: number;
        }, p2: {
            x: number;
            y: number;
        }): number;
        static equalInRange(a: number, b: number, range?: number): boolean;
        /**
         * 随机整数，取闭区间[min, max]
         * @param min
         * @param max
         * @returns
         */
        static randomInt(min: number, max: number): number;
        /**
         * 直线同圆的交点；x1,x2表直线点,x3,r表圆,锚点在圆心
         * @returns 空数组或有两个交点的数组
         */
        static getLineCircleIntersectP(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, r: any): {
            x: any;
            y: any;
        }[];
        /**
         * 直线同矩形的交点；x1,x2表直线点，x,widht表矩形,锚点在左上角；
         * @returns 空数组或有不定交点的数组
         */
        static getLineRectIntersectP(x1: any, y1: any, x2: any, y2: any, x: any, y: any, width: any, height: any): any[];
        /**
         * 直线同直线的交点；x1,x2表直线1，x3,x4表直线2；
         * @returns 一个交点对象或1(同一直线)或-1(平行直线)
         */
        static getLineLineIntersectP(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, x4: any, y4: any): 1 | -1 | {
            x: any;
            y: any;
        };
        /**
         * 点是否在矩形上；pX表点，x,width表矩形，锚点在左上角
         * @returns
         */
        static isPointInRect(pX: any, pY: any, x: any, y: any, width: any, height: any): boolean;
        /**
         * 点是否在矩形上；pX表点，x,width表矩形，锚点在左上角
         * ***非精确0.0001误差***
         * @returns
         */
        static isPointInRectSo(pX: any, pY: any, x: any, y: any, width: any, height: any): boolean;
        /**
         * 同toFixed(),但向下floor
         * @param num
         * @param fixed
         * @returns
         */
        static toFixedFloor(num: any, fixed: any): any;
    }
}
declare namespace df {
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
        static getStrByByteLen(length: any, str: any): any;
        /**
         * 反转字符串
         * @param str
         * @returns 反转后的字符串
         */
        static reverse(str: string): string;
        /**
         * 去掉字符串所有的回车换行
         * @param str
         * @returns 无回车换行的字符串
         */
        static removeEnter(str: string): string;
        /**
         * 获取url参数值
         * @param key
         * @returns
         */
        static getUrlValueByKey(key?: string): string;
        /**
         * 获取base64编码
         * @param str
         * @returns
         */
        static getBase64(str: string): string;
    }
}
declare namespace df {
    /**
     * 时间工具，静态工具类
     */
    class TimeUtil {
        constructor();
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
        static inTimeRange(start: string, end: string): boolean;
        /**
         * 时分秒(99:59:59)
         * @param time 秒
         * @returns
         */
        static hms(time: number): string;
        /**
         * 分秒(99:59)
         * @param time 秒
         * @returns
         */
        static ms(time: number): string;
    }
}
declare namespace df {
    /**
     * 其它工具类
     */
    class ToolUtil {
        constructor();
        /**防连点 */
        static CLICK(context: any, callBack: any, time?: number, param?: string): void;
    }
}
