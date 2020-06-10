var selector = d3.select("#selDataset");

d3.json("../../data/samples.json").then(data => {
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
  singleMetadata.forEach ((element) => {
  var textBox = d3.select("#sample-metadata").append("p")
  textBox.text(`${element[0]} : ${element[1]}`);
  });
  // First Graph
  var otuIds = samples[0].otu_ids
  var strotuIds = otuIds.map(function(e){return 'OTU ' + e.toString()});
  var sampleValues = samples[0].sample_values
  var top10otu = strotuIds.slice(0,10).reverse()
  var top10samples = sampleValues.slice(0,10).reverse();
  trace1 = {
    x: top10samples,
    y: top10otu,
    type: 'bar',
    orientation: 'h'
  };
  var data = [trace1]

  Plotly.newPlot("bar", data)
  // Bubble graph

  var trace2 = {
    x: otuIds,
    y: sampleValues,
    mode: 'markers',
    marker: {
      color: otuIds,
      size: sampleValues
    }
  };
  var data2 = [trace2]

  Plotly.newPlot("bubble", data2)

  ////////////
  // Enter a speed between 0 and 180
var level = metadata[0].wfreq*(180/9);

// Trig to calc meter point
var degrees = 180 - level,
     radius = .505;
var radians = degrees * Math.PI / 180;
var x = (radius * Math.cos(radians)+.5);
var y = (radius * Math.sin(radians)+.250);

// Path: may have to change to create a better triangle
var mainPath = 'M .5 0.200 L .5 0.250 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);
console.log(path);
  var data3 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata[0].wfreq,
      title: { text: "Scrubs per week" },
      text:["0-1","1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
      direction: "clockwise",
      textinfo: "text",
      hoverinfo: "label",
      textposition: "inside",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9]},
        steps: [
          { range: [0, 1], color: 'rgb(253, 254, 77)',},
          { range: [1, 2], color: 'rgb(224,251,85)' },
          { range: [2, 3], color: 'rgb(196,248,93)' },
          { range: [3, 4], color: 'rgb(168,245,101)' },
          { range: [4, 5], color: 'rgb(140,242,109)' },
          { range: [5, 6], color: 'rgb(112,240,117)' },
          { range: [6, 7], color: 'rgb(84,237,125)' },
          { range: [7, 8], color: 'rgb(56,234,133)' },
          { range: [8, 9], color: 'rgb(28,231,141)' },
        ],
      }
    }
  ];
  var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    },{
      type: 'circle',
      x0:0.475,
      y0:0.2,
      x1:0.525,
      y1:0.25,
      fillcolor: '850000',
    }]
  };

Plotly.newPlot('gauge', data3, layout);


  ///////////





});

function loadData() {
  d3.json("../../samples.json").then(data => {
    var names = data.names;
    var metadata = data.metadata;
    var samples = data.samples;
    // Sample Data
    metadata.forEach(element =>{
      if (element.id == selector.node().value){
        var singleMetadata = Object.entries(element);
        d3.select("#sample-metadata").html("")
        var wfreqValue = element.wfreq
        singleMetadata.forEach ((element) => {
          var textBox = d3.select("#sample-metadata").append("p")
          textBox.text(`${element[0]} : ${element[1]}`);
          });
        
        
        var level = wfreqValue*(180/9);

        // Trig to calc meter point
        var degrees = 180 - level,
              radius = .505;
        var radians = degrees * Math.PI / 180;
        var x = (radius * Math.cos(radians)+.5);
        var y = (radius * Math.sin(radians)+.250);
        
        // Path: may have to change to create a better triangle
        var mainPath = 'M .5 0.200 L .5 0.250 L ',
              pathX = String(x),
              space = ' ',
              pathY = String(y),
              pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        console.log(path)
        var updatelayout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            },{
              type: 'circle',
              x0:0.475,
              y0:0.2,
              x1:0.525,
              y1:0.25,
              fillcolor: '850000',
            }]
          };
        Plotly.relayout("gauge", updatelayout	);
        Plotly.restyle("gauge", "value", [wfreqValue])
        console.log(updatelayout);
        
      }
    })
    samples.forEach(element => {
      if (element.id == selector.node().value){
        var otuIds = element.otu_ids
        var strotuIds = otuIds.map(function(e){return 'OTU ' + e.toString()});
        var sampleValues = element.sample_values
        var top10otu = strotuIds.slice(0,10).reverse()
        var top10samples = sampleValues.slice(0,10).reverse();
        Plotly.restyle("bar", "x", [top10samples]);
        Plotly.restyle("bar", "y", [top10otu]);
        var updateBubble = {}
        Plotly.restyle("bubble", "x", [otuIds]);
        Plotly.restyle("bubble", "y", [sampleValues]);
        Plotly.restyle("bubble", "marker.color", [otuIds]);
        Plotly.restyle("bubble", "marker.size", [sampleValues]);        
      }
    });
  });
}