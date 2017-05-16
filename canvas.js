function draw(points, lines){
	for (var i = 0; i < points.length; i ++){
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.arc(points[i].x,points[i].y,5,0,2*Math.PI);
		ctx.stroke();
	}
	for (var i = 0; i < lines.length; i ++){
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.moveTo(lines[i][0].x,lines[i][0].y);
		ctx.lineTo(lines[i][1].x,lines[i][1].y);
		ctx.stroke();
	}
}
var vertices = Object.keys(network_example.vertices).map(function (key) {return network_example.vertices[key];});
function edges_to_vertices_draw(v,e){
	var edges =[];
	for (var i = 0; i < e.length; i++){
		edges.push([v[e[i].start],v[e[i].end]])
	}
	return edges
}
var edges = edges_to_vertices_draw(network_example.vertices,network_example.edges)
draw(vertices,edges)  