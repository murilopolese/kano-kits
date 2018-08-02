class PixelTurtle():
    # Pixel Kit instance
    kit = None
    # Current position of Pixel [x, y]
    cursor = [8, 4]
    # Current color of Pixel
    color = [0, 255, 0]
    # Current color of Pixel heading
    headingColor = [150, 150, 0]
    # Vectors of headings [x, y]
    headings = [ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] ]
    # Index of current heading vector
    heading = 0

    # All the pixels. Accessible as `stage[y][x]`
    stage = [
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
    ]

    # Flag if the Pixel is visible
    pixelVisible = True
    # Flag if the Pixel heading is visible
    pixelHeadingVisible = True
    # Flag if Pixel movement is drawing on `stage`
    pixelPenDown = True

    def __init__(self, kit):
        self.kit = kit
        self.render()

    # Check if a position is inside the stage
    def inStage(self, x, y):
        return x > -1 and x < 16 and y > -1 and y < 8

    # Draw data on `stage` on LEDs
    def renderStage(self):
        for y, row in enumerate(self.stage):
            for x, col in enumerate(row):
                self.kit.setPixel(x, y, self.stage[y][x])

    # Draw pixel on screen (but not on stage)
    def renderPixel(self):
        if self.pixelVisible and self.inStage(self.cursor[0], self.cursor[1]):
            self.kit.setPixel(self.cursor[0], self.cursor[1], self.color)

    # Draw heading on screen (but not on stage)
    def renderPixelHeading(self):
        vector = self.headings[self.heading]
        nx = self.cursor[0]+vector[0]
        ny = self.cursor[1]+vector[1]
        if self.pixelHeadingVisible and self.inStage(nx, ny):
            self.kit.setPixel(nx, ny, self.headingColor)

    # Draw stage, pixel and heading. Pixel and heading depends on if they are or
    # not visible.
    def render(self):
        self.kit.clear()
        self.renderStage()
        self.renderPixel()
        self.renderPixelHeading()
        self.kit.render()

    # Stamp cursor on stage
    def stamp(self):
        if self.inStage(self.cursor[0], self.cursor[1]):
            self.stage[self.cursor[1]][self.cursor[0]] = self.color

    # USER APIs:
    # =======================

    # Set pixel color
    def setColor(self, ncolor=[0,255,0]):
        self.color = ncolor
        self.render()

    # Set pixel heading color
    def setHeadingColor(self, ncolor=[150,150,0]):
        self.headingColor = ncolor
        self.render()

    # Set absolute position of pixel. Origin is on top left and axis grow to right
    # and down
    def moveTo(self, x, y):
        self.cursor[0] = x
        self.cursor[1] = y
        self.stamp()
        self.render()

    # Set relative positon of pixel. Origin is on the pixel current position
    def move(self, x, y):
        self.cursor[0] = self.cursor[0] + x
        self.cursor[1] = self.cursor[1] + y
        self.stamp()
        self.render()

    # Set pixel to be visible
    def showPixel(self):
        self.pixelVisible = True
        self.renderPixel()
        self.render()

    # Set pixel to be invisible
    def hidePixel(self):
        self.pixelVisible = False
        self.renderPixel()
        self.render()

    # Set heading to be visible
    def showHeading(self):
        self.pixelHeadingVisible = True
        self.renderPixelHeading()
        self.render()

    # Set heading to be invisible
    def hideHeading(self):
        self.pixelHeadingVisible = False
        self.renderPixelHeading()
        self.render()

    # Set the pen down (movement of pixel draws on stage)
    def penDown(self):
        self.pixelPenDown = True

    # Set the pen up (movement of pixel won't draw on stage)
    def penUp(self):
        self.pixelPenDown = False

    # Move pixel forward towards heading. If pen is down, stamps position on stage
    def forward(self, n=1):
        for i in range(0, n):
            if self.pixelPenDown:
                self.stamp()
            vector = self.headings[self.heading]
            self.cursor[0] = self.cursor[0]+vector[0]
            self.cursor[1] = self.cursor[1]+vector[1]
        if self.pixelPenDown:
            self.stamp()
        self.render()

    # Move pixel backwards in the heading direction. If pen is down, stamps position on stage
    def backward(self, n=1):
        for i in range(0, n):
            if self.pixelPenDown:
                self.stamp()
            vector = self.headings[self.heading]
            self.cursor[0] = self.cursor[0]-vector[0]
            self.cursor[1] = self.cursor[1]-vector[1]
        if self.pixelPenDown:
            self.stamp()
        self.render()

    # Rotate heading left
    def left(self, n=1):
        self.heading = (self.heading - n) % len(self.headings)
        self.render()

    # Rotate heading right
    def right(self, n=1):
        self.heading = (self.heading + n) % len(self.headings)
        self.render()

    # Clear stage
    def clear(self):
        for i in range(0, 128):
            self.stage[i] = [0, 0, 0]
        self.render()

    def getX(self):
        return self.cursor[0]
    def getY(self):
        return self.cursor[1]
    def getHeading(self):
        return self.heading
