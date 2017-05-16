
function run(){
	var number_of_agents = parseInt(document.getElementById("number_of_agents").value);
	var number_of_rounds = parseInt(document.getElementById("number_of_rounds").value);
	var AFF = parseFloat(document.getElementById("AFF").value);
	var AI = parseFloat(document.getElementById("AI").value);
	var powerA = parseInt(document.getElementById("powerA").value);
	var BFF = parseFloat(document.getElementById("BFF").value);
	var BI = parseFloat(document.getElementById("BI").value);
	var powerB = parseInt(document.getElementById("powerB").value);
// 	var Alloc = parseInt(document.getElementById("Alloc").value);
	var Alloc = 0;
	var explorationPercent = parseFloat(document.getElementById("explorationPercent").value);
	var explorationRecPercent = parseFloat(document.getElementById("explorationRecPercent").value);
	var firstExpNum = parseInt(document.getElementById("firstExpNum").value);
	var distribution = document.getElementById("distribution")[document.getElementById("distribution").selectedIndex].value;
	var graph = document.getElementById("graph")[document.getElementById("graph").selectedIndex].value;
	var punishment = document.getElementById("punishment")[document.getElementById("punishment").selectedIndex].value;
	var model = document.getElementById("model")[document.getElementById("model").selectedIndex].value;
	var saw_weight = parseFloat(document.getElementById("saw").value);
	var saw_days = parseFloat(document.getElementById("sawDays").value);
	var logitsens = parseInt(document.getElementById("logitsens").value);
	var within = document.getElementById("within").checked;
	var withinNumber = parseInt(document.getElementById("withinNumber").value);
	var Days_to_average = parseInt(document.getElementById("Days_to_average").value);
	total_recall_recommendation(number_of_rounds,number_of_agents,AFF,AI,powerA,BFF,BI,powerB,Alloc,explorationPercent,explorationRecPercent,firstExpNum,distribution,graph,model,punishment,saw_weight,saw_days,logitsens,within,withinNumber,Days_to_average)
}
function slicer(start,end){
	var start = parseInt(document.getElementById("start").value);
	var end = parseInt(document.getElementById("end").value)+1;
	var headers = [array[0]];
	var range = array.slice(start,end);
	temparray = headers.concat(range);
	document.getElementById("curve_chart").innerHTML=""
	drawChart(true);
}
