
const canvas = document.querySelector('canvas')
var floorarray = []
const ctx = canvas.getContext('2d')
var pipeArray = []
var isstarted = false
var isgameover = false

    minvel = presets[document.getElementById('HZ-preset').innerHTML].minimum_vel
    gravity_y = presets[document.getElementById('HZ-preset').innerHTML].gravity_y
    jump_y = presets[document.getElementById('HZ-preset').innerHTML].jump_y
    change_ang = presets[document.getElementById('HZ-preset').innerHTML].change_ang
    tempo = presets[document.getElementById('HZ-preset').innerHTML].tempo
    refresh = presets[document.getElementById('HZ-preset').innerHTML].refresh


if(!localStorage.getItem('Hz-preset')){
    console.log('true')
    localStorage.setItem('Hz-preset', document.getElementById('HZ-preset').innerHTML)
}
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

function handleGMO(currentpnts){
    hit.play()
    document.getElementById('counter').style.opacity = '0%'
    var points = 0
    document.getElementById('GMO-scr').style.display = 'block'
    setTimeout(() => {
        document.getElementById('GMO-scr').style.filter = 'blur(0px) opacity(100%)'
        setTimeout(() => {
            setInterval(() => {
                if(points < currentpnts){
                    points++
                    document.getElementById('score').innerHTML = points
                }
            }, 80)
        }, 900)
    }, 100)
    isgameover = true
    if(best < currentpnts){
        best = currentpnts
        localStorage.setItem('best-score', best)
    }
    document.getElementById('BEST').innerHTML = best
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

        if(isstarted){
        if(Math.floor(this.position.y) < (canvas.height - (this.width) - 60)){
            this.velocity.y -= gravity_y
        }
        else if(!keypressed.sp.press){
            this.velocity.y = 0
        }

        this.position.y -= this.velocity.y
        if(this.angle < 90 && Math.floor(this.position.y) < (canvas.height - (this.width) - 60) && this.velocity.y < minvel){
        this.angle += change_ang}

        if(Math.floor(this.position.y) > (canvas.height - (this.width) - 60)){
            handleGMO(pointcount)
        }}

    }
}

const flappy = new jumper({
    position:{
        x: canvas.width/3,
        y: canvas.height/2.4    
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
            if(isstarted){
            wing.play()
            keypressed.sp.press = true
            flappy.velocity.y = jump_y
            flappy.angle = -20
            console.log('pressed')}
            
            else{
                execute()
            }
        }break;
    }}
    switch(key){
        case 'Escape':{
            if(document.getElementById('options').style.left === '-10px'){
                document.getElementById('options').style.left = '-300px'}
        }break;
    }

    
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

            floorarray.forEach((elem) => {
                if(elem.position.x + elem.width < -(canvas.width)){
                    if(floorarray.indexOf(elem) !== -1){
                    floorarray.splice(floorarray.indexOf(elem), 1)}

                } else if(elem.position.x + elem.width > 4 * canvas.width){
                    if(floorarray.indexOf(elem) !== -1){
                        floorarray.splice(floorarray.indexOf(elem), 1)}
                } 
            })
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
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width + 20, this.height)
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

    var high_x_pos = 0
    floorarray.forEach((elem) => {
        if(elem.position.x + elem.width > high_x_pos){
            high_x_pos = elem.position.x
        }
    })


    if(!isstarted){
    var fl = new floor({
        img:floorimg,
        position:{
            x:high_x_pos,
            y:canvas.height - 70,
        },
        height: canvas.height / 10,
        width: canvas.width
    })

    var fl_after = new floor({
        img:floorimg,
        position:{
            x:high_x_pos + canvas.width,
            y:canvas.height - 70,
        },
        height: canvas.height / 10,
        width: canvas.width
    })
}
    else{
        var fl = new floor({
            img:floorimg,
            position:{
                x:0,
                y:canvas.height - 70,
            },
            height: canvas.height / 10,
            width: canvas.width
        })  
    }

    floorarray.push(fl)
    floorarray.push(fl_after)

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
var speed

function Handlecollision(pipetop, flappy, pipebottom){
    if((pipetop.position.x) <= (canvas.width/3) + flappy.width - 5 && pipetop.position.x > flappy.position.x){

        if(flappy.position.y + 5 <= (pipetop.position.y + pipetop.height)){
                handleGMO(pointcount)
        } 
        else if(flappy.position.y + flappy.height - 1 >= (pipebottom.position.y)){ 
            handleGMO(pointcount)
        }
        else{

            if(temppipe !== pipetop){
            temppipe = pipetop
            pointcount += 1
            switch(pointcount){
                case 10: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[0]} break;
                case 20: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[1]} break;
                case 30: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[2]} break;
                case 40: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[3]} break;
                case 50: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[4]} break; 
                case 60: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[5]} break; 
                case 70: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[6]} break; 
                case 80: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[7]} break; 
                case 90: {[tempo[0], tempo[1], gravity_y] = presets[document.getElementById('HZ-preset').innerHTML].phases[8]} break; 
                case 100: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[9]} break; 
                case 110: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[10]} break; 
                case 120: {tempo = presets[document.getElementById('HZ-preset').innerHTML].phases[11]} break; 
                case 130: {[tempo[0], tempo[1], gravity_y] = presets[document.getElementById('HZ-preset').innerHTML].phases[12]} break; 
                case 140: {tempo = [tempo[0], tempo[1]] = presets[document.getElementById('HZ-preset').innerHTML].phases[13]} break; 
                case 150: {tempo = [tempo[0], tempo[1]] = presets[document.getElementById('HZ-preset').innerHTML].phases[14]} break; 
                case 160: {tempo = [tempo[0], tempo[1]] = presets[document.getElementById('HZ-preset').innerHTML].phases[15]} break; 
                case 170: {tempo = [tempo[0], tempo[1]] = presets[document.getElementById('HZ-preset').innerHTML].phases[16]} break;
            }
            point.play()
            document.getElementById('counter').innerHTML = pointcount}
        }
    }
}

function animate(){


    if(!isgameover){
    setTimeout(() => {
        window.requestAnimationFrame(animate)
    }, refresh)}

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
}

function execute(){
isstarted = true
document.getElementById('counter').style.opacity = '100%'
document.getElementById('start-scr').style.opacity = '0%'
setTimeout(() => {
    document.getElementById('start-scr').style.display = 'none'
}, 300)
function interval() {
    setTimeout(() => {
        PipeCreate()
        interval();
    }, tempo[0]);
};
interval();

}
var countrefr = 0
function floorinit() {
    var refr
    if(countrefr == 0) refr = 0
    else refr = tempo[0]
    setTimeout(() => {
        countrefr++
        FloorCreate()
        floorinit();
    }, refr);
};
floorinit();
animate()