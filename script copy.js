
var canvas = document.getElementById('mainCanvas');



paper.install(window);
paper.setup(canvas);


var isDrawing = false;
var heldPath;
var lineDrawTool = new Tool();
var deleteTool = new Tool();
var clickTool = new Tool();
var testTool = new Tool();

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
	let output
	output = makeIO(parent, i, posX,posY)
	if(!output){return undefined}
	output.data.objectType = "output"
	output.data.powerState
	output.data.connected = function() {
		console.log("TESTING FOR CONNECTIONS")
		let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 0};
		let hitResults = project.hitTestAll({x: output.data.x, y: output.data.y}, hitOptions)
		return hitResults.filter(e => e.item.id != output.id).map(e => e.item)
	}
	output.onMouseDown = function(event) {
		console.log("WORKS");
		outputClicked(event, output);
	}

	output.changePowerState = function() {
		if(output.data.powerState){
			console.log(output.data.connected());
			output.data.connected().forEach(line => {
				line.powerUpdate(true)
				//line.strokeColor = "red"
			});
		}else{
			output.data.connected().forEach(line => {
				line.powerUpdate(false)
				//line.strokeColor = "black"
			});
		}
	
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
		if (heldPath) {
			heldPath.selected = true;
		}
		heldPath = createPath({x: self.data.x, y: self.data.y});
		//heldPath.add(event.point);
		isDrawing = true;
		heldPath.segments[0].connectedToInput=self;	
		console.log(heldPath);

		//self.data.connected.push(heldPath)
		
		
	}
	if(paper.tool == clickTool){
		if(self.data.powerState){
			self.data.powerState = false;
			self.strokeColor = "black"
			//self.changePowerState()
			
		}else{
			self.data.powerState = true;
			self.strokeColor = "blue"
			//self.changePowerState()
			
		}
		self.data.connected().forEach(line => {
			//line.data.powerLevel++
			line.data.powerLevel = 0
			/*if(self.data.powerState){line.data.powerLevel = 1}*/
			line.powerCount()
			line.powerUpdate(powerCount)
			updatedLines = []
			countedLines = []
			
			//line.strokeColor = "red"
		});
		powerCount = 0
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
	if(heldPath.segments.length <= 1){
		heldPath.remove()
		heldPath = undefined;
		return;
	}
	heldPath.removeSegments(heldPath.segments.length - 1);
	heldPath.add({x:self.data.x,y:self.data.y});

	heldPath.segments[heldPath.segments.length - 1].connectedToInput=self;	

	heldPath.selected = true;
	heldPath = undefined;
	isDrawing = false;
}

function getConnectionsAtStart(path) {
	let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 1};
	let hitResults = project.hitTestAll(path.segments[0].point, hitOptions)
	//console.log(hitResults);
	return hitResults.filter(e => e.item.id != path.id).map(e => e.item)
}
function getConnectionsAtEnd(path) {
	let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 1};
	let hitResults = project.hitTestAll(path.segments[path.segments.length-1].point, hitOptions)
	//console.log(hitResults);
	//console.log(path.segments[path.segments.length-1].point);
	return hitResults.filter(e => e.item.id != path.id).map(e => e.item)
}

function getConnections(path) {
	return getConnectionsAtEnd(path).concat(getConnectionsAtStart(path))
}


function deletePath(pathToDelete) {
	let cS = getConnectionsAtStart(pathToDelete)
	let cE = getConnectionsAtEnd(pathToDelete)
	let cA = getConnections(pathToDelete)
	let recursion = []


	let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 0};
	let bDead = []
	//first
	if(pathToDelete.firstSegment.connectedToInput == undefined){
		let connected = getConnectionsAtStart(pathToDelete)
		console.log("START");
		console.log(connected);
		if(connected.length == 2){

			let storedCIs = []
			if(connected[0].segments[0].connectedToInput){storedCIs.push(connected[0].segments[0].connectedToInput)}
			if(connected[0].segments[connected[0].segments.length-1].connectedToInput){storedCIs.push(connected[0].segments[connected[0].segments.length-1].connectedToInput)}
			if(connected[1].segments[0].connectedToInput){storedCIs.push(connected[1].segments[0].connectedToInput)}
			if(connected[1].segments[connected[1].segments.length-1].connectedToInput){storedCIs.push(connected[1].segments[connected[0].segments.length-1].connectedToInput)}

			console.log(storedCIs);

			/*console.log(connected[0].segments[0].connectedToInput);
			console.log(connected[0].segments[connected[0].segments.length-1].connectedToInput);
			console.log(connected[1].segments[0].connectedToInput);
			console.log(connected[1].segments[connected[0].segments.length-1].connectedToInput);*/
			
			
			//let store = []
			//store[0] = connected[0].segments[0].connectedToInput
			//store[1] = connected[0].segments[connected[0].segments.length-1].connectedToInput
			connected[0].join(connected[1])
			//bDead.push(connected[0])
			//connected[0].segments[0].connectedToInput = store[0]
			//connected[0].segments[connected[0].segments.length-1].connectedToInput = store[1]

			storedCIs.forEach(CI => {
				let CIx = CI.data.x
				let CIy = CI.data.y
				if(connected[0].segments[0].point.x == CIx && connected[0].segments[0].point.y == CIy){
					connected[0].segments[0].connectedToInput = CI
				}
				if(connected[0].segments[connected[0].segments.length-1].point.x == CIx && connected[0].segments[connected[0].segments.length-1].point.y == CIy){
					connected[0].segments[connected[0].segments.length-1].connectedToInput = CI
				}
			})
			bDead.push(connected[0])
			//connected[0].reduce()
			//connected[0].simplify()
			//connected[0].flatten(10000000000)
			//connected[0].smooth({ type: 'catmull-rom', factor: 0.5 });
		}else if(connected.length == 1){
			
			recursion.push(connected[0])

			//deletePath(connected[0])
			

		}
	}
	
	//last
	if(pathToDelete.lastSegment.connectedToInput == undefined){
		let connected = getConnectionsAtEnd(pathToDelete)
		console.log("END");
		console.log(connected);
		if(connected.length == 2){
			let storedCIs = []
			if(connected[0].segments[0].connectedToInput){storedCIs.push(connected[0].segments[0].connectedToInput)}
			if(connected[0].segments[connected[0].segments.length-1].connectedToInput){storedCIs.push(connected[0].segments[connected[0].segments.length-1].connectedToInput)}
			if(connected[1].segments[0].connectedToInput){storedCIs.push(connected[1].segments[0].connectedToInput)}
			if(connected[1].segments[connected[1].segments.length-1].connectedToInput){storedCIs.push(connected[1].segments[connected[0].segments.length-1].connectedToInput)}


			console.log(storedCIs);
			/*let store = []
			console.log(connected[0].segments[0].connectedToInput);
			console.log(connected[0].segments[connected[0].segments.length-1].connectedToInput);
			console.log(connected[1].segments[0].connectedToInput);
			console.log(connected[1].segments[connected[0].segments.length-1].connectedToInput);*/
			//store[0] = connected[0].segments[0].connectedToInput
			//store[1] = connected[0].segments[connected[0].segments.length-1].connectedToInput
			connected[0].join(connected[1])
			
			/*connected[0].segments[0].connectedToInput = store[0]
			connected[0].segments[connected[0].segments.length-1].connectedToInput = store[1]*/
			//connected[0].reduce()
			//connected[0].simplify()
			//connected[0].flatten(10000000000)
			//connected[0].smooth({ type: 'catmull-rom', factor: 0.5 });
			storedCIs.forEach(CI => {
				let CIx = CI.data.x
				let CIy = CI.data.y
				if(connected[0].segments[0].point.x == CIx && connected[0].segments[0].point.y == CIy){
					connected[0].segments[0].connectedToInput = CI
				}
				if(connected[0].segments[connected[0].segments.length-1].point.x == CIx && connected[0].segments[connected[0].segments.length-1].point.y == CIy){
					connected[0].segments[connected[0].segments.length-1].connectedToInput = CI
				}
			})
			bDead.push(connected[0])
		}else if(connected.length == 1){
			//if(connected[0].lastSegment.connectedToInput == undefined){
			recursion.push(connected[0])
			//deletePath(connected[0])
			//}
			

		}
		//var hitResult = project.hitTestAll(event.target.lastSegment.point, hitOptions);
	}
	console.log("LOG AT FULLEND");
	
	updatedLines = []
	countedLines = []
	powerCount = 0
	console.log(pathToDelete);

	pathToDelete.remove();
	bDead.forEach(line => {
		//line.data.powerLevel++
		console.log(line)
		line.data.powerLevel = 0
		line.powerCount()
		console.log(powerCount)
		line.powerUpdate(powerCount)
		console.log(line.data.powerLevel)		
		//line.strokeColor = "red"
	});
	updatedLines = []
	countedLines = []
	powerCount = 0

	if(bDead.length == 0){
		cA.forEach(line => {
			//line.data.powerLevel++
			console.log(line)
			line.data.powerLevel = 0
			line.powerCount()
			line.powerUpdate(powerCount)
			
			//line.strokeColor = "red"
		})
	}
	updatedLines = []
	countedLines = []
	powerCount = 0
	/*cE.forEach(line => {
		//line.data.powerLevel++
		console.log(line)
		
		line.data.powerLevel = 0
		line.powerCount()
		line.powerUpdate(powerCount)
		
		//line.strokeColor = "red"
	});*/
	updatedLines = []
	countedLines = []
	powerCount = 0
	console.log("LOG AT FULLEND1");
	
	if(recursion){
		recursion.forEach(e => {
			deletePath(e)
		})
	}
}

let updatedLines = []
let countedLines = []
let powerCount = 0
function createPath(position,segmentsArray) {
	
	
	let segments;
	if(segmentsArray == undefined){
		segments = [position];
	}else{
		segments = segmentsArray;
	}

	let cPath = new Path({
		segments: segments,
		strokeColor: 'black',
		// Select the path, so we can see its segment points:
		fullySelected: true,
		strokeWidth: 5,
		data: {connections: new Array(),parentCont: null}
	});
	cPath.data.objectType = "line"
	//path.onMouseDown = function(event) {
	cPath.data.powerLevel = 0;
	cPath.powerUpdate = function(level) {
		
		cPath.data.powerLevel = level
		getConnections(cPath).forEach(line => {
			if(!updatedLines.includes(line.id)){
				updatedLines.push(line.id)
				//line.data.powerLevel = level
				line.powerUpdate(level)	
			}
		})
		if(cPath.data.powerLevel >= 1 ){
			cPath.turnOn()
		}
		if(cPath.data.powerLevel == 0){
			cPath.turnOff()
		}
		
	}
	cPath.powerCount = function() {
		
		/*getIO(){
			let hitOptions = {ends:false, segments: false,stroke: false,curves:false, fill: true,tolerance: 0};
			return hitResults = project.hitTestAll(event.point, hitOptions)
		}*/
		if(cPath.segments[0].connectedToInput){
			console.log("a");
			if(cPath.segments[0].connectedToInput.data.objectType === "output"){
				console.log("b");

				if(cPath.segments[0].connectedToInput.data.powerState){
					console.log("c");

					powerCount++
				}
			}
			
		}
		if(cPath.segments[cPath.segments.length - 1].connectedToInput){
			console.log("1a");
			if(cPath.segments[cPath.segments.length - 1].connectedToInput.data.objectType === "output"){
				console.log("1b");
				if(cPath.segments[cPath.segments.length - 1].connectedToInput.data.powerState){
					console.log("1c");
					powerCount++
				}
			}
		}
		getConnections(cPath).forEach(line => {
			if(!countedLines.includes(line.id)){
				countedLines.push(line.id)
				
				line.powerCount()	
			}
		})
		
		
	}
	cPath.turnOff = function(){
		cPath.strokeColor = "black"
	}
	cPath.turnOn = function(){
		cPath.strokeColor = "blue"
	}
	let gwseh;
	cPath.onMouseDown = function(event) {
		if(paper.tool == clickTool){
			
			if(cPath.strokeColor != "green"){
				gwseh = cPath.strokeColor
				cPath.strokeColor = "green"
			}else{
				cPath.strokeColor = gwseh
			}
			
		}
	}
	cPath.clickedLineDraw = function(event, self,location) {
		if(isDrawing){
			//adding drawn path to self (path)
			if(heldPath.segments.length <= 1){
				heldPath.remove()
				heldPath = undefined;
				return;
			}


			console.log("b");
			
			heldPath.removeSegments(heldPath.segments.length - 1);
			heldPath.add(self.getNearestPoint(event.point));
			var location = location;
			var lIndx = location.index;
			
			
			
			
			
			
			segment = self.insert(location.index + 1, self.getNearestPoint(event.point));
			


			aPath = createPath(undefined, self.segments.slice(lIndx + 1))
			if(self.lastSegment.connectedToInput){
				aPath.segments[aPath.segments.length - 1].connectedToInput = self.lastSegment.connectedToInput;
			}
			let store;
			if(self.firstSegment.connectedToInput){
				 store = self.firstSegment.connectedToInput
			}
			self.segments = self.segments.slice(0,lIndx + 2)
			self.segments[0].connectedToInput = store
			//event.target.smooth();

			updatedLines = []
			countedLines = []
			powerCount = 0

			aPath.data.powerLevel = 0
			aPath.powerCount()
			aPath.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0

			self.data.powerLevel = 0
			self.powerCount()
			self.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0

			aPath.selected = true;
			heldPath = undefined;
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
				if (hitResult.type == 'stroke') {
					console.log("b");

					var location = hitResult.location;
					var lIndx = location.index;
					console.log(location.index)
					
					segment = self.insert(location.index + 1, self.getNearestPoint(event.point));

					/*
					createPath(undefined, self.segments.slice(lIndx + 1))
					self.segments = self.segments.slice(0,lIndx + 2)*/
					aPath = createPath(undefined, self.segments.slice(lIndx + 1))
					if(self.lastSegment.connectedToInput){
						aPath.segments[aPath.segments.length - 1].connectedToInput = self.lastSegment.connectedToInput;
					}
					let store;
					if(self.firstSegment.connectedToInput){
						 store = self.firstSegment.connectedToInput
					}
					self.segments = self.segments.slice(0,lIndx + 2)
					self.segments[0].connectedToInput = store

					updatedLines = []
					countedLines = []
					powerCount = 0
		
					aPath.data.powerLevel = 0
					aPath.powerCount()
					aPath.powerUpdate(powerCount)
		
					updatedLines = []
					countedLines = []
					powerCount = 0
		
					//self.data.powerLevel = 0
					//self.powerCount()
					//self.powerUpdate(powerCount)
		
					updatedLines = []
					countedLines = []
					powerCount = 0




				}
			}
			heldPath = createPath(cPath.getNearestPoint(event.point));
			heldPath.add(event.point);
			
			isDrawing = true
		}
	}
	cPath.clickedDelete = function(event, self){
			deletePath(cPath)
	}

	return cPath;
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
		console.log("switched to test");
		testTool.activate()
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
	if(event.key == "c"){
		releaseDrawing()
		clickTool.activate()
		console.log("click tool activated")
	}
}

function releaseDrawing(){
	if(isDrawing){
		heldPath.removeSegment(heldPath.segments.length -1);
		if(heldPath.segments.length <= 1){
			heldPath.remove();
		}
		heldPath = undefined;
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

	if(isDrawing && heldPath && !hitLine){	
		//heldPath.removeSegment(heldPath.segments.length -1);
		//heldPath.add(event.point);
		heldPath.add(event.point);
		
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
	if(heldPath){
		return hitResults.filter(e => e.item.id != heldPath.id)
	}else{
		return hitResults;
	}

}
// While the user drags the mouse, points are added to the path
// at the position of the mouse:
lineDrawTool.onMouseMove = function(event) {
	if(heldPath){
		if(heldPath.segments.length <= 1){
			heldPath.remove()
			heldPath = undefined;
			//return;
		}

		heldPath.removeSegment(heldPath.segments.length - 1);
		//console.log(path.segments[path.segments.length - 1].point);

		//we need to do this the hard boilerplate way because we dont use paperscript :C :C :C
		//This clownfest draws the line behind the cursor
		let a = {x:heldPath.segments[heldPath.segments.length - 1].point.x, y:heldPath.segments[heldPath.segments.length - 1].point.y}
		let b = {x:event.point.x,y:event.point.y};
		let vector = new Point(b.x - a.x,b.y - a.y);
		vector.length = vector.length - 20;
		c = {x: a.x + vector.x, y: a.y + vector.y};
		heldPath.add(c);

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

testTool.onMouseDown = function(event) {
	let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 10};
	let hitResults = project.hitTestAll(event.point, hitOptions)
	console.log("WE HIT:");
	console.log(hitResults);
	//return hitResults.filter(e => e.item.id != path.id).map(e => e.item)
}