// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

// Create margin variable
var margin = {top:20, right:40, bottom:50, left:60};

// chart area minus margins
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// create svg container
var svg = d3.select("#scatter").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from csv
d3.csv("assets/data/data.csv").then(function(response){
    console.log(response);

    // parse data
    response.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // scale x to chart width
    var xScale = d3.scaleLinear()
    .domain([d3.min(response, d => d.poverty) - 1, d3.max(response, d => d.poverty) +1])
    .range([0, chartWidth]);

    // scale y to chart height
    var yScale = d3.scaleLinear()
    .domain([d3.min(response, d => d.healthcare) - 1, d3.max(response, d => d.healthcare) +2] )
    .range([chartHeight, 0]);

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);

    // create circles
    var circleGroup = chartGroup.append("g").selectAll("circle")
        .data(response)
        .enter()
        .append("circle")
        .classed("circle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "lightblue")
        .attr("opacity", 0.9);

    // state abbreviations in the circles
    var textGroup = chartGroup.append("g").selectAll("text")
        .data(response)
        .enter()
        .append("text")
        .classed("state-text", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("transform", `translate(-10, 5)`)
        .text(d => d.abbr)
        .style("font-size", "12PX")
        .style("font-weight", "bold")
        .attr("fill", "white");

    // create y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+10)
        .attr("x", 0 - (chartHeight/1.5))
        .attr("dy", "1em")
        .classed("yaxis-text", true)
        .style("font-weight", "bold")
        .text("Lacks Heathcare (%)");

    // create x-axis label
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.bottom -15})`)
        .classed("xaxis-text", true)
        .style("font-weight", "bold")
        .text("In Poverty (%)");

    }).catch(function (error) {
        console.log(error);
});
