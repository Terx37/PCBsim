
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

	io.data.connected = [];

	io.onMouseEnter = function(event) {
		io.fillColor = hoverColor;
		
	}
	io.onMouseLeave = function(event) {
		io.fillColor = fillColor;
		
	}
	io.onFrame = function() {
		io.bringToFront();
	}
	io.addConnected = function(connected, fromStartOrEnd) {

		if(!io.data.connected.some(e => e.c.id == connected.id)){
			io.data.connected.push({c:connected,f:fromStartOrEnd})
		}
		/*
		if(!io.data.connected.includes(connected)){
			io.data.connected.push({c:connected,f:fromStartOrEnd})
		}
		*/
	}
	io.removeConnected = function(connected) {
		let ia
		if(io.data.connected.some((e,i) => {if(e.c.id == connected.id){ia = i;return true;}})){
			io.data.connected.splice(ia, 1)
		}

		/*
		if(io.data.connected.includes(connected)){
			io.data.connected.splice(io.data.connected.indexOf(connected), 1)
			return "io"
		}
		*/
	}
	return io;
}

function makeOutput(parent, i, posX,posY) {
	let output
	output = makeIO(parent, i, posX,posY)
	if(!output){return undefined}
	output.data.objectType = "output"
	output.data.powerState
	/*output.data.connected = function() {
		console.log("TESTING FOR CONNECTIONS")
		let hitOptions = {ends:true, segments: false,stroke: false,curves:false, fill: false,tolerance: 0};
		let hitResults = project.hitTestAll({x: output.data.x, y: output.data.y}, hitOptions)
		return hitResults.filter(e => e.item.id != output.id).map(e => e.item)
	}*/
	
	
	
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

		//NEW
		self.addConnected(heldPath,"start")
		heldPath.addConnectedStart(self,"con")


		//heldPath.add(event.point);
		isDrawing = true;
		
		//heldPath.segments[0].connectedToInput=self;	
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

	//heldPath.segments[heldPath.segments.length - 1].connectedToInput=self;	
	heldPath.addConnectedEnd(self, "io")
	self.addConnected(heldPath,"end")

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


function deletePath(pathTD) {

	function deleteAndWeld(EndStart){
		if(EndStart.length == 2){
			console.log("ONE");
			console.log(EndStart.slice());
			let A = EndStart[0]
			let Ainner
			let Aouter
			if(A.data.conEnd.some(e => e.c.id == pathTD.id)){
				Ainner = A.data.conEnd.slice()
				Aouter = A.data.conStart.slice()
			}else{
				Ainner = A.data.conStart.slice()
				Aouter = A.data.conEnd.slice()
			}
			let B = EndStart[1]
			console.log(EndStart.slice());
			let Binner
			let Bouter
			if(B.data.conEnd.some(e => e.c.id == pathTD.id)){
				console.log("TWOA");
				Binner = B.data.conEnd
				Bouter = B.data.conStart
				//B.data.conStart.forEach((e)=>{
					let r = pathTD.removeConnected(B)
					let resp = B.data.conStart[0].removeConnected(B)
					console.log(EndStart.slice());

					console.log(resp);
					if (resp == "end"){
						B.data.conStart[0].addConnectedEnd(A,"end")
						console.log("A");
					}
					if (resp == "start"){
						B.data.conStart[0].addConnectedStart(A,"end")
						console.log("B");

					}
				//})
				console.log(EndStart.slice());
			
			}else{
				console.log("TWOB");
				Binner = B.data.conStart
				Bouter = B.data.conEnd
				B.data.conEnd.forEach((e)=>{
					let resp
					if(e.f == "start"){
						resp = e.c.removeConnectedStart(B)
					}else if(e.f == "end"){
						resp = e.c.removeConnectedEnd(B)

					}
					if (resp == "end"){
						e.c.addConnectedEnd(A,"start")
						console.log("A1");
					}
					if (resp == "start"){
						e.c.addConnectedStart(A,"start")
						console.log("B1");
					}
				})
			}

			//EndStart[1] = Binner
			console.log(EndStart.slice());
			EndStart[0].join(EndStart[1])
			A.data.conStart = Aouter
			A.data.conEnd = Binner
		}else{
			pathTD.data.conEnd.forEach((e)=>{
				e.removeConnected(pathTD)
			})
		}
	}
	
	deleteAndWeld(pathTD.data.conEnd)
	deleteAndWeld(pathTD.data.conStart)
	/*pathTD.data.conStart.forEach((e)=>{
		e.removeConnected(pathTD)
	})*/


	pathTD.remove();
	
	/*if(recursion){
		recursion.forEach(e => {
			deletePath(e)
		})
	}*/
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
	cPath.data.conStart = []
	cPath.data.conEnd = []


	//we tell the function if we pushed this connection from its start or from its end
	//so that if 
	cPath.addConnectedStart = function(connected, fromStartOrEnd) {
		//if(!cPath.data.conStart.includes(connected)){

		if(!cPath.data.conStart.some(e => e.c.id == connected.id)){
			cPath.data.conStart.push({c: connection, f: fromStartOrEnd})
		}
	}
	cPath.addConnectedEnd = function(connected, fromStartOrEnd) {
		//if(!cPath.data.conEnd.includes(connected)){
		
		if(!cPath.data.conEnd.some(e => e.c.id == connected.id)){
			cPath.data.conEnd.push({c: connection, f: fromStartOrEnd})
		}
	}
	cPath.removeConnectedStart = function(connected) {
		/*if(cPath.data.conEnd.includes(connected)){
			cPath.data.conEnd.splice(cPath.data.conEnd.indexOf(connected), 1)
			return "end"
		}*/
		let ib
		if (cPath.data.conStart.some((e,i) => {if(e.c.id == connected.id){ib=i;return true}})) {
			cPath.data.conStart.splice(ib, 1)
			return "start"
		}
		/*
		if(cPath.data.conStart.includes(connected)){
			cPath.data.conStart.splice(cPath.data.conEnd.indexOf(connected), 1)
			return "start"
		}
		*/
	}
	cPath.removeConnectedEnd = function(connected, instigatorStartOrEnd) {
		
		let ia
		
		if (cPath.data.conEnd.some((e,i) => {if(e.c.id == connected.id){ia=i;return true}})) {
			cPath.data.conEnd.splice(ia, 1)
			return "end"
		}
		
	}
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
	cPath.clickedLineDraw = function(event,location) {
		if(isDrawing){
			//ending drawing at path
			//adding drawn path to self (path)
			if(heldPath.segments.length <= 1){
				heldPath.remove()
				heldPath = undefined;
				return;
			}


			console.log("b");
			
			heldPath.removeSegments(heldPath.segments.length - 1);
			heldPath.add(cPath.getNearestPoint(event.point));
			var location = location;
			var lIndx = location.index;
		
			segment = cPath.insert(location.index + 1, cPath.getNearestPoint(event.point));
			

			//last half
			pathB = createPath(undefined, cPath.segments.slice(lIndx + 1))
			pathB.data.conEnd = cPath.data.conEnd.slice()
			pathB.data.conStart = [cPath, heldPath]
			
			//mod connections
			//old end before we shorten the cPath
			cPath.data.conEnd.forEach((e)=>{
				
				e.removeConnected(cPath)
				
			})

			//first half
			cPath.segments = cPath.segments.slice(0,lIndx + 2)
			//cPath.data.conStart = cPath.data.conStart.slice()
			cPath.data.conEnd = [pathB, heldPath]
			
			//drawn path
			heldPath.data.conEnd = [cPath, pathB]

			/*
			aPath = createPath(undefined, cPath.segments.slice(lIndx + 1))
			if(cPath.lastSegment.connectedToInput){
				aPath.segments[aPath.segments.length - 1].connectedToInput = cPath.lastSegment.connectedToInput;
			}
			let store;
			if(cPath.firstSegment.connectedToInput){
				 store = cPath.firstSegment.connectedToInput
			}
			cPath.segments = cPath.segments.slice(0,lIndx + 2)
			cPath.segments[0].connectedToInput = store
			*/
			//event.target.smooth();

			/*updatedLines = []
			countedLines = []
			powerCount = 0

			aPath.data.powerLevel = 0
			aPath.powerCount()
			aPath.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0

			cPath.data.powerLevel = 0
			cPath.powerCount()
			cPath.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0
			*/
			pathB.selected = true;
			heldPath = undefined;
			isDrawing = false;
		} else {
			//start drawing at path
			console.log("you started drawing from path");

			console.log("b");

			var location = location;
			var lIndx = location.index;
			console.log(location.index)
			
			//segment = cPath.insert(location.index + 1, cPath.getNearestPoint(event.point));
			heldPath = createPath(cPath.getNearestPoint(event.point));
			heldPath.add(event.point);
			segment = cPath.insert(location.index + 1, cPath.getNearestPoint(event.point));
			

			//last half
			pathB = createPath(undefined, cPath.segments.slice(lIndx + 1))
			pathB.data.conEnd = cPath.data.conEnd.slice()
			pathB.data.conStart = [cPath, heldPath]
			
			//mod connections
			//old end before we shorten the cPath
			cPath.data.conEnd.forEach((e)=>{
				if(e.data)
				if(e.data.conEnd){
					if(e.data.conEnd.includes(cPath)){
						e.data.conEnd.splice(e.data.conEnd.indexOf(cPath), 1)
					}
				}
				if(e.data.conStart){
					if(e.data.conStart.includes(cPath)){
						e.data.conStart.splice(e.data.conEnd.indexOf(cPath), 1)
					}
				}
				if(e.data.connected){
					if(e.data.connected.includes(cPath)){
						e.data.connected.splice(e.data.connected.indexOf(cPath), 1)
					}
				}
			})

			//first half
			
			cPath.segments = cPath.segments.slice(0,lIndx + 2)
			//cPath.data.conStart = cPath.data.conStart.slice()
			cPath.data.conEnd = [pathB, heldPath]
			
			//drawn path
			
			heldPath.data.conStart = [cPath, pathB]
			/*
			createPath(undefined, self.segments.slice(lIndx + 1))
			self.segments = self.segments.slice(0,lIndx + 2)*/
			/*aPath = createPath(undefined, cPath.segments.slice(lIndx + 1))
			if(cPath.lastSegment.connectedToInput){
				aPath.segments[aPath.segments.length - 1].connectedToInput = cPath.lastSegment.connectedToInput;
			}
			let store;
			if(cPath.firstSegment.connectedToInput){
					store = cPath.firstSegment.connectedToInput
			}
			cPath.segments = cPath.segments.slice(0,lIndx + 2)
			cPath.segments[0].connectedToInput = store

			updatedLines = []
			countedLines = []
			powerCount = 0

			aPath.data.powerLevel = 0
			aPath.powerCount()
			aPath.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0*/

			//self.data.powerLevel = 0
			//self.powerCount()
			//self.powerUpdate(powerCount)

			updatedLines = []
			countedLines = []
			powerCount = 0





			
			
			isDrawing = true
		}
	}
	cPath.clickedDelete = function(event){
			deletePath(cPath)
	}

	return cPath;
}


var textItem = new PointText({
	content: 'Click and drag to draw a line.',
	point: new Point(20, 30),
	fillColor: 'black',
});
var debugTextStart
var debugTextEnd


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
			hitResult.item.clickedLineDraw(event,hitResult.location);
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
			
			hitResult.item.clickedDelete(event);
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
	let hitOptions = {ends:false, segments: true,stroke: true,curves:false, fill: false,tolerance: 10};
	let hitResults = project.hitTestAll(event.point, hitOptions)
	hitResults.forEach((e)=>{
		e.item.strokeColor = "green";

		if(debugTextEnd){
			debugTextEnd.remove();
		}
		if(debugTextStart){
			debugTextStart.remove();
		} 
		debugTextStart = new PointText({
			content: 'Click and drag to draw a line.',
			point: new Point(e.item.parent.segments[0].point.x + 20, e.item.parent.segments[0].point.y +  30),
			fillColor: 'black',
		});
		/*debugTextEnd = new PointText({
			content: 'Click and drag to draw a line.',
			point: new Point(20, 30),
			fillColor: 'black',
		});*/

	})
	console.log("WE HIT:");
	console.log(hitResults);
	
	//return hitResults.filter(e => e.item.id != path.id).map(e => e.item)
}