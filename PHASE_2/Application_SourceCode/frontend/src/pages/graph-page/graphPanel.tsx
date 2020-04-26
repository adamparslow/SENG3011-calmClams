import React, { useEffect, memo } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import config from '../../config';

const style = { height: "93vh", width: "100%", backgroundColor: "#FFFFFF" };

interface GraphPanelProps {
    data: any
    totalCases: boolean;
    totalDeaths: boolean;
    newCases: boolean;
    newDeaths: boolean;
};

const GraphPanel = (props: GraphPanelProps) => {
    useEffect(() => {
        if (props.data.seriesTitles.length == 0) {
            return;
        }

        //console.log(props);
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        let chart = am4core.create("chartdiv", am4charts.XYChart);

        //chart.paddingTop = 40; // Leave some room for the axis titles

        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;

        // Add scrollbar
        let scrollbar = new am4charts.XYChartScrollbar();
        scrollbar.height = 100;
        scrollbar.background.fill = am4core.color(config.theme.mediumColor);
        scrollbar.startGrip.background.fill = am4core.color(config.theme.mediumColor);
        scrollbar.endGrip.background.fill = am4core.color(config.theme.mediumColor);

        chart.scrollbarX = scrollbar;
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";
        //chart.legend.labels.template.text = '[bold {color}]{name}[\]';

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomXY";


        function createAxis(name) {
            let axis = chart.yAxes.push(new am4charts.ValueAxis());
            // Move the axis titles to the top
            /*
            axis.layout = "absolute";
            axis.title.text = name;
            axis.title.align = "center";
            axis.title.valign = "top";
            axis.title.rotation = 0;
            axis.title.dy = -40;
            axis.title.fontWeight = "600";
            axis.paddingRight = 10;
            */
            axis.paddingLeft = 5;
            axis.disabled = true;
            axis.title.text = name;
            axis.min = 1;
            if (chart.yAxes.indexOf(axis) !== 0) {
                axis.syncWithAxis = tCasesAxis;
            }
            axis.title.events.on("hit", () => axis.logarithmic = !axis.logarithmic);
            return axis;
        }

        // Create series
        function createSeries(axis, xField, yField, bulletType, colour) {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = yField;
            series.dataFields.dateX = xField;
            series.strokeWidth = 2;
            series.yAxis = axis;

            series.name = snakeToTitle(yField);
            series.tooltipText = "{name}:{valueY}";
            series.tensionX = 0.9;
            series.showOnInit = true;
            series.fill = colour;
            series.stroke = colour;

            // Maybe remove/show the axis for this series when we toggle this axis
            series.events.on("hidden", toggleAxes);
            series.events.on("shown", toggleAxes);

            // Display the current number in the legend
            //series.legendSettings.valueText = "{valueY.close}";
            scrollbar.series.push(series);

            let interfaceColors = new am4core.InterfaceColorSet();

            // Make the bullets
            let bullet = series.bullets.push(new am4charts.Bullet());
            bullet.width = 12;
            bullet.height = 12;
            bullet.horizontalCenter = "middle";
            bullet.verticalCenter = "middle";

            // Choose a shape
            let shape;
            switch (bulletType) {
                case "triangle":
                    shape = bullet.createChild(am4core.Triangle);
                    break;
                case "rectangle":
                    shape = bullet.createChild(am4core.Rectangle);
                    break;
                case "rrectangle":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 0;
                    shape.cornerRadiusBottomRight = 30;
                    shape.cornerRadiusTopLeft = 30;
                    shape.cornerRadiusTopRight = 0;
                    break;
                case "rrectangle2":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 30;
                    shape.cornerRadiusBottomRight = 0;
                    shape.cornerRadiusTopLeft = 0;
                    shape.cornerRadiusTopRight = 30;
                    break;
                case "trapizoid":
                    shape = bullet.createChild(am4core.Trapezoid);
                    shape.topSide = 10;
                    shape.botSide = 5;
                    break;
                case "cone":
                    shape = bullet.createChild(am4core.Cone);
                    break;

                default:
                    console.log("error", bulletType);
                    break;
                case "circle":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 100;
                    shape.cornerRadiusBottomRight = 100;
                    shape.cornerRadiusTopLeft = 100;
                    shape.cornerRadiusTopRight = 100;
                    break;
            }

            shape.stroke = interfaceColors.getFor("background");
            shape.strokeWidth = 2;
            shape.direction = "top";
            shape.width = 12;
            shape.height = 12;

            axis.renderer.line.strokeOpacity = 1;
            axis.renderer.line.strokeWidth = 2;
            axis.renderer.line.stroke = series.stroke;
            axis.renderer.line.align = "right";
            axis.renderer.labels.template.fill = series.stroke;

        }

        function toggleAxes(ev) {
            let axis = ev.target.yAxis;
            let disabled = true;
            axis.series.each(function (series) {
                if (!series.isHiding && !series.isHidden) {
                    disabled = false;
                }
            });
            axis.disabled = disabled;
        }

        let data = [];

        let tCasesAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Total Cases");
        let tDeathsAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Total Deaths");
        let nCasesAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("New Cases");
        let nDeathsAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("New Deaths");
        let googleAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Google Search Terms (Percentage of Peak Traffic)");
        let twitterAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Twitter");
        nCasesAxis.extraMax = 0.8;
        nDeathsAxis.extraMax = 0.8;


        //console.log(props.data);

        let tCasesColour, tDeathsColour, nCasesColour, nDeathsColour, googleColour, twitterColour;
        const colourSet = new am4core.ColorSet();
        colourSet.step = 3;
        tCasesColour = colourSet.next();
        tDeathsColour = colourSet.next();
        nCasesColour = colourSet.next();
        nDeathsColour = colourSet.next();
        googleColour = colourSet.next();
        twitterColour = colourSet.next();

        const bullets = ["circle", "rectangle", "triangle", "trapizoid", "rrectangle", "rrectangle2", "cone"];

        // Combine all the data and create each series
        for (let i in props.data.seriesTitles) {
            const titles = props.data.seriesTitles[i];

            data = data.concat(props.data.graphData[i]);
            const bullet = bullets[+i % bullets.length];

            // Create each series for each country
            for (let seriesName in props.data.graphData[i][0]) {
                if (seriesName.includes("total_cases") && props.totalCases) {
                    createSeries(tCasesAxis, "date_" + titles, seriesName, bullet, tCasesColour);
                }
                if (seriesName.includes("total_deaths") && props.totalDeaths) {
                    createSeries(tDeathsAxis, "date_" + titles, seriesName, bullet, tDeathsColour);
                }
                if (seriesName.includes("new_cases") && props.newCases) {
                    createSeries(nCasesAxis, "date_" + titles, seriesName, bullet, nCasesColour);
                }
                if (seriesName.includes("new_deaths") && props.newDeaths) {
                    createSeries(nDeathsAxis, "date_" + titles, seriesName, bullet, nDeathsColour);
                }
                if (seriesName.includes("google")) {
                    createSeries(googleAxis, "gdate_" + titles, seriesName, bullet, googleColour);
                }
                if (seriesName.includes("twitter")) {
                    createSeries(twitterAxis, "tdate_" + titles, seriesName, bullet, twitterColour);
                }

            }
        }

        chart.data = data;

        //console.log(chart.data);
        return function cleanup() {
            chart.dispose();
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

function snakeToTitle(string: String) {
    string = string.replace(" ", "_");
    string = string.replace(":", "_");
    let parts = string.split("_");
    let ans: Array<String> = [];
    for (let p of parts) {
        ans.push(p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    }
    return ans.join(" ");
}

export default GraphPanel;