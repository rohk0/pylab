import turtle

num1 = int(input("enter your first number: "))
num2 = int(input("enter your second number: "))
print(num1 + num2)
answer = input("did it add up?: ").lower()
if answer == "yes":
    print("Great! Glad it worked")
else:
    print("Oops! Looks like something went wrong")

answer2 = input("do you what to do more?: ").lower()
if answer2 == "yes":
    num1 = int(input("enter your first number: "))
    num2 = int(input("enter your second number: "))
    print(num1 + num2)
    answer3 = input("did it add up?: ").lower()
    if answer3 == "yes":
        print("Ok bye :)")
    else:
        print("Oops! Looks like something went wrong")
else:
    # Set up the window
    screen = turtle.Screen()
    screen.setup(width=700, height=400)
    screen.title("Python Turtle - Ok bye :)")
    screen.bgcolor("#ffffff")

    t = turtle.Turtle()
    t.pensize(5)
    t.speed(3)
    t.color("#333333")

    # 1. DRAW "O"
    t.penup()
    t.goto(-250, -40)
    t.pendown()
    t.circle(40)

    # 2. DRAW "k"
    t.penup()
    t.goto(-150, 60)        # tall stem
    t.pendown()
    t.goto(-150, -40)

    t.penup()
    t.goto(-110, 20)        # upper diagonal arm
    t.pendown()
    t.goto(-150, -10)

    t.penup()
    t.goto(-150, -10)       # lower diagonal leg
    t.pendown()
    t.goto(-110, -40)

    # 3. DRAW "b"  (loop on the RIGHT of the stem)
    t.penup()
    t.goto(-50, 60)         # tall stem
    t.pendown()
    t.goto(-50, -40)

    t.penup()
    t.goto(-50, -40)        # bowl
    t.setheading(-90)
    t.pendown()
    t.circle(20)

    # 4. DRAW "y"  (both strokes meet at the same point)
    t.penup()
    t.goto(0, 0)
    t.pendown()
    t.goto(15, -25)

    t.penup()
    t.goto(30, 0)
    t.pendown()
    t.goto(15, -25)
    t.goto(0, -50)          # tail descends below baseline

    # 5. DRAW "e"
    t.penup()
    t.goto(60, -20)         # crossbar
    t.setheading(0)
    t.pendown()
    t.forward(30)
    t.left(90)
    t.circle(15, 270)

    # 6. DRAW COLON ":"  (use dot() so the dots are actually visible)
    t.penup()
    t.goto(130, 10)
    t.dot(8)

    t.penup()
    t.goto(130, -20)
    t.dot(8)

    # 7. DRAW PARENTHESIS ")"  (wider arc for a real smile)
    t.penup()
    t.goto(160, 30)
    t.setheading(-60)
    t.pendown()
    t.circle(50, 120)

    t.hideturtle()
    screen.mainloop()
