import turtle

screen = turtle.Screen()
screen.setup(width=700, height=400)
screen.title("Python Turtle - Ok bye :)")
screen.bgcolor("#ffffff")

t = turtle.Turtle()
t.pensize(5)
t.speed(0)
t.color("#333333")

# 1. DRAW "O"
t.penup()
t.goto(-250, -40)
t.pendown()
t.circle(40)

# 2. DRAW "k"
t.penup()
t.goto(-150, 60)
t.pendown()
t.goto(-150, -40)

t.penup()
t.goto(-110, 20)
t.pendown()
t.goto(-150, -10)

t.penup()
t.goto(-150, -10)
t.pendown()
t.goto(-110, -40)

# 3. DRAW "b"
t.penup()
t.goto(-50, 60)
t.pendown()
t.goto(-50, -40)

t.penup()
t.goto(-50, -40)
t.setheading(0)
t.pendown()
t.circle(20, 360)

# 4. DRAW "y"
t.penup()
t.goto(0, 0)
t.pendown()
t.goto(15, -25)

t.penup()
t.goto(30, 0)
t.pendown()
t.goto(0, -50)

# 5. DRAW "e"
t.penup()
t.goto(60, -20)
t.setheading(0)
t.pendown()
t.forward(30)
t.left(90)
t.circle(15, 270)

# 6. DRAW COLON ":"
t.penup()
t.goto(130, 10)
t.pendown()
t.circle(2)

t.penup()
t.goto(130, -20)
t.pendown()
t.circle(2)

# 7. DRAW PARENTHESIS ")"
t.penup()
t.goto(160, 25)
t.setheading(-70)
t.pendown()
t.circle(50, 60)

t.hideturtle()

# Save canvas as postscript, then convert to PNG via Pillow
canvas = screen.getcanvas()
canvas.postscript(file="_verify_output.eps", colormode='color')
print("Saved EPS")

# Try to also save as PNG using PIL if available
try:
    from PIL import Image
    img = Image.open("_verify_output.eps")
    img.save("_verify_output.png", "png")
    print("Saved PNG")
except Exception as e:
    print(f"PIL conversion failed: {e}")

screen.bye()
