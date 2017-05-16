function SOUECALC() {
      function quadFirstSolution(a,b,c){
       if (a === 0){
         return -c/b;
       }
       var deltasqrt = Math.sqrt(b**2 - 4*a*c);
       if (deltasqrt >= 0){
         return (-b + deltasqrt)/(2*a);
       }
    }
    //FF-free flow, I- impedence, NOA- number of participants on route A, TT- travel time 
    //DTT- difference in travel time between routes(abs), GW- general welfare.
    // parameters: participantsNum,AFF,AI,BFF,BI,NOA,Alloc
    this.powerA = 1;
    this.powerB = 1;
    // 	this.numjamA = 0;
    // 	this.numjamA = 0;
    // 	this.sizejamA = 0;
    // 	this.sizejamB = 0;
    this.Alloc = 0;
    this.NOA = 0;
    this.mathround = false;
    this.calculate = function() {
        var TTA = []
          
        , TTB = []
          
        , DTT = []
          
        , GW = [];
        for (var i = 0; i < this.participantsNum + 1; i++) {
            // 			TTA.push(this.sizejamA > 0 && i >= this.numjamA? this.AFF + Math.pow(i,this.powerA)*this.AI + this.sizejamA: this.AFF + Math.pow(i,this.powerA)*this.AI);
            // 			TTB.push(this.sizejamB > 0 && this.participantsNum - i >= this.numjamB? this.BFF + Math.pow(this.participantsNum - i,this.powerB)*this.BI +this.sizejamB : this.BFF + Math.pow(this.participantsNum - i,this.powerB)*this.BI);
            TTA.push(this.mathround ? Math.round(this.AFF + Math.pow(i, this.powerA) * this.AI) : this.AFF + Math.pow(i, this.powerA) * this.AI);
            TTB.push(this.mathround ? Math.round(this.BFF + Math.pow(this.participantsNum - i, this.powerB) * this.BI) : this.BFF + Math.pow(this.participantsNum - i, this.powerB) * this.BI);
            DTT.push(Math.abs(TTA[i] - TTB[i]));
            GW.push(i * TTA[i] + (this.participantsNum - i) * TTB[i]);
        }
        
        for (var i = 0; i < this.participantsNum + 1; i++) {
            var currentA = TTA[i];
            var currentB = TTB[i];
            var possibleA = TTA[i + 1];
            var possibleB = TTB[i - 1];
            if ((currentA <= possibleB || i === 0) && (currentB <= possibleA || i === this.participantsNum)) {
                var UEA = i;
            }
        }

        
        this.trueuea = UEA;
        this.actualTTA = TTA[this.NOA];
        this.actualTTB = TTB[this.NOA];
        this.maxTTA = Math.max.apply(Math, TTA);
        this.maxTTB = Math.max.apply(Math, TTB);
        this.minTTA = Math.min.apply(Math, TTA);
        this.minTTB = Math.min.apply(Math, TTB);
        this.payoffA = this.Alloc - TTA[this.NOA];
        this.payoffB = this.Alloc - TTB[this.NOA];
        this.SOA = GW.indexOf(Math.min.apply(Math, GW));
        this.SOB = this.participantsNum - GW.indexOf(Math.min.apply(Math, GW));
        this.SOATT = TTA[this.SOA];
        this.SOBTT = TTB[this.SOA];
        this.SOFaster = this.SOATT < this.SOBTT? "A":"B";
        this.SON = this.SOFaster === "A"? this.SOA:this.SOB;
        this.UEA = DTT.indexOf(Math.min.apply(Math, DTT));
        this.UEB = this.participantsNum - DTT.indexOf(Math.min.apply(Math, DTT));
        this.UEATT = TTA[this.UEA];
        this.UEBTT = TTB[this.UEA];
//         this.POA = GW[this.UEA] / GW[this.SOA];
        this.POA = GW[this.trueuea] / GW[this.SOA];
        this.SOavg = (this.SOATT * this.SOA + this.SOBTT * this.SOB) / this.participantsNum;
        this.SOGW = this.Alloc * this.participantsNum - (TTA[this.SOA] * this.SOA + TTB[this.SOA] * this.SOB);
        this.actualGW = this.Alloc * this.participantsNum - (TTA[this.NOA] * this.NOA + TTB[this.NOA] * (this.participantsNum - this.NOA));
        this.actualTTT = TTA[this.NOA] * this.NOA + TTB[this.NOA] * (this.participantsNum - this.NOA);
        this.SOdev = this.SOGW - this.actualGW;
        this.SOdriverdev = Math.abs(this.SOA - this.NOA);
        this.avSOdriverdev = this.SOdev / this.SOdriverdev;
        this.devtowards = this.NOA > this.SOA ? "A" : this.NOA < this.SOA ? "B" : null ;
        this.realSOA = quadFirstSolution(3*(this.AI-this.BI),6*this.participantsNum*this.BI,(this.AFF-this.BFF-3*this.BI*(this.participantsNum**2)));
        this.realSOB = this.participantsNum - this.realSOA;
        this.realUEA = quadFirstSolution(this.AI-this.BI,2*this.participantsNum*this.BI,(this.AFF-this.BFF-this.BI*(this.participantsNum**2)));
        this.realUEB = this.participantsNum - this.realUEA;;
        this.realAggSO = this.realSOA*(this.AFF+this.AI*(this.realSOA**2)) + this.realSOB*(this.BFF+this.BI*(this.realSOB**2));
        this.realAggUE = this.realUEA*(this.AFF+this.AI*(this.realUEA**2)) + this.realUEB*(this.BFF+this.BI*(this.realUEB**2));
        this.realPOA = this.realAggUE/ this.realAggSO;
        this.realIndex = (this.realAggUE - this.actualTTT)/(this.realAggUE - this.realAggSO);
    }
}

// function quadFirstSolution(a,b,c){
//    if (a === 0){
//      return -c/b;
//    }
//    var deltasqrt = Math.sqrt(b**2 - 4*a*c);
//    if (deltasqrt >= 0){
//      return (-b + deltasqrt)/(2*a);
//    }
// }



function loopdeloop(drivers,ways,pop){
    
    for (var i = 0; i < drivers; i++){
        t.push(i)
        if (ways > 1){
            loopdeloop(drivers,ways - 1,pop);
        }else{
            pop();
        }
    }
}

function df(drivers){
    var results = [];
    for(var i = 0; i <= drivers; i++){
        for (var j = 0; j <=drivers - i;j++){
            for (var k = 0; k <=drivers - i - j;k++){
                results.push([i,j,k,drivers -i - j - k])
            }
        }
    }
    return results;
}

function testueso(){
    var routes = [[10,0.0016666,2],[26,0.0016666,2]];
    var allocue =[],allocso =[];
    for (var i = 0; i < routes.length;i++){
        allocue.push(0);
        allocso.push(0);
    }
    var timesue = [];
    var timesso = [];
    var pov = [["volume","price of anarchy","dif"]];
    for (var i = 0; i < 100; i++){
        for (var j = 0; j < routes.length;j++){
            var timeue = routes[j][0] +routes[j][1]*Math.pow(allocue[j]+1,routes[j][2]);
            var timeso = (allocso[j]+1)*(routes[j][0] +routes[j][1]*Math.pow(allocso[j]+1,routes[j][2])) - (allocso[j])*(routes[j][0] +routes[j][1]*Math.pow(allocso[j],routes[j][2]));
            timesue[j] = timeue;
            timesso[j] = timeso;
        }
        allocue[timesue.indexOf(Math.min.apply(Math, timesue))]++;
        allocso[timesso.indexOf(Math.min.apply(Math, timesso))]++;
        var totalue=0,totalso=0;
        for (var j = 0; j < routes.length;j++){
            totalue+= allocue[j]*(routes[j][0] +routes[j][1]*Math.pow(allocue[j],routes[j][2]));
            totalso+= allocso[j]*(routes[j][0] +routes[j][1]*Math.pow(allocso[j],routes[j][2]));
        }
        pov.push([i+1,totalue/totalso,allocso[0] - allocue[0]])
    }
    return pov;
}


function gini(data) {
  if (!Array.isArray(data)) {
    throw new Error("Data set is not an array.");
  }

  if (data.length <= 0) {
    throw new Error("Data set is an empty array.");
  }

  data = data.map(function(value) {
    value = Number(value);

    if (isNaN(value)) {
      throw new Error("Data set contains non-numbers.");
    }

    if (value < 0) {
      throw new Error("Data set contains negative numbers.");
    }

    return value;
  });

  var sum1 = 0;
  var sum2 = 0;

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (i != j) {
        sum1 += Math.abs(data[i] - data[j]);
      }
    }

    sum2 += data[i];
  }

  if (sum2 == 0) {
    return 0; // If data set contains only zeroes, the equation further below won't work.
  }

  return sum1 / (2 * Math.pow(data.length, 2) * (sum2 / data.length));
};



function new_network(AClength){
//   this function calculates the UE and SO in a right triangle, where the long leg is route A, and the short leg and the hypotenuse is route B. 
// the leg impedence is three times the impedence of the hypotenuse.
  var ABlength = 10000;
  var BClength = Math.pow(Math.pow(ABlength,2) +Math.pow(AClength,2),0.5);
  
}