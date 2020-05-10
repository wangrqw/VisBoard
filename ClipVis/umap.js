var umap = d3.select("#umap")
  .append("svg")
  .attr("width", document.getElementById("umap").offsetWidth)
  .attr("height", document.getElementById("umap").offsetWidth)
  .append("g");
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var umap0 = d3.select("#umap0")
.append("svg")
.attr("width", document.getElementById("umap0").offsetWidth)
.attr("height", document.getElementById("umap0").offsetWidth)
.append("g");
var umap1 = d3.select("#umap1")
.append("svg")
.attr("width", document.getElementById("umap1").offsetWidth)
.attr("height", document.getElementById("umap1").offsetWidth)
.append("g");
var umap2 = d3.select("#umap2")
.append("svg")
.attr("width", document.getElementById("umap2").offsetWidth)
.attr("height", document.getElementById("umap2").offsetWidth)
.append("g");
var umap3 = d3.select("#umap3")
.append("svg")
.attr("width", document.getElementById("umap3").offsetWidth)
.attr("height", document.getElementById("umap3").offsetWidth)
.append("g");

var umap_sm = [umap0,umap1,umap2,umap3];

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


function draw_umap(jsonfile) {
  umap.selectAll("path").remove();
  [0,1,2,3,].forEach(function(m){
    umap_sm[m].selectAll("path").remove();
  });

d3.json("../data/"+jsonfile, function(data){
  // console.log(data);
  // var aud = document.getElementById("note");
  var x = d3.scaleLinear().range([0,width])
  .domain(d3.extent(data, d=>d.umap[0]));
  var y = d3.scaleLinear().range([height, 0])
  .domain(d3.extent(data, d=>d.umap[1]));

  var x_sm = d3.scaleLinear().range([0,document.getElementById("umap0").offsetWidth])
  .domain(d3.extent(data, d=>d.umap[0]));
  var y_sm = d3.scaleLinear().range([document.getElementById("umap0").offsetWidth, 0])
  .domain(d3.extent(data, d=>d.umap[1]));
  
  var symbolGenerator = d3.symbol();

  var scatter = umap.append('g').selectAll('path')
  .data(data).enter().append('path')
  .attr('transform', function(d){
    var location = x(d.umap[0])+','+y(d.umap[1]);
    return 'translate('+location+')';
  })
  .attr('d', function(d){
    var type = symbolTypes[d.m];
    symbolGenerator.size(50).type(d3[type]);
    return symbolGenerator();
  })
  .attr('fill', function(d){ return tableau_10[d.c]; })
  .style("opacity", 0.5);

  //small side plots
  [0,1,2,3,].forEach(function(m){
    umap_sm[m].append('g').selectAll('path')
    .data(data.filter(function(d){
      return d.m == m;
    })).enter()
    .append('path')
    .attr('transform', function(d){
      var location = x_sm(d.umap[0])+','+y_sm(d.umap[1]);
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
});
}
