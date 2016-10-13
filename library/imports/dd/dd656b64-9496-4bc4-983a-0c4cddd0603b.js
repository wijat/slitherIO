var _properties;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Helpers = require('Helpers');

cc.Class({
    'extends': cc.Component,

    properties: (_properties = {}, _defineProperty(_properties, '速度(像素/秒)', 50), _defineProperty(_properties, 'curExp', 0), _defineProperty(_properties, 'curLv', 0), _defineProperty(_properties, 'sectionPrefab', {
        'default': null,
        type: cc.Prefab
    }), _defineProperty(_properties, 'moveDirRot', 90), _properties),
    // use this for initialization
    onLoad: function onLoad() {
        this.index = 0;
        this.node.zIndex = 255;
        this.addTailDt = this['速度(像素/秒)'] * 0.0005;
        this.speed = this['速度(像素/秒)'];
        this.sectionPool = new cc.NodePool('sectionPool');
        this.isStop = false;

        this.initIt();
    },

    //初始化蛇的样子
    initIt: function initIt() {

        var colorAry = Helpers.getRandomColor();
        this.node.color = new cc.Color(colorAry[0], colorAry[1], colorAry[2]);

        this.runAddTailAction();
    },

    //运行不停生成尾巴的动作
    runAddTailAction: function runAddTailAction() {
        var dt = this.getAddTailDt();
        var action = cc.repeatForever(cc.sequence(cc.callFunc(function () {
            this.createSection();
        }, this), cc.delayTime(dt)));
        action.setTag(125);
        this.node.stopActionByTag(125);
        this.node.runAction(action);
    },

    //获取尾巴生成公式
    getAddTailDt: function getAddTailDt() {
        return 6 / this.speed;
    },

    //创建蛇的段
    createSection: function createSection() {

        var node;
        if (this.sectionPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.sectionPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.sectionPrefab);
        }
        node.color = this.node.color;
        node.scale = this.node.scale;
        node.rotation = this.node.rotation;
        node.x = this.node.x;
        node.y = this.node.y;
        node.parent = this.node.parent;

        var srcLen = 1;
        var dt = this.curLv * 0.2 + srcLen;
        var action = cc.sequence(cc.delayTime(dt), cc.scaleTo(dt / 2, this.node.scale - 1), cc.callFunc(function () {
            this.sectionPool.put(node);
        }, this));
        node.runAction(action);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.isStop) {
            return;
        }

        this.node.x += this.moveDirVec.x * this.speed * dt;
        this.node.y += this.moveDirVec.y * this.speed * dt;
    }
});