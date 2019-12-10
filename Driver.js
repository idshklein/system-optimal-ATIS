function Driver(){
// 	driver's memory
	this.id = 0;
	this.history = [];

	this.historyA = [];
	this.historyB = [];
	this.historycomplied = [];
	this.historynotcomplied = [];
	this.historyAll = []

	this.choicesA = 0;
	this.sumA = 0;
	this.choicesB = 0;
	this.sumB = 0;
	this.choicescomplied = 0;
	this.sumcomplied = 0;
	this.choicescompliedA = 0;
	this.sumcompliedA = 0;
	this.choicescompliedB = 0;
	this.sumcompliedB = 0;
	this.choicesnotcomplied = 0;
	this.sumnotcomplied = 0;
	this.choicesnotcompliedA = 0;
	this.sumnotcompliedA = 0;
	this.choicesnotcompliedB = 0;
	this.sumnotcompliedB = 0;
	this.choicesAll = 0;
	this.sumAll = 0;
	

	this.routeSwitches = 0;
	this.routeSwitchesBool = false;
	this.compliedSwitches = 0;
	this.recievedRecommendation = 0;
	this.archive = function(route,time,strategy,complied,a,days,memoryDaysForHistoryAll){
// 		archive to history array
		var object = {};
		object.route = route;
		object.time = time;
		object.strategy = strategy;
		object.complied = complied;
		typeof this.lastRound(a) === "undefined" ? this.routeSwitches = this.routeSwitches: route === this.lastRound(a).route ? (this.routeSwitches = this.routeSwitches,this.routeSwitchesBool = false): (this.routeSwitches++,this.routeSwitchesBool = true);
		typeof this.lastRound(a) === "undefined" ? this.compliedSwitches = this.compliedSwitches: complied === this.lastRound(a).complied ? this.compliedSwitches = this.compliedSwitches: this.compliedSwitches++;
		this.history.push(object);
// 		archive to SAW history
		if (route === "A"){
			a.historyA.push(time);
			if (a.historyA.length > days){
				a.historyA.shift();
			}
		}else{
			a.historyB.push(time);
			if (a.historyB.length > days){
				a.historyB.shift();
			}
		}
		if (complied){
			a.historycomplied.push(time);
			if (a.historycomplied.length > days){
				a.historycomplied.shift();
			}
		}else if (complied === false){
			a.historynotcomplied.push(time);
			if (a.historynotcomplied.length > days){
				a.historynotcomplied.shift();
			}
		}
// 		archive to history all
		a.historyAll.push(time);
		if (a.historyAll.length > memoryDaysForHistoryAll){
			a.historyAll.shift();
		}
// 		archive to alt avg time
		route === "A"? (a.choicesA++,a.sumA+=time):(a.choicesB++,a.sumB+=time);
		if (complied){
			a.choicescomplied++;
			a.sumcomplied += time;
		}else if (complied === false){
			a.choicesnotcomplied++;
			a.sumnotcomplied+=time;
		}
// 		complied? (a.choicescomplied++,a.sumcomplied+=time):(a.choicesnotcomplied++,a.sumnotcomplied+=time);
		route === "A" && complied? (a.choicescompliedA++,a.sumcompliedA+=time):(a.choicesnotcompliedA++,a.sumnotcompliedA+=time);
		route === "B" && complied? (a.choicescompliedB++,a.sumcompliedB+=time):(a.choicesnotcompliedB++,a.sumnotcompliedB+=time);
// 		archive to sumall
		a.choicesAll++;
		a.sumAll +=time;
	}
	this.avgTime = function(a,route, number_of_rounds,lastDaysOnRoute, complied){
		var query = a.history;
		query = typeof number_of_rounds === "undefined" ? query:query.slice(query.length - number_of_rounds,query.length);
		query = typeof route === "undefined" ? query:query.filter(function(event){return event.route === route});
		query = typeof lastDaysOnRoute === "undefined" ? query:query.slice(query.length - lastDaysOnRoute,query.length);
		query = typeof complied === "undefined" ? query:query.filter(function(event){return event.complied === complied});
		var sum = query.reduce(function(a, b) {return a + b.time;},0);
		return query.length > 0 ? sum/query.length:0;
	}
	this.avgTimeSAW = function(a,query){
		query = "history" + query;
		var len = a[query].length;
		var sum = len>0? a[query].reduce(function(a, b) {return a + b;}):0;
		return len > 0 ?sum/len:0;
	}
	this.avgTimealt = function(a,type){
		var choices = a["choices" + type];
		var sum = a["sum" + type];
		return choices > 0? sum/choices:choices;
	}
	this.lastRound = function(a){
		return typeof a.history[a.history.length - 1] != "undefined"?a.history[a.history.length - 1]:undefined;
	}
// 	driver's actions
	this.otherRoute = function(route){
		return route === "A"?"B":"A";
	}
	this.chooseRoute =function chooseRoute (route){
		return route;
	}
	this.chooseRouteA =function chooseRouteA (){
		return "A";
	}
	this.chooseRouteB =function chooseRouteB (){
		return "B";
	}
	this.chooseRandom = function chooseRandom (){
		var routes = ["A","B"];
		return routes[Math.round(Math.random())];
	}
	this.chooseRecommendation = function(a){
		return a.recommendation;
	}
	this.dif = function(a,weight){
		typeof weight === "undefined"? weight = 1 : weight=weight;
		var CNC = a.avgTimealt(a,"complied") - a.avgTimealt(a,"notcomplied");
		var cncsaw = a.avgTimeSAW(a,"complied") - a.avgTimeSAW(a,"notcomplied");
		var CNCcalc = (weight * a.avgTimealt(a,"complied") + (1-weight)*a.avgTimeSAW(a,"complied")) - (weight * a.avgTimealt(a,"notcomplied") + (1-weight)*a.avgTimeSAW(a,"notcomplied"));
		return [CNC,cncsaw,CNCcalc];
	}
// 	driver's rules
//  total recall
	this.chooseTotalRecall = function(a,logit,logitsens){
		typeof logit === "undefined" ? logit = false: logit;
		var routeA = a.avgTimealt(a,"A");
		var routeB = a.avgTimealt(a,"B");
		if (logit){
			var rand = Math.random();
			var exponentFunction = 1/(1 + Math.exp(logitsens*(routeA - routeB)));
			return rand < exponentFunction ? "A":rand === exponentFunction?a.chooseRandom():"B";
		}else{
			return routeA < routeB ? "A":routeA === routeB?a.chooseRandom(): "B";
		}
	}
	this.chooseTotalRecallExploration = function(a,explorationPercent,logit,logitsens){
		var rand= Math.random();
		return rand > explorationPercent/100 ? a.chooseTotalRecall(a,logit,logitsens) : a.chooseRandom();
	}
// 	total recall sensitive to SO
	this.chooseTotalRecallSO = function(a,recommendedRoute,explorationPercent,explorationRecPercent,j,firstExpNum,logit,logitsens){
		var totalRecall = a.chooseTotalRecall(a,logit,logitsens);
		typeof logit === "undefined" ? logit = false: logit;
		var complied = a.avgTimealt(a,"complied");
		var notcomplied = a.avgTimealt(a,"notcomplied");
		var TRdif = complied - notcomplied;
		if (logit){
			var rand = Math.random();
			var exponentFunction = 1/(1 + Math.exp(logitsens*(complied - notcomplied)));
			var comply = rand < exponentFunction ? true:false;
		}else{
			var equal = Math.random() < 0.5? true:false;
			var comply = complied < notcomplied?true:complied === notcomplied? equal:false;	
		}
		var rand = Math.random();
		var randtwo = Math.random();
		var explore = rand < explorationPercent/100 || j <= firstExpNum;
		var exploreRec = randtwo < explorationRecPercent/100;
		return explore? a.chooseRandom():totalRecall === recommendedRoute ? recommendedRoute:comply && !exploreRec ?recommendedRoute:totalRecall;
	}
// 	SAW model - erev 2010
	this.chooseSAW = function(a,weight,logit,logitsens){
		typeof logit === "undefined" ? logit = false: logit;
		var w = weight;
		var sawW = 1 - weight;
		var routeA = w*a.avgTimealt(a,"A") + sawW * a.avgTimeSAW(a,"A");
		var routeB = w*a.avgTimealt(a,"B") + sawW * a.avgTimeSAW(a,"B");
		if (logit){
			var rand = Math.random();
			var exponentFunction = 1/(1 + Math.exp(logitsens*(routeA - routeB)));
			return rand < exponentFunction ? "A":rand === exponentFunction?a.chooseRandom():"B";
		}else{
			return routeA < routeB ? "A":routeA === routeB?a.chooseRandom(): "B";
		}
	}
	this.chooseSAWexploration = function(a,explorationPercent,weight,logit,logitsens){
		var rand= Math.random();
		return rand > explorationPercent/100 ? a.chooseSAW(a,weight,logit,logitsens):a.chooseRandom();
	}
// 	SAW model sensitive to SO
	this.chooseSAWSO = function(a,recommendedRoute,explorationPercent,explorationRecPercent,weight,j,firstExpNum,logit,logitsens){
		typeof logit === "undefined" ? logit = false: logit;
		var saw = a.chooseSAW(a,weight,logit,logitsens);
		var compliedTR = a.avgTimealt(a,"complied");
		var compliedSAW = a.avgTimeSAW(a,"complied");
		var notcompliedTR = a.avgTimealt(a,"notcomplied");
		var notcompliedSAW = a.avgTimeSAW(a,"notcomplied");
		var complied = weight*compliedTR + (1 - weight)*compliedSAW;
		var notcomplied = weight*notcompliedTR + (1 - weight)*notcompliedSAW;
		var TRdif = compliedTR - notcompliedTR;
		var SAWdif = compliedSAW - notcompliedSAW;
		var popo = weight*TRdif +(1-weight)*SAWdif;
		if (logit){
			var rand = Math.random();
			var exponentFunction = 1/(1 + Math.exp(logitsens*(complied - notcomplied)));
			var comply = rand < exponentFunction ? true:rand === exponentFunction?a.chooseRandom():false;
		}else{
			var equal = Math.random() < 0.5? true:false;
			var comply = complied < notcomplied?true:complied === notcomplied? equal:false;	
// 			var comply = weight*TRdif +(1-weight)*SAWdif < 0 ?true:weight*TRdif +(1-weight)*SAWdif === 0 ? equal:false;	
		}
		var rand= Math.random();
		var randtwo = Math.random();
		var explore = rand < explorationPercent/100 || j <= firstExpNum;
		var exploreRec = randtwo < explorationRecPercent/100;
		return explore? a.chooseRandom():saw === recommendedRoute ? recommendedRoute:comply && !exploreRec ?recommendedRoute:saw;
	}
// comply or dont
	this.chooseCompornot = function(a,recommendedRoute,explorationPercent){
		var rand= Math.random();
		var compliedTR = a.avgTimealt(a,"complied");
		var notcompliedTR = a.avgTimealt(a,"notcomplied");
		var choice = compliedTR < notcompliedTR ? recommendedRoute:compliedTR === notcompliedTR? a.chooseRandom():a.otherRoute(recommendedRoute);
		return rand > rand > explorationPercent/100? choice:a.chooseRandom();
	}

//  payoff sum model -selten 2007 simulations
	this.strategiesABNames = ["chooseRouteA","chooseRouteB","chooseRecommendation"];
	this.strategiesAB = [this.chooseRouteA,this.chooseRouteB,this.chooseRecommendation];
	this.strategiesPropensitiesAB = [0,0,0];
	this.choosePayoffSumAB = function(a){
		var lastStrategy = a.lastRound(a) === undefined? undefined:a.lastRound(a).strategy;
		var lastTime = a.lastRound(a) === undefined? undefined:a.lastRound(a).time;
		if (typeof lastStrategy != "undefined"){
			a.strategiesPropensitiesAB[a.strategiesABNames.indexOf(lastStrategy)] += 1/lastTime;
		}
		var random = Math.random();
		var total = a.strategiesPropensitiesAB.reduce(function(a, b) {return a + b;});
		for(var i = 0; i < a.strategiesPropensitiesAB.length; i++){
			var low = i === 0 ? 0 : a.strategiesPropensitiesAB.slice(0, i).reduce(function(a, b) {return a + b;});
			var high = a.strategiesPropensitiesAB.slice(0,i+1).reduce(function(a, b) {return a + b;});
			if ((low/total < random) && (high/total >= random)){
				var object = {
					action:this.strategiesAB[i](a),
					name:this.strategiesABNames[i]
				}
				return object;
			}
		}
	}











	this.strategiesPropensities = [];
	this.strategiesNames =[];
	this.strategies = [];
	this.addStrategy = function(action){
		this.strategies.push(action);
		this.strategiesPropensities.push(0);
	}
	this.choosePayoffSum = function(roundNumber){
		if (roundNumber === 1){
			for(var i = 0; i < this.strategies.length;i++){
				this.strategiesNames.push(this.strategies[i].name)
			}
		} 
		if (roundNumber <= this.strategies.length*4){
			var a = this;
			var number = roundNumber%this.strategies.length === 0 ? this.strategies.length:roundNumber%this.strategies.length;
			var object = {
				action:this.strategies[number - 1](a),
				name:this.strategies[number - 1].name
			}
			return object;
		}else{
			var a = this;
			var random = Math.random();
			var total = this.strategiesPropensities.reduce(function(a, b) {return a + b;});
			for(var i = 0; i < this.strategiesPropensities.length; i++){
				var low = i === 0 ? 0 : this.strategiesPropensities.slice(0, i).reduce(function(a, b) {return a + b;});
				var high = this.strategiesPropensities.slice(0,i+1).reduce(function(a, b) {return a + b;});
				if ((low/total < random) && (high/total >= random)){
					var object = {
						action:this.strategies[i](a),
						name:this.strategies[i].name
					}
					return object;
				}else if (i === this.strategiesPropensities.length - 1) {
					this.choosePayoffSum(roundNumber);
				}
			}
		}	
	}
	this.addToPropensity = function(action,price){
		this.strategiesPropensities[this.strategiesNames.indexOf(action)] += price;
	}
	
//  greedy aspirations - helbing roca 2011
// complete
}
