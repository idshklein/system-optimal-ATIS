var array,temparray;
var number_of_agents_viz;
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart(slice) {
	typeof slice === "undefined"? slice = false :slice;
	var data = slice?google.visualization.arrayToDataTable(temparray):google.visualization.arrayToDataTable(array);
	var width = screen.width.toString();
	// var width = "5000";
	var options = {
// 	title: 'Network dynamics',
	  width: width,
	  height:"900",
	  // curveType: 'function',
	  legend: {textStyle:{color: '#000000', fontSize:30}},
	  vAxis:{title: 'Agents', titleTextStyle: {color: '#000000', fontSize:50},viewWindowMode: 'explicit',viewWindow: {max: number_of_agents_viz,min: 0},textStyle:{color: '#000000', fontSize:30}},
	  hAxis:{title: 'Round number', titleTextStyle: {color: '#000000', fontSize:50},textStyle:{color: '#000000', fontSize:30}},
	};
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
	google.visualization.events.addListener(chart, 'ready', function () {
        document.getElementById('curve_chart').innerHTML = '<img src="' + chart.getImageURI() + '">';
//         console.log(document.getElementById('curve_chart').innerHTML);
      });
	chart.draw(data, options);
}