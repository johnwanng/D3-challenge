// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Default xaxis and yaxis values
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  //console.log(chosenXAxis);
  // create scales
  var xLinearScale = d3.scaleLinear()
                       .domain( d3.extent(Data, data => data[chosenXAxis]))
                        //The nice method call on the x scale tells the x-axis to format the chosenXAxis scale nicely.                       
                       .nice(d3[chosenXAxis])
                       .range([0, chartWidth]);                       
  return xLinearScale; 
}

// function used for updating y-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
                       .domain(d3.extent(Data, data => data[chosenYAxis]))
                        //The nice method call on the x scale tells the x-axis to format the chosenYAxis scale nicely.                       
                       .nice(d3[chosenYAxis])
                       .range([ chartHeight, 0]);
  return yLinearScale;
}


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
       .duration(1000)
       .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
       .duration(1000)
       .call(leftAxis);

  return yAxis;
}


// function used for updating circle group
function updateCircleGroups(Data, x, y, chosenXAxis, chosenYAxis, circlesGroup) {

    // Add Circles
    var circlesGroup = chartGroup.selectAll("Circle")
                                 .data(Data)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", function (d) { return x(d[chosenXAxis]); } )
                                 .attr("cy", function (d) { return y(d[chosenYAxis]); } )
                                 .attr("r", 10)        
                                 .style("fill", "#8abcd5");

    return circlesGroup;
  }

// function used for updating circle labels
function updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels) {

    var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

    // text label for the circle
    circleLabels.attr("dx", function(d) {return x(d[chosenXAxis]);})
                .attr("dy", function(d) {return y(d[chosenYAxis]);})
                .text(function(d) {return d.abbr})
                .attr("text-anchor","middle")
                .style("font-size","9px")
                .style("fill", "white");
 
    return circleLabels;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesLabels) {

  console.log(chosenXAxis);

  // Define tooltip
  var toolTip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([80, -60])
                  .html(function(d) {
                    //console.log(`${d[chosenXAxis]}`);  
                  //console.log(`${d.state}<br> ${chosenXAxis} : ${d[chosenXAxis]} <br> ${chosenYAxis}: ${d[chosenYAxis]}`);
                  return (`${d.state}<br> ${chosenXAxis} : ${d[chosenXAxis]} <br> ${chosenYAxis}: ${d[chosenYAxis]}`);
  });              

  // Attach to the circle label
  circlesLabels.call(toolTip);

  // onmouse over event will show the tooltip
  circlesLabels.on("mouseover", function(data) {
                  toolTip.show(data);
                  })
  // onmouseout event will not show the tooltip
              .on("mouseout", function(data, index) {
                  toolTip.hide(data);
                  });

  return circlesLabels;
}




// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(Data) {

    // Print the Data
    //console.log(Data);

    // Cast the relevant data values to number that are  to be plotted on the chart
    Data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
//        console.log(data.smokes);
    });

    // Plot the xaxis from the chosen x axis
    var x = xScale(Data, chosenXAxis);

    // Add x-axis to the canvas
    var xAxis = chartGroup.append("g")
                          .attr("transform", "translate(0," + chartHeight + ")")
                          .call(d3.axisBottom(x));

    // Plot the xaxis from the chosen y axis
    var y = yScale(Data, chosenYAxis);

    // Add y-axis to the canvas
    var yAxis = chartGroup.append("g")
                          .call(d3.axisLeft(y));

    // Add Circles
    var circlesGroup = updateCircleGroups(Data, x, y, chosenXAxis, chosenYAxis, circlesGroup);

    // Add Cirlcle label
    var circleLabels = updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);
    

    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
                                 .attr("transform","translate(" + ((svgWidth / 2 - 80)) + " ," + (svgHeight - chartMargin.top - 10) + ")");

    var povertyLabel = xlabelsGroup.append("text")
                                  .attr("x", 0)
                                  .attr("y", -30)
                                  .attr("value", "poverty") // value to grab for event listener
                                  .classed("active", true)    
                                  .text("In Poverty (%)");                       

    var ageLabel = xlabelsGroup.append("text")
                                  .attr("x", 0)
                                  .attr("y", -10)
                                  .attr("value", "age") // value to grab for event listener
                                  .classed("inactive", true)    
                                  .text("Age (Medium)");                                                                   

    var incomeLabel = xlabelsGroup.append("text")
                                  .attr("x", 0)
                                  .attr("y", 10)
                                  .attr("value", "income") // value to grab for event listener
                                  .classed("inactive", true)    
                                  .text("Household Income (Medium)");           


// Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
                                //.attr("transform","translate(" + ((svgWidth / 2 - 80)) + " ," + (svgHeight - chartMargin.top - 10) + ")");
                                 .attr("transform", "rotate(-90)")
                                 .attr("y", 0 - chartMargin.left + 40)
                                 .attr("x", 0 - (svgHeight / 2))
                                 .attr("dy", "1em");
                  

    var healthcareLabel = ylabelsGroup.append("text")
                                  .attr("x", -250)
                                  .attr("y", -30)
                                  .attr("value", "healthcare") // value to grab for event listener
                                  .classed("active", true)    
                                  .text("Lacks Healthcare (%)");                       

    var smokesLabel = ylabelsGroup.append("text")
                                  .attr("x", -250)
                                  .attr("y", -50)
                                  .attr("value", "smokes") // value to grab for event listener
                                  .classed("inactive", true)    
                                  .text("Smokes (%)");                                                                   

    var obesityLabel = ylabelsGroup.append("text")
                                  .attr("x", -250)
                                  .attr("y", -70)
                                  .attr("value", "obesity") // value to grab for event listener
                                  .classed("inactive", true)    
                                  .text("Obesity (%)");           
 
    // Make circle labels so they are tooptip enabled 
    var circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
                .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== chosenXAxis) {

                // replaces chosenXAxis with selected x axis value
                chosenXAxis = value;

                // updates x scale for new chosenXAxis info
                x = xScale(Data, chosenXAxis);

                // updates x axis with transition for chosenXAxis
                xAxis = renderXAxes(x, xAxis);
                console.log("change");
   
                // Update Cirlcle position with transition for chosenXAxis                                        
                circlesGroup.transition()
                            .duration(1000)
                            .attr("cx", d => x(d[chosenXAxis]));

                // Update Cirlcle label with chosenXAxis info
                var circleLabels = updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);
                                                        
                // updates tooltips with chosenXAxis info
                var circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);

                // changes xaxis classes to change bold text
                if (chosenXAxis === "poverty") {
                  povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);                    
                }
                else if (chosenXAxis === "age") {
                  povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);                    
                }
                else if (chosenXAxis === "income") {
                  povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);                    
                }
              }
            })

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
                .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== chosenYAxis) {

                // replaces chosenYAxis with selected y axis value
                chosenYAxis = value;

                // updates y scale for new chosenYAxis info
                y = yScale(Data, chosenYAxis);

                // updates y axis with transition for chosenYAxis
                yAxis = renderYAxes(y, yAxis);
                console.log("change");
   
                // Update Cirlcle position with transition for chosenYAxis                                        
                circlesGroup.transition()
                            .duration(1000)
                            .attr("cy", d => y(d[chosenYAxis]));

                // Update Cirlcle label with chosenYAxis info
                var circleLabels = updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);
                                                        
                // updates tooltips with chosenYAxis info
                var circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);

                // changes yaxis classes to change bold text
                if (chosenYAxis === "healthcare") {
                  healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);                    
                }
                else if (chosenYAxis === "smokes") {
                  healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);                    
                }
                else if (chosenYAxis === "obesity") {
                  healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);                    
                }
              }              
            })

}).catch(function(error) {
  console.log(error);
});
