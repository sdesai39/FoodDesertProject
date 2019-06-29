//set svg and chart dimensions
//set svg dimensions
var svgWidth = 960;
var svgHeight = 620;

//set borders in svg
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};

//calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3
    .select("#scatter")
    .append("div")
    .classed("chart", true);

//append an svg element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var url = "/api/counties";
d3.json(url, function(error, data) {
    data = JSON.parse(data);    
    data = data[0]
    
var features = data["features"];
income = []
features.forEach(function(feature) {
    income.push(feature.properties["Median Icome"])    
    });    
            
minpop = []
features.forEach(function(feature) {
    minpop.push(feature.properties["% Minority"])
    });
    
whitepop = []
features.forEach(function(feature) {
    minpop.push(feature.properties["% White"])
    });
    
FD = []
    features.forEach(function(feature) {
    FD.push(feature["properties"]["FD%"])
    });
    
    console.log(data);
var fdiData = data
    



    //initial Parameters
var chosenXAxis = income;
// var fdLabel = "FD%";

//function used for updating x-scale var upon clicking on axis label
function xScale(fdiData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(fdiData, d => d[chosenXAxis]) * 0.8,
            d3.max(fdiData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(fdiData, fdLabel) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(fdiData, d => d[fdLabel]) * 0.8,
            d3.max(fdiData, d => d[fdLabel]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


//function used for updating circles group with a transition to new circles
//for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, fdLabel) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[fdLabel]));

    return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, fdLabel) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[fdLabel]));

    return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //white percentage
    if (chosenXAxis === whitepop) {
        return `${value}%`;
    }
    //household income in dollars
    else if (chosenXAxis === income) {
        return `$${value}`;
    }
    //minority percentage
    else {
        return `${value}%`;
    }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, fdLabel, circlesGroup) {

    //select x label
    //poverty percentage
    if (chosenXAxis === whitepop) {
        var xLabel = "White Population:";
    }
    //household income in dollars
    else if (chosenXAxis === income) {
        var xLabel = "Median Income:";
    }
    //age (number)
    else {
        var xLabel = "Minority Population:";
    }


    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[fdLabel]}%`);
        });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

    //create first linear scales
    var xLinearScale = xScale(fdiData, chosenXAxis);
    var yLinearScale = yScale(fdiData, fdLabel);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fdiData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[fdLabel]))
        .attr("r", 12)
        .attr("opacity", ".5");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(fdiData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[fdLabel]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", income)
        .text("Household Income (Median)");

    var minpopLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", minpop)
        .text("Minority Population (%)")

    var whitepopLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", whitepop)
        .text("White Population (%)")

    //create group for 3 y-axis labels
    var fdLabel = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`)
        .append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", FD)
        .text("Population in Food Desert (%)");

    // var smokesLabel = yLabelsGroup.append("text")
    //     .classed("aText", true)
    //     .classed("inactive", true)
    //     .attr("x", 0)
    //     .attr("y", 0 - 40)
    //     .attr("dy", "1em")
    //     .attr("transform", "rotate(-90)")
    //     .attr("value", "smokes")
    //     .text("Smokes (%)");

    // var obesityLabel = yLabelsGroup.append("text")
    //     .classed("aText", true)
    //     .classed("inactive", true)
    //     .attr("x", 0)
    //     .attr("y", 0 - 60)
    //     .attr("dy", "1em")
    //     .attr("transform", "rotate(-90)")
    //     .attr("value", "obesity")
    //     .text("Obese (%)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, fdLabel, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(fdiData, chosenXAxis);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, fdLabel);

                //update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, fdLabel);

                //update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, fdLabel, circlesGroup);

                //change classes to change bold text
                if (chosenXAxis === minpop) {
                    minpopLabel.classed("active", true).classed("inactive", false);
                    whitepopLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === whitepop) {
                    minpopLabel.classed("active", false).classed("inactive", true);
                    whitepopLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    minpopLabel.classed("active", false).classed("inactive", true);
                    whitepopLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }
            }
        });
    });





