function findBigTransition(sample, samplesize, numberofpoints) {
    var len = sample.length;
    var results = [];
    for (var i = samplesize; i < len - samplesize; i++) {
        var before = sample.slice(i - samplesize, i).reduce(function(a, b) {
            return a + b;
        }) / samplesize;
        var after = sample.slice(i, i + samplesize).reduce(function(a, b) {
            return a + b;
        }) / samplesize;
        results.push(after - before);
    }
    var absresults = [];
    var abslen = results.length
    for (var i = 0; i < abslen; i++) {
        absresults[i] = Math.abs(results[i]);
    }
    var report = [];
    for (var i = 0; i < numberofpoints; i++) {
        var maxindex = absresults.indexOf(Math.max.apply(Math, absresults));
        var min = Math.min.apply(Math, absresults);
        report.push([maxindex + samplesize, results[maxindex]]);
        for (var j = -samplesize; j < samplesize; j++) {
            absresults[maxindex + j] = min;
        }
    }
    return report;
}
var smith;
function total_recall_recommendation(number_of_rounds, number_of_agents, AFF, AI, powerA, BFF, BI, powerB, Alloc, explorationPercent, explorationRecPercent, firstExpNum, 
distribution, graph, model, systemPunishment, saw_weight, saw_days, logitsens, within,withinNumber,Days_to_average) {
    if (graph === "NumA") {
        array = [["number", "agents on A", "SO: ", "UE: ", "average in last " + Days_to_average + " rounds: "]];
        number_of_agents_viz = number_of_agents;
    } else if (graph === "NumAcomplied") {
//         array = [["number", "agents on A", "SO: ", "UE: ", "like to comply", "average in last " + Days_to_average + " rounds: "]];
        array = [["number", "agents on A", "SO: ", "UE: ", "comply", "average in last " + Days_to_average + " rounds: "]];
        number_of_agents_viz = number_of_agents;
    } else if (graph === "NumAcompliedsaw") {
        array = [["number", "agents on A", "SO: ", "UE: ", "like to comply", "average: "]];
        number_of_agents_viz = number_of_agents;
    } else if (graph === "avggraph") {
        var preArray = ["number", "complied"];
        for (var i = 1; i <= number_of_agents; i++) {
            preArray.push("agent " + i + " avg ");
        }
        preArray.push("SO");
        preArray.push("UE");
        array = [preArray];
    } else if (graph === "cumulative_switches") {
        array = [["number", "route switches","complied switches"]];
    } else if (graph === "ind_switches") {
        array = [["number", "switches"]];
    } else if (graph === "gini") {
        array = [["number", "gini"]];
    }else if (graph === "times") {
        array = [["number", "total time","route A total time","route B total time"]];
    }
    var agents = [];
    var world = new SOUECALC();
    world.participantsNum = number_of_agents;
    world.AFF = AFF;
    world.AI = AI;
    world.powerA = powerA;
    world.BFF = BFF;
    world.BI = BI;
    world.powerB = powerB;
    world.Alloc = Alloc;
//     world.mathround = true;  
    world.calculate();
    for (var i = 0; i < number_of_agents; i++) {
        var agent = new Driver();
        agent.id = i + 1;
        for (var j = 0; j < agent.strategiesPropensitiesAB.length; j++) {
            agent.strategiesPropensitiesAB[j] = 10 / (world.maxTTA);
        }
        agents.push(agent);
    }
    var sum = 0;
    var SD = [];
    var difarray = [];
    var checkMed = [];
    var total = 0;
    var tmpmodel = model;
    var ginigraph = [];
    var indswitchesGraph = [];
    var totaltimegraph = [];
    for (var j = 1; j <= number_of_rounds; j++) {
        if (within) {
            if (j <= withinNumber) {
                if(model === "SAWSO"){
                    model = "SAW";
                }else if (model === "total_recall_recommendation"){
                    model = "totalRecall";
                }
            } else {
                model = tmpmodel;
            }
        }
        if (j % 100 === 0) {
            console.log(j);
        }
        var dif = 0;
        
        var choices = [];
        var strategies = [];
        var complied = 0;
        // 		recommendations
        var random = randomSO(number_of_agents, world.SOA);
        var entitlement_array = [];
        var unfair_entitlement_array = [];
        var justice_entitlement_array = [];
        var unjustice_entitlement_array = [];
        var merit_entitlement_array = [];
        var meritA_entitlement_array = [];
        var meritB_entitlement_array = [];
        var anti_merit_entitlement_array = [];
        var anti_meritA_entitlement_array = [];
        var anti_meritB_entitlement_array = [];
        var a_entitlement_array = [];
        var b_entitlement_array = [];
        var reformer_test = [];
        var killer_alloc = [];
        var killer_alloc_SAW = [];
        for (var i = 0; i < number_of_agents; i++) {
            entitlement_array.push(agents[i].recievedRecommendation);
            unfair_entitlement_array.push(agents[i].id);
            justice_entitlement_array.push(-agents[i].sumAll);
            unjustice_entitlement_array.push(agents[i].sumAll);
            merit_entitlement_array.push(-agents[i].choicescomplied);
            meritA_entitlement_array.push(-agents[i].choicescompliedA);
            meritB_entitlement_array.push(-agents[i].choicescompliedB);
            anti_merit_entitlement_array.push(agents[i].choicescomplied);
            anti_meritA_entitlement_array.push(agents[i].choicescompliedA);
            anti_meritB_entitlement_array.push(agents[i].choicescompliedB);
            a_entitlement_array.push(agents[i].choicesA);
            b_entitlement_array.push(agents[i].choicesB);
            var killer = agents[i].choicescomplied === 0 || agents[i].choicesnotcomplied === 0 ? 0 : agents[i].avgTimealt(agents[i], "notcomplied") - agents[i].avgTimealt(agents[i], "complied");
            var killer_SAW = agents[i].choicescomplied === 0 || agents[i].choicesnotcomplied === 0 ? 0 :(saw_weight*agents[i].avgTimealt(agents[i], "notcomplied")+(1-saw_weight)*agents[i].avgTimeSAW(agents[i], "notcomplied")) - (saw_weight*agents[i].avgTimealt(agents[i], "complied")+(1-saw_weight)*agents[i].avgTimeSAW(agents[i], "complied"));
            killer_alloc.push(killer);
            killer_alloc_SAW.push(killer_SAW);
            reformer_test.push((agents[i].choicescomplied > 0) && (agents[i].choicesnotcomplied > 0));
            
        }
        var allocation;
        if ((model === "totalRecall")||(model === "SAW")) {
            allocation = new Array(number_of_agents);
        } else if (distribution === "random") {
            allocation = randomSO(number_of_agents, world.SON,world.SOFaster);
        } else if (distribution === "fair") {
            allocation = turnSO(entitlement_array, world.SON,world.SOFaster);
        } else if (distribution === "unfair") {
            allocation = unfairSO(number_of_agents, world.SON);
        } else if (distribution === "justice") {
            allocation = turnSO(justice_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "unjustice") {
            allocation = turnSO(unjustice_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "merit") {
            allocation = turnSO(merit_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "meritA") {
            allocation = turnSO(meritA_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "meritB") {
            allocation = turnSO(meritB_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "anti_merit") {
            allocation = turnSO(anti_merit_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "anti_meritA") {
            allocation = turnSO(anti_meritA_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "anti_meritB") {
            allocation = turnSO(anti_meritB_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "a") {
            allocation = turnSO(a_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "b") {
            allocation = turnSO(b_entitlement_array, world.SON,world.SOFaster, true);
        } else if (distribution === "killer_alloc") {
            allocation = turnSO(killer_alloc, world.SON,world.SOFaster, true);
        } else if (distribution === "reformer"){
            var yyy = new Set(reformer_test);
            var ttt = Array.from(yyy)
            if (ttt.length === 1 && ttt[0]){
                allocation = turnSO(killer_alloc, world.SON,world.SOFaster, true);
            }else{
                allocation = randomSO(number_of_agents, world.SON);
            }
        } else if (distribution === "reformer_SAW"){
            var yyy = new Set(reformer_test);
            var ttt = Array.from(yyy)
            if (ttt.length === 1 && ttt[0]){
                allocation = turnSO(killer_alloc_SAW, world.SON,world.SOFaster, true);
            }else{
                allocation = randomSO(number_of_agents, world.SON);
            }
        }
        for (var i = 0; i < number_of_agents; i++) {
            if (model === "total_recall_recommendation") {
                var choice = agents[i].chooseTotalRecallSO(agents[i], allocation[i], explorationPercent, explorationRecPercent, j, firstExpNum);
            } else if (model === "total_recall_recommendation_logit") {
                var choice = agents[i].chooseTotalRecallSO(agents[i], allocation[i], explorationPercent, explorationRecPercent, j, firstExpNum, true, logitsens);
            } else if (model === "totalRecall") {
                var choice = agents[i].chooseTotalRecallExploration(agents[i], explorationPercent);
            } else if (model === "totalRecall_logit") {
                var choice = agents[i].chooseTotalRecallExploration(agents[i], explorationPercent, true, logitsens);
            } else if (model === "SAW") {
                var choice = agents[i].chooseSAWexploration(agents[i], explorationPercent, saw_weight);
            } else if (model === "SAW_logit") {
                var choice = agents[i].chooseSAWexploration(agents[i], explorationPercent, saw_weight, true, logitsens);
            } else if (model === "SAWSO") {
                var choice = agents[i].chooseSAWSO(agents[i], allocation[i], explorationPercent, explorationRecPercent, saw_weight, j, firstExpNum);
            } else if (model === "SAWSO_logit") {
                var choice = agents[i].chooseSAWSO(agents[i], allocation[i], explorationPercent, explorationRecPercent, saw_weight, j, firstExpNum, true, logitsens);
            } else if (model === "Compornot") {
                var choice = agents[i].chooseCompornot(agents[i], allocation[i], explorationPercent);
            } else if (model === "payoffSum") {
                agents[i].recommendation = allocation[i];
                var output = agents[i].choosePayoffSumAB(agents[i]);
                var choice = output.action;
                strategies.push(output.name)
            } else {
                alert("Under construction");
                return false;
            }
            if ((graph === "NumAcomplied") || (graph === "avggraph")) {
                var todif = agents[i].dif(agents[i]);
                todif[0] < 0 ? dif += 1 : dif += 0;
            } else if (graph === "NumAcompliedsaw") {
                var todif = agents[i].dif(agents[i],saw_weight);
                todif[2] < 0 ? dif += 1 : dif += 0;  
            }
            allocation[i] === world.SOFaster ? agents[i].recievedRecommendation++ : agents[i].recievedRecommendation = agents[i].recievedRecommendation;
            choice === allocation[i] ? complied++ : complied = complied;
            choices.push(choice);
        }
        var choseA = choices.filter(function(choice) {
            return choice === "A"
        }).length;
        world.NOA = choseA;
        j > number_of_rounds - Days_to_average ? sum += choseA : sum = sum;
        SD.push(choseA);
        difarray.push(dif);
        var start = j < 100 ? 0 : j - 100;
        var movingAavg = SD.slice(start, j);
        var denom = j > 100 ? 100 : j;
        movingAavg = movingAavg.reduce(function(a, b) {
            return a + b;
        }) / denom;
        var movingdifavg = difarray.slice(start, j);
        movingdifavg = movingdifavg.reduce(function(a, b) {
            return a + b;
        }) / denom;
        world.calculate();
        var index = world.realIndex;
        var punishment = number_of_agents === complied ? 0 : world.SOdev / (number_of_agents - complied);
        var reward = complied === 0 ? 0 : world.SOdev / complied;
        if (graph === "NumA") {
            			array.push([j,choseA,world.SOA,world.UEA]);
//             array.push([j, movingAavg, world.SOA, world.UEA]);
        } else if (graph === "NumAcomplied") {
//             			array.push([j,choseA,world.SOA,world.UEA,dif]);
            			array.push([j,choseA,world.SOA,world.UEA,complied]);
//             array.push([j, movingAavg, world.SOA, world.UEA, movingdifavg]);
        } else if (graph === "NumAcompliedsaw") {
                array.push([j,choseA,world.SOA,world.UEA,dif]);
//             array.push([j, movingAavg, world.SOA, world.UEA, dif]);
        } else if (graph === "avggraph") {
            var preArray = [j, dif];
            for (var i = 0; i < number_of_agents; i++) {
//                 preArray.push(agents[i].avgTimeSAW(agents[i], "All"));
                				preArray.push(20+agents[i].avgTimealt(agents[i],"notcomplied") - agents[i].avgTimealt(agents[i],"complied"));
            }
            preArray.push(world.SOavg);
            preArray.push(world.UEATT);
            array.push(preArray);
        } else if (graph === "cumulative_switches") {
            var routeSwitches = 0;
            var compliedSwitches = 0;
            for (var i = 0; i < number_of_agents; i++) {
                routeSwitches += agents[i].routeSwitches;
                compliedSwitches += agents[i].compliedSwitches;
            }
            array.push([j, routeSwitches / number_of_agents,compliedSwitches/number_of_agents])
        }
        checkMed.push(choseA);
        var giniarray = [];
        var indswitches = 0;
        var totaltime = 0;
        var totalA = 0;
        var totalB = 0;
        model === "totalRecall" || model === "SAW"? systemPunishmentact = "false":systemPunishmentact = systemPunishment;
        for (var i = 0; i < number_of_agents; i++) {
            var complied = allocation[i] === choices[i];
            var punishmentToTT,rewardToTT;
            if (systemPunishmentact == "false"){
                punishmentToTT = 0;
                rewardToTT = 0;
            }
            else if(systemPunishmentact === "punishment"){
                complied? punishmentToTT = 0: punishmentToTT = punishment;
                rewardToTT = 0;
            }else if(systemPunishmentact === "reward"){
                punishmentToTT = 0;
                complied? rewardToTT = reward: rewardToTT = 0;
            }else if(systemPunishmentact === "punishment_reward"){
                complied? (punishmentToTT = 0,rewardToTT = reward):(punishmentToTT = punishment,rewardToTT = 0);
            }
            var TT = choices[i] === "A" ? world.actualTTA : world.actualTTB;
            TT = TT + punishmentToTT - rewardToTT;
            total += TT;
            totaltime += TT;
            choices[i] === "A"? totalA += TT:totalB += TT;
            var strategy = model === "payoffSum" ? strategies[i] : undefined;
            if (model === "totalRecall" || model === "SAW") {
                complied = undefined;
            }
            agents[i].archive(choices[i], TT, strategy, complied, agents[i], saw_days, 100);
            // switch 3 to memory days.switch 100 to memory history all. add parameters
            giniarray.push(agents[i].sumAll)
            agents[i].routeSwitchesBool?indswitches++:indswitches=indswitches;
        }
		ginigraph.push([j,gini(giniarray)])
		indswitchesGraph.push([j,indswitches])
		totaltimegraph.push([j,totaltime/number_of_agents,totalA/choseA,totalB/(number_of_agents-choseA)])

    }
    var average = sum / Days_to_average;
    if (graph === "NumA") {
        array[0][2] += world.SOA;
        array[0][3] += world.UEA;
        array[0][4] += average;
        for (var i = 1; i < array.length; i++) {
            array[i].push(average);
        }
    } else if (graph === "NumAcomplied") {
        array[0][2] += world.SOA;
        array[0][3] += world.UEA;
        array[0][5] += average;
        for (var i = 1; i < array.length; i++) {
            array[i].push(average);
        }
    } else if (graph === "NumAcompliedsaw") {
        array[0][2] += world.SOA;
        array[0][3] += world.UEA;
        array[0][5] += average;
        for (var i = 1; i < array.length; i++) {
            array[i].push(average);
        }
    } else if (graph === "avggraph") {
        number_of_agents_viz = world.maxTTA > world.maxTTB ? world.maxTTA : world.maxTTB;
        number_of_agents_viz = number_of_agents_viz < number_of_agents ? number_of_agents + 10 : number_of_agents_viz;
        for (var i = 0; i < number_of_agents; i++) {
            var compliance_rate = agents[i].choicescomplied / number_of_rounds;
            array[0][i + 2] += compliance_rate;
        }
    } else if (graph === "cumulative_switches") {
        number_of_agents_viz = array[array.length - 1][1];
        number_of_agents_viz = number_of_rounds;
    } else if (graph === "ind_switches") {
        array = array.concat(indswitchesGraph);
        number_of_agents_viz = number_of_agents;
    } else if (graph === "gini") {
        array= array.concat(ginigraph);
        number_of_agents_viz = 0.2;
    }
    else if (graph === "times") {
        array= array.concat(totaltimegraph);
        number_of_agents_viz = 100;
    }
    var sortedMed = checkMed.sort(function(a, b) {
        return a - b;
    })
    smith = agents[0];
    console.clear();
    console.log("UEA: " + world.trueuea)
    console.log("total cost: " + total);
    console.log("avg: " + average);
    console.log("SD: " + standardDeviation(SD));
    console.log("median: " + sortedMed.length % 2 === 0 ? (sortedMed[sortedMed.length / 2 - 1] + sortedMed[sortedMed.length / 2]) / 2 : sortedMed[Math.floor(sortedMed.length / 2)]);
    console.log("transitions:" + JSON.stringify(findBigTransition(SD, 200, 3)));
    document.getElementById("curve_chart").innerHTML = "";
    drawChart();
// run with collect data
//     var avgall = SD.reduce(function(a, b) {return a + b;})/number_of_rounds;
//     var tr = SD.slice(withinNumber-withinNumber/10,withinNumber);
//     var avgtr = tr.reduce(function(a, b) {return a + b;})/(withinNumber/10);
//     var sdtr = standardDeviation(tr);
//     var trr = SD.slice(withinNumber,SD.length);
//     var avgtrr = trr.reduce(function(a, b) {return a + b;})/(number_of_rounds - withinNumber);
//     var sdtrr = standardDeviation(trr);
//     return [BFF,BI, world.trueuea,world.SOA,world.POA,world.trueuea - world.SOA,world.SOA/number_of_agents,distribution,systemPunishment,tmpmodel,avgall,standardDeviation(SD),avgtr,sdtr,avgtrr,sdtrr,average]
    
}
function collect_data(Nrounds, replications) {
//     creating output file
    var output = [];
    var headers = ["variable: route B FF","variable: route BI","UEA","SOA","price of anarchy","UEA - SOA","SOA/number of agents",	"variable: allocation",	"variable: punishment","variable: model","Average","SD","average nr rounds","SD","average r rounds","SD","average last 100"]
    output.push(headers)

//     variable parameters

    var routeBFF = [];
    for (var i = 1; i <100; i+=1){
        routeBFF.push(i);
    }
//     var routeBFF = 11;

//     var routeBI = [0.0008333,0.0016666,0.0033332];
//     var routeBI = 0.0008333;
    var routeBI = 0.0016666;
//     var routeBI = 0.0033332;

//     var allocations = ["fair", "reformer", "random", "justice", "anti_merit","a"];
    var allocations = "fair";
//     var allocations = "anti_merit";
//     var allocations = "random";
//     var allocations = "a";
//     var allocations = "justice";
//     var allocations = "reformer";
//     var allocations = reformer_SAW


//     var punishments = [true, false];
//     var punishments = true;
    var punishments = false;

//     var models = ["total_recall_recommendation","SAWSO"];
//     var models = "total_recall_recommendation";
    var models = "SAWSO";

//     loop
    var iterNum = 0;
    for(var b = 0; b < routeBFF.length;b++){
//         for(var c = 0; c < routeBI.length;c++){
//             for (var allocation = 0; allocation < allocations.length; allocation++) {
//                 for (var punishment = 0; punishment < punishments.length; punishment++) {
//                     for (var model = 0; model < models.length; model++) {
                        var i = 0;
                           while (i < replications) {
                            var time = new Date();
                            time = time.getTime();
//                             var sim = total_recall_recommendation(Nrounds, 100, 10, 0.00166666, 2, routeBFF[b], routeBI, 2, 0, 3, 0, 
//                             0, allocations, undefined, models, punishments, 0.5,3, undefined,true,Nrounds/10);
                            var sim = total_recall_recommendation(Nrounds, 100, 10, 0.00166666, 2, routeBFF[b], routeBI, 2, 0, 3, 0, 
                            0, allocations, undefined, models, punishments, 0.5,3, undefined,true,Nrounds/10);
                            output.push(sim);
                            i++;
                            iterNum++;
                            var ntime = new Date();
                            time = ntime.getTime() - time;
                            console.log(iterNum + "/" + routeBFF.length *replications  + " " + time / 1000)
                        }
//                     }
//                 }
//             }
//         }
    }    
    toCsv(output);
}



function findParameters(){
    var twelveScenario = [12,10,0.1,22,0.05];
    var elevenScenario = [11,10,0.1,18,0.05];
    var tenScenario = [10,10,0.1,16,0.05];
    var nineScnario = [9,10,0.1,15,0.05];
    var Scenarios = [twelveScenario,elevenScenario,tenScenario,nineScnario];

    var rounds = [];
    for(var i = 1; i<= 1000;i++){
        rounds.push("round " + i);
    }
    var punishments = [true,false];
    var results=[["ID","participants","model","punishment"].concat(rounds)]
    for(var j = 0; j <Scenarios.length;j++){
        var q = 0;
        for (var i = 1; i<=50; i++){
            for(var k = 0; k <punishments.length;k++){
                var sim = total_recall_recommendation(2000, Scenarios[j][0], Scenarios[j][1], Scenarios[j][2], 2, Scenarios[j][3], Scenarios[j][4], 2, 0, 3, 0, 0, 
                "fair", undefined, "total_recall_recommendation", punishments[k], 0.5, 3, undefined, true)
                q++;
                results.push([[q,Scenarios[j][0],"TR",punishments[k]].concat(sim.slice(0,1000))]);
                results.push([[q,Scenarios[j][0],"TRR",punishments[k]].concat(sim.slice(1000,2000))]);
            }
        }
    }
    toCsv(results);
}
function findsettings(){
    var results = [["participantsNum","BFF","UE","SO","POA"]];
    for (var j = 9; j<=12; j++){
        for (var i = 10; i < 50; i++){
            var world = new SOUECALC();
            world.participantsNum = j;
            world.AFF = 10;
            world.AI = 0.1;
            world.powerA = 2;
            world.BFF = i;
            world.BI = 0.05;
            world.powerB = 2;
            world.Alloc = 0;
            world.mathround = true;  
            world.calculate();
            results.push([j,i,world.trueuea,world.SOA,world.POA])
        }
    }
    toCsv(results);
}