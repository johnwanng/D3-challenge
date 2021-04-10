// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 100,
    right: 30,
    bottom: 100,
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


/*

// Step 1: Append tooltip div
    var toolTip = d3.select("body").append("div").classed("tooltip",true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d, i) {
      toolTip.style("display", "block");
      toolTip.html('<p>'  + d.date + '<br>' + d.medals + ' medal(s) <br> won </p>')
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
      // Step 3: Add an onmouseout event to make the tooltip invisible
      .on("mouseout", function() {
        toolTip.style("display", "none");
      });

*/


    // Add the tooltip container to the body
    /* var toolTip = d3.select("body")
                    .append("div")
                    .classed("tooltip",true); */

    var toolTip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([80, -60])
                    .html(function(d) {
                      return (`${d.state}<br> Poverty : ${d.poverty} <br> HealthCars: ${d.healthcare}`);
                    });                   
/*


var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });


*/


    // tooltip mouseover event handler
 /*    var tipMouseover = function(d) {
        var html  = '<p>' + d.state + "<br/>" +
                    "Poverty : " + d.poverty + "<br/>" +
                    "HealthCare : " + d.healthcare + '</p>';
        console.log(html);
        //console.log(d3.event.pageX);
        //console.log(d3.event.pageY);
        tooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", .9) // started as 0!
    };

    // tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
               .duration(300) // ms
               .style("opacity", 0); // don't care about position!
    }; */

    // Add dots and circles
    var gdots = chartGroup.selectAll("dot")
                          .data(Data)
                          .enter()
                          .append("g");

    gdots.append("circle")
         .attr("class","dot")
         .attr("cx", function (d) { return x(d.poverty); } )
         .attr("cy", function (d) { return y(d.healthcare); } )
         .attr("r", 10)        
         .style("fill", "#8abcd5");

    //.on("mouseover", tipMouseover)

    //.on("mouseout", tipMouseout);         

    // text label for the circle
    gdots.append("text").text(function(d) {return d.abbr})
         .attr("x", function(d) {return x(d.poverty);})
         .attr("y", function(d) {return y(d.healthcare);})
         .attr("text-anchor","middle")
         .style("font-size","9px")
         .style("fill", "white");


    chartGroup.call(toolTip);

    chartGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

         /* 
         // Add mouseoiver event to display tooltip
         .on("mouseover", function(d, i) {
            console.log('mouseover');
            toolTip.style("display", "block");
            toolTip.html('<p>' + d.state + "<br/>" + "Poverty : " + d.poverty + "<br/>" + "HealthCare : " + d.healthcare + '</p>')
                  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY + "px");
              })
          // Add an onmouseout event to make the tooltip invisible
         .on("mouseout", function() {
            console.log('mouseout');
            toolTip.style("display", "none");
          });
 */
    // text label for the x axis
    chartGroup.append("text")
              .attr("transform", "translate(" + ((svgWidth / 2) - 30 ) + " ," + (svgHeight - chartMargin.bottom - 50) + ")")  
              .style("text-anchor", "middle")
              .style("font-weight","bold")
              .text("In Poverty (%)");

    // text label for the y axis
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - chartMargin.left + 50)
              .attr("x", 0 - (svgHeight / 2) + 100)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .style("font-weight","bold")
              .text("Lacks Healthcare (%)"); 

});

