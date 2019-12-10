// function total_recall(number_of_rounds,number_of_agents,AFF,AI,powerA,BFF,BI,powerB,Alloc,explorationPercent){
// 	array = [["number","actual","SO: ","UE: ","average: "]];
// 	number_of_agents_viz = number_of_agents;
// 	var agents = [];
// 	var world = new SOUECALC();
// 	world.participantsNum = number_of_agents;
// 	world.AFF = AFF;
// 	world.AI = AI;
// 	world.powerA = powerA;
// 	world.BFF = BFF;
// 	world.BI = BI;
// 	world.powerB = powerB;
// 	world.Alloc = Alloc;
// 	world.mathround = true;
// 	for (var i = 0; i < number_of_agents; i++){
// 		var agent = new Driver();
// 		agent.id = i + 1;
// 		agents.push(agent);
// 	}
// 	var sum = 0;
// 	var SD = [];
// 	var checkMed = [];
// 	var total = 0;
// 	for(var j = 1; j <= number_of_rounds;j++){
// 		var choices = [];
// 		for (var i = 0; i < number_of_agents;i++){
// 			var choice = agents[i].chooseTotalRecallExploration(agents[i],explorationPercent);
// 			choices.push(choice);
// 		}
// 		var choseA = choices.filter(function(choice){return choice === "A"}).length;
// 		world.NOA = choseA;
// 		sum += choseA;
// 		SD.push(choseA);
// 		world.calculate();
// 		array.push([j,choseA,world.SOA,world.UEA]);
// 		checkMed.push(choseA);
// 		for (var i = 0; i < number_of_agents; i++){
// 			var TT = choices[i] === "A" ? world.actualTTA:world.actualTTB;
// 			total += TT;
// 			agents[i].archive(choices[i],TT,undefined,undefined,agents[i]);
// 		}	
// 	}
// 	var average = sum / number_of_rounds;
// 	array[0][2] += world.SOA;
// 	array[0][3] += world.UEA;
// 	array[0][4] += average;
// 	for (var i  = 1; i < array.length;i++){
// 		array[i].push(average);
// 	}
// 	document.getElementById("curve_chart").innerHTML ="";
// 	var sortedMed = checkMed.sort(function(a, b){return a-b});
// 	console.log("total cost: " + total);
// 	console.log("avg drivers on route A: " + average);
// 	console.log("SD: " +standardDeviation(SD));
// 	console.log("median: " + sortedMed.length % 2 === 0 ? (sortedMed[sortedMed.length/2 -1] + sortedMed[sortedMed.length/2]) /2:sortedMed[Math.floor(sortedMed.length/2)]);
// 	console.log("agent 1 route switches: " + agents[0].routeSwitches);
// 	console.log(SD);
// 	drawChart();
// // 	toCsv([SD,[]]);
// }
// function SAW(number_of_rounds,number_of_agents,AFF,AI,powerA,BFF,BI,powerB,Alloc,explorationPercent){
// 	array = [["number","actual","SO: ","UE: ","average: "]];
// 	number_of_agents_viz = number_of_agents;
// 	var agents = [];
// 	var world = new SOUECALC();
// 	world.participantsNum = number_of_agents;
// 	world.AFF = AFF;
// 	world.AI = AI;
// 	world.powerA = powerA;
// 	world.BFF = BFF;
// 	world.BI = BI;
// 	world.powerB = powerB;
// 	world.Alloc = Alloc;
// 	world.mathround = true;
// 	for (var i = 0; i < number_of_agents; i++){
// 		var agent = new Driver();
// 		agent.id = i + 1;
// 		agents.push(agent);
// 	}
// 	var sum = 0;
// 	var SD = [];
// 	var checkMed = [];
// 	for(var j = 1; j <= number_of_rounds;j++){
// 		var choices = [];
// 		for (var i = 0; i < number_of_agents;i++){
// 			var choice = agents[i].chooseSAW(agents[i],explorationPercent,75,3);
// 			choices.push(choice);
// 		}
// 		var choseA = choices.filter(function(choice){return choice === "A"}).length;
// 		world.NOA = choseA;
// 		sum += choseA;
// 		SD.push(choseA);
// 		world.calculate();
// 		array.push([j,choseA,world.SOA,world.UEA]);
// 		checkMed.push(choseA);
// 		for (var i = 0; i < number_of_agents; i++){
// 			var TT = choices[i] === "A" ? world.actualTTA:world.actualTTB;
// 			agents[i].archive(choices[i],TT,undefined,undefined,agents[i]);
// 		}	
// 	}
// 	var average = sum / number_of_rounds;
// 	array[0][2] += world.SOA;
// 	array[0][3] += world.UEA;
// 	array[0][4] += average;
// 	for (var i  = 1; i < array.length;i++){
// 		array[i].push(average);
// 	}
// 	document.getElementById("curve_chart").innerHTML ="";
// 	var sortedMed = checkMed.sort(function(a, b){return a-b});
// 	console.log("avg: " + average);
// 	console.log("SD: " +standardDeviation(SD));
// 	console.log("median: " + sortedMed.length % 2 === 0 ? (sortedMed[sortedMed.length/2 -1] + sortedMed[sortedMed.length/2]) /2:sortedMed[Math.floor(sortedMed.length/2)]);
// 	console.log("agent 1 route switches: " + agents[0].routeSwitches);
// 	drawChart();
// // 	toCsv([SD,[]]);
// }