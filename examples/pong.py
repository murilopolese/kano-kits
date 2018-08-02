from kano.PixelKit import PixelKit
from kano.PixelTurtle import PixelTurtle
from time import sleep
from random import randint as random

kit = PixelKit('/dev/ttyUSB0')

t = 0
ballPosition = [7, 4]
ballDirection = [1, 1]
padPosition = 2
padSize = 2
gameOver = False
level = 12
score = 0

def reset(button=False):
    global t
    global ballPosition
    global ballDirection
    global padPosition
    global gameOver
    global level
    global score
    t = 0
    ballPosition = [7, 4]
    ballDirection = [1, 1]
    padPosition = 2
    gameOver = False
    level = 12
    score = 0

def renderBall():
    kit.setPixel(ballPosition[0], ballPosition[1], [200, 200, 200])

def renderLeftPad():
    for i in range(0, padSize):
        kit.setPixel(0, int(padPosition + i), [0, 0, 200])

def renderRightPad():
    for i in range(0, padSize):
        kit.setPixel(15, int(padPosition + i), [0, 200, 0])

def renderFrame():
    renderBall()
    renderLeftPad()
    renderRightPad()

def hitPad():
    return ballPosition[1] >= int(padPosition) and ballPosition[1] <= int(padPosition)+(padSize-1)

def updateBall():
    global gameOver
    global level
    global score
    newPosition = [
        ballPosition[0] + ballDirection[0],
        ballPosition[1] + ballDirection[1]
    ];
    if newPosition[1] > 7 or newPosition[1] < 0:
        ballDirection[1] = ballDirection[1] * -1
    if newPosition[0] == 15 or newPosition[0] == 0:
        if hitPad():
            ballDirection[0] = ballDirection[0] * -1
            level = level - 0.5
            if level < 3:
                level = 3
            score = score + 1
        else:
            gameOver = True
    ballPosition[0] = ballPosition[0] + ballDirection[0]
    ballPosition[1] = ballPosition[1] + ballDirection[1]

def onJoystickUp():
    global padPosition
    if padPosition > 0:
        padPosition = padPosition - 0.2

def onJoystickDown():
    global padPosition
    if padPosition < 5:
        padPosition = padPosition + 0.2

def onDial(value):
    global padPosition
    dialPosition = int((value/5)*7)
    # dialPosition = int((value/4095)*7)
    if dialPosition >= 0 and dialPosition <= 7-(padSize-1):
        padPosition = dialPosition

def nothing():
    pass

kit.onJoystickUp = onJoystickUp
kit.onJoystickDown = onJoystickDown
kit.onJoystickLeft = nothing
kit.onJoystickRight = nothing
kit.onButton = reset
kit.onButtonA = reset
kit.onButtonB = reset
kit.onDial = nothing
# kit.onDial = onDial

def loop():
    global t
    t = t + 1
    # kit.checkControls()
    if not gameOver:
        if t % int(level) == 0:
            updateBall()
        kit.clear()
        renderFrame()
        kit.render()
    else:
        kit.setBackground([200, 200, 0])
        for i in range(0, score):
            kit.setPixel(i%16, int(i/16), [200, 0, 0])
        kit.render();

def start():
    reset()
    while True:
        loop()
        sleep(0.1)
