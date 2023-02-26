var path;
var canvas = document.getElementById('mainCanvas');



paper.install(window);
paper.setup(canvas);



var lineDrawTool = new Tool();
//lineDrawTool.remove()
selectTool = new Tool()
selectTool.activate()

function makeOutput(parent, i, posX,posY) {
	var output
	output = makeIO(parent, i, posX,posY)
	if(!output){return undefined}

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

	input.onMouseDown = function(event) {
		console.log("WORKS");
		inputClicked(event, input);
	}
	return input;
}
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
		io.bringToFront();
	}
	io.onMouseLeave = function(event) {
		io.fillColor = fillColor;
		
	}
	

	return io;
}

parent = {out: [{posX: 100, posY: 200}]}

console.log(makeOutput(null,null,null,null));
console.log(makeOutput(parent,0,null,null));
console.log(makeOutput(null,null,100,300));
console.log(makeInput(null,null,200,100));

function outputClicked(event, self) {
	console.log("outputClicked");
	if(paper.tool == lineDrawTool){
		if(isDrawing){
			releaseDrawing();
		}
		isDrawing = true;

		if (path) {
			path.selected = false;
		}

		// Create a new path and set its stroke color to black:
		let group = new Group()
		G = group;
		path = createPath({x: self.data.x, y: self.data.y});
		group.addChild(path);
		self.bringToFront();
		//path.add(event.point);
	}
}
function inputClicked(event, self) {
	console.log("inputClicked")
	if(paper.tool == lineDrawTool){
			if(isDrawing){
				isDrawing = false;
				path.selected = false;
				
				connectToInput(path,self)
				path = undefined;
	
			}
		}
	
}

function createPath(position) {
	path = new Path({
		segments: [position/*,position*/],
		strokeColor: 'black',
		// Select the path, so we can see its segment points:
		fullySelected: true,
		strokeWidth: 5,

	});

	path.onMouseDown = function(event) {
		if(paper.tool == lineDrawTool){
			console.log("you clicked path");
			pathN = createPath(event.point);

			event.target.parent.addChild(pathN);
			isDrawing = true
	
		}
	}

	return path;
}


var textItem = new PointText({
	content: 'Click and drag to draw a line.',
	point: new Point(20, 30),
	fillColor: 'black',
});

function connectToInput(path,self) {
	if(path.segments.length <= 1){
		path.remove()
		path = undefined;
	}
	path.removeSegments(path.segments.length - 1);
	console.log(self)
	path.add({x:self.data.x,y:self.data.y});

}

selectTool.onMouseDown = function(event) {

}


/*canvas.addEventListener("contextmenu", function(event){
	//document.body.addEventListener("contextmenu", function(event){
	//console.log ('Right click');
	
	event.stopImmediatePropagation();
	event.stopPropagation();
	event.preventDefault();
	RClick()
	return false;
	//return true;
});*/

var G;
var prevTool
view.onKeyDown = function(event) {
	//console.log();
	
	if(event.key == "f") {
		console.log(project.activeLayer);
	}
	if(event.key == "o") {
		//console.log(project.activeLayer);
		G.remove();
	}
	if(event.key == "e"){
		if(prevTool == undefined) {
			prevTool = paper.tool;
			console.log("set tool on first run");
		}
		if(paper.tool != lineDrawTool){
			prevTool = paper.tool;



			console.log("switched to LineDrawTool");

			lineDrawTool.activate()
			//lineDrawTool.onMouseDown(event) 
			

			
		}else{

			console.log("switched back")
			releaseDrawing();
			prevTool.activate()
			//prevTool.onMouseDown(event) 
		}
	}
}

var isDrawing = false;

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

function RClick(){
	//path.removeSegment(path.segments.length - 1);
	console.log("RClick");
	//selectTool.activate()
	
	return false;
}



lineDrawTool.onMouseDown = function(event) {
	// If we produced a path before, deselect it:
	
	//isDrawing = true;
	if(!isDrawing){
		return
	}
	if (path) {
		path.selected = false;
	}
	
	//hit

	if(false){
		
		if(isDrawing){
			isDrawing = false;
			path.selected = false;
			
			connectToInput(path,input)
			path = undefined;

		}
		
	}
	// Create a new path and set its stroke color to black:
	/*path = new Path({
		segments: [event.point],
		strokeColor: 'black',
		// Select the path, so we can see its segment points:
		fullySelected: true
	});*/
	path.add(event.point);
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
lineDrawTool.onMouseMove = function(event) {
	if(path){
		if(path.segments.length <= 1){
			path.remove()
			path = undefined;
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
