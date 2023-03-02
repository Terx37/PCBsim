
var canvas = document.getElementById('mainCanvas');



paper.install(window);
paper.setup(canvas);


var isDrawing = false;
var path;
var lineDrawTool = new Tool();
var deleteTool = new Tool();

//lineDrawTool.remove()
selectTool = new Tool()
selectTool.activate()

parent = {out: [{posX: 100, posY: 200}]}

console.log(makeOutput(null,null,null,null));
console.log(makeOutput(parent,0,null,null));
console.log(makeOutput(null,null,100,300));
console.log(makeInput(null,null,200,100));


function makeIO(parent,i,posX, posY,radius = 20,width = 7,fillColor = "yellow",strokeColor = "black",hoverColor = "red") {
	//if suplied parent of output and number of output, automaticly places itself to the correct position
	//if suplied position, uses that
	//if none, returns undefined
	var io
	if(posX && posY) {
		io = new Path.Circle(new Point(posX, posY), radius);
		io.data = {x: posX,y: posY}	
	}else if(parent){
		io = new Path.Circle(new Point(parent.out[i].posX, parent.out[i].posY), radius);
		io.data = {x: parent.out[i].posX,y: parent.out[i].posY}
	}else{
		return undefined;
	}
	io.strokeWidth = width;
	io.fillColor = fillColor;
	io.strokeColor = strokeColor;
	io.onMouseEnter = function(event) {
		io.fillColor = hoverColor;
		
	}
	io.onMouseLeave = function(event) {
		io.fillColor = fillColor;
		
	}
	io.onFrame = function() {
		io.bringToFront();
	}

	return io;
}

function makeOutput(parent, i, posX,posY) {
	var output
	output = makeIO(parent, i, posX,posY)
	if(!output){return undefined}
	output.data.objectType = "output"
	output.onMouseDown = function(event) {
		console.log("WORKS");
		outputClicked(event, output);
	}
	return output;
}

function makeInput(parent, i, posX,posY) {
	var input
	input = makeIO(parent, i, posX,posY)
	if(!input){return undefined}
	input.data.objectType = "input"
	input.onMouseDown = function(event) {
		console.log("WORKS");
		inputClicked(event, input);
	}
	return input;
}

function outputClicked(event, self) {
	console.log("outputClicked");
	if(paper.tool == lineDrawTool){
		if(isDrawing){
			releaseDrawing();
		}
		

		if (path) {
			path.selected = true;
		}

		// Create a new path and set its stroke color to black:

		path = createPath({x: self.data.x, y: self.data.y});
		path.add(event.point);
		isDrawing = true;
		path.segments[0].connectedToInput=true;	
		console.log(path);
		
		//self.bringToFront();
		//path.add(event.point);
	}
}

function inputClicked(event, self) {
	console.log("inputClicked")
	if(paper.tool == lineDrawTool){
			if(isDrawing){
				connectToInput(self)
			}
		}
	
}

function connectToInput(self) {
	if(path.segments.length <= 1){
		path.remove()
		path = undefined;
		return;
	}
	path.removeSegments(path.segments.length - 1);
	path.add({x:self.data.x,y:self.data.y});

	path.segments[path.segments.length - 1].connectedToInput=true;	

	path.selected = true;
	path = undefined;
	isDrawing = false;
}

function deletePath(pathToDelete) {
	let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 0};
	
	//first
	if(pathToDelete.firstSegment.connectedToInput == undefined){
		let hitResults = project.hitTestAll(pathToDelete.firstSegment.point, hitOptions)
		let connected = []
		
		hitResults.forEach(function(hitResult){
			//if hit self
			if(hitResult.item.id == pathToDelete.id){
				//discard
				return;
			}
			connected.push(hitResult.item)
	
			console.log(hitResult);
			
		})
		if(connected.length == 2){
			connected[0].join(connected[1])
			//connected[0].reduce()
			//connected[0].simplify()
			//connected[0].flatten(10000000000)
			//connected[0].smooth({ type: 'catmull-rom', factor: 0.5 });
		}else if(connected.length == 1){
			
			
			deletePath(connected[0])
			
	
		}
	}
	
	//last
	if(pathToDelete.lastSegment.connectedToInput == undefined){
		let hitResults = project.hitTestAll(pathToDelete.lastSegment.point, hitOptions)
		let connected = []
		hitResults.forEach(function(hitResult){
			//if hit self
			if(hitResult.item.id == pathToDelete.id){
				//discard
				return;
			}
			connected.push(hitResult.item)
			console.log(hitResult);
			
		})
		console.log(connected.length);
		if(connected.length == 2){
			
			connected[0].join(connected[1])
			//connected[0].reduce()
			//connected[0].simplify()
			//connected[0].flatten(10000000000)
			//connected[0].smooth({ type: 'catmull-rom', factor: 0.5 });

		}else if(connected.length == 1){
			//if(connected[0].lastSegment.connectedToInput == undefined){
				deletePath(connected[0])
			//}
			

		}
		//var hitResult = project.hitTestAll(event.target.lastSegment.point, hitOptions);
	}
	pathToDelete.remove();
	
}
function createPath(position,segmentsArray) {
	
	
	let segments;
	if(segmentsArray == undefined){
		segments = [position];
	}else{
		segments = segmentsArray;
	}

	path = new Path({
		segments: segments,
		strokeColor: 'black',
		// Select the path, so we can see its segment points:
		fullySelected: true,
		strokeWidth: 5,
		data: {connections: new Array(),parentCont: null}
	});
	path.data.objectType = "line"
	//path.onMouseDown = function(event) {
	path.clickedLineDraw = function(event, self,location) {
		if(isDrawing){
			//adding drawn path to self (path)
			if(path.segments.length <= 1){
				path.remove()
				path = undefined;
				return;
			}


			console.log("b");
			
			path.removeSegments(path.segments.length - 1);
			path.add(self.getNearestPoint(event.point));
			var location = location;
			var lIndx = location.index;
			segment = self.insert(location.index + 1, self.getNearestPoint(event.point));
			
			createPath(undefined, self.segments.slice(lIndx + 1))
			self.segments = self.segments.slice(0,lIndx + 2)
			//event.target.smooth();

			path.selected = true;
			path = undefined;
			isDrawing = false;
		} else {
			console.log("you started drawing from path");
			var hitOptions = {
				segments: false,
				stroke: true,
				fill: true,
				tolerance: 15
			};
			var hitResult = project.hitTest(self.getNearestPoint(event.point), hitOptions);
			if (hitResult) {
				if (hitResult.type == 'segment') {
					console.log("a");
					segment = hitResult.segment;
				} else if (hitResult.type == 'stroke') {
					console.log("b");

					var location = hitResult.location;
					var lIndx = location.index;
					console.log(location.index)
					
					segment = self.insert(location.index + 1, self.getNearestPoint(event.point));

					
					createPath(undefined, self.segments.slice(lIndx + 1))
					self.segments = self.segments.slice(0,lIndx + 2)
				}
			}
			createPath(path.getNearestPoint(event.point));
			path.add(event.point);
			
			isDrawing = true
		}
	}
	path.clickedDelete = function(event, self){
			deletePath(self)
	}

	return path;
}


var textItem = new PointText({
	content: 'Click and drag to draw a line.',
	point: new Point(20, 30),
	fillColor: 'black',
});



var prevTool
view.onKeyDown = function(event) {
	//console.log();
	
	if(event.key == "f") {
		console.log(project.activeLayer);
		console.log(project.activeLayer.children[4].data.parentCont)
	}
	if(event.key == "o") {

	}
	if(event.key == "e"){
		console.log("switched to LineDrawTool");
		lineDrawTool.activate()
	}
	if(event.key == "s"){
		releaseDrawing();
		selectTool.activate()
		console.log("select tool activated")

	}
	if(event.key == "d"){
		releaseDrawing();
		deleteTool.activate()
		console.log("delete tool activated")

	}
}

function releaseDrawing(){
	if(isDrawing){
		path.removeSegment(path.segments.length -1);
		if(path.segments.length <= 1){
			path.remove();
		}
		path = undefined;
		isDrawing = false;
	}
}

lineDrawTool.onMouseDown = function(event) {
	let hitLine = false
	hitTestOnMouseDown(event).every(function(hitResult){

		/*if (hitResult.type =='stroke') {
		}*/
		if (hitResult.item.data.objectType =='line') {
			console.log("CLICKED ON STROKE");
			hitResult.item.clickedLineDraw(event, hitResult.item,hitResult.location);
			hitLine = true;
			return false;
		}
		
	})

	if(isDrawing && path && !hitLine){	
		path.removeSegment(path.segments.length -1);
		path.add(event.point);
		path.add(event.point);
		
		//lineDrawTool.onMouseMove(event)
	}
}
selectTool.onMouseDown = function(event) {

}

deleteTool.onMouseDown = function(event) {
	
	hitTestOnMouseDown(event).every(function(hitResult){

		if (hitResult.item.data.objectType =='line') {
			
			hitResult.item.clickedDelete(event, hitResult.item);
			return false;
		}
	})
}

function hitTestOnMouseDown(event){
	var hitOptions = {
		segments: false,
		stroke: false,
		fill: false,
		curves: true,
		tolerance: 15
	};
	var hitResults = project.hitTestAll(event.point, hitOptions);
	if(path){
		return hitResults.filter(e => e.item.id != path.id)
	}else{
		return hitResults;
	}

}
// While the user drags the mouse, points are added to the path
// at the position of the mouse:
lineDrawTool.onMouseMove = function(event) {
	if(path){
		if(path.segments.length <= 1){
			path.remove()
			path = undefined;
			return;
		}

		path.removeSegment(path.segments.length - 1);
		//console.log(path.segments[path.segments.length - 1].point);

		//we need to do this the hard boilerplate way because we dont use paperscript :C :C :C
		//This clownfest draws the line behind the cursor
		let a = {x:path.segments[path.segments.length - 1].point.x, y:path.segments[path.segments.length - 1].point.y}
		let b = {x:event.point.x,y:event.point.y};
		let vector = new Point(b.x - a.x,b.y - a.y);
		vector.length = vector.length - 20;
		c = {x: a.x + vector.x, y: a.y + vector.y};
		path.add(c);

	}
	

	// Update the content of the text item to show how many
	// segments it has:
	//textItem.content = 'Segment count: ' + path.segments.length;
}

// When the mouse is released, we simplify the path:
lineDrawTool.onMouseUp = function(event) {
	//var segmentCount = path.segments.length;

	// When the mouse is released, simplify it:
	//path.simplify(10);

	// Select the path, so we can see its segments:
	//path.fullySelected = true;

	/*
	var newSegmentCount = path.segments.length;
	var difference = segmentCount - newSegmentCount;
	var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
	textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';
	*/
}
