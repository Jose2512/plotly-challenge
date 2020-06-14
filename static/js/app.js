function needleCalc(wfreqTarget){
  var level = wfreqTarget*(180/9);
  var degrees = 180 - level,
      radius = .505;
  var radians = degrees * Math.PI / 180;
  var x = (radius * Math.cos(radians)+.5);
  var y = (radius * Math.sin(radians)+.250);
  var mainPath = 'M .5 0.200 L .5 0.250 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  return mainPath.concat(pathX,space,pathY,pathEnd);
};

var selector = d3.select("#selDataset");

d3.json("./data/samples.json").then(data => {
  var names = data.names;
  var metadata = data.metadata;
  var samples = data.samples;
  // Names for Selection
  names.forEach(element => {
      var options = selector.append("option");
      options.text(element);
      options.attr("value", element)
  });
  // Sample Data
  var singleMetadata = Object.entries(metadata[0]);
  singleMetadata.forEach (([key, value]) => {
  var textBox = d3.select("#sample-metadata").append("p")
  textBox.classed('demoinf', true)
  textBox.text(`${key} : ${value}`);
  });
  // First Graph Data
  var otuIds = samples[0].otu_ids
  var otuLabels = samples[0].otu_labels
  var strotuIds = otuIds.map(function(e){return 'OTU ' + e.toString()});
  var sampleValues = samples[0].sample_values
  var top10otu = strotuIds.slice(0,10).reverse()
  var top10samples = sampleValues.slice(0,10).reverse();
  // First Graph Trace
  trace1 = {
    x: top10samples,
    y: top10otu,
    type: 'bar',
    orientation: 'h',
    marker:{
      color: 'rgba(255,255,255,0.5)'
    },
  };
    // First Graph Layout
  var layoutBar={
    margin: {
      t: 30,
      pad: 4
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 350,
    xaxis:{
      color:'rgb(255,255,255)',
      tickfont: {
        family: "MuseoModerno",
      }
    },
    yaxis:{
    color:'rgb(255,255,255)',
    tickfont: {
      family: "MuseoModerno",
      }
    }
    };
  var data = [trace1]
  Plotly.newPlot("bar", data, layoutBar, )
  
  // Bubble graph
  var trace2 = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      colorscale: 'Earth',
      color: otuIds,
      size: sampleValues
    }
  };
  var layoutBubble={
    height: 320, 
    margin: {
      t: 30,
      pad: 4
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis:{
      showgrid: false,
      color:'rgb(255,255,255)',
      tickfont: {
        family: "MuseoModerno",
      }
    },
    yaxis:{
    showgrid: false,
    color:'rgb(255,255,255)',
    tickfont: {
      family: "MuseoModerno",
      }
    }
    };
  var data2 = [trace2]
  Plotly.newPlot("bubble", data2,layoutBubble)
  //gauge-needle graph
  var path = needleCalc(metadata[0].wfreq);
  var data3 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata[0].wfreq,
      title: { text: "Scrubs per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {
          color: "rgba (255,255,255,0.5"
        },
        axis: { 
          range: [null, 9]},
        
        steps: [
          { range: [0, 1], color: 'rgba(127, 12, 150, .05)' },
          { range: [1, 2], color: 'rgba(127, 12, 150, .1)' },
          { range: [2, 3], color: 'rgba(127, 12, 150, .15)' },
          { range: [3, 4], color: 'rgba(127, 12, 150, .2)' },
          { range: [4, 5], color: 'rgba(127, 12, 150, .25)' },
          { range: [5, 6], color: 'rgba(127, 12, 150, .3)' },
          { range: [6, 7], color: 'rgba(127, 12, 150, .35)' },
          { range: [7, 8], color: 'rgba(127, 12, 150, .40)' },
          { range: [8, 9], color: 'rgba(127, 12, 150, .45)' },
        ],
      }
    }
  ];
  var layout = {
    width: 340,
    margin: {
      l:5,
      t:0,
      b:0,
      r:5,
      pad: 4
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font:{
      color: "rgb(255,255,255)",
      family: "MuseoModerno",
    },
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(204,45,232)',
      line: {
        color: 'rgb(204,45,232)'
      }
    },{
      type: 'circle',
      x0:0.475,
      y0:0.2,
      x1:0.525,
      y1:0.25,
      fillcolor: 'rgb(204,45,232)',
      line: {
        color: 'rgb(204,45,232)'
      }
    }]
  };
Plotly.newPlot('gauge', data3, layout);
});

function loadData() {
  d3.json("./data/samples.json").then(data => {
    var metadata = data.metadata;
    var samples = data.samples;
    var otuLabels = samples.otu_labels
    // Sample Data
    metadata.forEach(element =>{
      if (element.id == selector.node().value){
        var singleMetadata = Object.entries(element);
        d3.select("#sample-metadata").html("")
        var wfreqValue = element.wfreq
        singleMetadata.forEach (([key, value]) => {
          var textBox = d3.select("#sample-metadata").append("p")
          textBox.classed('demoinf', true)
          textBox.text(`${key} : ${value}`);
          });
        
        var path = needleCalc(wfreqValue);
        var updatelayout = {
          shapes:[{
            type: 'path',
            path: path,
            fillcolor: 'rgb(204,45,232)',
            line: {
              color: 'rgb(204,45,232)'
            }
          },{
            type: 'circle',
            x0:0.475,
            y0:0.2,
            x1:0.525,
            y1:0.25,
            fillcolor: 'rgb(204,45,232)',
            line: {
              color: 'rgb(204,45,232)'
            }
          }]
          };
        Plotly.relayout("gauge", updatelayout	);
        Plotly.restyle("gauge", "value", [wfreqValue])
      }
    })
    samples.forEach(element => {
      if (element.id == selector.node().value){
        var otuIds = element.otu_ids
        var strotuIds = otuIds.map(function(e){return 'OTU ' + e.toString()});
        var sampleValues = element.sample_values
        var top10otu = strotuIds.slice(0,10).reverse()
        var top10samples = sampleValues.slice(0,10).reverse();
        Plotly.animate("bar",{
          data:[{x:top10samples, y:top10otu}]
        },{
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 500
            }
          }
        )      
        Plotly.restyle("bubble", "x", [otuIds]);
        Plotly.restyle("bubble", "y", [sampleValues]);
        Plorly.restyle("bubble", "text", [otuLabels]);
        Plotly.restyle("bubble", "marker.color", [otuIds]);
        Plotly.restyle("bubble", "marker.size", [sampleValues]);        
      }
    });
  });
}