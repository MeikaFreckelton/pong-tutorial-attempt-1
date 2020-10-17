const canvas = document.getElementById("pong")
// canvas.style.border = "1px solid black"


const context = canvas.getContext("2d")

const user = {
    x: 0,
    y: (canvas.height/2 - 100)/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}
const com = {
    x: canvas.width - 10,
    y: (canvas.height - 100)/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

const net = {
    x: (canvas.width - 2)/2,
    y: 0,
    height: 10, 
    width: 2, 
    color: "WHITE"

}




const drawRect = (x, y, w, h, color) => {
    context.fillStyle = color
    context.fillRect(x, y, w, h)
}



function drawNet(){
    for (let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}


const drawCircle = (x, y, r, color) => {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, r, 0, Math.PI*2, true)
    context.closePath()
    context.fill()
}


canvas.addEventListener("mousemove", movePaddle)

function movePaddle (evt) {
    let rect = canvas.getBoundingClientRect()


    user.y = evt.clientY - rect.top - user.height/2

    // let computerLevel = 0.1

    // com.y += (ball.y - (com.y + com.height/2)) * computerLevel
}

const resetBall = () => {
    ball.x = canvas.width/2 
    ball.y = canvas.height/2 
    ball.speed = 7
    ball.velocityX = -ball.velocityX
}



const drawText = (text, x, y, color) => {
    context.fillStyle = color
    context.font = "45px helvetica"
    context.fillText(text, x, y)
}

// drawText("something", 300, 200, "WHITE")


function collision(b, p){
    p.top = p.y
    p.bottom = p.y + p.height
    p.left = p.x 
    p.right = p.x + p.width 

    b.top = b.y - b.radius 
    b.bottom = b.y + b.radius 
    b.right = b.x + b.radius 
    b.left = b.x - b.radius

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top
}


const update = () => {

    // change score of players if they win
    if (ball.x - ball.radius < 0){
        com.score++
        resetBall()
    } else if (ball.x + ball.radius > canvas.width){
        user.score++
        resetBall()
    }

    // update velocity
    ball.x += ball.velocityX
    ball.y += ball.velocityY

    let computerLevel = 0.1
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel

    // when ball collides with bottom and top wall we inverse the y velocity
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com

    if (collision(ball, player)){
        let collidePoint = ball.y - (player.y + player.height/2)
        collidePoint = collidePoint/(player.height/2)
        let angleRad = (Math.PI/4) * collidePoint

        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1

        ball.velocityX = direction * ball.speed * Math.cos(angleRad)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        ball.speed += 0.1
        
        
    }

    if (ball.x - ball.radius < 0 ){
        com.score++
        resetBall()
    } else if (ball.x + ball.radius > canvas.width){
        user.score++
        resetBall()
    }

}

function render(){
    // clear canvas
    drawRect(0,0, canvas.width, canvas.height, "BLACK")

    // draw text
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE")
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE")

    // draw net 
    drawNet()

    

    // paddle
    drawRect(user.x, user.y, user.width, user.height, user.color)
    drawRect(com.x, com.y, com.width, com.height, com.color)

    // circle
    drawCircle(ball.x, ball.y, ball.radius, ball.color)


}



function game() {
    update()
    render()
}

const framePerSecond = 50

setInterval(game, 1000/framePerSecond)













