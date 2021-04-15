// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
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

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(Data) {

    // Print the Data
    //console.log(Data);

    // Cast the healthcare and poverty values to number for each piece of Data
    Data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Define scales
    // Add X axis
    var x = d3.scaleLinear()
              .domain(d3.extent(Data, data => data.poverty))
    //The nice method call on the x scale tells the x-axis to format the poverty scale nicely.
              .nice(d3.poverty)
              .range([ 0, chartWidth]);

    // Add x-axis to the canvas
    chartGroup.append("g")
              .attr("transform", "translate(0," + chartHeight + ")")
              .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
              .domain(d3.extent(Data, data => data.healthcare))
    //The nice method call on the y scale tells the y-axis to format the healthcare scale nicely.
              .nice(d3.healthcare)
              .range([ chartHeight, 0]);

    // Add x-axis to the canvas
    chartGroup.append("g")
              .call(d3.axisLeft(y));

   // Define tooltip
   var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([80, -60])
                    .html(function(d) {
                      console.log(`${d.state}<br> Poverty : ${d.poverty} <br> HealthCars: ${d.healthcare}`);
                      return (`${d.state}<br> Poverty : ${d.poverty} <br> HealthCars: ${d.healthcare}`);
                    });                   

    // Add Circles
    var circlesGroup = chartGroup.selectAll("Circle")
                                 .data(Data)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", function (d) { return x(d.poverty); } )
                                 .attr("cy", function (d) { return y(d.healthcare); } )
                                 .attr("r", 10)        
                                 .style("fill", "#8abcd5");
                                 
    // Add text label for the circle
    var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

    circleLabels.attr("x", function(d) {return x(d.poverty);})
                .attr("y", function(d) {return y(d.healthcare);})
                .text(function(d) {return d.abbr})
                .attr("text-anchor","middle")
                .style("font-size","9px")
                .style("fill", "white");


    circleLabels.call(toolTip);

                  // onmouseover event
    circleLabels.on("mouseover", function(data) {
                    toolTip.show(data);})
                  // onmouseout event
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);});

    // text label for the x axis
    chartGroup.append("text")
              .attr("transform", "translate(" + ((svgWidth / 2 - 80)) + " ," + (svgHeight - chartMargin.top - 10) + ")")                
              .text("In Poverty (%)");

    // text label for the y axis
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - chartMargin.left + 40)
              .attr("x", 0 - (svgHeight / 2))
              .attr("dy", "1em")
              //.style("font-weight","bold")
              .text("Lacks Healthcare (%)"); 

});

