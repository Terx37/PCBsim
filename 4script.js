var myPath = new Path({
	segments: [[40, 115], [80, 180], [200, 20]],
	selected: true
});

myPath.strokeColor = '#ff0000';
myPath.strokeWidth = 10;

myPath.strokeJoin = 'round';
function onResize(event) {
    //document.getElementById("mainCanvas").styleList.add(`width=${document.getElementById("canvasCont").offsetWidth}`)
    //document.getElementById("mainCanvas").styleList.add(`height=${document.getElementById("canvasCont").offsetHeight}`)
	// Whenever the window is resized, recenter the path:
	myPath.position = view.center;
}
//var path = null;
        

// Mouse tool state
var isDrawing = false;
var draggingIndex = -1;


var values = {
	paths: 50,
	minPoints: 5,
	maxPoints: 15,
	minRadius: 30,
	maxRadius: 90
};

var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
};
createPaths();

function createPaths() {
	var radiusDelta = values.maxRadius - values.minRadius;
	var pointsDelta = values.maxPoints - values.minPoints;
	for (var i = 0; i < values.paths; i++) {
		var radius = values.minRadius + Math.random() * radiusDelta;
		var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
		var path = createBlob(view.size * Point.random(), radius, points);
		var lightness = (Math.random() - 0.5) * 0.4 + 0.4;
		var hue = Math.random() * 360;
		path.fillColor = { hue: hue, saturation: 1, lightness: lightness };
		path.strokeColor = 'black';
	};
}
function createBlob(center, maxRadius, points) {
	var path = new Path();
	path.closed = true;
	for (var i = 0; i < points; i++) {
		var delta = new Point({
			length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
			angle: (360 / points) * i
		});
		path.add(center + delta);
	}
	path.smooth();
	return path;
}
var segment, path;
var movePath = false;
function onMouseDown(event) {
	segment = path = null;
    
	var hitResult = project.hitTest(event.point, hitOptions);
	
    if (!hitResult){
        var radiusDelta = values.maxRadius - values.minRadius;
	    var pointsDelta = values.maxPoints - values.minPoints;
	
		var radius = values.minRadius + Math.random() * radiusDelta;
		var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
		var patha = createBlob(view.size * Point.random(), radius, points);
		var lightness = (Math.random() - 0.5) * 0.4 + 0.4;
		var hue = Math.random() * 360;
		patha.fillColor = { hue: hue, saturation: 1, lightness: lightness };
		patha.strokeColor = 'black';
        alert("a")
        //path = null
        return;
    }
    path = null
    segment = path = null;
    hitResult = project.hitTest(event.point, hitOptions);
	if (event.modifiers.shift) {
		if (hitResult.type == 'segment') {
			hitResult.segment.remove();
		};
		return;
	}

	if (hitResult) {
		path = hitResult.item;
		if (hitResult.type == 'segment') {
			segment = hitResult.segment;
		} else if (hitResult.type == 'stroke') {
			var location = hitResult.location;
			segment = path.insert(location.index + 1, event.point);
			path.smooth();
		}
	}
	movePath = hitResult.type == 'fill';
	if (movePath)
		project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
	project.activeLayer.selected = false;
	if (event.item){
		event.item.selected = true;
    }
}

function onMouseDrag(event) {
	if (segment) {
		segment.point += event.delta;
		path.smooth();
	} else if (path) {
		path.position += event.delta;
	}
}




/*


function onMouseDrag(event) {
    var options = {
        fill: true,
        tolerance: 20
      };
    
    // Maybe hit test to see if we are on top of a circle
    dragable = getDragable();
    if (!isDrawing && dragable.length > 0 && !(draggingIndex > -1)) {
        for (var ix = 0; ix < dragable.length; ix++) {
            if (dragable[ix].hitTest(event.point,options)) {
                dragable[ix].getType
                draggingIndex = ix;
                break;
            }
        }
    }

    // Should we be dragging something?
    if (draggingIndex > -1) {
        circles[draggingIndex].position = event.point;
    } else {
            // We are drawing
            /*path = new Path.Circle({
                center: event.downPoint,
                radius: (event.downPoint - event.point).length,
                fillColor: null,
                strokeColor: 'black',
                strokeWidth: 10
                
            });*//*
            size = 15;
            path = new Path.Rectangle({
                point: event.downPoint - (size/2),
                size:  size,
                fillColor: null,
                strokeColor: 'black',
                strokeWidth: 2
                
            });
            
            //nodeOuter = new Path.Circle
            path.removeOnDrag();
            isDrawing = true;
    }
};

function onMouseUp(event) {
    if (isDrawing) {
        circles.push(path);
    }

    // Reset the tool state
    isDrawing = false;
    draggingIndex = -1;
};

*/