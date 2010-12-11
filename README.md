This is a pure Javascript library for creating pie charts that can be adjusted on the fly.

### Syntaxt

    // piechart(centerX, centerY, radius, values, options)

    r = Raphael(0, 0, 500, 500)
    chart = r.piechart(250, 250, 100, [10, 22, 32, 2, 18], {color:"blue"})
    
See test.html for full example
    
### Options

Currently supported:

1. color: the base color for the chart
2. onchange: a function for the chart to call when it is adjusted

Obviously, a work in progress, and still a bit buggy. Needless to say, bug reports/pull requests welcome.

Loosely based on Dmitry Baranovskiy's examples [here](http://raphaeljs.com/pie.html), [here](http://raphaeljs.com/growing-pie.html) and [here](http://g.raphaeljs.com/piechart2.html).