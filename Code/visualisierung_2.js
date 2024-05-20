// Karte

var outerDiv = d3.select('#mapTitle')
    .style('position', 'relative')
    .style('top', '25px')
    .style('left', '50px')
    .style('font-family', 'Arial, sans-serif')
    .style('font-size', '23px')
    .style('color', '#F5F5F5')
    .text('Order Revenue By Location');

var ResetControl = L.Control.extend({
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        var button = L.DomUtil.create('a', 'leaflet-control-reset', container);
        button.innerHTML = 'Reset';
        button.href = '#';
        button.title = 'Reset Map';

        button.style.backgroundColor = '#262626';
        button.style.fontSize = '14px';
        button.style.padding = '5px';
        button.style.color = '#F5F5F5';
        button.style.border = '1px solid #F5F5F5';
        button.style.borderRadius = '10px';
        button.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
        button.style.minWidth = '70px';
        button.style.opacity = '0.9';

        container.style.borderRadius = '10px';

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.on(button, 'click', function (e) {
            var scrollPos = window.scrollY;
            map.setView([-14.879955, -60.474375], 4);
            L.DomEvent.stopPropagation(e);
            setTimeout(function () {
                window.scrollTo(0, scrollPos);
            }, 100);
            createMapWithData(0,0);
            d3.select("#sliderMap2").property("value", 0);
            d3.select("#sliderText2").html('order count:<br>min. 0 orders');
            d3.select("#sliderMap").property("value", 0);
            d3.select("#sliderText").html('delivery time:<br>min. 0 days');
        });
        return container;
    }
});

var map = L.map('map', {
    scrollWheelZoom: true,
}).setView([-14.879955, -60.474375], 4);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>'
}).addTo(map);

map.scrollWheelZoom.enable(); //für MacOS
map.zoomControl.setPosition('topright');


// Farbskala
function createCustomColorScale(startValue, endValue, startColor, endColor) {
    const colorScale = d3.scaleLinear()
        .domain([startValue, endValue])
        .range([startColor, endColor])
        .clamp(true);
    return function (value) {
        return colorScale(value);
    };
}

const startValue = 20;
const endValue = 3500;
const startColor = "#8B0000";
const endColor = "#FFFFE0";
const customColorScale = createCustomColorScale(startValue, endValue, startColor, endColor);


function createMapWithData(delivery_slider_data, order_count_slider_data) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Circle) {
            map.removeLayer(layer);
        }
    });

    Papa.parse('https://raw.githubusercontent.com/frankSxhneider/dataVis/main/vis2_map_city.csv', {
        header: true,
        download: true,
        complete: function (results) {
            results.data.forEach(row => {
                let lat = parseFloat(row.geo_lat);
                let lng = parseFloat(row.geo_lng);
                let total_payment_value = parseFloat(row.total_payment_value);
                let cnt_payment_value = parseInt(row.cnt_payment_value);
                let avg_payment_value = parseFloat(row.avg_payment_value);
                let avg_delivery_time_formatted = row.avg_delivery_time_formatted;
                let delivery_time_days = parseInt(row.delivery_time_days);

                const maxRadius = 150000;
                let color = customColorScale(total_payment_value);
                let radius = Math.min(avg_payment_value * 50, maxRadius); //mit dem Wert für den Radius und *50 wird maxRadius nicht erreicht

                // filter
                delivery_slider_data = parseInt(delivery_slider_data);
                if (delivery_time_days < delivery_slider_data) { return; }
                order_count_slider_data = parseInt(order_count_slider_data);
                if (cnt_payment_value < order_count_slider_data) { return; }

                var circle = L.circle([lat, lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: radius,
                    weight: 1
                }).addTo(map);

                circle.bindTooltip('<b>Total Revenue: </b>' + total_payment_value + ' R$<br>' + '<b>Order Count: </b>' + cnt_payment_value + '<br>' + '<b>Ø Order Value: </b>' + avg_payment_value + ' R$<br>' + '<b>Ø delivery time: </b>' + avg_delivery_time_formatted, {
                    direction: 'top',
                    opacity: 0.8,
                    sticky: true,
                });

                circle.on('mouseover', function (e) {
                    this.openTooltip();
                });

                circle.on('mouseout', function (e) {
                    this.closeTooltip();
                });
            });
        }
    });
}
(new ResetControl()).addTo(map);

var sliderValue = 0;
var sliderOrderCount = 0;

d3.select("#sliderMap").on("input", function () {
    sliderValue = d3.select(this).property("value");
    d3.select("#sliderText").html('delivery time:<br>min. ' + sliderValue + ' days');
    createMapWithData(sliderValue, sliderOrderCount);
});

d3.select("#sliderMap2").on("input", function () {
    sliderOrderCount = d3.select(this).property("value");
    d3.select("#sliderText2").html('order count:<br>min. ' + sliderOrderCount + ' orders');
    createMapWithData(sliderValue, sliderOrderCount);
});

createMapWithData(sliderValue, sliderOrderCount);


// LEGEND
var LegendControl = L.Control.extend({
    onAdd: function (map) {
        var legendDiv = L.DomUtil.create('div', 'legend collapsed');

        legendDiv.innerHTML = '<div class="legend-toggle" style="font-size: 14px;">Legend ▼</div>';

        L.DomEvent.on(legendDiv, 'click', function (e) {
            if (legendDiv.classList.contains('collapsed')) {
                legendDiv.innerHTML = '<div class="legend-toggle" style="font-size: 14px;">Legend ▲</div>';

                var legendContent = d3.select(legendDiv).append('div').classed('legend-content', true);

                legendContent.append('h3').html('Total Revenue').style("font-size", "14px");

                var firstentry = legendContent.append('div').classed('legend-item', true).style("display", "flex").style("align-items", "center");
                firstentry.append('svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .style("margin-right", "8px")
                    .append('circle')
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", 8)
                    .style("fill", '#FFFFE0');
                firstentry.append('span')
                    .text('more than 3500 R$')
                    .style("font-size", "14px");

                var secondentry = legendContent.append('div').classed('legend-item', true).style("display", "flex").style("align-items", "center");
                secondentry.append('svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .style("margin-right", "8px")
                    .append('circle')
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", 8)
                    .style("fill", '#e2bfa8');
                secondentry.append('span').
                    text('2600 R$')
                    .style("font-size", "14px");

                var thirdentry = legendContent.append('div').classed('legend-item', true).style("display", "flex").style("align-items", "center");
                thirdentry.append('svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .style("margin-right", "8px")
                    .append('circle')
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", 8)
                    .style("fill", '#a84038');
                thirdentry.append('span').
                    text('900 R$')
                    .style("font-size", "14px");

                var fourthentry = legendContent.append('div').classed('legend-item', true).style("display", "flex").style("align-items", "center");
                fourthentry.append('svg')
                    .attr('width', 20)
                    .attr('height', 20)
                    .style("margin-right", "8px")
                    .append('circle')
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", 8)
                    .style("fill", '#8B0000');
                fourthentry.append('span')
                    .text('less than 20 R$')
                    .style("font-size", "14px");

                legendContent.append('h3').html('Average order value').style("font-size", "14px");

                var textentry = legendContent.append('div').classed('legend-item', true).style("display", "flex").style("align-items", "center");
                textentry.append('span')
                    .text('is represented by the radius...')
                    .style("font-size", "14px");

                legendContent.append('h3').html('Hover over the circles to see the exact values!').style("font-size", "14px");

                legendDiv.classList.remove('collapsed');
            } else {
                legendDiv.innerHTML = '<div class="legend-toggle" style="font-size: 14px;">Legend ▼</div>';
                legendDiv.classList.add('collapsed');
            }
        });
        legendDiv.style.backgroundColor = '#262626';
        legendDiv.style.padding = '8px';
        legendDiv.style.color = '#F5F5F5';
        legendDiv.style.border = '1px solid #F5F5F5';
        legendDiv.style.borderRadius = '10px';
        legendDiv.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
        legendDiv.style.opacity = '0.9';

        return legendDiv;
    }
});

// Hinzufügen des Legendensteuerelements zur Karte
(new LegendControl()).addTo(map);