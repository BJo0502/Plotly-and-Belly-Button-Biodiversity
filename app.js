function init() {
     
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      //console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);

          var defaultId = data.names[0]
          buildMetadata(defaultId)
          buildCharts(defaultId)

      });
  })}
  
  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key,value])=>{
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      })
    });
  }

  function buildCharts(sample) {
    d3.json("samples.json").then((data) =>{
      var samps = data.samples;
      var sampsArray = samps.filter(sampObj => sampObj.id == sample);
      var sampsResult = sampsArray[0];
      var otuIds = sampsResult.otu_ids.map(otuIds => "OTU " + otuIds)
      var otuLabels = sampsResult.otu_labels
      var sampVals = sampsResult.sample_values.sort(function(a,b){return b-a})
      var topTenSamp = sampVals.slice(0,10).reverse()
      //console.log(topTenSamp)
    

      var barTrace = {
        x: topTenSamp,
        y: otuIds,
        type: "bar",
        orientation: 'h',
        text: otuLabels,
        marker: {color: "rgb(82, 255, 47,.9)"},
      }

      var dataBar = [barTrace]
      
      var layoutBar = {
       title: "Top 10 Bacterial Species",
       //xaxis:  { title: "Sample Value"},
       //yaxis: { title: "Bacterial Species ID"},
       height: 500,
       width: 600,
       paper_bgcolor: "rgb(53, 47, 47, 0.9)",
       font: {
       size: 16,
       color: "white",
       family: "Arial"
     },
      align: 'center'
        };
      
        Plotly.newPlot("bar", dataBar, layoutBar)

      var traceBubble = {
        x: sampsResult.otu_ids,
        y: sampsResult.sample_values,
        text: sampsResult.otu_labels,
        mode: 'markers',
        marker: {
          size: sampsResult.sample_values,
          color: sampsResult.otu_ids,
          colorscale: "Bluered"
        }
        
      }
      var dataBubble = [traceBubble]

      var layoutBubble = {
        title: "<b>Different Types of Bacteria Detected in Belly Button</b>",
        hovermode: 'closest',
        showlegend: false,
        paper_bgcolor: "rgb(53, 47, 47, 0.9)",
        font: {
          size: 16,
          color: "white",
          family: "Arial"
       }
      }
      Plotly.newPlot('bubble', dataBubble, layoutBubble)

      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var wfreq = result.wfreq
      //console.log(wfreq)

      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
          type: "indicator",
          mode: "gauge+number",
          //delta: { reference: 4 },
          gauge: {
            axis: { range: [null, 10] },
            bar: {color: "black"},
            steps: [
              { range: [0, 2], color: "rgb(255, 47, 47,.9)" },
              { range: [2, 4], color: "rgb(241, 128, 15,.9)" },
              { range: [4, 6], color: "rgb(226, 241, 15,.9)" },
              { range: [6, 8], color: "rgb(173, 255, 47,.9)" },
              { range: [8, 10], color: "rgb(82, 255, 47,.9)" }
            ],
          }
        }
      ];
      
      var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 },paper_bgcolor: "rgb(53, 47, 47, 0.9)",font: {
        size: 16,
        color: "white",
        family: "Arial"
     } };
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
      })
  }

