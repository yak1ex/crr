// TODO: clear when interval
// TODO: busy / cancel in busy
// TODO: consider zoom in integer
// TODO: stop/restart interval to reconfigure

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
    var counter = 0;
    // for alias
    var extent, div, size, ticks, w, h, s;
    // forward declaration
    var ele, ctx; // [zero, one]
    var update; // function(i, j)
    var picker; // function(i, j)
    var set_extent; // function(extent)

    var setup_option = function(opt) {
        $.extend(option, opt);
        // for integer, set_extent() handles div
        if(option.type === 'complex') {
            div = option.div;
        }
        set_extent = {
            complex: function(e) { extent = e; },
            integer: function(e) {
                extent = e;
                div = { x: extent.r - extent.l, y: extent.t - extent.b }
            },
        }[option.type];
        set_extent(option.extent);
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

    var update_timer;
    var setup = function(container) {

        $(container).append(
            '<div id="crrlib-canvas-container">\n' +
            '<canvas class="crrlib-mycanvas" id="crrlib-mycanvas0"></canvas>\n' +
            '<canvas class="crrlib-mycanvas" id="crrlib-mycanvas1"></canvas>\n' +
            '<canvas class="crrlib-mycanvas" id="crrlib-mycanvas-guide"></canvas>\n' +
            '</div>\n' +
            '<p id="crrlib-extent"></p>\n' +
            '<p id="crrlib-current"></p>\n'
        );
        var guide = 2;

        // state
        var extents = [];
        var zoom_anchor;

        // helper
        var start_update = function() {
            if(update_timer !== void 0) {
                clearTimeout(update_timer);
            }
            update();
        };
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
        ctx[guide].strokeStyle = '#ff0000';
        ctx[guide].globalCompositeOperation = 'copy';

        $('#crrlib-canvas-container').width(size.x).height(size.y);

        // event handlers
        var curpos = $('#crrlib-current');
        function zoom_extent(e) {
            if(option.square_zoom) {
                var len = Math.max(Math.abs(e.pageX - zoom_anchor.pageX), Math.abs(e.pageY - zoom_anchor.pageY));
                e1 = {
                    pageX: zoom_anchor.pageX - (e.pageX < zoom_anchor.pageX ? len : 0),
                    pageY: zoom_anchor.pageY - (e.pageY < zoom_anchor.pageY ? len : 0)
                };
                e2 = {
                    pageX: zoom_anchor.pageX + (e.pageX > zoom_anchor.pageX ? len : 0),
                    pageY: zoom_anchor.pageY + (e.pageY > zoom_anchor.pageY ? len : 0)
                };
	        if(e1.pageX < offset.left || e2.pageX > size.x + offset.left || e1.pageY < offset.top || e2.pageY > size.y + offset.top) return;
            } else {
                e1 = {
                    pageX: Math.min(e.pageX, zoom_anchor.pageX),
                    pageY: Math.min(e.pageY, zoom_anchor.pageY)
                };
                e2 = {
                    pageX: Math.max(e.pageX, zoom_anchor.pageX),
                    pageY: Math.max(e.pageY, zoom_anchor.pageY)
                };
            }
            if(math.square(e1.pageX - e2.pageX)+math.square(e1.pageY - e2.pageY) <= 100) return;
            return [e1, e2];
        }
        ele.mousemove(function(e) {
            var p = getpos(e);
            curpos.text(coord(p.x, p.y));
            if(option.zoom && zoom_anchor !== void 0) {
                var new_zoom = zoom_extent(e);
                if(new_zoom !== void 0) {
                    ctx[guide].clearRect(0, 0, size.x, size.y); // globalCompositeOperation = 'copy' might not have effect
                    ctx[guide].strokeRect(Math.min(e1.pageX, e2.pageX) - offset.left, Math.min(e1.pageY, e2.pageY) - offset.top, Math.abs(e2.pageX - e1.pageX), Math.abs(e2.pageY - e1.pageY));
                } else {
                    ctx[guide].clearRect(0, 0, size.x, size.y);
                }
            }
        });
        if(option.zoom) {
            ele.mousedown(function(e) {
                if(e.which == 1) {
                    zoom_anchor = { pageX: e.pageX, pageY: e.pageY };
                }
            });
            ele.mouseup(function(e) {
                if(e.which == 1) {
                    ctx[guide].clearRect(0, 0, size.x, size.y);
                    var new_zoom = zoom_extent(e);
                    zoom_anchor = void 0;
                    if(new_zoom === void 0) return;
                    var e1 = new_zoom[0], e2 = new_zoom[1];
                    if(math.square(e1.pageX - e2.pageX)+math.square(e1.pageY - e2.pageY) > 100) {
                        var p1 = getpos(e1), p2 = getpos(e2);
                        extents.push(extent);
                        set_extent({ l: math.min(p1.x, p2.x), r: math.max(p1.x, p2.x), b: math.min(p1.y, p2.y), t: math.max(p1.y, p2.y) });
                        extent_updater();
                        start_update();
                    }
                }
            });
            $(window).mouseup(function(e) {
                if(e.which == 1) {
                    ctx[guide].clearRect(0, 0, size.x, size.y);
                    zoom_anchor = void 0;
                }
            });
            ele.mouseleave(function(e) {
                if(zoom_anchor !== void 0) {
                    ctx[guide].clearRect(0, 0, size.x, size.y);
                }
            });
            ele.dblclick(function(e) {
                if(e.which == 1) {
                    if(extents.length > 0) {
                        set_extent(extents.pop());
                        extent_updater();
                        start_update();
                    }
                }
            });
        }
    };

    var target = 0;
    var last_entered;
    var stop_requested = false;
    update = function(i, j) {
        update_timer = void 0;
        if(i === void 0) { i = 0; j = 0; }
        var start = $.now();
        if(i === 0 && j === 0) {
            last_entered = start;
            if(!('interval' in option)) { ele.eq(target).css('z-index', 1); }
            ctx[target].fillStyle = '#ffffff';
            ctx[target].fillRect(0, 0, size.x, size.y);
            ctx[target].strokeStyle = '#000000';
            ctx[target].strokeRect(0, 0, size.x, size.y);
            ++counter;
            if('enter' in option) {
                option.enter({ counter: counter });
            }
        }
        if('cell' in option) {
            while(i < div.y) {
                while(j < div.x) {
                    var ret = option.cell(picker(i, j));

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
                    if(!('interval' in option) && $.now() - start > ticks) {
                        ctx[target].strokeStyle = '#000000';
                        ctx[target].strokeRect(0, 0, size.x, size.y);
                        if(stop_requested) {
                            stop_requested = false;
                        } else {
                            update_timer = setTimeout(function() { update(i, j); }, 0);
                        }
                        return;
                    }
                }
                j = 0; ++i;
            }
        }
        if('leave' in option) {
            option.leave({ counter: counter });
        }
        ctx[target].strokeStyle = '#000000';
        ctx[target].strokeRect(0, 0, size.x, size.y);
        if('interval' in option) {
            ele.eq(  target).css('z-index', 1);
            ele.eq(1-target).css('z-index', 0);
            target = 1 - target;
            if(stop_requested) {
                stop_requested = false;
            } else {
                update_timer = setTimeout(update, Math.max(0, option.interval - $.now() + last_entered));
            }
        }
    };

// Helper factories
    var factories = {
        idx1: function() {
            return function(x,y) {
                if(y === void 0) { y = x[1]; x = x[0]; }
                return y*w+x;
            };
        },
        adj4: function(opt) {
            if('torus' in opt && opt.torus) {
                return function(x,y) {
                    if(y === void 0) { y = x[1]; x = x[0]; }
                    return [[0,w],[0,s-w],[1,0],[w-1,0]].
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
            if('torus' in opt && opt.torus) {
                return function(x,y) {
                    if(y === void 0) { y = x[1]; x = x[0]; }
                    return [[0,w],[0,s-w],[1,0],[w-1,0],[1,w],[1,s-w],[w-1,w],[w-1,s-w]].
                        map(function(d) { return (y*w+(x+d[0])%w+d[1])%s; });
                };
            } else {
                return function(x,y) {
                    if(y === void 0) { y = x[1]; x = x[0]; }
                    return [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]].
                        filter(function(d) { return 0<=d[0]+x&&d[0]+x<w&&0<=d[1]+y&&d[1]+y<h; }).
                        map(function(d) { return (y+d[1])*w+x+d[0]; });
                };
            }
        },
        colors: function() { // currently no option
            var f=Math.floor;
            function hcolor(h) {
                var H=f(h/60), rgb=[];
                rgb[f((H+4)%6/2)]=0; rgb[f((H+1)%6/2)]=1; rgb[2-(H+1)%3]=1-Math.abs(h/60%2-1);
                return 'rgb('+rgb.map(function(x){return f(x*255+.5);}).join(',')+')';
            }
            function step(n) {
                function iscoprime(x,y)
                {
                    function gcd(x,y) {
                        return x%y===0?y:gcd(y,x%y);
                    }
                    return gcd(x,y)===1;
                }
                var N=f(n/2);
                if(iscoprime(n,N)) return N;
                for(var i=1;i<N;i++) {
                    if(iscoprime(n,N-i)) return N-i;
                    if(iscoprime(n,N+i)) return N+i;
                }
            }
            return function(n) {
                if(n===1) return [hcolor(0)];
                var h=0,s=step(n),r=[];
                for(var i=0;i<n;++i) { r.push(h/n*360); h=(h+s)%n; }
                return r.map(hcolor);
            };
        },
    };

    return {
        init: function(container, opt) {
            setup_option(opt);
            setup(container);
        },
        run: function() {
            counter = 0;
            update();
        },
        stop: function() {
            stop_requested = true;
        },
        make_helper: function(key, opt) {
            if(key in factories) {
                return factories[key](opt);
            } else throw "Unknown helper type '" + key + "' is specified";
        },
    };
}

