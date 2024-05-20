//Lollipop-Diagramm

var svg0 = d3.select(".vis0");

var text0 = svg0.append("text")
    .attr("x", 40)
    .attr("y", 40)
    .text("Insights Into Review Scores:")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", "23px")
    .attr("fill", "#F5F5F5");

// button
var buttonWidth0 = 120;
var buttonHeight0 = 35;
svg0.append("rect")
    .attr("id", "buttonLollipop")
    .attr("x", 335)
    .attr("y", 14)
    .attr("width", buttonWidth0)
    .attr("height", buttonHeight0)
    .attr("fill", "#262626")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2)
    .on("mousedown", function () {
        d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseup", function () {
        d3.select(this).attr("opacity", 1);
    })
    .on("click", function () {
        updateLChart(d3.select("#buttonLollipopText").text() === "Frequency" ? "comment_rate" : "frequency");
        d3.select(this).attr("width", function () {
            return d3.select("#buttonLollipopText").text() === "Frequency" ? (buttonWidth0 + 50) : buttonWidth0;
        });
        d3.select("#buttonLollipopText").attr("x", function () {
            return d3.select("#buttonLollipopText").text() === "Frequency" ? (335 + buttonWidth0 / 2 + 25) : (335 + buttonWidth0 / 2);
        });
        d3.select("#buttonLollipopText").text(function () {
            return d3.select(this).text() === "Frequency" ? "Comment Rate" : "Frequency";
        });
    });

svg0.append("text")
    .attr("id", "buttonLollipopText")
    .attr("x", 335 + buttonWidth0 / 2)
    .attr("y", 16 + buttonHeight0 / 2)
    .attr("font-size", "23px")
    .attr("font-family", "Arial, sans-serif")
    .attr("fill", "#F5F5F5")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .text("Frequency");

var margin0 = { top: 30, right: 30, bottom: 70, left: 60 },
    width0 = 500 - margin0.left - margin0.right,
    height0 = 450 - margin0.top - margin0.bottom;

var movetoright = 50;
var movedown = 60;

svg0
    .append("svg")
    .attr("width", width0 + margin0.left + margin0.right)
    .attr("height", height0 + margin0.top + margin0.bottom)
    .append("g")
    .attr("transform", `translate(${margin0.left}, ${margin0.top})`);

var x = d3.scaleBand()
    .range([0, width0])
    .padding(1);
var xAxis = svg0.append("g")
    .attr("transform", `translate(${movetoright}, ${height0 + movedown})`)
    .attr("color", "#262626")

var y = d3.scaleLinear()
    .range([height0, 0]);
var yAxis = svg0.append("g")
    .attr("class", "yaxis0")
    .attr("transform", `translate(${movetoright}, ${movedown})`)
    .attr("color", "#ccc")

function updateLChart(selectedVar) {
    d3.csv("https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis0_review_score.csv").then(function (data) {

        // add axis
        x.domain(data.map(function (d) { return d.review_score; }))
        xAxis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("fill", "#F5F5F5")
            .attr("font-size", "12px");

        y.domain([0, d3.max(data, function (d) { return +d[selectedVar] + 0.05 })]);
        yAxis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y).tickFormat(function (d) { return (d * 100).toFixed(0) + "%"; }));

        svg0.append("line")
            .attr("x1", movetoright)
            .attr("x2", width0 + movetoright)
            .attr("y1", y(0) + movedown)
            .attr("y2", y(0) + movedown)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);

        var linesJ = svg0.selectAll(".line0")
            .data(data)
        linesJ
            .join("line")
            .attr("class", "line0")
            .transition()
            .duration(1000)
            .attr("x1", function (d) { return x(d.review_score) + movetoright; })
            .attr("x2", function (d) { return x(d.review_score) + movetoright; })
            .attr("y1", y(0) + movedown)
            .attr("y2", function (d) { return y(d[selectedVar]) + movedown; })
            .attr("stroke", "grey")

        var circlesU = svg0.selectAll("circle")
            .data(data)
        circlesU
            .join("circle")
            .transition()
            .duration(1000)
            .attr("cx", function (d) { return x(d.review_score) + movetoright; })
            .attr("cy", function (d) { return y(d[selectedVar]) + movedown; })
            .attr("r", 9)
            .attr("fill", "#00cccc");
    });
}

updateLChart('frequency');