// TODO: onetime / interval
// TODO: clear when interval
// TODO: complex / coordinate => (l,b)-(r,t)
// TODO: show zoom in hint
// TODO: busy / cancel in busy
// TODO: consider zoom in integer

function crrlib()
{
    var math = mathjs();

    var option = {
        size: { x: 101, y: 101 },
        type: 'complex',
        extent: { l: -10, b: -10, t: 10, r: 10 },
        div: { x: 201, y: 201 },
        zoom: true,
        square_zoom: true,
        ticks: 100,
    };
    // for alias
    var extent, div, size, ticks, w, h, s;
    // forward declaration
    var ele, ctx; // [zero, one]
    var update; // function(i, j)
    var picker; // function(i, j)

    var setup_option = function(opt) {
        $.extend(option, opt);
        extent = option.extent;
        div = {
            complex: option.div,
            integer: { x: extent.r - extent.l, y: extent.t - extent.b }
        }[option.type];
        picker = {
            complex: function(i, j) {
                return math.complex(
                    extent.l + (extent.r - extent.l) / div.x * (j + .5),
                    extent.b + (extent.t - extent.b) / div.y * (i + .5)
                );
            },
            integer: function(i, j) { return [i, j]; },
        }[option.type];
        size = option.size;
        ticks = option.ticks;
        w = option.extent.r - option.extent.l;
        h = option.extent.t - option.extent.b;
        s = w * h;
    }

    var setup = function(container) {

        $(container).append(
            '<div id="crrlib-canvas-container">\n' +
            '<canvas class="crrlib-mycanvas" id="crrlib-mycanvas0"></canvas>\n' +
            '<canvas class="crrlib-mycanvas" id="crrlib-mycanvas1"></canvas>\n' +
            '</div>\n' +
            '<p id="crrlib-extent"></p>\n' +
            '<p id="crrlib-current"></p>\n'
        );

        // state
        var extents = [];
        var zoom_anchor;

        // helper
        var prec = function(val) { return math.format(val, { precision: 5}); };
        var coord = function(x, y) { return '(' + prec(x) + ',' + prec(y) + ')'; };
//      var col = ['#000000','#0000ff','#ff0000','#ff00ff','#00ff00','#00ffff','#ffff00'];
        var extent_updater = function() { $('#crrlib-extent').text(coord(extent.l,extent.b)+'-'+coord(extent.r,extent.t)); };
        extent_updater();

        ele = $('.crrlib-mycanvas').attr({ width: size.x, height: size.y });
        var offset = ele.first().offset();
        var getpos = {
            complex: function(e) { return {
                x: (extent.r - extent.l) / size.x * (e.pageX - offset.left) + extent.l,
                y: (extent.b - extent.t) / size.y * (e.pageY - offset.top) + extent.t
            }},
            integer: function(e) { return {
                x: Math.ceil((extent.r - extent.l) / size.x * (e.pageX - offset.left)) + extent.l,
                y: Math.ceil((extent.b - extent.t) / size.y * (e.pageY - offset.top)) + extent.t
            }},
        }[option.type];
        ctx = $.map(ele, function (ele) { return ele.getContext('2d'); });

        $('#crrlib-canvas-container').width(size.x).height(size.y);

        // event handlers
        var curpos = $('#crrlib-current');
        ele.mousemove(function(e) {
            var p = getpos(e);
            curpos.text(coord(p.x, p.y));
        });
        if(option.zoom) {
            ele.mousedown(function(e) {
                if(e.which == 1) {
                    zoom_anchor = { pageX: e.pageX, pageY: e.pageY };
                }
            });
            ele.mouseup(function(e) {
                if(e.which == 1) {
                    var e1, e2;
                    if(option.square_zoom) {
                        e1 = { pageX: math.min(e.pageX, zoom_anchor.pageX), pageY: math.min(e.pageY, zoom_anchor.pageY) };
                        var len = math.max(math.max(e.pageX, zoom_anchor.pageX) - e1.pageX, math.max(e.pageY, zoom_anchor.pageY) - e1.pageY);
                        if(e1.pageX + len - offset.left > size.x || e1.pageY + len - offset.top > size.y) return;
                        e2 = { pageX: e1.pageX + len, pageY: e1.pageY + len };
                    } else {
                        e1 = e; e2 = zoom_anchor;
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
        }
    };

    var target = 0;
    update = function(i, j) {
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
                var ret = option.cell(picker(i, j));

                // TODO: Handle stroke
                if(ret) {
                    if('fill' in ret) {
                        ctx[target].fillStyle = ret.fill;
                        ctx[target].fillRect(size.x / div.x * j, size.y - size.y / div.y * (i + 1), size.x / div.x, size.y / div.y);
                    }
                    if('stroke' in ret) {
                        ctx[target].strokeStyle = ret.stroke;
                        ctx[target].strokeRect(size.x / div.x * j, size.y - size.y / div.y * (i + 1), size.x / div.x, size.y / div.y);
                    }
                }

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

// Helper factories
    var factories = {
        idx1: function() {
            return function(x,y) {
                return y*w+x;
            };
        },
        adj4: function(opt) {
            if(opt && opt.torus) {
                return function(x,y) {
                    return [[0,h],[0,s-h],[1,0],[w-1,0]].
                        map(function(d) { return (y*w+(x+d[0])%w+d[1])%s; });
                };
            } else {
                return function(x,y) {
                    return [[0,1],[0,-1],[1,0],[-1,0]].
                        filter(function(d) { return 0<=d[0]+x&&d[0]+x<w&&0<=d[1]+y&&d[1]+y<h; }).
                        map(function(d) { return (y+d[1])*w+x+d[0]; });
                };
            }
        },
        adj8: function(opt) {
            if(opt && opt.torus) {
                return function(x,y) {
                    return [[0,h],[0,s-h],[1,0],[w-1,0],[1,h],[1,s-h],[w-1,h],[w-1,s-h]].
                        map(function(d) { return (y*w+(x+d[0])%w+d[1])%s; });
                };
            } else {
                return function(x,y) {
                    return [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].
                        filter(function(d) { return 0<=d[0]+x&&d[0]+x<w&&0<=d[1]+y&&d[1]+y<h; }).
                        map(function(d) { return (y+d[1])*w+x+d[0]; });
                };
            }
        }
    };

    return {
        init: function(container, opt) {
            setup_option(opt);
            setup(container);
        },
        run: function() {
            update();
        },
        make_helper: function(key, opt) {
            if(key in factories) {
                return factories[key](opt);
            } else throw "Unknown helper type '" + key + "' is specified";
        },
    };
}

