const ready = require('./ready');
const info = require('./info');
const app = require('./app');
const particle = require('./particle');

const scenes = [];
const scene = {};
let  ticker, tickerfn;
function scene1(textures){
    //create container
    scenes[0] = new PIXI.Container();
    var bgcolor = new PIXI.Graphics();
    bgcolor.clear();
    bgcolor.beginFill(0xa5babc,1);
    bgcolor.drawRect(0,0,app.view.width, app.view.height);
    bgcolor.endFill();

    //create title-roles and animate
    var titleroles = new PIXI.Sprite(textures['title-roles']);
    titleroles.anchor.x = titleroles.anchor.y = .5;
    titleroles.x = info.winw/2;
    titleroles.y = info.winh*.3;

    //create building
    var building = new PIXI.Sprite(textures['hk-building']);
    building.anchor.x = .5;
    building.anchor.y = 1;
    building.x = info.winw/2;
    building.y = info.winh;
    if(info.winw > 1000){
        building.width = info.winw;
        building.height = info.winw*.2;
    }

    //create title
    var title = new PIXI.Sprite(textures['title']);
    title.anchor.x = title.anchor.y = .5;
    title.x = info.winw/2;
    title.y = info.winh*.3;

    //create btn
    var btn = new PIXI.Sprite(textures['start-btn']);
    btn.anchor.x = btn.anchor.y = .5;
    btn.x = info.winw/2;
    btn.y = info.winh/1.8;
    btn.interactive = true;
    scene.button = btn;

    //make responsive
    if(info.winw < 768){
        title.width = 200;
        title.height = title.width*.65;
        titleroles.width = 360;
        titleroles.height = titleroles.width * .795;
        btn.width = 150;
        btn.height = btn.width * .22;
    }
    scenes[0].addChild(bgcolor,titleroles,building,title,btn);
    return scenes[0];
}

function scene2(textures){
    scenes[1] = new PIXI.Container();

    var bgimg = new PIXI.Sprite(textures['background']),
        icon = new PIXI.Sprite(textures['score']),
        score = new PIXI.Text(info.score, {
            fontFamily: 'microsoft yahei',
            fontSize: 20,
            fill: ['#ffffff', '#ffcd24'],
            stroke: '#ff7e09',
            strokeThickness: 1,
            dropShadow: true,
            dropShadowColor: '#782510',
            dropShadowDistance: 1,
            dropShadowBlur: 2
        }),
        best = new PIXI.Text(info.scoreTxt + info.best,{
            fontFamily: 'microsoft yahei',
            fontSize: 10,
            fill: ['#ffe108'],
            stroke: '#8a4805',
            strokeThickness: 1
        }),
        life = new PIXI.Text(info.lifeTxt + info.life,{
            fontFamily: 'microsoft yahei',
            fontSize: 20,
            fontWeight: 'bold',
            fill: ['#fafff3'],
            stroke: '#2c2d2b',
            strokeThickness: 1,
            dropShadow: true,
            dropShadowColor: '#232323',
            dropShadowDistance: 1,
            dropShadowBlur: 2
        });
    bgimg.width = info.winw;
    bgimg.height = info.winh;
    icon.x = icon.y = 10;
    score.y = icon.y;
    score.x = icon.x + icon.width+5;
    best.y = icon.y + icon.height+5;
    best.x = 5;
    life.x = info.winw - life.width - 5;
    life.y = 10;

    info.update = function(str){
        var strs = str.split(/\s+/),
            len = strs.length,
            i = 0;
        if(!str){
            strs = ['score','best','life'];
        }
        for(; i<len; i++){
            switch (str){
                case 'score': score.text = info.score; break;
                case 'best': best.text = info.scoreTxt + info.best; break;
                case 'life': life.text = info.lifeTxt + info.life; break;
            }
        }
        str = null;
    };
    scenes[1].addChild(bgimg,icon, score, best, life);
    return scenes[1];
}

function createParticle(){
    ticker = app.timer(dop);
    var time = 0;
    function dop(){
        time += ticker.elapsedMS;
        if(time > Math.random()*500+500){
            particle.create(Math.random()*info.winw, Math.random()*info.winh, 12, 0xff00f0);
            particle.create(Math.random()*info.winw, Math.random()*info.winh, 12, 0xffff00);
            particle.create(Math.random()*info.winw, Math.random()*info.winh, 12, 0xff0000);
            time = 0;
        }
    }
    tickerfn = dop;
    ticker.start();
}
function destroyParticle(){
    app.clearTimer(ticker, tickerfn);
}

scene.create = function (id) {
    if(id == 0){
        return scene1(ready.source.texture);
    }else if(id == 1){
        return scene2(ready.source.texture);
    }
};
scene.destroy = function(id){
    if(typeof id === 'number'){
        scenes[id].destroy();
    }else{
        scenes[0].destroy();
        scenes[1].destroy();
    }
};

scene.showParticle = createParticle;
scene.hideParticle = destroyParticle;
module.exports = scene;