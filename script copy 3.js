var myTool = "lineTool"
// "Z","L","/","-"
var myWireDrawConnectType = "Z0"


var canvas = document.getElementById('mainCanvas');
paper.install(window);
paper.setup(canvas);
//project = paper.project
//view = paper.view

tool = new Tool()
// GRID
	// Set up grid parameters
	var gridSize = 30; // Size of each grid cell in pixels
	var numCols = Math.floor(view.size.width / gridSize);
	var numRows = Math.floor(view.size.height / gridSize);

	// Create a group to hold the grid lines
	var gridGroup = new paper.Group();


	


	// Loop through each row and column to create grid lines
	for (var i = 0; i < numCols; i++) {
	for (var j = 0; j < numRows; j++) {
		var rect = new paper.Rectangle(i * gridSize, j * gridSize, gridSize, gridSize);
		var path = new paper.Path.Rectangle(rect);
		gridGroup.addChild(path);
	}
	}

	// Style the grid lines
	gridGroup.strokeColor = 'black';
	gridGroup.strokeWidth = 0.5;

	// Draw the grid
	view.draw();

	//sets mainLayer as active layer
	var gridLayer = project.activeLayer;
	var wireLayer = new paper.Layer();
	project.activeLayer = wireLayer;
	// Move the grid to the center of the canvas
	//gridGroup.position = paper.view.center;
//

var clickDrag = false;
var lines = [];
lines = new paper.Group();
tool.onMouseDrag= function(event) {
	if (!clickDrag) {
		//wire = new Group()
	}

	//minimal drag distance to trigger
	let isTriggered = function() {
		let a = event.downPoint.x - event.point.x;
 
    	let b = event.downPoint.y - event.point.y;

  		// Distance formula between two points 
		let distance = Math.sqrt(a * a + b * b);
        return distance > 15;
	}

	if((isTriggered())||clickDrag){
		clickDrag=true;
		handleDrag(event);
		clickDrag=true;
	}
	
};

tool.onMouseUp = function(event){
	if (!clickDrag) {
		handleNonDragClick(event);
	}else{
		handleRelease(event)
	}
	clickDrag=false;
}

view.onKeyDown = function(event) {
	if (event.key == "e") {
		console.log(lines)
	}
	if (event.key == "f") {
		console.log(project.activeLayer)
	}
}

var mousePointX = view.size.width / 2;
var mousePointY = view.size.height / 2;

view.onMouseMove = function(event) {
    mousePointX = event.point.x;
    mousePointY = event.point.y;
}

function handleNonDragClick(event){

	if(myTool == "lineTool"){
		testOnHitOnLinesAndRemove(event.point)
	}

	return;

}

function testOnHitOnLinesAndRemove(pointToTest){
	
	var hitResult = hitTestWire(pointToTest);

	console.log("Hit: "+hitResult)
	let oneTime = true;
	hitResult.forEach((hitResult)=>{
		if(oneTime){
			if (!hitResult){
				return;
			}
			if (hitResult.type == 'curve') {
				hitResult.item.parent.remove();
				oneTime = false;

			};
			return;
		}
	})
}

function hitTestWire(pointToTest, options){
	var defaultOptions = {
        fill: true,
        tolerance: 10,
		curves: true,
		handles:false,
		//center: true
    };
	var finalOptions = {...defaultOptions,...options}

	var storeCurrentLayer = project.activeLayer;
	project.activeLayer = wireLayer;

	var hitResult = project.activeLayer.hitTestAll(pointToTest, finalOptions)

	project.activeLayer = storeCurrentLayer;

	return hitResult;
}


var lineDrawing = false;

var line;

//lines = new paper.Group();
var wire;
var currentlyDrawnPseudoWireGroup;
var splitOldWire;
function handleDrag(event){
	splitOldWire = []
	if(myTool == "lineTool"){
		lineDrawing = true;
		currentlyDrawnPseudoWireGroup = drawTempLine(event)
		//console.log(currentlyDrawnPseudoWireGroup);
	}

	return
}

function drawTempLine(event){
	segments = []
	var fSnappedPoint = {
		x:Math.round(event.downPoint.x / gridSize) * gridSize,
		y:Math.round(event.downPoint.y / gridSize) * gridSize
	}	
	
	var sSnappedPoint = {
		x:Math.round(event.point.x / gridSize) * gridSize,
		y:Math.round(event.point.y / gridSize) * gridSize
	}
	
	segments.push(fSnappedPoint);

	if(!((fSnappedPoint.x == sSnappedPoint.x) || (fSnappedPoint.y == sSnappedPoint.y))){
		// "Z","L","/","-"
		let mode = myWireDrawConnectType.charAt(0);
		let type = myWireDrawConnectType.charAt(1);
		switch(mode){
			case "Z":
                segments = connectUsingZ(fSnappedPoint, sSnappedPoint, segments, type);
				break;
            case "L":
				segments = connectUsingL(fSnappedPoint, sSnappedPoint, segments, type);
				break;
			case "/":
				segments = connectUsingL(fSnappedPoint, sSnappedPoint, segments, type);
				break;
			case "-":
				segments = connectUsingS(fSnappedPoint, sSnappedPoint, segments);
				break;
		}
	}else{
		segments.push(sSnappedPoint);
	}

	//segments.push({x:100,y:100});
	//segments.push({x:100,y:100});
	var currentlyDrawnPseudoWireGroup = new Group()
	currentlyDrawnPseudoWireGroup.removeOnDrag()
	for (var i = 0; i+1 < segments.length; i++) {
		//draw only if not overlapping previous
		if((segments[i].x != segments[i+1].x) || (segments[i].y != segments[i+1].y)){
			
			currentlyDrawnPseudoWireGroup.addChild(drawWire(segments[i],segments[i+1],"black"))
		}
	}
	
	//wire = currentlyDrawnPseudoWireGroup
	return currentlyDrawnPseudoWireGroup
}

function connectUsingZ(fSnappedPoint, sSnappedPoint, segments, type = 0) {
		//CODE for ultimate Marszalek-grade "Z" shape 😎
		var midOne;
		var midTwo;
		if(type == 0){
			if((Math.abs(sSnappedPoint.x-fSnappedPoint.x))>(Math.abs(sSnappedPoint.y-fSnappedPoint.y))){
				type = 1
			}else{
				type = 2
			}
		}
		if (type == 1){
			midOne = {x:((fSnappedPoint.x+sSnappedPoint.x)/2),y:fSnappedPoint.y}
			midTwo = {x:((fSnappedPoint.x+sSnappedPoint.x)/2),y:sSnappedPoint.y}		
		}else{
			midOne = {x:fSnappedPoint.x,y:((fSnappedPoint.y+sSnappedPoint.y)/2)}
			midTwo = {x:sSnappedPoint.x,y:((fSnappedPoint.y+sSnappedPoint.y)/2)}
		}
		midOne.x = Math.round(midOne.x / gridSize) * gridSize
		midOne.y = Math.round(midOne.y / gridSize) * gridSize
		midTwo.x = Math.round(midTwo.x / gridSize) * gridSize
		midTwo.y = Math.round(midTwo.y / gridSize) * gridSize
		segments.push(midOne);
		segments.push(midTwo);
		segments.push(sSnappedPoint);
		return segments;
}
function connectUsingL(fSnappedPoint, sSnappedPoint, segments, type) {
	//CODE for ultimate Marszalek-grade "L" shape 😎
	var midOne;
	if(type == 0){
		if((Math.abs(sSnappedPoint.x-fSnappedPoint.x))>(Math.abs(sSnappedPoint.y-fSnappedPoint.y))){
			type = 1
		}else{
			type = 2
		}
	}
	if (type == 1){
		midOne = {x:sSnappedPoint.x,y:fSnappedPoint.y}
	}else{
		midOne = {x:fSnappedPoint.x,y:sSnappedPoint.y}
	}
	midOne.x = Math.round(midOne.x / gridSize) * gridSize
	midOne.y = Math.round(midOne.y / gridSize) * gridSize

	segments.push(midOne);
	segments.push(sSnappedPoint);
	return segments;
}
function connectUsingS(fSnappedPoint, sSnappedPoint, segments, type) {
	// Straight Lines Only
	if((Math.abs(sSnappedPoint.x-fSnappedPoint.x))>=(Math.abs(sSnappedPoint.y-fSnappedPoint.y))){
		sSnappedPoint.y = fSnappedPoint.y
	}else{
		sSnappedPoint.x = fSnappedPoint.x
	}
	segments.push(sSnappedPoint);
	return segments;
}


var wire;

function drawWire(beginning, end, color, removeOnDrag = true) {
	var path = null;
	path = new Path.Line(beginning,end)
	//path.fillColor = color
	path.strokeColor = color
	path.strokeWidth = 10
	path.fullySelected = true;
	if (removeOnDrag) {
		path.removeOnDrag();
	}
	var wire = null;
	wire = new Group()
	if (removeOnDrag) {
		wire.removeOnDrag()
	}
	wire.addChild(path)
	wire.addChild(spawnNode({x:beginning.x,y:beginning.y},removeOnDrag))
	wire.addChild(spawnNode({x:end.x,y:end.y},removeOnDrag))
	
	wire.data.wireStartPos = {x:beginning.x,y:beginning.y}
	wire.data.wireEndPos = {x:end.x,y:end.y}
	if(beginning.x == end.x){
		wire.data.orientation = "vertical"
	}else{
		//beginning.y == end.y
		wire.data.orientation = "horizontal"
	}


	wire.data.connected = {start:[],end:[]}

	//wire.data.connected = new Map()
	return wire;
}

function spawnNode(spawnPoint, removeOnDrag=true){
	size = 20;
	var rectangle = new Rectangle([spawnPoint.x-(size/2),spawnPoint.y-(size/2)], new Size(size, size));
	
	var cornerSize = new Size(2, 2);
	var node = new Path.Rectangle(rectangle, cornerSize);
	node.fillColor="black";
	node.strokeColor = 'black';
	if (removeOnDrag) {
		node.removeOnDrag()
	}
	return node;
}

function handleRelease(event) {

	if (lineDrawing) {
		lineDrawing=false;
		// if an end node or a start node of a wire is placed on the start, end or middle of any other wire, the two wires are connected, two middles colliding does not mean a connection.
		//every node needs to hava a sister wire connected to it and a sister node on the wires oposite end
		// therefore, the only important information required to describe any wire in terms of its shape and connection to other wires is:	It's start and end points
		// these points are designated: .wireStartPos, .wireEndPos
		// these points are stored in the .data atribute of the 
		//console.log(currentlyDrawnPseudoWireGroup);
		let numberOfWiresToHandle = currentlyDrawnPseudoWireGroup.children.length;
		for (let i = 0; i < numberOfWiresToHandle; i++) {
			var wire = currentlyDrawnPseudoWireGroup.children[0];


			// absolute distance between start and end points divided by grid size, this gives us the grid distance between the two points, +1 is added to get final wire length
			//WARNING, THIS WILL FUCK UP IF THE LINES ARE NOT VERTICAL OR HORIZONTAL
			var lineLength = Math.sqrt(Math.pow(wire.data.wireEndPos.x - wire.data.wireStartPos.x, 2) + Math.pow(wire.data.wireEndPos.y - wire.data.wireStartPos.y, 2))
			var lineGridLength = lineLength/gridSize
			var wireGridLength = lineGridLength+1
			let xGap1 = (wire.data.wireStartPos.x - wire.data.wireEndPos.x)/ (wireGridLength) //lineLength.x / (wireGridLength); // calculate gap between two points
			let yGap1 = (wire.data.wireStartPos.y - wire.data.wireEndPos.y)/ (wireGridLength) //lineLength.y / (wireGridLength); // on each axis

			let xGap = (wire.data.wireEndPos.x-wire.data.wireStartPos.x)/lineGridLength
			let yGap = (wire.data.wireEndPos.y-wire.data.wireStartPos.y)/lineGridLength

			let points = []; // array to store all points position
			for(let i=0; i<wireGridLength; i++) {
				let xPos = wire.data.wireStartPos.x + (i * xGap); // x coordinate of this point
				let yPos = wire.data.wireStartPos.y + (i * yGap); // y coordinate of this point

				points.push({x:xPos, y:yPos});
			}
			console.log(points);
			
			/*var hitTestOptions = {

				fill: false,
				tolerance: 1,
				curves: true,
				//handles:false,
				//type: "fill",
				//class: "Group"
			}*/

			/*
			var defaultOptions = {
				fill: true,
				tolerance: 10,
				curves: true,
				handles:false,
				//center: true
			};
			*/

			let options = {

				fill: false,
				tolerance: 1,
				curves: false,
				center: false,
				segments: true,
				handles: false,
				//type: "fill",
				//class: "Group"
			}
			let options2 = {

				fill: false,
				tolerance: 1,
				curves: true,
				center: false,
				
				handles: false,
				//type: "fill",
				//class: "Group"
			}
			dividedLineBegining = wire.data.wireStartPos;
			//console.log(points);
			points.forEach((point, index) => {
				//doesnt hittest itself because it only checks "lines", into which it is only added later
				//point = {x:point.x-1, y:point.y-1}

				let hitResult = hitTestWire(point,options)
				//if(hitResult[0]){console.log(hitResult[0].item);}
				//console.log(point);
				//console.log(wire);
				if(hitResult) {
					console.log(hitResult);

				}else {
					console.log("null");
				}
				hitResult.forEach((hitResult) => {
					if(hitResult.item.parent.id == wire.id){
						return;
					
					}
					console.log("GWGAG");

					//console.log("A");
					if(hitResult){
						//console.log("B");
	
						if(hitResult.type === "segment"){
							if ((index == 0)||(index == points.length-1)) {
								console.log("VEBABEAB")
								if(hitResult.item.parent.data.orientation == wire.data.orientation){
									//antiOverlap(hitResult,wire);

									console.log("!")
									if((point.x == hitResult.item.parent.data.wireStartPos.x)&&(point.y == hitResult.item.parent.data.wireStartPos.y)){
										//we hit start
										
										if(hitResult.item.parent.data.connected.start.length == 0){
											let newLine3;
											if(index == 0){
												//our start
												newLine3 = drawWire(hitResult.item.parent.data.wireEndPos, wire.data.wireEndPos, "red", false);		
												newLine3.data = hitResult.item.parent.data
												newLine3.data.connected.start = hitResult.item.parent.data.connected.end;
												newLine3.data.connected.end = wire.data.connected.end;

																				
											}else{
												//our end
												
												newLine3 = drawWire(wire.data.wireStartPos, hitResult.item.parent.data.wireEndPos, "red", false)
												newLine3.data = hitResult.item.parent.data
												newLine3.data.connected.start = wire.data.connected.start;
												newLine3.data.connected.end = hitResult.item.parent.data.connected.end;
											}
											wire.remove()
											hitResult.item.parent.remove()
											wire=newLine3
											
											//lines.addChild(newLine3)
										}else{
											//console.log("START");
											//hitResult.item.parent.data.connected.set([point.x,point.y].toString(), wire);
											/*let splitLine1start = hitResult.item.parent.data.wireStartPos;
											let splitLine1end = point;
											let splitLine2start = point;
											let splitLine2end = hitResult.item.parent.data.wireEndPos;
											let newLine1 = drawWire(splitLine1start, splitLine1end, "red");
											newLine1.data = hitResult.item.parent.data
											newLine1.data.connected.start = null;
											newLine1.data.connected.end = null;
											let newLine2 = drawWire(splitLine2start, splitLine2end, "blue");*/
											
											if((point.x == wire.data.wireStartPos.x)&&(point.y == wire.data.wireStartPos.y)){
												wire.data.connected.start = hitResult.item.parent;
												
											}else{
												wire.data.connected.end = hitResult.item.parent;
											}
											if((point.x == hitResult.item.parent.data.wireStartPos.x) && (point.y == hitResult.item.parent.data.wireStartPos.y)){
												hitResult.item.parent.data.connected.start = wire
											}else{
												hitResult.item.parent.data.connected.end = wire
											}
			
										}
									}else{
										
										//we hit end
										if(hitResult.item.parent.data.connected.end.length == 0){
											console.log("?")
											let newLine3;
											if(index == 0){
												//our start
												newLine3 = drawWire(hitResult.item.parent.data.wireStartPos, wire.data.wireEndPos, "red", false);		
												newLine3.data = hitResult.item.parent.data
												newLine3.data.connected.start = hitResult.item.parent.data.connected.start;
												newLine3.data.connected.end = wire.data.connected.end;

																				
											}else{
												//our end
												
												newLine3 = drawWire(wire.data.wireStartPos, hitResult.item.parent.data.wireStartPos, "red", false)
												newLine3.data = hitResult.item.parent.data
												newLine3.data.connected.start = wire.data.connected.start;
												newLine3.data.connected.end = hitResult.item.parent.data.connected.start;
												
											}
											wire.remove()
											hitResult.item.parent.remove()
											wire = newLine3;
											
											//wire=undefined
											lines.addChild(newLine3)
										}else{
											//console.log("START");
											//hitResult.item.parent.data.connected.set([point.x,point.y].toString(), wire);
											/*let splitLine1start = hitResult.item.parent.data.wireStartPos;
											let splitLine1end = point;
											let splitLine2start = point;
											let splitLine2end = hitResult.item.parent.data.wireEndPos;
											let newLine1 = drawWire(splitLine1start, splitLine1end, "red");
											newLine1.data = hitResult.item.parent.data
											newLine1.data.connected.start = null;
											newLine1.data.connected.end = null;
											let newLine2 = drawWire(splitLine2start, splitLine2end, "blue");*/
											
											if((point.x == wire.data.wireStartPos.x)&&(point.y == wire.data.wireStartPos.y)){
												wire.data.connected.start = hitResult.item.parent;
												
											}else{
												wire.data.connected.end = hitResult.item.parent;
											}
											if((point.x == hitResult.item.parent.data.wireStartPos.x) && (point.y == hitResult.item.parent.data.wireStartPos.y)){
												hitResult.item.parent.data.connected.start = wire
											}else{
												hitResult.item.parent.data.connected.end = wire
											}
			
										}
									}
								}
							}
							

							else{
								console.log("ELSE 1");
								if(hitResult.item.parent.data.orientation == wire.data.orientation){
									//antiOverlap(hitResult,wire);

								}else{
									//console.log("START");
									//redraw old line
									splitOldWire = drawWire(dividedLineBegining,point,"red", false)
									//transfers data
									let wireData = wire.data;
									splitOldWire.data = wireData;
									splitOldWire.data.wireStartPos = dividedLineBegining;
									splitOldWire.data.wireEndPos = point;
									splitOldWire.data.connected.start = wireData.connected.start;
									splitOldWire.data.connected.end = hitResult.item.parent;

									//ads the cutoffed wire to lines (the last wire gets added at the end of the function)
									wire.remove()
									//wire=undefined
									lines.addChild(splitOldWire)
									//draw a new line
									wire = drawWire(point,points[points.length-1],"blue", false)
									wire.data = wireData;
									wire.data.wireStartPos = point;
									wire.data.wireEndPos = points[points.length-1];
									wire.data.connected.start = hitResult.item.parent;
									wire.data.connected.end = wireData.connected.end;
									//wire.removeOnMove()
									
									dividedLineBegining = point;
								}
							}
	
							
							//console.log(e.item.parent.data)
							//e.item.parent.data.connected.set([point.x,point.y].toString(), wire);
							//console.log(e.item.parent.data)
							
							//check if 
						}
						
						
			
					}
				})
				
				if ((index == 0)||(index == points.length-1)) {
					
					
					hitResult2 = hitTestWire(point,options2)
					hitResult2.forEach((hitResult) => {
						if(hitResult.item.parent.id == wire.id){
							return;
						
						}
						if(hitResult.type === "curve"){
							if(hitResult.item.parent.data.orientation == wire.data.orientation){
								
								//antiOverlap(hitResult,wire,index,point);
								
								let a1 = wire.data.wireStartPos;
								let a2 = wire.data.wireEndPos;
								let b1 = hitResult.item.parent.data.wireStartPos;
								let b2 = hitResult.item.parent.data.wireEndPos; 
								let aStart
								let aEnd
								let leftMostPos
								let rightMostPos
								if(wire.data.orientation == "vertical"){
									aStart = wire.data.wireStartPos.y
									aEnd = wire.data.wireEndPos.y
								
									leftMost = Math.min(a1.y,a2.y,b1.y,b2.y);
									rightMost = Math.max(a1.y,a2.y,b1.y,b2.y);
									leftMostPos = {x: a1.x, y: leftMost}
									rightMostPos = {x: a1.x, y: rightMost}
								}else{
									aStart = wire.data.wireStartPos.x
									aEnd = wire.data.wireEndPos.x
									
									leftMost = Math.min(a1.x,a2.x,b1.x,b2.x);
									rightMost = Math.max(a1.x,a2.x,b1.x,b2.x);
									leftMostPos = {x: leftMost, y:a1.y}
									rightMostPos = {x: rightMost, y:a1.y}
								}
							
								//get the higher value								
								let aMax = Math.max(a1, a2);
								let aMin = Math.min(a1, a2);
							
								let bMax = Math.max(b1, b2);
								let bMin = Math.min(b1, b2);
							
								
								hitResult.item.parent.remove()
								wire.remove()
								wire = drawWire(leftMostPos, rightMostPos, "blue", false)

								

							}else{

								//console.log("START");
								//hitResult.item.parent.data.connected.set([point.x,point.y].toString(), wire);
								/*if((point.x == hitResult.item.parent.data.wireStartPos.x)&&(point.y == hitResult.item.parent.data.wireStartPos.y)){
									hitResult.item.parent.data.connected.start.push(point)
								}else if((point.x == hitResult.item.parent.data.wireEndPos.x)&&(point.y == hitResult.item.parent.data.wireEndPos.y)){
									hitResult.item.parent.data.connected.end.push(point)

								}*/
								
								

								if((point.x == hitResult.item.parent.data.wireStartPos.x)&&(point.y == hitResult.item.parent.data.wireStartPos.y)){

								}else if((point.x == hitResult.item.parent.data.wireEndPos.x)&&(point.y == hitResult.item.parent.data.wireEndPos.y)){

								}else{
									let splitLine1start = hitResult.item.parent.data.wireStartPos;
									let splitLine1end = point;
									let splitLine2start = point;
									let splitLine2end = hitResult.item.parent.data.wireEndPos;
									let newLine1 = drawWire(splitLine1start, splitLine1end, "red", false);
		
									newLine1.data = hitResult.item.parent.data
									newLine1.data.connected.start = null;
									newLine1.data.connected.end = null;
									lines.addChild(newLine1)
		
									let newLine2 = drawWire(splitLine2start, splitLine2end, "blue", false);
									lines.addChild(newLine2)
									hitResult.item.parent.remove()
								}


								
							
							
							}
							


							//Implement overlap protection, if this is fired, you need to find the node of the hit wire that is overlapping with currently drawn wire, you can do this by checking whether either the start or end node of the hit wire is inside the space in between the two nodes of currently drawn wire, a geometrical equation should suffice, there are five possible situations for overlap: 
							//1. The start node of the hit wire is inside the space in between the two nodes of currently drawn wire
                            //2. The end node of the hit wire is inside the space in between the two nodes of currently drawn wire
                            //3. both nodes of the hit wire are inside the space in between the two nodes of currently drawn wire (we are fully outside)
                            //4. both nodes of the hit wire are outside the space in between the two nodes of currently drawn wire (we are fully inside)
							//5. one node is overlapping with node and the other with curve
							//you can check for them if:
							//1: 2x node on curve
							//2: 2x node on node of same wire = dont draw

							//!!! write if horizontal or diagonal into the wire.data, then use it to simplify lines automatically

							//if both nodes colide with curve of same line, dont draw new wire
							//if one node colides with wire with same orientation, take hitwire start or hitwire end, whichever makes more sense, and draw a new wire between it and the wire node that is outside
						}
					})
				}
				//let hitTestStart = lines.hitTestAll(wire.data.wireStartPos, hitTestOptions)
			});
			/*
			for (let i = 0; i < points.length; i++) {
				const element = wireGridLength[i];
				//doesnt hittest itself because it only checks "lines", into which it is only added later
				let hitTestStart = lines.hitTestAll(wire.data.wireStartPos, hitTestOptions)
			}*/

			/*if(hitTestStart){

				for (let i = 0; i < hitTestStart.length; i++) {
					var e = hitTestStart[i]; 
					if (e) {
						console.log(e.item.parent.data)
						e.item.parent.data.connected.set([wire.data.wireStartPos.x,wire.data.wireStartPos.y].toString(), wire);
						console.log(e.item.parent.data)

					}
				}
			}
			if(hitTestEnd){

				for (let i = 0; i < hitTestEnd.length; i++) {
					var e = hitTestEnd[i]; 
					if (e) {
						e.item.parent.data.connected.set([wire.data.wireEndPos.x,wire.data.wireEndPos.y].toString(), wire);
					}
				}
			}*/
			
			if(wire != undefined){
				lines.addChild(wire)

			}
			//wire = null;
			//spawnNode(testPoint);
		
		};
	//lines.push(line)
	
	}
}

function antiOverlap(hitResult,wire,index,point){

	let a1 = wire.data.wireStartPos;
	let a2 = wire.data.wireEndPos;
	let b1 = hitResult.item.parent.data.wireStartPos;
	let b2 = hitResult.item.parent.data.wireEndPos; 
	let aStart
	let aEnd
	if(wire.data.orientation == "vertical"){
		aStart = wire.data.wireStartPos.y
		aEnd = wire.data.wireEndPos.y
		a1 = a1.y
		a2 = a2.y
		b1 = b1.y
		b2 = b2.y
	}else{
		aStart = wire.data.wireStartPos.x
		aEnd = wire.data.wireEndPos.x
		a1 = a1.x
		a2 = a2.x
		b1 = b1.x
		b2 = b2.x
	}

	//get the higher value								
	let aMax = Math.max(a1, a2);
	let aMin = Math.min(a1, a2);

	let bMax = Math.max(b1, b2);
	let bMin = Math.min(b1, b2);

	leftMost = Math.min(a1,a2,b1,b2);
	rightMost = Math.max(a1,a2,b1,b2);




	if (aStart > aMin && aStart < aMax) {
		// bMax is within a
		console.log("1");
		//its end is between us
	}
	if (aEnd > aMin && aEnd < aMax){
		// bMin is within a
		console.log("2");

	}
	if (aStart > bMin && aStart < bMax) {
		// aMax is within b
		console.log("3");
	}
	if (aEnd > bMin && aEnd < bMax){
		// aMin is within b
		console.log("4");

	}
	//hitResult.item.parent
}