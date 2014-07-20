### mandelbrot ###

z = 0, c = pick
loop z = z^2 + c until 1000 count or |z| > 2

### julia ###

z = pick, c = some constant
loop z = z^2 + c until 1000 count or |z| > 2

### mountain ###

triangle(a, b, c)
d = (a+b)/2 + random_y
e = (b+c)/2 + random_y
f = (c+a)/2 + random_y
triangle(a, d, f)
triangle(b, d, e)
triangle(c, f, e)

### plant ###

0->1[0]1[0]0
1->11
[->[
]->]

1:bare, leaft:0, [: 45deg ccw/cw

### hodgepodge ###

k1:2, k2:3, g:1-20

a = 1 + count(neighbor(i,j) < N) (or count(0 < neighbor(i,j) < N)
b = count(neightbor(i, j) == N)
s = sum(value(i,j), value(neighbor(i,j)))
value(i,j) == 0 -> a/k1 + b/k2
value(i,j) == N -> 0
otherwise -> s/a + g

### slo gro ###

add point at center of circle
choose point on circle
random walk until contact (if go out of circle, re-choose point)

### simulated evolution ###

one bacterium -> 40 units = 40 moves
limit 1500 units
F,R,HR,RV,HL,L
after 800 moves (matures) and more than or equal to 1000 units (strong), split 2 children, which one has inreased value at a gene and another has decreased value at another gene
p(X) = 2^X/(2^F+2^R+...+2^L)
(0,2),(2,1),(2,-1),(0,-2),(-2,-1),(-2,1)

### mars ###

address 0..7999 mod 8000
addressing mode: n -> direct(1)(relative offset from the instruction), @n -> indirect(2)(relative offset which is read from the relative address and is relative to the relative address), #n -> immediate(0)
-1 == 7999

1. MOV A B: A->B
2. ADD A B: A+B->B
3. SUB A B: B-A->B
4. JMP A
5. JMZ A B: if B == 0 JMP A
6. JMG A B: if B > 0 JMP A
7. DJZ A B: B-1->B then if B == 0 JMP A
8. CMP A B: skip the next instruction if A != B
0. DAT   B: nonexecutable

DAT   -1 -> 00000007999
ADD #5 -1 -> 20100057999
MOV #0 @-2 -> 10200007998
JMP -2 -> 41079980000

2 programs loaded at random positions which are no closer than 1000 addresses


#### DWARF ####

```
DAT -1
ADD #5 -1 (entry)
MOV #0 @-2
JMP -2
```

#### IMP ####

```
MOV 0 1
```

#### GEMINI ####

DAT   0
DAT   99
MOV @-2 @-1
CMP -3 #9
JMP 4
ADD #1 -5
ADD #1 -5
JMP -5
MOV #99 93
JMP 93

distance 10 instead of 100 -> JUGGERNAUT
distance large primve -> BIGFOOT

#### RAIDAR ####

picket(1x100) <-100-> raidar <-100-> picket(1x100)
if picket is damaged
new picketc <-100-> new raidar <-100-> recovered picket

#### SCANNER ####

scanner scanner
compare two copy, if mismatch found, copy from here to there then jump there

### chaos1 ###

x <- .3
for i=1 to 2000
 x <- rx(1-x)
for i=1 to 300
 x <- rx(1-x)
 plot(width * x, 100)

r: 2.95 -> 4.0

### chaos2 ###

for i=1 to 1000
 xx <- xcos(a) - (y-x^2)sin(a)
 y <- xsin(a) + (y-x^2)cos8a)
 x <- xx
 plot(x,y) [-1,1]x[-1,1]

a: 1.111, .264, 1.5732

### ###

x=0, y=0
 x <- sin(ay) - cos(bx)
 y <- sin(cx) - cos(dy)

chicken legs: 2.01, -2.53, 1.61, -.33
dot launcher: -2.7, -.09, -.86, -2.2
self-decorating Easter egg: -2.24, .43, -.65, -2.43

### truchet tile ###

1/4 arc
0: //, 1: \\

### popcorn ###

h: .05

for j=1 to 50
 for k=1 to 50
  x0 <- -6 + .24j
  y0 <- -6 + .24k
  x <- x0
  y <- y0
   for n=1 to 50
    xx <- x - hsin(y + tan(3y))
    yy <- y - hsin(x + tan(3x))
    x <- xx
    y <- yy
    plot(4.166x + 25, 4.166y + 25)

### party planner ###

w:30, h:20
+---+
|   |
|   |
+---+

table: [10.15]x[9,11] (1origin)

arthur: artist
bernie: businessman
dennis: dentist
millie: model
penelope: princess
susan: stockbroker
viola: violinist
wally: wightlifter

a b d m p s v w t
0 15 7 2 6 9 4 12 1
8 0 6 4 6 3 2 10 1
11 4 0 5 12 2 9 6 1
6 9 3 0 10 7 13 5 5
3 10 5 14 0 11 7 15 5
12 2 4 8 5 0 12 4 1
7 8 14 10 4 13 0 3 5
6 7 13 6 3 8 9 0 5

minimize sum of absolute differences from ideal distances (adj8)

### prime ###

Ulam's spiral

5 4 3
6 1 2
7

### circle2 ###

for i=1 to 100
 for j=1 to 100
  x <- corna + side*i/100
  y <- cornb + side*j/100
  if int(x^2 + y^2) % 2 == 0 then plot(i,j)

can change the number of colors

### hopalong ###

x <- 0
y <- 0
for i=1 to num
 plot(x,y)
 xx <- y - sign(x) * sqrt(abs(bx - c))
 yy <- a -x
 x <- xx
 y <- yy

a,b,c = -200,.1,-80 / .4,1,0 / -3.14,.3,.3 / -1000,.1,-10 (num:10000,100000,600000)

- variant
  - x <- y-sin(x)
    y <- a-x
    a: 0.7 of the number pi

### fredkin ###

if the number of alive neighbors is even then cell <- 0 
else cell <- 1

### life ###

Life: abcd
 A living cell dies if it has fewer than [a] or more than [b] living neighbors.
 A dead cell keeps dead if it has fewer than [c] or more than [d] living neighbors.

Conway's original: Life 2333
3D: Life 4555, Life 5766 (can emulate original by 2 layers)

### pint ###

for i=1 to num
 x <- rand()*2
 y <- rand()*2
 if (x-1)^2+(y-1)^2 < 1 then ++count
count*4/num => pi

### zombie ###

for i=1 to num
 count=0
 while rand() >= w do ++count
 ++bucket[count]
show bucket

average of count => 1/w
distribution of count => negative exponential

### galton ###

for i=1 to num
 count = 0
 for j=1 to level
  if rand() < 0.5 then ++count
 ++bucket[count]
show bucket

nCr

### voters ###

torus configuration

pick one cell
pick one adjacent
cell <- adjacent

variant: cell <- ! adjacent

### qwing ###

c <-0, ta <- 0, ts <- 0, q <- 0
while(1) {
 if(q == 0 || ta < ts) {
  if(q != 0) ts <- ts - ta
  c <- c + ta
  q <- q + 1
  use zombie to get ta
 } else {
  ta <- ta - ts
  c <- c + ts
  q <- q - 1
  use zombie to get ts
 }
}

### wator ###

nfish, nshark, fbreed, sbreed, starve

place nfish fishes and nshark sharks with random ages
while 1
 move each fish to unoccupied 4-neighbor
 ++ its age
 if its age == fbreed then add fish to old pos and set age = 0 for both fishes

 move each shark to fish occupied 4-neighor if any, otherwise unoccupied 4-neighbor
 ++ its age
 set starve = 0 if move to fish occupied
 kill if starve == starve
 if its age == sbreed then add shark to old pos and set age = 0, starve = 0 for both shark
