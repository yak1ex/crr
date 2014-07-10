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
