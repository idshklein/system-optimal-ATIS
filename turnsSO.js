// function turnSO(entitlement_array, SOA,SOFaster,randomize){
// 	typeof randomize === "undefined"? randomize = false:randomize;
// 	var len = entitlement_array.length;
// 	var recommendations = [];
// 	var most_entitled = [];
// 	var tickets = SOA;
// 	var SOSlower = SOFaster === "A" ? "B":"A";
// 	while (tickets > 0){
// 		var min = Math.min.apply(Math,entitlement_array);
// 		var max = Math.max.apply(Math,entitlement_array);
// 		var add = Math.abs(max) >Math.abs(min)? Math.abs(max) + 1:Math.abs(min) + 1;
// 		var minArray = [];
// 		for (var i = 0; i < entitlement_array.length; i++){
// 			entitlement_array[i] === min? (minArray.push(i),entitlement_array[i]+=add):min = min;
// 		}
// 		if (minArray.length <= tickets){
// 			most_entitled = most_entitled.concat(minArray);
// 			tickets -= minArray.length;
// 		}else{
// 			randomize? shuffle(minArray) : minArray = minArray;
// 			var temp = minArray.slice(0,tickets);
// 			most_entitled = most_entitled.concat(temp);
// 			tickets -= minArray.length;
// 		}
// 	}
// 	for (var i = 0; i < len; i++){
// 		recommendations.push(SOSlower);
// 	}
// 	for (var i = 0; i < most_entitled.length; i++){
// 		recommendations[most_entitled[i]] = SOFaster;
// 	}
// 	return recommendations;
// }

function shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
    	current = Math.floor(Math.random() * (top + 1));
    	tmp = array[current];
    	array[current] = array[top];
    	array[top] = tmp;
    }
    return array;
}

function randomSO(number_of_participants,SON,fasterSO){
	var SOSlower = fasterSO === "A" ? "B":"A";
	var entitlement_array = [];
	for (var i = 0; i < number_of_participants; i++){
		i < SON ? entitlement_array.push(fasterSO):entitlement_array.push(SOSlower);
	}
	return shuffle(entitlement_array);
}
function test(){
	turnSO(t,10,true);
}
function unfairSO(number_of_participants,SOA){
	var entitlement_array = [];
	for (var i = 0; i < number_of_participants; i++){
		i < SOA ? entitlement_array.push("A"):entitlement_array.push("B");
	}
	return entitlement_array;
}

function turnSO(entitlement_array,SON,SOFaster,randomize) {
    var len = entitlement_array.length;
    var SOSlower = SOFaster === "A" ? "B":"A";
    var test_with_index = [];
    for (var i = 0; i < entitlement_array.length; i++) {
        test_with_index.push([entitlement_array[i], i]);
    }
    if (randomize){
    	test_with_index.sort(function(left, right) {
    		var rand = Math.random() > 0.5? 1 : -1;
        	return left[0] < right[0] ? -1 :left[0] === right[0]? rand: 1;
    	});
    }else{
    	test_with_index.sort(function(left, right) {
        	return left[0] <= right[0] ? -1 : 1;
    	});
    }
    var indexes = [];
    for (var j in test_with_index) {
        indexes.push(test_with_index[j][1]);
    }
    var result = [];
    for (var i = 0; i < len;i++){
    	if (i < SON){
    		result[indexes[i]] = SOFaster;
    	}else{
    		result[indexes[i]] = SOSlower;
    	}
    }
    return result;
}