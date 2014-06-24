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

k1:2, k2:3

a = count(neighbor(i,j) < N) (or count(0 < neighbor(i,j) < N)
b = count(neightbor(i, j) == N)
s = sum(value(i,j), value(neighbor(i,j)))
value(i,j) == 0 -> a/k1 + b/k2
value(i,j) == N -> 0
otherwise -> s/a + g

### slo gro ###

add point at center of circle
choose point on circle
random walk until contact (if go out of circle, re-choose point)
