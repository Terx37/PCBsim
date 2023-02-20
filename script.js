var nodeConnector = []
var gridSize = 10
path = new Path.Circle({
	center: 100,
	radius: 10,
	fillColor: null,
	strokeColor: 'black',
	strokeWidth: 10
	
});

nodeConnector.push(path)
var oldSecond;
var segments = [];
function onMouseDrag(event) {
	first = {x:Math.round(event.downPoint.x/gridSize)*gridSize,y:Math.round(event.downPoint.y/gridSize)*gridSize};
	second = {x:Math.round(event.point.x/gridSize)*gridSize,y:Math.round(event.point.y/gridSize)*gridSize};
	if(oldSecond){
		if((oldSecond.x == second.x)&&(oldSecond.y == second.y)){

		}else{
			if((Math.abs(oldSecond.x - second.x)>20)||(Math.abs(oldSecond.y - second.y)>20)){
				oldSecond = second;
				console.log("moved")
				segments.push(second)
			}
			
		}
	}else{
		segments.push(second)
		oldSecond = second
	}
	
	//if((Math.abs(oldSecond.x - second.x)>3))

	if((Math.abs(second.x-first.x))>(Math.abs(second.y-first.y))){
		var destination = [second.x,first.x]
		//var destination = [200,300]

	}else{
		var destination = [first.y,second.y]
		//var destination = [300,300]
	}
	
	for (var i = 0; i < nodeConnector.length; i++) {
		var element = nodeConnector[i];
		if(element.contains(event.downPoint)){
			path = new Path.Line({
				//from: first,
				//to: destination,
				segments: segments,
				strokeColor: 'black',
				strokeWidth: 10
				
			});
			path.removeOnDrag();
		}
	}

	
}