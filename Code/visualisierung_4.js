// Violin-Plot

var svg4 = d3.select(".vis4");

var text4 = svg4.append("text")
    .attr("x", 40)
    .attr("y", 40)
    .html("Distribution of Product Prices Among Customers")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", "23px")
    .attr("fill", "#F5F5F5");

var margin2 = { top: 10, right: 30, bottom: 20, left: 50 },
    width2 = 680 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

svg4.append("svg")
    .attr("class", "violinPlot")
    .attr("x", 20)
    .attr("y", 70)
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

svg4 = d3.select(".violinPlot");

d3.csv("https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis4_price.csv").then(function (data) {

    var x = d3.scaleBand()
        .range([0, width2])
        .domain(["not_rebuyer", "rebuyer"])
        .padding(0.05) // space between groups from 0-1 * padding
    svg4.append("g")
        .attr("transform", "translate(35," + height2 + ")")
        .attr("color", "#262626")
        .call(d3.axisBottom(x)
            .tickFormat(function (d) {
                return d === "not_rebuyer" ? "One-time customer" : "Recurring customer";
            })
        )
        .selectAll("text")
        .style("fill", "#F5F5F5")
        .attr("font-size", "14px");

    var y = d3.scaleLinear()
        .domain([-10, 400])
        .range([height2, 0])
    svg4.append("g")
        .attr("transform", "translate(35,9)")
        .attr("color", "#F5F5F5")
        .call(d3.axisLeft(y))

    // horizontal background lines
    var coordinateValues = [0, 50, 100, 150, 200, 250, 300, 350, 400];
    svg4.selectAll(".coordinate-line-n")
        .data(coordinateValues)
        .enter().append("line")
        .attr("class", "coordinate-line-n")
        .attr("x1", 40)
        .attr("x2", width2 + 40)
        .attr("y1", d => y(d) + 10)
        .attr("y2", d => y(d) + 10)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")
        .style("stroke-opacity", 0.3)
        .lower();

    var groupedData = d3.group(data, d => d.kindofbuyer);
    var sumstat = Array.from(groupedData, ([key, value]) => ({ key: key, value: value }));

    sumstat.forEach(group => {
        var input = group.value.map(d => parseFloat(d.mean_price));
        var histogram = d3.histogram()
            .domain(y.domain())
            .thresholds(y.ticks(40))(input);

        group.value = histogram.map(bin => ({
            x0: bin.x0,
            x1: bin.x1,
            length: group.key === 'rebuyer' ? bin.length * 14 : bin.length
        }));
    });

    var maxNum = 0
    for (i in sumstat) {
        allBins = sumstat[i].value
        lengths = allBins.map(function (a) { return a.length; })
        longuest = d3.max(lengths)
        if (longuest > maxNum) { maxNum = longuest }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum, maxNum])

    svg4
        .selectAll("myViolin")
        .data(sumstat)
        .enter()
        .append("g")
        .attr("transform", function (d) { return ("translate(" + (x(d.key) + 35) + " ,0)") })
        .append("path")
        .style("stroke", "none")
        .style("fill", function (d) { return d.key === "rebuyer" ? "#006B6F" : "#69b3a2"; })
        .attr("d", function (d) {
            return d3.area()
                .x0(function (bin) { return xNum(-bin.length); })
                .x1(function (bin) { return xNum(bin.length); })
                .y(function (bin) { return y(bin.x0); })
                .curve(d3.curveCatmullRom)(d.value);
        })
        .on("mouseover", function (event, d) {
            let textColor = d.key === "rebuyer" ? "#006B6F" : "#69b3a2";
            let cat = d.key === "rebuyer" ? 0 : 1;
            let xOffset = 335;
            let yOffset = 100;
            let percentFontSize = "50px";
            let regularFontSize = "25px";

            svg4.append("text")
                .attr("class", "multiline-text")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .style("font-size", regularFontSize)
                .style("fill", textColor)
                .style("pointer-events", "none")
                .append("tspan")
                .attr("x", xOffset)
                .attr("dy", 30)
                .attr("text-anchor", "middle")
                .style("font-size", percentFontSize)
                .text(cat === 0 ? "6.7 %" : "93.3 %")
                .append("tspan")
                .attr("x", xOffset)
                .attr("dy", 30)
                .attr("text-anchor", "middle")
                .style("font-size", regularFontSize)
                .text("of all customers")
                .append("tspan")
                .attr("x", xOffset)
                .attr("dy", 30)
                .attr("text-anchor", "middle")
                .style("font-size", regularFontSize)
                .text("have purchased")
                .append("tspan")
                .attr("x", xOffset)
                .attr("dy", 30)
                .attr("text-anchor", "middle")
                .style("font-size", regularFontSize)
                .text(cat === 1 ? "once." : "multiple times.");
        })
        .on("mouseout", function (event, d) {
            svg4.selectAll(".multiline-text").remove();
        });





});


function handleMouseOver(d) {
    var textColor = d.key === "rebuyer" ? "#69b3a2" : "#ff6347";

    svg4.append("text")
        .attr("class", "multiline-text")
        .attr("x", 250)
        .attr("y", 130)
        .style("font-size", "20px")
        .style("fill", textColor)
        .style("pointer-events", "none")
        .text(function () {
            return "Ihr";
        })
        .append("tspan")
        .attr("x", 250)
        .attr("dy", 25)
        .text("mehrzeiliger")
        .append("tspan")
        .attr("x", 250)
        .attr("dy", 25)
        .text("Text hier");
}