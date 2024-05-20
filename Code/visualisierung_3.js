//stacked Column-Chart

var svg3 = d3.select(".vis3");
var text = svg3.append("text")
    .attr("x", 40)
    .attr("y", 40)
    .text("Count of Orders By Product Categories Over Time")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", "23px")
    .attr("fill", "#F5F5F5");

var margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 1100 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

svg3.append("svg")
    .attr("class", "barChart")
    .attr("x", 20)
    .attr("y", 60)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 10);

// 2 Button
var rectWidth = 100;
var rectHeight = 30;
svg3.append("rect")
    .attr("id", "buttonStackedChart1")
    .attr("x", 1100)
    .attr("y", 70)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("fill", "lightgray")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("stroke", "black")
    .attr("stroke-width", 4)
    .style("box-shadow", "2px 3px 2px rgba(18, 18, 18, 0.3)")
    .on("mousedown", function () {
        d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseup", function () {
        d3.select(this).attr("opacity", 1);
    })
    .on("click", function () {
        drawChart_month(csv_month);
        d3.select(this).attr("stroke-width", 4);
        d3.select('#buttonStackedChart2').attr("stroke-width", 0);
    });

svg3.append("text")
    .attr("id", "buttonText1")
    .attr("x", 1100 + rectWidth / 2)
    .attr("y", 70 + rectHeight / 2)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .text("Months");

svg3.append("rect")
    .attr("id", "buttonStackedChart2")
    .attr("x", 1220)
    .attr("y", 70)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("fill", "lightgray")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("stroke", "black")
    .style("box-shadow", "2px 3px 2px rgba(18, 18, 18, 0.3)")
    .on("mousedown", function () {
        d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseup", function () {
        d3.select(this).attr("opacity", 1);
    })
    .on("click", function () {
        drawChart_day(csv_days);
        d3.select(this).attr("stroke-width", 4);
        d3.select('#buttonStackedChart1').attr("stroke-width", 0);
    });

svg3.append("text")
    .attr("id", "buttonText2")
    .attr("x", 1220 + rectWidth / 2)
    .attr("y", 70 + rectHeight / 2)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("pointer-events", "none")
    .text("Days");



svg3 = d3.select(".barChart");


// 2 separate Funktionen zum Erstellen beider Chart-Aggregationsebenen aufgrund möglicher spezifischer Änderungen der Chart-Versionen
var url_month = "https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis3_month.csv";
var csv_month;
var url_days = "https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis3_day.csv";
var csv_days;
d3.csv(url_month).then(function (data) {
    csv_month = data;
    drawChart_month(csv_month);
});
d3.csv(url_days).then(function (data) {
    csv_days = data;
});


function drawChart_month(data) {

    svg3.selectAll("*").remove();

    var subgroups = data.columns.slice(1)
    var groups = data.map(d => d.purchase_month)

    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg3.append("g")
        .attr("transform", `translate(40, ${height + 10})`) //von 10 auf 11, um x-Achse nach unten zu schieben
        .attr("color", "#262626")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("line")
        .attr("stroke", "none");

    var y = d3.scaleLinear()
        .domain([0, 9500])
        .range([height, 0]);
    svg3.append("g")
        .attr("transform", `translate(40, 10)`)
        .attr("color", "#F5F5F5")
        .call(d3.axisLeft(y))
        .selectAll("line")
        .attr("stroke", "#F5F5F5");

    // grid lines
    var coordinateValues = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
    svg3.selectAll(".coordinate-line-Month")
        .data(coordinateValues)
        .enter().append("line")
        .attr("class", "coordinate-line-Month")
        .attr("x1", 40)
        .attr("x2", width + 40)
        .attr("y1", d => y(d) + 10)
        .attr("y2", d => y(d) + 10)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")
        .style("stroke-opacity", 0.3)
        .lower();

    svg3.selectAll(".tick text")
        .attr("fill", "#F5F5F5");

    // color palette = one color per subgroup
    var barChartColors = ["#42313A", "#6C2D2C", "#9F4636", "#F1DCC9", "#e0a96d", "#201e20", "#ddc3a5", "#7f7f7f"];
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(barChartColors);

    // stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    svg3.append("g")
        .selectAll("g")
        .data(stackedData) // loop key per key = group per group
        .join("g")
        .attr("fill", d => color(d.key))
        .attr("class", d => "myRect " + d.key.substring(0, 3))
        .attr("transform", `translate(40, 10)`)
        .selectAll("rect")
        .data(d => d) // loop subgroup per subgroup to add all rectangles
        .join("rect")
        .attr("x", d => x(d.data.purchase_month))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", function (event, d) {
            let subGroupName = d3.select(this.parentNode).datum().key

            d3.selectAll(".coordinate-line-Month").style("stroke-opacity", 0.1)
            d3.selectAll(".myRect").style("opacity", 0.1)
            d3.selectAll(".label3").style("opacity", 0.1)
            d3.selectAll(".circle3").style("opacity", 0)

            d3.selectAll("." + subGroupName.substring(0, 3)).style("opacity", 1)
        })
        .on("mouseleave", function (event, d) {
            d3.selectAll(".myRect").style("opacity", 1)
            d3.selectAll(".label3").style("opacity", 1)
            d3.selectAll(".circle3").style("opacity", 1)

            d3.selectAll(".coordinate-line-Month").style("stroke-opacity", 0.3)
        })

    // legend
    var legend = d3.select(".vis3").append("g")
        .attr("class", "legend3")
        .attr("transform", "translate(1100, 160)");

    var colorNames = Object.keys(data[0]);
    colorNames = colorNames.slice(1).reverse();

    legend.selectAll("circles")
        .data(colorNames).enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", function (d, i) { return i * 37; })
        .attr("r", 8)
        .attr("class", function (d, i) { return "circle3 " + d.substring(0, 3); })
        .style("fill", d => color(d));

    legend.selectAll("labels")
        .data(colorNames).enter()
        .append("text")
        .attr("x", 25)
        .attr("y", function (d, i) { return i * 37; })
        .text(d => d)
        .attr("class", function (d, i) { return "label3 " + d.substring(0, 3); })
        .attr("alignment-baseline", "middle")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "18px")
        .attr("fill", "#F5F5F5");
}

function drawChart_day(data) {

    svg3.selectAll("*").remove();

    var subgroups = data.columns.slice(1)
    var groups = data.map(d => d.purchase_day)

    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    var xaxis = svg3.append("g")
        .attr("transform", `translate(40, ${height + 10})`)
        .attr("color", "#262626")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    xaxis
        .selectAll("line")
        .attr("stroke", "none");

    xaxis
        .selectAll("text")
        .style("fill", "#F5F5F5")
        .attr("font-size", "14px");

    var y = d3.scaleLinear()
        .domain([0, 19100])
        .range([height, 0]);
    svg3.append("g")
        .attr("transform", `translate(40, 10)`)
        .attr("color", "#F5F5F5")
        .call(d3.axisLeft(y))
        .selectAll("line")
        .attr("stroke", "#F5F5F5");

    var coordinateValues = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000];
    svg3.selectAll(".coordinate-line-Days")
        .data(coordinateValues)
        .enter().append("line")
        .attr("class", "coordinate-line-Days")
        .attr("x1", 40)
        .attr("x2", width + 40)
        .attr("y1", d => y(d) + 10)
        .attr("y2", d => y(d) + 10)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2")
        .style("stroke-opacity", 0.3)
        .lower();

    svg3.selectAll(".tick text")
        .attr("fill", "#F5F5F5");

    var barChartColors = ["#42313A", "#6C2D2C", "#9F4636", "#F1DCC9", "#e0a96d", "#201e20", "#ddc3a5", "#7f7f7f"];
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(barChartColors);

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    svg3.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .attr("class", d => "myRect " + d.key.substring(0, 3))
        .attr("transform", `translate(40, 10)`)
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data.purchase_day))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", function (event, d) {
            let subGroupName = d3.select(this.parentNode).datum().key

            d3.selectAll(".myRect").style("opacity", 0.1)
            d3.selectAll(".coordinate-line-Days").style("stroke-opacity", 0.1)
            d3.selectAll(".label3").style("opacity", 0.1)
            d3.selectAll(".circle3").style("opacity", 0)
            d3.selectAll("." + subGroupName.substring(0, 3)).style("opacity", 1)

        })
        .on("mouseleave", function (event, d) {

            d3.selectAll(".myRect").style("opacity", 1)
            d3.selectAll(".label3").style("opacity", 1)
            d3.selectAll(".circle3").style("opacity", 1)
            d3.selectAll(".coordinate-line-Days").style("stroke-opacity", 0.3)
        })
}