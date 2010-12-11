Raphael.fn.piechart = function (offsetX, offsetY, radius, values) {
		
		var paper = this;
		var chart = this.set();
		var startAngle = 0;
		var total = 0;
		for(var i = 0; i < values.length; i++){
			total += values[i];
		}
		
		function degreesBetween(startAngle, endAngle){
			if(-endAngle < -startAngle){
				return 360 - -startAngle + -endAngle
			} else {
				return -endAngle - -startAngle
			}
		}
		
		function sliceDef(startAngle, endAngle) {
        var rad = Math.PI/180,
            x1 = offsetX + radius * Math.cos(Math.abs(startAngle) * rad),
            x2 = offsetX + radius * Math.cos(Math.abs(endAngle) * rad),
            y1 = offsetY + radius * Math.sin(Math.abs(startAngle) * rad),
            y2 = offsetY + radius * Math.sin(Math.abs(endAngle) * rad),
            pathDef = ["M", offsetX, offsetY, "L", x1, y1, "A", radius, radius, 0, +(degreesBetween(startAngle, endAngle) > 180), 1, x2, y2, "z"];
        return pathDef;
    }

		for(var i = 0; i < values.length; i++){
			var degrees = (360 * values[i]/total)
			var endAngle = startAngle - degrees;
			var slice = this.path(sliceDef(startAngle, endAngle)).attr({stroke: "#000", "stroke-width": 2, fill: "#fff"});
			slice.startAngle = startAngle;
			slice.endAngle = endAngle;
			chart.push(slice)
			startAngle += (endAngle - startAngle);
		}
		
		chart.drag(
			function(dx, dy){
				var startAngle = -Raphael.angle(this.startX+dx, this.startY+dy, offsetX, offsetY);
				var prevSlice = chart[this.id-1];
				if(prevSlice==undefined){
					prevSlice = chart[chart.length-1]
				}
				if(degreesBetween(startAngle, this.endAngle)<=5 || degreesBetween(prevSlice.startAngle, startAngle)<=5){
					fireEvent(this.node, "mouseup");
				}
				this.attr("path", sliceDef(startAngle, this.endAngle));
				this.startAngle = startAngle;
				prevSlice.attr("path", sliceDef(prevSlice.startAngle, startAngle));
				prevSlice.endAngle = startAngle;
			},
			function(x, y){
					this.toFront();
					this.startX = x;
					this.startY = y;
		}); 
		
		return chart
		
};

function fireEvent(element,event){
    if (document.createEventObject){
    // dispatch for IE
    var evt = document.createEventObject();
    return element.fireEvent('on'+event,evt)
    }
    else{
    // dispatch for firefox + others
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
    }
}