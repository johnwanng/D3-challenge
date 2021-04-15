// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Initial Params
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
                       //.domain([d3.min(Data, d=> d[chosenXAxis]), d3.max(Data, d => d[chosenXAxis])])
                        //The nice method call on the x scale tells the x-axis to format the chosenXAxis scale nicely.                       
                       .nice(d3[chosenXAxis])
                       .range([0, chartWidth]);                       
  return xLinearScale; 
  /* var xLinearScale = d3.scaleLinear()
                       .domain(d3.extent(Data, data => data["aaAge"]))
                        //The nice method call on the x scale tells the x-axis to format the chosenXAxis scale nicely.                       
                       .nice(d3["aaAge"])
                       .range([0, chartWidth]);
  return xLinearScale;   */
}

// function used for updating y-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
                       .domain(d3.extent(Data, data => data[chosenYAxis]))
                       //.domain([d3.min(Data, d => d[chosenYAxis]), d3.max(Data, d => d[chosenYAxis])])
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

/* 
// functions used for updating circles group with a transition to
// new circles for both X and Y coordinates
function renderXCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// functions used for updating circles text with a transition on
// new circles for both X and Y coordinates
function renderXText(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis])+5);

  return circlesGroup;
}

 */

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

  circlesLabels.call(toolTip);

  // onmouse over event
  circlesLabels.on("mouseover", function(data) {
                  toolTip.show(data);
                  })
  // onmouseout event
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

    // Define scales
    // Add X axis
/*     var x = d3.scaleLinear()
              .domain(d3.extent(Data, data => data[chosenXAxis]))
    //The nice method call on the x scale tells the x-axis to format the chosenXAxis scale nicely.
              .nice(d3.chosenXAxis)
              .range([ 0, chartWidth]);   */

    //console.log(x);

    // Add x-axis to the canvas
    var xAxis = chartGroup.append("g")
                          .attr("transform", "translate(0," + chartHeight + ")")
                          .call(d3.axisBottom(x));


/*     // Add x-axis to the canvas
    chartGroup.append("g")
              .attr("transform", "translate(0," + chartHeight + ")")
              .call(d3.axisBottom(x));
 */

              
/*     // Add Y axis
    var y = d3.scaleLinear()
              .domain(d3.extent(Data, data => data.healthcare))
    //The nice method call on the y scale tells the y-axis to format the healthcare scale nicely.
              .nice(d3.healthcare)
              .range([ chartHeight, 0]); */

    // Plot the xaxis from the chosen x axis
    var y = yScale(Data, chosenYAxis);

    // Add y-axis to the canvas
    var yAxis = chartGroup.append("g")
                          .call(d3.axisLeft(y));

/*     // Add y-axis to the canvas
    chartGroup.append("g")
              .call(d3.axisLeft(y)); */


   // Define tooltip
/*    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([80, -60])
                    .html(function(d) {
                      console.log(`${d.state}<br> Poverty : ${d.poverty} <br> HealthCars: ${d.healthcare}`);
                      return (`${d.state}<br> Poverty : ${d.poverty} <br> HealthCars: ${d.healthcare}`);
                    });                    */

    // Add Circles
    var circlesGroup = updateCircleGroups(Data, x, y, chosenXAxis, chosenYAxis, circlesGroup);

    // Add Cirlcle label
    var circleLabels = updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);
    
    //var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

    // text label for the circle
/*     circleLabels.attr("x", function(d) {return x(d[chosenXAxis]);})
                .attr("y", function(d) {return y(d[chosenYAxis]);})
                .text(function(d) {return d.abbr})
                .attr("text-anchor","middle")
                .style("font-size","9px")
                .style("fill", "white");  */
 
    // text label for the circle
    //var circleLabels = updateCircleGroups(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);

    // Add Circles
/*     var circlesGroup = chartGroup.selectAll("Circle")
                                 .data(Data)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", function (d) { return x(d[chosenXAxis]); } )
                                 .attr("cy", function (d) { return y(d[chosenYAxis]); } )
                                 .attr("r", 10)        
                                 .style("fill", "#8abcd5");

    var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

    // text label for the circle
    circleLabels.attr("x", function(d) {return x(d[chosenXAxis]);})
                .attr("y", function(d) {return y(d[chosenYAxis]);})
                .text(function(d) {return d.abbr})
                .attr("text-anchor","middle")
                .style("font-size","9px")
                .style("fill", "white"); */


/*     circleLabels.call(toolTip);

                  // onmouseover event
    circleLabels.on("mouseover", function(data) {
                    toolTip.show(data);})
                  // onmouseout event
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);});
 */
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

    // text label for the x axis
    /* chartGroup.append("text")
              .attr("transform", "translate(" + ((svgWidth / 2 - 80)) + " ," + (svgHeight - chartMargin.top - 10) + ")")                
              .text("In Poverty (%)");
   */


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
 
    // updateToolTip function above csv import
    var circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);

    
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
                .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              //console.log(value);
              if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                //console.log(chosenXAxis);
                //console.log(chosenYAxis);

                // functions here found above csv import
                // updates x scale for new data
                x = xScale(Data, chosenXAxis);

                // updates x scale for new data
                //y = yScale(Data, chosenYAxis);

                // updates x axis with transition
                xAxis = renderXAxes(x, xAxis);

                // updates y axis with transition
                //yAxis = renderYAxes(y, yAxis);

                // Add Circles
                //var circlesGroup = updateCircleGroups(Data, x, y, chosenXAxis, chosenYAxis, circlesGroup);

                // Add Cirlcle label
                //var circleLabels = updateCircleLabels(Data, x, y, chosenXAxis, chosenYAxis, circleLabels);

                var circlesGroup = chartGroup.selectAll("Circle")
                                                .data(Data)
                                                .enter()
                                                .append("circle")
                                                .attr("cx", function (d) { return x(d[chosenXAxis]); } )
                                                .attr("cy", function (d) { return y(d[chosenYAxis]); } )
                                                .attr("r", 10)        
                                                .style("fill", "#8abcd5");

                var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

                // text label for the circle
                circleLabels.attr("dx", function(d) {return x(d[chosenXAxis]);})
                            .attr("dy", function(d) {return y(d[chosenYAxis]);})
                            .text(function(d) {return d.abbr})
                            .attr("text-anchor","middle")
                            .style("font-size","9px")
                            .style("fill", "white");

                            
                // updates tooltips with new info
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
                    .classed("inactive", false);
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
                    .classed("inactive", false);
                  ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);                    
                }

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
                    .classed("inactive", false);
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

    }); 

    // text label for the y axis
    /* chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - chartMargin.left + 40)
              .attr("x", 0 - (svgHeight / 2))
              .attr("dy", "1em")
              //.style("font-weight","bold")
              .text("Lacks Healthcare (%)");  */

        /*       // Create group for two x-axis labels
        var labelsGroup = chartGroup.append("g")

                                    .attr("transform", `translate(${width / 2}, ${height + 20})`);

        
        var hairLengthLabel = labelsGroup.append("text")
              .attr("x", 0)
              .attr("y", 20)
              .attr("value", "hair_length") // value to grab for event listener
              .classed("active", true)
              .text("Hair Metal Ban Hair Length (inches)");
          
            var albumsLabel = labelsGroup.append("text")
              .attr("x", 0)
              .attr("y", 40)
              .attr("value", "num_albums") // value to grab for event listener
              .classed("inactive", true)
              .text("# of Albums Released"); */


});

