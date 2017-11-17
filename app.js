var svgWidth = 860;
var svgHeight = 600;

var margin = { top: 20, right: 40, bottom: 120, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var stateName;
var population;
var sampleSize;
var xValue;
var yValue;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .style("fill", "#ededed");

var chart = svg.append("g")
    .style("fill", "#ededed");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("fill", "#ededed")
  .style("opacity", 0);

d3.csv("data.csv", function(err, censusData) {
  if (err) throw err;

  //format the data
  censusData.forEach(function(data) {
    //demographics
    data.PopOver65 = +data.PopOver65;
    data.BothEmployed = +data.BothEmployed;
    data.BothUnemployed = +data.BothUnemployed;

    //behavioral data
    data.AlcoholConsumption = +data.AlcoholConsumption;
    data.PhysicalActivity = +data.PhysicalActivity;
    data.LessThanHS = +data.LessThanHS;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([20, d3.max(censusData, function(data) {
    return +data.PopOver65;
  })]);
  yLinearScale.domain([0, d3.max(censusData, function(data) {
    return data.AlcoholConsumption * 1.2;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
       stateName = data.State;
       population = +data.PopOver65;
       sampleSize = data.AlcoholConsumption;
      return (stateName + "<br> Population: " + population + "<br> Over 65: " + sampleSize);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(censusData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.PopOver65);
        return xLinearScale(data.PopOver65);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.AlcoholConsumption);
      })
      .attr("r", "10")
      .attr("fill", "orange")
      .text("AA")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  //first y axis
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height - 230))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Alcohol Consumption within past 30 days")
      .style("fill", "black")
      .on("click", function(data) {

        //scale the domain
        xLinearScale.domain([20, d3.max(censusData, function(data) {
          return +data.PopOver65;
        })]);
        yLinearScale.domain([0, d3.max(censusData, function(data) {
          return data.AlcoholConsumption * 1.2;
        })]);

        //remove the axis
        chart.selectAll("g").remove();

        chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .transition().duration(500)
            .call(bottomAxis);

        chart.append("g")
            .transition().duration(500)
            .call(leftAxis);

        //edit the tool tip info
        toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
           stateName = data.State;
           population = +data.PopOver65;
           sampleSize = data.AlcoholConsumption;
          return (stateName + "<br> Both Employed: " + population + "<br> Physical Activity: " + sampleSize);
        });
        chart.call(toolTip);

        //remove all the data
        chart.selectAll("circle").remove();

        //add new data
        chart.selectAll("circle")
            .data(censusData)
            .enter().append("circle")
            .attr("cx", function(data, index) {
              return xLinearScale(data.PopOver65);
            })
            .attr("cy", function(data, index) {
              return yLinearScale(data.AlcoholConsumption);
            })
            .attr("r", "10")
            .attr("fill", "orange")
            .text("AA")
            .on("click", function(data) {
              toolTip.show(data);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            })
            .transition()
            .duration(500);  
      })

  //second y axis
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height - 230))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Physical Activity Regularly")
      .style("fill", "black")
      .on("click", function(data) {

        //scale the domain
        xLinearScale.domain([20, d3.max(censusData, function(data) {
          return +data.BothEmployed;
        })]);
        yLinearScale.domain([0, d3.max(censusData, function(data) {
          return data.PhysicalActivity * 1.2;
        })]);

        //remove the axis
        chart.selectAll("g").remove();

        chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .transition().duration(500)
            .call(bottomAxis);

        chart.append("g")
            .transition().duration(500)
            .call(leftAxis);

        //edit the tool tip info
        toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
           stateName = data.State;
           population = +data.BothEmployed;
           sampleSize = data.PhysicalActivity;
          return (stateName + "<br> Both Employed: " + population + "<br> Over 65: " + sampleSize);
        });
        chart.call(toolTip);

        //remove all the data
        chart.selectAll("circle").remove();

        //add new data
        chart.selectAll("circle")
            .data(censusData)
            .enter().append("circle")
            .attr("cx", function(data, index) {
              console.log(data.BothEmployed);
              return xLinearScale(data.BothEmployed);
            })
            .attr("cy", function(data, index) {
              return yLinearScale(data.PhysicalActivity);
            })
            .attr("r", "10")
            .attr("fill", "red")
            .text("AA")
            .on("click", function(data) {
              toolTip.show(data);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            })
            .transition()
            .duration(500);
        
      })

  //third y axis 
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height - 230))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Less Than a High School Education")
      .style("fill", "black")
      .on("click", function(){
          //scale the domain
        xLinearScale.domain([20, d3.max(censusData, function(data) {
          return +data.BothEmployed;
        })]);
        yLinearScale.domain([0, d3.max(censusData, function(data) {
          return data.LessThanHS * 1.2;
        })]);

        //remove the axis
        chart.selectAll("g").remove();

        chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .transition().duration(500)
            .call(bottomAxis);

        chart.append("g")
            .transition().duration(500)
            .call(leftAxis);

        //edit the tool tip info
        toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
           stateName = data.State;
           population = +data.BothEmployed;
           sampleSize = data.LessThanHS;
          return (stateName + "<br> Both Employed: " + population + "<br> Less than HS Education: " + sampleSize);
        });
        chart.call(toolTip);


        //remove all the data
        chart.selectAll("circle").remove();

        //add new data
        chart.selectAll("circle")
            .data(censusData)
            .enter().append("circle")
            .attr("cx", function(data, index) {
              console.log(data.BothEmployed);
              return xLinearScale(data.BothEmployed);
            })
            .attr("cy", function(data, index) {
              return yLinearScale(data.LessThanHS);
            })
            .attr("r", "10")
            .attr("fill", "green")
            .text("AA")
            .on("click", function(data) {
              toolTip.show(data);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            })
            .transition()
            .duration(500);

      });
      
// Append x-axis labels (adults 65 years and older)
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Adults 65 Years Old and Over in the U.S.")
    .style("fill", "black");

  // Append x-axis labels (Families where both male and female are working)
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 50) + ")")
    .attr("class", "axisText")
    .text("Families where partners are employed")
    .style("fill", "black");
    //.on("click", function (){changeData(censusData)});

  // Append x-axis labels (Families where both male and female are not working)
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 70) + ")")
    .attr("class", "axisText")
    .text("Families where partners are unemployed")
    .style("fill", "black");

});

// function changeData(data){
//   //TO-DO
//   //chain methods 
//   console.log(data[0]["State"]);
//   alert(data[0]["State"]);

//   chart.selectAll("circle")
//       .data(censusData)
//       .enter().append("circle")
//         .attr("cx", function(data, index) {
//           console.log(data.BothEmployed);
//           return xLinearScale(data.BothEmployed);
//         })
//         .attr("cy", function(data, index) {
//           return yLinearScale(data.LessThanHS);
//         })
//         .attr("r", "10")
//         .attr("fill", "green")
//         .text("AA")
//         .on("click", function(data) {
//           toolTip.show(data);
//         })
//         // onmouseout event
//         .on("mouseout", function(data, index) {
//           toolTip.hide(data);
//         })
//         .transition()
//         .duration(500);
//   }