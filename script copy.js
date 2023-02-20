var myTool = "lineTool"


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
		wire = new Group()
	}
	clickDrag=true;
	handleDrag(event);
	clickDrag=true;
};

tool.onMouseUp = function(event){
	if (!clickDrag) {
		handleNonDragClick(event);
	}else{
		handleRelease(event)
	}
	clickDrag=false;
}

tool.onKeyDown = function(event) {
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
	if (!hitResult){
		return;
	}
	if (hitResult.type == 'curve') {
		hitResult.item.parent.remove();
	};
	return;
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

	var hitResult = project.activeLayer.hitTest(pointToTest, finalOptions)

	project.activeLayer = storeCurrentLayer;

	return hitResult;
}
//var hitLine;
//#region old
/*
function testHitOnLine(event, testPoint) {
	console.log("FGWGAGWGW")
	//test for extend
	/*
	var options = {
        fill: true,
        tolerance: 0,
		curves: false,
		handles:true,
		//center: true
    };
	
	result = false;
	for (var ix = 0; ix < lines.length; ix++) {
		for (var index = 0; index < lines[ix].children.length; index++) {

			var element = lines[ix].children[index];
			if (element.hitTest(testPoint,options)) {
				
				//element.remove();
				result = true;
				//hitLine = {l:element,t:"end"}
				return result;
			}
			//console.log(testPoint)
			console.log(lines[0].hitTest(testPoint,options))
		}
		if (result) {
			lines[ix].remove()
			lines.splice(ix,1)
			return result
		}
		
	}
	if (result) {
		return result
	}
	*//*
	//test for delete
	var result;
	var options = {
        fill: true,
        tolerance: 0,
		curves: true,
		//handles:false,
		//center: true
    };
    
	result = false;
	for (var ix = 0; ix < lines.length; ix++) {

		for (var index = 0; index < lines[ix].children.length; index++) {

			var element = lines[ix].children[index];

			if (element.hitTest(testPoint,options)) {

				element.remove();
				result = true;
			}
		}
		if (result) {
			console.log("GW")

			if (!lines[ix].hasChildren()) {
				console.log("GW")
				lines[ix].remove();
				lines.splice(ix,1);
			}
		}
		
	}
	if (result) {
		return result
	}
}*/
//#endregion

var lineDrawing = false;

var line;

//lines = new paper.Group();
var wire;
function handleDrag(event){
	
	if(myTool == "lineTool"){

	}


	lineDrawing = true;
	//if hit existing line, connect
	var point = event.downPoint;
	var testPoint = new Point(Math.round(point.x / gridSize) * gridSize,Math.round(point.y / gridSize) * gridSize);
	//spawnNode(testPoint);

	var options = {
        fill: true,
        tolerance: 1,
		curves: true,
		handles:true,
		//center: true
    };
	
	/*
	result = false;
	var resultI;
	for (var ix = 0; ix < lines.length; ix++) {
		for (var index = 0; index < lines[ix].children.length; index++) {
			var element = lines[ix].children[index];
			if (element.hitTest(testPoint,options)) {
				//element.remove();
				result = true;
				resultI=ix;
			}
		}
		if (result) {

		}
	}
	*/
	segments = []
	var fSnappedPoint = new Point(Math.round(event.downPoint.x / gridSize) * gridSize,Math.round(event.downPoint.y / gridSize) * gridSize);
	segments.push(fSnappedPoint);
	var sSnappedPoint = new Point(
		Math.round(event.point.x / gridSize) * gridSize,
		Math.round(event.point.y / gridSize) * gridSize
	);
	
	//CODE for ultimate Marszalek-grade "Z" shape 😎
	//#region Zshape
	/* 
	
	if((Math.abs(sSnappedPoint.x-fSnappedPoint.x))>(Math.abs(sSnappedPoint.y-fSnappedPoint.y))){
		midOne = [((fSnappedPoint.x+sSnappedPoint.x)/2),fSnappedPoint.y]
		midTwo = [((fSnappedPoint.x+sSnappedPoint.x)/2),sSnappedPoint.y]
	}else{
		midOne = [fSnappedPoint.x,((fSnappedPoint.y+sSnappedPoint.y)/2)]
		midTwo = [sSnappedPoint.x,((fSnappedPoint.y+sSnappedPoint.y)/2)]
	}
	midOne[0] = Math.round(midOne[0] / gridSize) * gridSize
	midOne[1] = Math.round(midOne[1] / gridSize) * gridSize
	midTwo[0] = Math.round(midTwo[0] / gridSize) * gridSize
	midTwo[1] = Math.round(midTwo[1] / gridSize) * gridSize

	segments.push(midOne);
	segments.push(midTwo);
	*/
	//#endregion
	// Straight Lines Only Now aka. SLON
	if((Math.abs(sSnappedPoint.x-fSnappedPoint.x))>(Math.abs(sSnappedPoint.y-fSnappedPoint.y))){
		var sSnappedPoint = new Point(sSnappedPoint.x,fSnappedPoint.y)
	}else{
		var sSnappedPoint = new Point(fSnappedPoint.x,sSnappedPoint.y)
	}
	/////////////////////////////
	segments.push({x:100,y:100});
	segments.push(sSnappedPoint);

	var startNode;
	var endNode;
	//#region Old

	

	for (var i = 0; i+1 < segments.length; i++) {
		var element = segments[i];
		

			drawWire(segments[i],segments[i+1],"black")
			
		
	}

	return
}
var path1;// = new Group();


function drawWire(beginning, end, color){
	path = new Path.Line(beginning,end)
	path.fillColor = color
	path.strokeColor = color
	path.strokeWidth = 10
	path.fullySelected = true;
	path.removeOnDrag();

	wire.addChild(path)
	wire.addChild(spawnNode({x:beginning.x,y:beginning.y}))
	wire.addChild(spawnNode({x:end.x,y:end.y}))
	
	wire.data.wireStartPos = {x:beginning.x,y:beginning.y}
	wire.data.wireEndPos = {x:end.x,y:end.y}
	
	wire.data.connected = new Map()
}

function spawnNode(spawnPoint){
	size = 20;
	var rectangle = new Rectangle([spawnPoint.x-(size/2),spawnPoint.y-(size/2)], new Size(size, size));
	
	var cornerSize = new Size(2, 2);
	var node = new Path.Rectangle(rectangle, cornerSize);
	node.fillColor="black";
	node.strokeColor = 'black';
	node.removeOnDrag()
	return node;
}

function handleRelease(event) {

	if (lineDrawing) {
		if(path.length<=0){
			//lines.addChild(wire)
			wire.remove()
			//path.remove()
			/*for (var i = 0; i < path1.children.length; i++) {
				var element = path1.children[i];
				element.remove()
				
			}*/
			//path1.remove()
		}else{

			// if an end node or a start node of a wire is placed on the start, end or middle of any other wire, the two wires are connected, two middles colliding does not mean a connection.
			//every node needs to hava a sister wire connected to it and a sister node on the wires oposite end
			// therefore, the only important information required to describe any wire in terms of its shape and connection to other wires is:	It's start and end points
			// these points are designated: .wireStartPos, .wireEndPos
			// these points are stored in the .data atribute of the 

			var hitTestOptions = {
				fill: false,
				tolerance: 1,
				curves: true,
				//handles:false,
				//type: "fill",
				//class: "Group"
			}
			//doesnt hittest itself because it only checks "lines", into which it is only added later
			var hitTestStart = lines.hitTestAll(wire.data.wireStartPos, hitTestOptions)
			var hitTestEnd = lines.hitTestAll(wire.data.wireEndPos, hitTestOptions)
			console.log(hitTestStart)
			if(hitTestStart){

				for (var i = 0; i < hitTestStart.length; i++) {
					var e = hitTestStart[i]; 
					if (e) {
						console.log(e.item.parent.data)
						e.item.parent.data.connected.set([wire.data.wireStartPos.x,wire.data.wireStartPos.y].toString(), wire);
						console.log(e.item.parent.data)

					}
				}
			}
			if(hitTestEnd){

				for (var i = 0; i < hitTestEnd.length; i++) {
					var e = hitTestEnd[i]; 
					if (e) {
						e.item.parent.data.connected.set([wire.data.wireEndPos.x,wire.data.wireEndPos.y].toString(), wire);
					}
				}
			}
			

			lines.addChild(wire)
			//spawnNode(testPoint);
		}
		
		//lines.push(line)
		lineDrawing=false;
	}
	//console.log(lines)
}