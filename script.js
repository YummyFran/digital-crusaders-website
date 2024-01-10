const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const maxSquares = 8

let squares = []
let light = {
    x: window.innerWidth/2,
    y: window.innerHeight/2
};

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    squares.forEach(box => {
        box.rotate()
        box.drawShadow(light)
    });

    squares.forEach(box => {
        box.draw()
    })

    requestAnimationFrame(animate)
}

function init() {
    resize()
    while (squares.length < maxSquares) {
        squares.push(new Box())
    }
    animate()
}

window.addEventListener('resize', resize)

window.addEventListener('mousemove', e => {
    light.x = e.offsetX === undefined ? e.layerX : e.offsetX
    light.y = e.offsetY === undefined ? e.layerY : e.offsetY
})

class Box {
    constructor() {
        this.half_size = Math.floor((Math.random() * Math.floor(canvas.width * 0.04)) + Math.floor(canvas.width * 0.02))
        this.x = Math.floor((Math.random() * canvas.width) + 1)
        this.y = Math.floor((Math.random() * canvas.height) + 1)
        this.velocityX = (Math.random() * 4) - 2
        this.velocityY = (Math.random() * 4) - 2
        this.rotation = Math.random() * Math.PI
        this.shadow_length = 2000
        this.colors = ["#5C469C", "#D4ADFC"]
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    }

    getDots() {
        const full = (Math.PI * 2) / 4
        const { x, y, rotation, half_size } = this

        const calculateDot = (offset) => ({
            x: x + half_size * Math.sin(rotation + full * offset),
            y: y + half_size * Math.cos(rotation + full * offset)
        });

        return {
            p1: calculateDot(0),
            p2: calculateDot(1),
            p3: calculateDot(2),
            p4: calculateDot(3)
        };
    }

    rotate() {
        const speed = (60 - this.half_size) / 20
        this.rotation += speed * 0.002
        this.x += this.velocityX
        this.y += this.velocityY
    }

    draw() {
        const dots = this.getDots()

        ctx.beginPath();
        ctx.moveTo(dots.p1.x, dots.p1.y)
        ctx.lineTo(dots.p2.x, dots.p2.y)
        ctx.lineTo(dots.p3.x, dots.p3.y)
        ctx.lineTo(dots.p4.x, dots.p4.y)
        ctx.fillStyle = this.color
        ctx.fill()

        if (this.y - this.half_size > canvas.height) {
            this.y -= canvas.height + this.half_size * 2
        }
        if(this.y + this.half_size < 0) {
            this.y += canvas.height + this.half_size * 2
        }
        if (this.x - this.half_size > canvas.width) {
            this.x -= canvas.width; + this.half_size * 2
        }
        if(this.x + this.half_size < 0) {
            this.x += canvas.width + this.half_size * 2
        }
    }

    drawShadow(light) {
        const dots = this.getDots()
        const points = Object.values(dots).map(dot => {
            const angle = Math.atan2(light.y - dot.y, light.x - dot.x)
            const endX = dot.x + this.shadow_length * Math.sin(-angle - Math.PI / 2)
            const endY = dot.y + this.shadow_length * Math.cos(-angle - Math.PI / 2)
            return {
                endX,
                endY,
                startX: dot.x,
                startY: dot.y
            };
        });

        ctx.fillStyle = "#161d61cc";
        for (let i = points.length - 1; i >= 0; i--) {
            const n = i === 3 ? 0 : i + 1
            ctx.beginPath();
            ctx.moveTo(points[i].startX, points[i].startY)
            ctx.lineTo(points[n].startX, points[n].startY)
            ctx.lineTo(points[n].endX, points[n].endY)
            ctx.lineTo(points[i].endX, points[i].endY)
            ctx.fill();
        }
    }
}

init()

document.addEventListener('DOMContentLoaded', function() {
    const devlink = document.querySelectorAll('.devlink');
    const dev = document.querySelectorAll('.dev');
    
    devlink.forEach((link, i) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            dev.forEach((div, j) => {
                if(i == j) {
                    div.style.display = "block"
                } else {
                    div.style.display = "none"
                }
            })
        });
    });
})