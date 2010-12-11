Raphael.fn.piechart = function (offsetX, offsetY, radius, values) {
		
		var paper = this;
		var chart = this.set();
		var startAngle = 0;
		var total = 0;
		for(var i = 0; i < values.length; i++){
			total += values[i];
		}
		
		function sliceDef(startAngle, endAngle) {
				if(Math.abs(endAngle) > Math.abs(startAngle)){
					var greaterThan180 = (Math.abs(endAngle - startAngle) > 180);
				} else {
					var greaterThan180 = ((360 - Math.abs(startAngle) + Math.abs(endAngle)) > 180);
				}
        var rad = Math.PI/180,
            x1 = offsetX + radius * Math.cos(Math.abs(startAngle) * rad),
            x2 = offsetX + radius * Math.cos(Math.abs(endAngle) * rad),
            y1 = offsetY + radius * Math.sin(Math.abs(startAngle) * rad),
            y2 = offsetY + radius * Math.sin(Math.abs(endAngle) * rad),
            pathDef = ["M", offsetX, offsetY, "L", x1, y1, "A", radius, radius, 0, +greaterThan180, 1, x2, y2, "z"];
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
				this.toFront();
				var startAngle = -Raphael.angle(this.startX+dx, this.startY+dy, offsetX, offsetY);
				this.attr("path", sliceDef(startAngle, this.endAngle));
				this.startAngle = startAngle;
				var prevSlice = chart[this.id-1];
				if(prevSlice==undefined){
					prevSlice = chart[chart.length-1]
				}
				prevSlice.attr("path", sliceDef(prevSlice.startAngle, startAngle));
				prevSlice.endAngle = startAngle;
			},
			function(x, y){
					this.startX = x;
					this.startY = y;
				},
			function(){
		}); 
		
		//chart.mousedown(function(event){
		//	alert("chart!")
		//	var clickAngle = Raphael.angle(offsetX, offsetY, event.pageX-paper.canvas.offsetLeft, event.pageY-paper.canvas.offsetTop)
		//	for(var i = 0; i < chart.length; i++){
		//		var slicePoint = chart[0].getPointAtLength(100);
		//		var thisAngle = Raphael.angle(offsetX, offsetY, slicePoint.x, slicePoint.y);
		//		if(thisAngle==clickAngle){
		//			var slice = chart[i];
		//			alert("good click!")
		//			break;
		//		}
		//	}
		//	if(slice==undefined){
		//		alert("misclick")
		//		return false;
		//	}
		//	chart.mousemove(function(event){
		//		var startAngle = Raphael.angle(offsetX, offsetY, event.pageX-paper.canvas.offsetLeft, event.pageY-paper.canvas.offsetTop)
		//		var endPoint = slice.getPointAtLength(slice.getTotalLength());
		//		var endAngle = Raphael.angle(offsetX, offsetY, endPoint.x, endPoint.y);
		//		slice.attr("path", sliceDef(startAngle, endAngle));
		//	});
		//});
		//chart.mouseup(function(event){
		//	slice.unmousemove();
		//});
		
		return chart
		
};