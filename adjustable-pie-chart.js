Raphael.fn.piechart = function (offsetX, offsetY, radius, values, opts) {
  var paper = this;
  var chart = this.set();
  chart.opts = opts || {}
  var startAngle = 0;
  var total = 0;
  for (var i = 0; i < values.length; i++) {
    total += values[i];
  }

  for (var i = 0; i < values.length; i++) {
    var degrees = (360 * values[i] / total)
    var endAngle = startAngle - degrees;
    var slice = this.path(sliceDef(startAngle, endAngle)).attr({
      stroke: "#000",
      "stroke-width": 2,
      fill: opts.color || "#000",
      "fill-opacity": values[i] / total
    });
    slice.startAngle = startAngle;
    slice.endAngle = endAngle;
    chart.push(slice)
    startAngle += (endAngle - startAngle);
  }

  function degreesBetween(startAngle, endAngle) {
    if (-endAngle < -startAngle) {
      return 360 - -startAngle + -endAngle
    } else {
      return -endAngle - -startAngle
    }
  }

  function sliceDef(startAngle, endAngle) {
    var rad = Math.PI / 180,
        x1 = offsetX + radius * Math.cos(Math.abs(startAngle) * rad),
        x2 = offsetX + radius * Math.cos(Math.abs(endAngle) * rad),
        y1 = offsetY + radius * Math.sin(Math.abs(startAngle) * rad),
        y2 = offsetY + radius * Math.sin(Math.abs(endAngle) * rad),
        pathDef = ["M", offsetX, offsetY, "L", x1, y1, "A", radius, radius, 0, +(degreesBetween(startAngle, endAngle) > 180), 1, x2, y2, "z"];
    return pathDef;
  }

  function computeValues() {
    var values = {};
    for (var i = 0; i < chart.length; i++) {
      values[chart[i].id] = Math.round(total * degreesBetween(chart[i].startAngle, chart[i].endAngle) / 360);
    }
    return values;
  }

  chart.drag(

  function (dx, dy) {
    var startAngle = -Raphael.angle(this.startX + dx, this.startY + dy, offsetX, offsetY);
    if (degreesBetween(startAngle, this.rightSlice.endAngle) <= 5 || degreesBetween(this.leftSlice.startAngle, startAngle) <= 5) {
      fireEvent(this.rightSlice.node, "mouseup");
    }
    this.rightSlice.attr("path", sliceDef(startAngle, this.rightSlice.endAngle));
    var percent = degreesBetween(startAngle, this.rightSlice.endAngle) / 360;
    this.rightSlice.attr("fill-opacity", percent);
    this.rightSlice.startAngle = startAngle;
    this.leftSlice.attr("path", sliceDef(this.leftSlice.startAngle, startAngle));
    this.leftSlice.attr("fill-opacity", degreesBetween(this.leftSlice.startAngle, startAngle) / 360);
    this.leftSlice.endAngle = startAngle;
    chart.opts.onchange.call(this, computeValues());
  }, function (x, y) {
    this.startX = x - offset(paper.canvas).x;
    this.startY = y - offset(paper.canvas).y;
    var clickAngle = -Raphael.angle(this.startX, this.startY, offsetX, offsetY);
    this.rightSlice = this;
    if (degreesBetween(this.startAngle, clickAngle) > degreesBetween(clickAngle, this.endAngle)) {
      this.rightSlice = chart[this.id + 1];
      if (this.rightSlice == undefined) {
        this.rightSlice = chart[0];
      }
    }
    this.leftSlice = chart[this.rightSlice.id - 1];
    if (this.leftSlice == undefined) {
      this.leftSlice = chart[chart.length - 1]
    }
  }, function () {
    this.rightSlice.attr("fill", "blue")
    this.leftSlice.attr("fill", "blue")
  });

  return chart
};

function fireEvent(element, event) {
  if (document.createEventObject) {
    // dispatch for IE
    var evt = document.createEventObject();
    return element.fireEvent('on' + event, evt)
  } else {
    // dispatch for firefox + others
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }
}

function offset(obj) {
  var left, top;
  left = top = 0;
  if (obj.offsetParent) {
    do {
      left += obj.offsetLeft;
      top += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return {
    x: left,
    y: top
  };
};