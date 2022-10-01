const canvas = new CanvasRoot("root", "canvas")
const player = new CanvasPlayer(canvas, 0, 0)
const ai = new CanvasBox(canvas, 0, 10, 20, 200, "#5a66f2")
const ball = new CanvasBall(canvas, 50, 50, "#efefef");
const score = new CanvasText(canvas, "0" ,canvas.obj.width - 40, 40);

start_pos = () => {
    canvas.clearScreen()
    canvas.obj.style.background = "linear-gradient(to right, #15162b, #2b1517)"

    player.lenH = 200
    player.lenW = 20
    player.verticalShiftSpeed = 40
    player.posX = canvas.obj.width - player.lenW
    player.posY = (canvas.obj.height - player.lenH) / 2
    player.bg = "#f56042"

    delete player.keyBinds.ArrowLeft
    delete player.keyBinds.ArrowRight

    ball.verticalShiftSpeed = 4
    ball.horizontalShiftSpeed = 5

    ai.posY = (canvas.obj.height - ai.lenH) / 2

    canvas.redrawAll()
}

update_frame = () => {
    canvas.clearScreen()

    ai.posY = ball.posY - ai.lenH / 2

    ballOffScreen = ball.isOffScreen(canvas)
    if (ballOffScreen != undefined) {
        switch (ballOffScreen) {
            case "left":
            case "right":
                alert("Game Over")
                break;

            case "top":
            case "bottom":
                ball.verticalShiftSpeed *= -1
                break;

            default:
                break;
        }
    }
    else {
        if (ball.collidesWith(player) == true ||
            ball.collidesWith(ai) == true
        ) {
            ball.horizontalShiftSpeed *= -1
            score.text = String(Number(score.text) + 1)
        }
    }

    ball.posY += ball.verticalShiftSpeed
    ball.posX += ball.horizontalShiftSpeed

    canvas.redrawAll()
}

setInterval(() => {
    update_frame()
}, 10);
start_pos()