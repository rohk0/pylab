import turtle

num1 = int(input("enter your first number: "))
num2 = int(input("enter your second number: "))
print (num1 + num2)
answer = input("did it add up?: ").lower()
if answer == "yes":
    print("Great! Glad it worked")
else:
    print("Oops! Looks like something went wrong")
answer2 = (input("do you what to do more?: "))
if answer2 == "yes":
    num1 = int(input("enter your first number: "))
    num2 = int(input("enter your second number: "))
    print (num1 + num2)
    answer3 = input("did it add up?: ").lower()
    if answer3 == "yes":
        print("Ok bye :)")
    else:
        print("Oops! Looks like something went wrong")
else:




   #  screen = turtle.Screen()
   #  t = turtle.Turtle()
   #  t.pensize(5)
   #  t.speed(3)
   #
   # # --- draw the colon (:)
   #
   #  t.penup()
   #  t.goto(0, 20)  # top bot
   #  t.pendown()
   #  t.circle(2)
   #
   #  t.penup()
   #  t.goto(0, -20)  # Bottom bot
   #  t.pendown()
   #  t.circle(2)
   #
   #  # --- Draw the smile parenthesis ()) ---
   #
   #  t.penup()
   #  t.goto(20, 40)    # Move to the top right of the smile
   #  t.setheading(-90)   # point downwards
   #  t.pendown()
   #
   #  # Draw a smooth arc for the parenthesis
   #  t.circle(40,90)    # curve down and left
   #
   #  screen.mainloop()
   # Set up the window
   screen = turtle.Screen()
   screen.setup(width=700, height=400)
   screen.title("Python Turtle - Ok bye :)")
   screen.bgcolor("#ffffff")

   t = turtle.Turtle()
   t.pensize(5)
   t.speed(3)
   t.color("#333333")

   # ==========================================
   # 1. DRAW "O"
   # ==========================================
   t.penup()
   t.goto(-250, -40)
   t.pendown()
   t.circle(40)

   # ==========================================
   # 2. DRAW "k"
   # ==========================================
   t.penup()
   t.goto(-150, 60)  # Start tall line
   t.pendown()
   t.goto(-150, -40)

   t.penup()
   t.goto(-110, 20)  # Top diagonal arm
   t.pendown()
   t.goto(-150, -10)

   t.penup()
   t.goto(-150, -10)  # Bottom diagonal leg
   t.pendown()
   t.goto(-110, -40)

   # ==========================================
   # 3. DRAW "b"
   # ==========================================
   t.penup()
   t.goto(-50, 60)  # Tall line
   t.pendown()
   t.goto(-50, -40)

   t.penup()
   t.goto(-50, -40)  # Loop for b
   t.setheading(0)
   t.pendown()
   t.circle(20, 360)

   # ==========================================
   # 4. DRAW "y"
   # ==========================================
   t.penup()
   t.goto(0, 0)  # Left side of v-shape
   t.pendown()
   t.goto(15, -25)

   t.penup()
   t.goto(30, 0)  # Right long tail
   t.pendown()
   t.goto(0, -50)

   # ==========================================
   # 5. DRAW "e"
   # ==========================================
   t.penup()
   t.goto(60, -20)  # Middle horizontal line
   t.setheading(0)
   t.pendown()
   t.forward(30)
   t.left(90)
   t.circle(15, 270)  # Top loop and bottom curve

   # ==========================================
   # 6. DRAW COLON ":"
   # ==========================================
   # Top dot
   t.penup()
   t.goto(130, 10)
   t.pendown()
   t.circle(2)

   # Bottom dot
   t.penup()
   t.goto(130, -20)
   t.pendown()
   t.circle(2)

   # ==========================================
   # 7. DRAW PARENTHESIS ")"
   # ==========================================
   t.penup()
   t.goto(160, 25)
   t.setheading(-70)  # Angle down for the arc
   t.pendown()
   t.circle(50, 60)  # Smooth curve for the smile

   # Hide the turtle arrow when finished
   t.hideturtle()

   # Keep window open
   screen.mainloop()
