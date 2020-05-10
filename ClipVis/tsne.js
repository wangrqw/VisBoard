const margin_value = 10;
const margin = {top: margin_value,right: margin_value,bottom: margin_value,left: margin_value},
width = document.getElementById("tsne").offsetWidth - margin.left - margin.right,
height = document.getElementById("tsne").offsetWidth- margin.top - margin.bottom;
const instruments_list = ['BambooFlute', 'Erhu', 'Pipa', 'Zheng'];

var tsne = d3.select("#tsne")
  .append("svg")
  .attr("width", document.getElementById("tsne").offsetWidth)
  .attr("height", document.getElementById("tsne").offsetWidth)
  .append("g");
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var tsne0 = d3.select("#tsne0")
.append("svg")
.attr("width", document.getElementById("tsne0").offsetWidth)
.attr("height", document.getElementById("tsne0").offsetWidth)
.append("g");
var tsne1 = d3.select("#tsne1")
.append("svg")
.attr("width", document.getElementById("tsne1").offsetWidth)
.attr("height", document.getElementById("tsne1").offsetWidth)
.append("g");
var tsne2 = d3.select("#tsne2")
.append("svg")
.attr("width", document.getElementById("tsne2").offsetWidth)
.attr("height", document.getElementById("tsne2").offsetWidth)
.append("g");
var tsne3 = d3.select("#tsne3")
.append("svg")
.attr("width", document.getElementById("tsne3").offsetWidth)
.attr("height", document.getElementById("tsne3").offsetWidth)
.append("g");

var tsne_sm = [tsne0,tsne1,tsne2,tsne3];

var tooltip = d3.select("body").append("div") 
  .attr("class", "tooltip")
  .style("opacity", 0);

// var fisheye = d3.fisheye.circular().radius(60).distortion(6);
// var cursorCircle = tsne.append("circle").attr("r", 60).style("stroke", "red").style("fill", "none");

var tableau_10 = ['rgb(31,119,180)',
  'rgb(255,127,14)',
  'rgb(44,160,44)',
  'rgb(214,39,40)',
  'rgb(148,103,189)',
  'rgb(140,86,75)',
  'rgb(227,119,194)',
  'rgb(127,127,127)',
  'rgb(188,189,34)',
  'rgb(23,190,207)',
  'gold',
  'rgb(255, 0, 191)',
  'royalblue'
];
var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];


function draw_tsne(jsonfile) {
  tsne.selectAll("path").remove();
  [0,1,2,3,].forEach(function(m){
    tsne_sm[m].selectAll("path").remove();
  });
d3.json("../data/"+jsonfile, function(data){
  // console.log(data);
  // var aud = document.getElementById("note");
  var x = d3.scaleLinear().range([0,width])
  .domain(d3.extent(data, d=>d.tsne[0]));
  var y = d3.scaleLinear().range([height, 0])
  .domain(d3.extent(data, d=>d.tsne[1]));

  var x_sm = d3.scaleLinear().range([0,document.getElementById("tsne0").offsetWidth])
  .domain(d3.extent(data, d=>d.tsne[0]));
  var y_sm = d3.scaleLinear().range([document.getElementById("tsne0").offsetWidth, 0])
  .domain(d3.extent(data, d=>d.tsne[1]));
  

  // var keys = ["bamboo flute","erhu","pipa","zheng"];
  // var legend = tsne.append("g").selectAll("g").data(keys).enter();
  // legend.append("rect")
  // .attr("x", 0).attr("y", function(d, i){ return 30*i; })
  // .attr("width", 25).attr("height",25)
  // .style("fill",function(d,i){ return colorScale(["c","e","p","z"][i]); });
  // legend.append("text")
  // .attr("x", 30).attr("y", function(d, i){ return 30*i+8; })
  // .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "25px")
  // .attr("dy", ".35em").style("text-anchor", "start")
  // .text(function(d){return d;});

  // var annote = tsne.append("g").selectAll("g").data(data).enter()
  // .append("text")
  // .attr("x", function (d,i) { 
  //   if(i%8==3&&i%384>=96&&i%384<192) return x(d["emd_pos"][0])-15;
  // })
  // .attr("y", function (d, i) { 
  //   if(i%8==3&&i%384>=96&&i%384<192) return y(d["emd_pos"][1])+10;
  // })
  // .attr("dy", ".35em").attr("font-family", "sans-serif").attr("font-weight","bold")
  // .attr("font-size", "25px").style("text-anchor", "start")
  // .text(function (d, i) { 
  //   if(i%8==3&&i%384>=96&&i%384<192) return d["idx"].substring(0,3);
  // });
  
  var symbolGenerator = d3.symbol();

  var scatter = tsne.append('g').selectAll('path')
  .data(data).enter()
  .append('path')
  .attr('transform', function(d){
    var location = x(d.tsne[0])+','+y(d.tsne[1]);
    return 'translate('+location+')';
  })
  .attr('d', function(d){
    var type = symbolTypes[d.m];
    symbolGenerator.size(50).type(d3[type]);
    return symbolGenerator();
    // return d3.symbol().size(50).type(d3[type]);
  })
  .attr('fill', function(d){
    return tableau_10[d.c];
  })
  .style("opacity", 0.5)
  .on("mouseover", function(d) {    
    tooltip.transition().duration(200).style("opacity", .9);    
    tooltip.html(instruments_list[d.m])
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");  
  })          
  .on("mouseout", function(d) {   
    tooltip.transition()    
    .duration(500)    
    .style("opacity", 0); 
  });

  //small side plots
  [0,1,2,3,].forEach(function(m){
    tsne_sm[m].append('g').selectAll('path')
    .data(data.filter(function(d){
      return d.m == m;
    })).enter()
    .append('path')
    .attr('transform', function(d){
      var location = x_sm(d.tsne[0])+','+y_sm(d.tsne[1]);
      return 'translate('+location+')';
    })
    .attr('d', function(d){
      var type = symbolTypes[d.m];
      symbolGenerator.size(30).type(d3[type]);
      return symbolGenerator();
    })
    .attr('fill', function(d){
      return tableau_10[d.c];
    })
    .style("opacity", 0.5);
  });
  


  // var scatter = tsne.select("g")
  // .selectAll("circle")
  // .data(data).enter()
  // .append("circle")
  // .attr("id", function(d){ return d["id"]; })
  // .attr("cx", function (d) { return x(d['tsne'][0]) })
  // .attr("cy", function (d) { return y(d['tsne'][1]) })
  // .attr("r", 1)
  // .style("fill", function(d){ 
  //   return 'royalblue'
  //   // return colorScale(d["label"]) 
  // })
  // .style("opacity", 0.5)
  // .on("mouseover", function(d) {    
  //   tooltip.transition().duration(200).style("opacity", .9);    
  //   tooltip.html(d.idx.substring(0,3)+" "+d.idx.substring(3)+" "+d.label)
  //   .style("left", (d3.event.pageX) + "px")
  //   .style("top", (d3.event.pageY - 28) + "px");  
  // })          
  // .on("mouseout", function(d) {   
  //   tooltip.transition()    
  //   .duration(500)    
  //   .style("opacity", 0); 
  // })
  // .on("click", function(d) {
  //   console.log("You just Click d:", d, aud);
  //   path="./clips/org_"+d["idx"]+"-"+(3+d["idx"])+"_"+d["label"]+".wav";
  //   console.log(path);
  //   aud.src = path;
  //   aud.load();
  //   // aud.muted = true;
  //   aud.play();
  // });


  // // fisheye: add a new property that saves the coordinates of circles
  // scatter.each(function(d) {
  //   d.coors = { "x": x(d["tsne"][0]),
  //               "y": y(d["tsne"][1]) 
  //             };
  // });

  // // add mousemove events: magnifier and circle around cursor
  // tsne.on("mousemove", function(){
  //   fisheye.focus(d3.mouse(this));
  //   // update curose cirle location
  //   cursorCircle.attr("cx", d3.mouse(this)[0])
  //         .attr("cy", d3.mouse(this)[1]);
  //   // magnifier effect
  //   scatter.each(function(d) { d.fisheye = fisheye(d.coors); })
  //       .attr("cx", function(d) { return d.fisheye.x; })
  //       .attr("cy", function(d) { return d.fisheye.y; })
  //       .attr("r", function(d) { return d.fisheye.z*2.5; });

  // });

});
}

