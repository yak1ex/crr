var crrlib = {};
window.onload = function() {
    var math = mathjs();
    var size = { x: 101, y: 101 };
    var extent = { l: -10, b: -10, t: 10, r: 10 };
    var extents = [];
    var div = { x: 201, y: 201 };
    var square = 1;
    var ticks = 100;

    var formulae = ['z^3+c', 'z^5+c', 'z^z+z^5+c', 'z^z+z^6+c','sin(z)+z^2+c', 'sin(z)+e^z+c'];
    var formula = math.compile(formulae[0]);

    var update;
    var zoom;

    var ele = $('.crrlib-mycanvas').attr({ width: size.x, height: size.y });
    var offset = ele.first().offset();

    $('#crrlib-canvas-container').width(size.x).height(size.y);

    var getpos = function(e) { return {
        x: (extent.r - extent.l) / size.x * (e.pageX - offset.left) + extent.l,
        y: (extent.b - extent.t) / size.y * (e.pageY - offset.top) + extent.t
    };};
    var ctx = $.map(ele, function (ele) { return ele.getContext('2d'); });

    var prec = function(val) { return math.format(val, { precision: 5}); };
    var coord = function(x, y) { return '(' + prec(x) + ',' + prec(y) + ')'; };
//  var col = ['#000000','#0000ff','#ff0000','#ff00ff','#00ff00','#00ffff','#ffff00'];
    var extent_updater = function() { $('#crrlib-extent').text(coord(extent.l,extent.b)+'-'+coord(extent.r,extent.t)); };
    extent_updater();

    var curpos = $('#crrlib-current');
    ele.mousemove(function(e) {
        var p = getpos(e);
        curpos.text(coord(p.x, p.y));
    });
    ele.mousedown(function(e) {
        if(e.which == 1) {
            zoom = { pageX: e.pageX, pageY: e.pageY };
        }
    });
    ele.mouseup(function(e) {
        if(e.which == 1) {
            var e1, e2;
            if(square) {
                e1 = { pageX: math.min(e.pageX, zoom.pageX), pageY: math.min(e.pageY, zoom.pageY) };
                var len = math.max(math.max(e.pageX, zoom.pageX) - e1.pageX, math.max(e.pageY, zoom.pageY) - e1.pageY);
                if(e1.pageX + len - offset.left > size.x || e1.pageY + len - offset.top > size.y) return;
                e2 = { pageX: e1.pageX + len, pageY: e1.pageY + len };
            } else {
                e1 = e; e2 = zoom;
            }
            if(math.square(e1.pageX - e2.pageX)+math.square(e1.pageY - e2.pageY) > 100) {
                var p1 = getpos(e1), p2 = getpos(e2);
                extents.push(extent);
                extent = { l: math.min(p1.x, p2.x), r: math.max(p1.x, p2.x), b: math.min(p1.y, p2.y), t: math.max(p1.y, p2.y) };
                extent_updater();
                update();
            }
        }
    });
    ele.dblclick(function(e) {
        if(e.which == 1) {
            if(extents.length > 0) {
                extent = extents.pop();
                extent_updater();
                update();
            }
        }
    });

    var target = 0;
    var c = math.complex(0.5, 0);
    var update = function(i, j) {
        if(i === undefined) { i = 0; j = 0; }
        var start = $.now();
        if(i === 0 && j === 0) {
            ele.eq(target).css('z-index', 1);
            ctx[target].fillStyle = '#ffffff';
            ctx[target].fillRect(0, 0, size.x, size.y);
            ctx[target].strokeStyle = '#000000';
            ctx[target].strokeRect(0, 0, size.x, size.y);
        }
        while(i < div.y) {
            while(j < div.x) {
                var z = math.complex(extent.l + (extent.r - extent.l) / div.x * (j + .5), extent.b + (extent.t - extent.b) / div.y * (i + .5));
                for(var k = 0; k < 10; ++k) {
                    z = formula.eval({z: z, c: c });
                    if(math.abs(math.re(z)) > 10 || math.abs(math.im(z)) > 10 || math.abs(z) > 10) break;
                }
                ctx[target].fillStyle = ((math.abs(math.re(z)) < 10 || math.abs(math.im(z)) < 10) ? '#000000' : '#ffffff');
                ctx[target].fillRect(size.x / div.x * j, size.y - size.y / div.y * (i + 1), size.x / div.x, size.y / div.y);

                ++j;
                if($.now() - start > ticks) {
                    ctx[target].strokeStyle = '#000000';
                    ctx[target].strokeRect(0, 0, size.x, size.y);
                    setTimeout(function() { update(i, j); }, 0);
                    return;
                }
            }
            j = 0; ++i;
        }
        ctx[target].strokeStyle = '#000000';
        ctx[target].strokeRect(0, 0, size.x, size.y);
//	ele.eq(  target).css('z-index', 1);
//	ele.eq(1-target).css('z-index', 0);
//      target = 1 - target;
//      setTimeout(update, 1000);
    };
    update();
}
