function toCsv(data){
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < data.length ? dataString+ "\n" : dataString;

}); 
var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
var date = Date();
link.setAttribute("download", date + ".csv");
link.click();


}
function toJSON(data){
    var str = JSON.stringify(data);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    var link = document.createElement("a");
    link.setAttribute("href", dataUri);
    var date = Date();
    link.setAttribute("download", date + ".json");
    link.click();
}