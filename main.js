const canvas = document.querySelector('canvas')
var floorarray = []
const ctx = canvas.getContext('2d')
var tempo = [2000, 5]
var pipeArray = []
var isgameover = false
var pipe = {
    position: {
        x: canvas.width,
        y: canvas.height
    },

    width: 64,
    height: 512
}
const Backimg = new Image()
Backimg.src = './Addons/flappybirdbg.png'
const floorimg = new Image()
floorimg.src = './Addons/flappybirdbg_floor.png'

//Backimg.onload
var best

try{
    best = localStorage.getItem('best-score')
}catch(e){
    best = 0
    localStorage.setItem('best-score', best)
}

var gravity_y = 1

function drawImage(img,x,y,width,height,deg){
    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save()

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    // Restore canvas state as saved from above
    ctx.restore();
}

class jumper{
    constructor({position, velocity, width, height, angle, imgsrc}){
        this.position = {
            x: position.x,
            y: position.y
        },

        this.velocity = {
            x: velocity.x,
            y: velocity.y,
        },

        this.width = width,
        this.height = height,
        this.angle = angle,
        this.image = new Image()
        this.image.src = imgsrc
    }

    draw(){

        //ctx.fillStyle = 'lightgray'
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        //ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        drawImage(this.image, this.position.x, this.position.y, this.width, this.height, this.angle)
    }

    update(){
        this.draw()
        if(Math.floor(this.position.y) < (canvas.height - (this.width) - 60)){
            this.velocity.y -= gravity_y
        }
        else if(!keypressed.sp.press){
            this.velocity.y = 0
        }

        this.position.y -= this.velocity.y
        if(this.angle < 90 && Math.floor(this.position.y) < (canvas.height - (this.width) - 60) && this.velocity.y < 5){
        this.angle += 3}

        if(Math.floor(this.position.y) > (canvas.height - (this.width) - 60)){
            isgameover = true
            document.getElementById('GMO-scr').style.display = 'block'
            setTimeout(() => {
                document.getElementById('GMO-scr').style.filter = 'blur(0px) opacity(100%)'
            }, 100)
        }

    }
}

const flappy = new jumper({
    position:{
        x: canvas.width/2.3,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0,
    },
    width: 60,
    height: 40,
    angle: 0,
    imgsrc: './Addons/flappybird.png'
})


var keypressed = {
    sp:{
        press:false
    },
}

window.addEventListener('keydown', (event) => {
    if(!isgameover){
        if(event.key.length === 1){
        key = event.key.toLowerCase()}
        else{
            key = event.key
        }

    //console.log(event)

    switch(key){
        case " ": {
            keypressed.sp.press = true
            flappy.velocity.y = 15
            flappy.angle = -40
            console.log('pressed')
        }break;
    }}

    
})

window.addEventListener('keyup', (event) => {
    if(!isgameover){
    if(event.key.length === 1){
    key = event.key.toLowerCase()}
    else{
        key = event.key
    }

//console.log(event)

switch(key){
    case " ": {
        keypressed.sp.press = false
    }break;
}}


})

class floor{
    constructor({position, img, width, height}){
        this.position = {
            x: position.x,
            y: position.y
        },
        this.image = img,
        this.width = width,
        this.height = height
    }
    draw(){
        drawImage(this.image, this.position.x, this.position.y, this.width, this.height, 0)
    }
    update(){
        this.draw()

        this.position.x -= tempo[1]
        if(this.position.x + this.width < (-this.width)){
            for(let i = 0; i < floorarray.length; i++){
                if(floorarray[i] === this){
                    floorarray.splice(i, 1)
                }
            }
        }
    }
}

class TopPipe{
    constructor({position, img, passed, width, height}){
        this.position = {
            x: position.x,
            y: position.y
        },
        this.image = img
        this.passed = passed,
        this.width = width,
        this.height = height
    }

    draw(){
        //ctx.fillStyle = 'green'
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()

        this.position.x -= tempo[1]

        if(this.position.x < (-this.width)){
            for(let i = 0; i < pipeArray.length; i++){
                if(pipeArray[i] === this){
                    pipeArray.splice(i, 1)
                }
            }
        }
    }
}

function FloorCreate(isstarted){
    if(!isstarted){
    var fl = new floor({
        img:floorimg,
        position:{
            x:canvas.width,
            y:canvas.height - 70,
        },
        height: canvas.height / 10,
        width: canvas.width
    })}
    else{
        var fl = new floor({
            img:floorimg,
            position:{
                x:canvas.width,
                y:canvas.height - 70,
            },
            height: canvas.height / 10,
            width: canvas.width
        })  
    }

    floorarray.push(fl)

}

function PipeCreate(){

    var randheightTop = -(Math.random() * (430 - 60) + 60);

    var toppipe = new TopPipe( {
        img: topPipeimg,
        position: {
            x: canvas.width,
            y: randheightTop
        },
        passed: false,
        width: 64,
        height: 512
    })

    var bottompipe = new TopPipe( {
        img: bottomPipeimg,
        position: {
            x: canvas.width,
            y: randheightTop + 650
        },
        passed: false,
        width: 64,
        height: 512
    })

    pipeArray.push([toppipe, bottompipe])
}

var topPipeimg = new Image()
topPipeimg.src = "./Addons/toppipe.png"

var bottomPipeimg = new Image()
bottomPipeimg.src = "./Addons/bottompipe.png"

var temppipe
var pointcount = 0
function Handlecollision(pipetop, flappy, pipebottom){
    if((pipetop.position.x) <= (canvas.width/2.3) + flappy.width - 5 && pipetop.position.x > flappy.position.x){

        if(flappy.position.y + 5 <= (pipetop.position.y + pipetop.height)){
                document.getElementById('GMO-scr').style.display = 'block'
                setTimeout(() => {
                    document.getElementById('GMO-scr').style.filter = 'blur(0px) opacity(100%)'
                }, 100)
                isgameover = true
            console.log('COLLISIONTOP', pipetop.position.y - pipetop.height, -flappy.position.y)
            if(best < pointcount){
                best = pointcount
                localStorage.setItem('best-score', best)
            }
            document.getElementById('BEST').innerHTML = best
            document.getElementById('score').innerHTML = pointcount
        } 
        else if(flappy.position.y + flappy.height - 1 >= (pipebottom.position.y)){ 
            document.getElementById('GMO-scr').style.display = 'block'
            setTimeout(() => {
                document.getElementById('GMO-scr').style.filter = 'blur(0px) opacity(100%)'
            }, 100)
            isgameover = true
            console.log('COLLISIONBOTTOM', pipebottom.position.y - pipebottom.height, -flappy.position.y)
            if(best < pointcount){
                best = pointcount
                localStorage.setItem('best-score', best)
            }
            document.getElementById('BEST').innerHTML = best
            document.getElementById('score').innerHTML = pointcount
        }
        else{

            if(temppipe !== pipetop){
            temppipe = pipetop
            pointcount += 1

            switch(pointcount){
                case 10: {tempo[0] = 1600; tempo[1] = 6} break;
                case 20: {tempo[0] = 1500; tempo[1] =  7;} break;
                case 30: {tempo[0] = 1400; tempo[1] =  8;} break;
                case 40: {tempo[0] = 1300; tempo[1] =  9;} break;
                case 50: {tempo[0] = 1200; tempo[1] = 10;} break; 
                case 60: {tempo[0] = 1100; tempo[1] = 11;} break; 
                case 70: {tempo[0] = 1000; tempo[1] = 12;} break; 
                case 80: {tempo[0] = 900; tempo[1] = 13;} break; 
                case 90: {tempo[0] = 800; tempo[1] = 14; gravity_y = 1.5} break; 
                case 100: {tempo[0] = 700; tempo[1] = 15;} break; 
                case 110: {tempo[0] = 600; tempo[1] = 16;} break; 
                case 120: {tempo[0] = 500; tempo[1] = 17;} break; 
                case 130: {tempo[0] = 400; tempo[1] = 18; gravity_y = 2} break; 
                case 140: {tempo[0] = 400; tempo[1] = 19;} break; 
                case 150: {tempo[0] = 400; tempo[1] = 20;} break; 
                case 160: {tempo[0] = 400; tempo[1] = 21;} break; 
                case 170: {tempo[0] = 400; tempo[1] = 22;} break;
            }
            document.getElementById('counter').innerHTML = pointcount}
        }
    }
}

function animate(){


    if(!isgameover){
    setTimeout(() => {
        window.requestAnimationFrame(animate)
    }, 20)}

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgb(139, 207, 234)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(Backimg, 0, 0, canvas.width, canvas.height)
    flappy.update()

    pipeArray.forEach((elem) => {
        elem[0].update()
        elem[1].update()
        Handlecollision(elem[0], flappy, elem[1])
    })

    floorarray.forEach((elem) => {
        elem.update()
    })
    console.log(floorarray.length)
}

FloorCreate(true)


function interval() {
    setTimeout(() => {
        PipeCreate()
        FloorCreate()
        interval();
    }, tempo[0]);
};
interval();

animate()
