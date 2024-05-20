// Ring-Diagramm

var svg1 = d3.selectAll(".vis1");

var text = svg1.append("text")
    .attr("x", 40)
    .attr("y", 40)
    .text("Preferred Payment Methods")
    .attr("font-family", "Arial, sans-serif")
    .attr("font-size", "23px")
    .attr("fill", "#F5F5F5");

d3.csv("https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis1_payment.csv").then(function (data) {

    data.forEach(function (d) {
        d.count = +d.count;
    });

    const customColors = ["#006B6F", "#00cccc", "#00ffff", "#9BF4EB"];
    const color = d3.scaleOrdinal()
        .range(customColors);

    const pie = d3.pie()
        .value(function (d) { return d.count; });

    const arcs = pie(data);

    // Bogen-Generator
    const arc = d3.arc()
        .innerRadius(70)
        .outerRadius(110)
        .padAngle(0.02);

    const g = svg1.selectAll(".arc")
        .data(arcs)
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(200, 190)");

    d3.selectAll(".vis1")
        .append("text")
        .attr("class", "hovertextVis1")
        .attr("x", 208)
        .attr("y", 210)
        .attr("text-anchor", "middle");

    var absolutValueThisSegment;
    var colorThisSegment;

    g.append("path")
        .attr("class", "segment")
        .attr("d", arc)
        .style("fill", function (d, i) { return color(i); })
        .on("mouseover", function (d, i) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("transform", function (d) {
                    const centroid = arc.centroid(d);
                    let x = centroid[0];
                    let y = centroid[1];
                    absolutValueThisSegment = d.value;
                    colorThisSegment = customColors[d.index];
                    return "translate(" + x * 0.1 + "," + y * 0.1 + ")";
                })
                .attr('opacity', '.85')
            var valueRatio = Math.round(absolutValueThisSegment / d3.sum(data, d => d.count) * 100);
            d3.select(".hovertextVis1")
                .style("opacity", 1)
                .attr("fill", colorThisSegment)
                .html(valueRatio + "<tspan font-size='30px'>%</tspan>");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('opacity', '1')
                .attr("transform", "translate(0,0)");
            d3.select(".hovertextVis1")
                .style("opacity", 0);
        });

    // Legende
    const legend = svg1.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(400, 140)");

    legend.selectAll("circles")
        .data(data).enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", function (d, i) { return i * 35; })
        .attr("r", 8)
        .style("fill", function (d, i) { return customColors[i]; });

    legend.selectAll("labels")
        .data(data).enter()
        .append("text")
        .attr("x", 25)
        .attr("y", function (d, i) { return i * 35; })
        .text(function(d) { return d.payment_type.charAt(0).toUpperCase() + d.payment_type.slice(1); })
        .attr("alignment-baseline", "middle")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "18px")
        .attr("fill", "#F5F5F5");


    legend.append("text")
        .attr("class", "info-icon")
        .attr("x", 85)
        .attr("y", 40)
        .text("i")
        .attr("font-family", "courier")
        .attr("font-size", "18px")
        .attr("fill", "#F5F5F5")
        .on("mouseover", function () {
            d3.select("#vis1")
                .append("div")
                .attr("class", "tooltip1")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "6px")
                .style("padding", "5px")
                .html("Boleto is a popular payment method used in brazil. It functions as a bank-issued invoice or voucher that can be paid at authorized locations such as banks, ATMs, or through online banking platforms, with a unique barcode or number identifying the payment.")
                .style("left", "100")
                .style("top", "50")
                .style("color", "#F5F5F5")
        })
        .on("mouseleave", function () {
            d3.select(".tooltip1")
                .remove()
        });

    legend.append("circle")
        .attr("cx", 90)
        .attr("cy", 34)
        .attr("r", 9)
        .attr("fill", "none")
        .attr("stroke", "#F5F5F5")
        .attr("stroke-opacity", 0.5);

}).catch(function (error) {
    console.log(error);
});