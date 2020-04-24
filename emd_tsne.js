var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = window.innerWidth/2 - margin.left - margin.right,
height = window.innerWidth/2 - margin.top - margin.bottom;

var emd_tsne = d3.select("#emd_tsne")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div") 
  .attr("class", "tooltip")
  .style("opacity", 0);


d3.json("./tsnescale_four_good.json", function(data){
  console.log(data);
  var aud = document.getElementById("note");
  var x = d3.scaleLinear().range([0,850])
  .domain(d3.extent(data, d=>d.emd_pos[0]));
  var y = d3.scaleLinear().range([850, 0])
  .domain(d3.extent(data, d=>d.emd_pos[1]));

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10); //category20

  var keys = ["bamboo flute","erhu","pipa","zheng"];
  var legend = emd_tsne.append("g").selectAll("g").data(keys).enter();
  legend.append("rect")
  .attr("x", 0).attr("y", function(d, i){ return 30*i; })
  .attr("width", 25).attr("height",25)
  .style("fill",function(d,i){ return colorScale(["c","e","p","z"][i]); });
  legend.append("text")
  .attr("x", 30).attr("y", function(d, i){ return 30*i+8; })
  .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "25px")
  .attr("dy", ".35em").style("text-anchor", "start")
  .text(function(d){return d;});

  var annote = emd_tsne.append("g").selectAll("g").data(data).enter()
  .append("text")
  .attr("x", function (d,i) { 
    if(i%8==3&&i%384>=96&&i%384<192) return x(d["emd_pos"][0])-15;
  })
  .attr("y", function (d, i) { 
    if(i%8==3&&i%384>=96&&i%384<192) return y(d["emd_pos"][1])+10;
  })
  .attr("dy", ".35em").attr("font-family", "sans-serif").attr("font-weight","bold")
  .attr("font-size", "25px").style("text-anchor", "start")
  .text(function (d, i) { 
    if(i%8==3&&i%384>=96&&i%384<192) return d["idx"].substring(0,3);
  });

  var scatter = emd_tsne.append("g")
  .selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attr("id", function(d){ return d["idx"]; })
  .attr("cx", function (d) { return x(d["emd_pos"][0]) })
  .attr("cy", function (d) { return y(d["emd_pos"][1]) })
  .attr("r", 3)
  .style("fill", function(d){ return colorScale(d["label"]) })
  .style("opacity", 0.6)
  .on("mouseover", function(d) {    
    tooltip.transition().duration(200).style("opacity", .9);    
    tooltip.html(d.idx.substring(0,3)+" "+d.idx.substring(3)+" "+d.label)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");  
  })          
  .on("mouseout", function(d) {   
    tooltip.transition()    
    .duration(500)    
    .style("opacity", 0); 
  })
  .on("click", function(d) {
    console.log("You just Click d:", d, aud);
    path="./clips/org_"+d["idx"]+"-"+(3+d["idx"])+"_"+d["label"]+".wav";
    console.log(path);
    aud.src = path;
    aud.load();
    // aud.muted = true;
    aud.play();
  });

  // var legend = emd_tsne.append("g")
  //   .attr("class","legend")
  //   .attr("transform","translate(50,30)")
  //   .style("font-size","12px")
  //   .call(d3.legend)

    // myaudio.addEventListener("canplaythrough", playfun, false);

    // function pausing_function(){
    //     console.log(" time during listening:", this.currentTime, end_time, d["file_name"])
    //     if(this.currentTime >= end_time){
    //         this.pause();
    //         this.currentTime  = 0 + '';
    //         this.removeEventListener("timeupdate", arguments.callee, false);
    //         console.log(" stopped", this.currentTime)
    //     }
    // }

    // function playfun() {
    //     if (this.currentTime < start_time){
    //         this.play();
    //         this.currentTime = start_time;
    //         console.log("onload", this.currentTime )
    //     }
    //     else {
    //         console.log("playing!!!!")
    //         this.muted=false;
    //         this.removeEventListener("canplaythrough",playfun, false);
    //         this.addEventListener("timeupdate", pausing_function, false);
    //     }
    // }
  

});

