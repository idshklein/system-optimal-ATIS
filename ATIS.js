function ATIS(){
// 	memory
	this.historyA = [];
	this.historyB = [];
// 	pushes new values
	this.TTA = function(time){
		this.historyA.push(time);
	}
	this.TTB = function(time){
		this.historyB.push(time);
	}
// 	remembers avg. days undefined - all days avg. days = 1 - last day time. more than one- avg of last X days
	this.avgA = function(days){
		typeof days === "undefined"? days = this.historyA.length:days;
		var array = this.historyA.slice(this.historyA.length - days, this.historyA.length);
		return array.reduce(function(a, b) {return a + b;})/array.length;
	}
	this.avgB = function(days){
		typeof days === "undefined"? days = this.historyB.length:days;
		var array = this.historyB.slice(this.historyB.length - days, this.historyB.length);
		return array.reduce(function(a, b) {return a + b;})/array.length;
	}
// 	median of route time
	this.medA = function(){
		var sorted = this.historyA.sort(function(a, b){return a-b});
		var med = sorted.length % 2 === 1 ? sorted[Math.floor(sorted.length/2)]: (sorted[sorted.length/2 -1] + sorted[sorted.length/2])/2;
		return med;
	}
	this.medB = function(){
		var sorted = this.historyB.sort(function(a, b){return a-b});
		var med = sorted.length % 2 === 1 ? sorted[Math.floor(sorted.length/2)]: (sorted[sorted.length/2 -1] + sorted[sorted.length/2])/2;
		return med;
	}
}
