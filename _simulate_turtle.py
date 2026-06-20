"""Simulate the turtle drawing using Pillow to produce a viewable PNG."""
from PIL import Image, ImageDraw
import math

W, H = 700, 400
img = Image.new("RGB", (W, H), "white")
draw = ImageDraw.Draw(img)

def to_img(x, y):
    return (x + W / 2, H / 2 - y)

PEN = "#333333"
PEN_W = 5

def line(p1, p2):
    draw.line([to_img(*p1), to_img(*p2)], fill=PEN, width=PEN_W)

class T:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self.heading = 0.0
        self.down = True
    def penup(self):
        self.down = False
    def pendown(self):
        self.down = True
    def goto(self, x, y):
        if self.down:
            line((self.x, self.y), (x, y))
        self.x, self.y = x, y
    def setheading(self, deg):
        self.heading = deg
    def forward(self, dist):
        rad = math.radians(self.heading)
        nx = self.x + dist * math.cos(rad)
        ny = self.y + dist * math.sin(rad)
        self.goto(nx, ny)
    def left(self, deg):
        self.heading += deg
    def right(self, deg):
        self.heading -= deg
    def dot(self, size):
        ix, iy = to_img(self.x, self.y)
        r = size / 2
        draw.ellipse([ix - r, iy - r, ix + r, iy + r], fill=PEN)
    def circle(self, r, extent=360):
        cx = self.x + r * math.cos(math.radians(self.heading + 90))
        cy = self.y + r * math.sin(math.radians(self.heading + 90))
        start_angle = math.degrees(math.atan2(self.y - cy, self.x - cx))
        steps = max(8, int(abs(extent) / 3))
        prev = (self.x, self.y)
        for i in range(1, steps + 1):
            a = start_angle + extent * i / steps
            nx = cx + abs(r) * math.cos(math.radians(a))
            ny = cy + abs(r) * math.sin(math.radians(a))
            if self.down:
                line(prev, (nx, ny))
            prev = (nx, ny)
        self.x, self.y = prev
        self.heading += extent

t = T()

# O
t.penup(); t.goto(-250, -40); t.pendown(); t.circle(40)

# k
t.penup(); t.goto(-150, 60); t.pendown(); t.goto(-150, -40)
t.penup(); t.goto(-110, 20); t.pendown(); t.goto(-150, -10)
t.penup(); t.goto(-150, -10); t.pendown(); t.goto(-110, -40)

# b
t.penup(); t.goto(-50, 60); t.pendown(); t.goto(-50, -40)
t.penup(); t.goto(-50, -40); t.setheading(-90); t.pendown(); t.circle(20)

# y
t.penup(); t.goto(0, 0); t.pendown(); t.goto(15, -25)
t.penup(); t.goto(30, 0); t.pendown(); t.goto(15, -25); t.goto(0, -50)

# e
t.penup(); t.goto(60, -20); t.setheading(0); t.pendown()
t.forward(30); t.left(90); t.circle(15, 270)

# :
t.penup(); t.goto(130, 10); t.dot(8)
t.penup(); t.goto(130, -20); t.dot(8)

# )
t.penup(); t.goto(160, 30); t.setheading(-60); t.pendown(); t.circle(50, 120)

img.save("_simulated_drawing.png")
print("Saved _simulated_drawing.png")
