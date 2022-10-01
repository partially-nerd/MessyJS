// ############ NATIVE HTML UI #############

class UiButton {
    constructor(parent_id, self_id) {
        this.parent = document.querySelector("#" + parent_id)
        this.obj = document.createElement("button")
        this.obj.id = self_id
        this.obj.classList = ["uibutton", "uiblur"]

        this.disabledObserver = new MutationObserver(function (event) {
            if (this.obj.disabled == true) {
                this.obj.classList.add("uibuttondisabled")
            }
            else {
                this.obj.classList.remove("uibuttondisabled")
            }
        })

        this.disabledObserver.observe(this.obj, {
            attributes: true,
            attributeFilter: ['disabled'],
            childList: false,
            characterData: false
        })

        this.parent.append(this.obj)
    }
}

class UiBox {
    constructor(parent_id, self_id) {
        this.parent = document.querySelector("#" + parent_id)
        this.obj = document.createElement("div")
        this.obj.id = self_id
        this.obj.visible = false
        this.obj.classList = ["uibox"]

        this.visibleObserver = new MutationObserver(function (event) {
            if (this.obj.visible == true) {
                this.obj.classList.add("uiboxvisible")
            }
            else {
                this.obj.classList.remove("uiboxvisible")
            }
        })

        this.visibleObserver.observe(this.obj, {
            attributes: true,
            attributeFilter: ['visible'],
            childList: false,
            characterData: false
        })

        this.parent.append(this.obj)
    }
}

class UiEntry {
    constructor(parent_id, self_id) {
        this.parent = document.querySelector("#" + parent_id)
        this.obj = document.createElement("input")
        this.obj.id = self_id
        this.obj.classList = ["uientry", "uiblur"]

        this.disabledObserver = new MutationObserver(function (event) {
            if (this.obj.disabled == true) {
                this.obj.classList.add("uientrydisabled")
            }
            else {
                this.obj.classList.remove("uientrydisabled")
            }
        })

        this.disabledObserver.observe(this.obj, {
            attributes: true,
            attributeFilter: ['disabled'],
            childList: false,
            characterData: false
        })

        this.parent.append(this.obj)
    }
}

// ############ NATIVE CANVAS UI #############
class CanvasRoot {
    constructor(parent_id, self_id) {
        this.parent = document.getElementById(parent_id)
        this.obj = document.createElement("canvas")
        this.obj.addEventListener("click", this.detectButtonPresses, false)
        this.obj.addEventListener("keydown", this.mapKeys, false)
        this.obj.width = window.innerWidth
        this.obj.height = window.innerHeight
        this.obj.setAttribute("tabindex", "1")

        this.obj.root = this
        this.obj.id = self_id
        this.player = null
        this.context = this.obj.getContext("2d")

        this.buttonsList = []
        this.children = []

        this.obj.classList = ["uicanvas"]
        this.parent.append(this.obj)

        // this.updateFrame = new Function('args', 'codeblock')
    }

    redrawAll() {
        this.children.forEach(child => {
            child.drawOn(this)
        })
    }

    detectButtonPresses(e) {
        var cursorX = e.clientX
        var cursorY = e.clientY
        var that = this.root

        that.buttonsList.forEach(button => {
            if ((button.posX < cursorX) &&
                (button.posX + button.lenW > cursorX) &&
                (button.posY < cursorY) &&
                (button.posY + button.lenH > cursorY)
            ) {
                button.onclick(e)
            }
        })
    }

    mapKeys(e) {
        if (e.key in this.root.player.keyBinds) {
            this.root.player.keyBinds[e.key]()
        }
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.obj.width, this.obj.height)
    }
}

class CanvasButton {
    constructor(canvas, x, y) {
        this.posX = x
        this.posY = y
        this.lenW = 40
        this.lenH = 40
        this.bg = "#1a1a1a"

        canvas.buttonsList.push(this)
        canvas.children.push(this)
        this.drawOn(canvas)
    }

    drawOn(canvas) {
        canvas.context.fillStyle = this.bg
        this.obj = canvas.context.fillRect(this.posX, this.posY, this.lenW, this.lenH)
    }

    collidesWith(rect) {
        collides = false
        if (
            this.posX <= rect.posX + rect.lenW &&
            this.posX + this.lenW >= rect.posX &&
            this.posY <= rect.posY + rect.lenH &&
            this.posY + this.lenH >= rect.posY
        ) {
            collides = true
        }
        return collides
    }

    isOffScreen(canvas) {
        if (this.posX - this.lenW < 0) {
            return "left"
        }
        else if (this.posY - this.lenH < 0) {
            return "top"
        }
        else if (this.posY + this.lenH > canvas.obj.height) {
            return "bottom"
        }
        else if (this.posX + this.lenW > canvas.obj.width) {
            return "right"
        }
    }

}

class CanvasBox {
    constructor(canvas, x, y, w, h, bg) {
        this.posX = x
        this.posY = y
        this.lenW = w
        this.lenH = h
        this.bg = bg

        this.drawOn(canvas)
        canvas.children.push(this)
    }

    collidesWith(rect) {
        collides = false
        if (
            this.posX <= rect.posX + rect.lenW &&
            this.posX + this.lenW >= rect.posX &&
            this.posY <= rect.posY + rect.lenH &&
            this.posY + this.lenH >= rect.posY
        ) {
            collides = true
        }
        return collides
    }

    isOffScreen(canvas) {
        if (this.posX - this.lenW < 0) {
            return "left"
        }
        else if (this.posY - this.lenH < 0) {
            return "top"
        }
        else if (this.posY + this.lenH > canvas.obj.height) {
            return "bottom"
        }
        else if (this.posX + this.lenW > canvas.obj.width) {
            return "right"
        }
    }

    drawOn(canvas) {
        canvas.context.fillStyle = this.bg
        this.obj = canvas.context.fillRect(this.posX, this.posY, this.lenW, this.lenH)
    }
}

class CanvasText {
    constructor(canvas, text, x, y) {
        this.posX = x
        this.posY = y
        this.text = text

        this.drawOn(canvas)
        canvas.children.push(this)
    }

    drawOn(canvas) {
        canvas.context.font = "20px Comic Sans MS"
        canvas.context.fillStyle = "#efefef"
        this.obj = canvas.context.fillText(this.text, this.posX, this.posY)
    }
}

class CanvasPlayer {
    constructor(canvas, x, y) {
        this.posX = x
        this.posY = y
        this.lenW = 40
        this.lenH = 80
        this.bg = "#0e0e0e"
        canvas.player = this
        canvas.children.push(this)

        this.verticalShiftSpeed = 10
        this.horizontalShiftSpeed = 10

        this.keyBinds = {
            "ArrowUp": () => { this.move("up", this.verticalShiftSpeed) },
            "ArrowDown": () => { this.move("down", this.verticalShiftSpeed) },
            "ArrowLeft": () => { this.move("left", this.horizontalShiftSpeed) },
            "ArrowRight": () => { this.move("right", this.horizontalShiftSpeed) },
        }

        this.drawOn(canvas)
    }

    move(direction, velocity) {
        console.log(direction, velocity)
        switch (direction) {
            case "up":
                this.posY -= velocity
                break

            case "down":
                this.posY += velocity
                break

            case "left":
                this.posX -= velocity
                break

            case "right":
                this.posX += velocity
                break

            default:
                break
        }
    }

    isOffScreen(canvas) {
        if (this.posX - this.lenW < 0) {
            return "left"
        }
        else if (this.posY - this.lenH < 0) {
            return "top"
        }
        else if (this.posY + this.lenH > canvas.obj.height) {
            return "bottom"
        }
        else if (this.posX + this.lenW > canvas.obj.width) {
            return "right"
        }
    }

    collidesWith(rect) {
        collides = false
        if (
            this.posX <= rect.posX + rect.lenW &&
            this.posX + this.lenW >= rect.posX &&
            this.posY <= rect.posY + rect.lenH &&
            this.posY + this.lenH >= rect.posY
        ) {
            collides = true
        }
        return collides
    }

    drawOn(canvas) {
        canvas.context.fillStyle = this.bg
        this.obj = canvas.context.fillRect(this.posX, this.posY, this.lenW, this.lenH)
    }
}

class CanvasBall {
    constructor(canvas, x, y, bg) {
        this.posX = x
        this.posY = y
        this.lenR = 20
        this.bg = bg

        this.drawOn(canvas)
        canvas.children.push(this)
    }

    collidesWith(rect) {
        if (
            this.posX <= rect.posX + rect.lenW &&
            this.posX + this.lenR >= rect.posX &&
            this.posY <= rect.posY + rect.lenH &&
            this.posY + this.lenR >= rect.posY
        ) {
            return true
        }
        return false
    }

    isOffScreen(canvas) {
        if (this.posX - this.lenR < 0) {
            return "left"
        }
        else if (this.posY - this.lenR < 0) {
            return "top"
        }
        else if (this.posY + this.lenR > canvas.obj.height) {
            return "bottom"
        }
        else if (this.posX + this.lenR > canvas.obj.width) {
            return "right"
        }
    }

    drawOn(canvas) {
        canvas.context.beginPath()
        canvas.context.fillStyle = this.bg
        this.obj = canvas.context.arc(this.posX, this.posY, this.lenR, 0, 2 * Math.PI)
        canvas.context.fill()
    }
}