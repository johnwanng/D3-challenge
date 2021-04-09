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

var svg = d3

  .select("body")

  .append("svg")

  .attr("height", svgHeight)

  .attr("width", svgWidth);

 

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere

// to the margins set in the "chartMargin" object.

var chartGroup = svg.append("g")

  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

 

// Load data from data.csv

d3.csv("assets/data/data.csv").then(function(Data) {

 

    // Print the tvData

    //console.log(Data);

 

    // Cast the healthcare and poverty values to number for each piece of Data

    Data.forEach(function(data) {

        data.healthcare = +data.healthcare;

        data.poverty = +data.poverty;

    });

 

    // Define scales

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    //console.log(colorScale);

 

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

 

    // Add the tooltip container to the body

    // it's invisible and its position/contents are defined during mouseover

    var tooltip = d3.select("body")

        .append("svg")

        .attr("class", "tooltip")

        .style("opacity", 0);

 

    // tooltip mouseover event handler

    var tipMouseover = function(d) {

        var color = colorScale(d.poverty);

        //console.log(color);

        var html  = d.state + "<br/>" +

                    "Poverty : " + d.poverty + "<br/>" +

                    "HealthCare : " + d.healthcare;

 

        console.log(html);

        //console.log(d3.event.pageX);

        //console.log(d3.event.pageY);

        tooltip.html(html)

//              .style("left", "20px")

//              .style("top", "20px")

            //.style("fill", "black")

            //.style("visibility", "visible")

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

    };

 

    //Healthcare vs. Poverty 

    // Add dots

    var gdots = chartGroup.selectAll("dot")

                    .data(Data)

                    .enter()

                    .append("g");

 

    gdots.append("circle")

    .attr("class","dot")

    .attr("cx", function (d) { return x(d.poverty); } )

    .attr("cy", function (d) { return y(d.healthcare); } )

    .attr("r", 10)        

    .style("fill", "#8abcd5")

    .on("mouseover", tipMouseover)

    .on("mouseout", tipMouseout);         

 

    // text label for the circle

    gdots.append("text").text(function(d) {return d.abbr})

    .attr("x", function(d) {return x(d.poverty);})

    .attr("y", function(d) {return y(d.healthcare);})

    .attr("text-anchor","middle")

    .style("font-size","9px")

    .style("fill", "white");

    //.on("mouseover", tipMouseover)

    //.on("mouseout", tipMouseout);   

   

 

    // text label for the x axis

    chartGroup.append("text")

    .attr("transform", "translate(" + ((svgWidth / 2) - 30 ) + " ," + (svgHeight - chartMargin.bottom - 50) + ")")  

    .style("text-anchor", "middle")

    .style("font-weight","bold")

    .text("In Poverty (%)");

 

    // text label for the y axis

    chartGroup.append("text")

        .attr("transform", "rotate(-90)")

        //.attr("y", 0 - chartMargin.left)

        //.attr("x", 0 - (svgHeight / 2))

        //.attr("y", 50)

        //.attr("x", -300)

        .attr("y", 0 - chartMargin.left + 50)

        .attr("x", 0 - (svgHeight / 2) + 100)

        .attr("dy", "1em")

        .style("text-anchor", "middle")

        .style("font-weight","bold")

        .text("Lacks Healthcare (%)"); 

 

});

