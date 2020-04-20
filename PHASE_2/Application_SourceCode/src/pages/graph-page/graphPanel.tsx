import React, { useEffect, memo } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import config from '../../config';

const style = { height: "93vh", width: "100%", backgroundColor: "#FFFFFF" };

interface GraphPanelProps {
    data: any
};

const GraphPanel = (props: GraphPanelProps) => {
    useEffect(() => {
        /* Chart code */
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        let chart = am4core.create("chartdiv", am4charts.XYChart);

        //chart.paddingTop = 40; // Leave some room for the axis titles

        // Increase contrast by taking evey second color
        chart.colors.step = 2;

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


        function createAxis(name) {
            let axis = chart.yAxes.push(new am4charts.ValueAxis());
            // Move the axis titles to the top
            axis.layout = "absolute";
            axis.title.text = name;
            axis.title.align = "center";
            axis.title.valign = "top";
            axis.title.rotation = 0;
            axis.title.dy = -40;
            axis.title.fontWeight = "600";
            axis.paddingRight = 10;
            axis.disabled = true;
            if (chart.yAxes.indexOf(axis) != 0) {
                // axis.syncWithAxis = chart.yAxes.getIndex(0);
            }
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
            series.events.on("hidden", toggleAxes);
            series.events.on("shown", toggleAxes);
            series.fill = colour;
            series.stroke = colour;
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
                    shape.topSide = 5;
                    shape.botSide = 10;
                    break;
                case "cone":
                    shape = bullet.createChild(am4core.Cone);
                    break;

                default:
                    console.log("error", bulletType);
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

        let tCasesAxis, tDeathsAxis, nCasesAxis, nDeathsAxis, googleAxis, twitterAxis;
        tCasesAxis = createAxis("Total Cases");
        tDeathsAxis = createAxis("Total Deaths");
        nCasesAxis = createAxis("New Cases");
        nDeathsAxis = createAxis("New Deaths");
        googleAxis = createAxis("Google %Traffic");
        twitterAxis = createAxis("Twitter");
        console.log(props.data);

        let tCasesColour, tDeathsColour, nCasesColour, nDeathsColour, googleColour, twitterColour;
        const colourSet = new am4core.ColorSet();
        colourSet.step = 2;
        tCasesColour = colourSet.next();
        tDeathsColour = colourSet.next();
        nCasesColour = colourSet.next();
        nDeathsColour = colourSet.next();
        googleColour = colourSet.next();
        twitterColour = colourSet.next();

        const bullets = ["circle", "rectangle", "triangle", "trapizoid", "rrectangle", "rrectangle2", "cone"];

        // Combine all the data and create a series for each
        for (let i in props.data.countries) {
            const country = props.data.countries[i];
            data = data.concat(props.data.graphData[i]);
            const bullet = bullets[i];
            console.log(bullets[i], i);
            for (let seriesName in props.data.graphData[i][0]) {
                if (seriesName.includes("total_cases")) {
                    createSeries(tCasesAxis, "date_" + country, seriesName, bullet, tCasesColour);
                }
                if (seriesName.includes("total_deaths")) {
                    createSeries(tDeathsAxis, "date_" + country, seriesName, bullet, tDeathsColour);
                }
                if (seriesName.includes("new_cases")) {
                    createSeries(nCasesAxis, "date_" + country, seriesName, bullet, nCasesColour);
                }
                if (seriesName.includes("new_deaths")) {
                    createSeries(nDeathsAxis, "date_" + country, seriesName, bullet, nDeathsColour);
                }
                if (seriesName.includes("google")) {
                    createSeries(googleAxis, "date_" + country, seriesName, bullet, googleColour);
                }
                if (seriesName.includes("twitter")) {
                    createSeries(twitterAxis, "date_" + country, seriesName, bullet, twitterColour);
                }

            }
        }
        chart.data = data;

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";
        //chart.legend.labels.template.text = '[bold {color}]{name}[\]';

        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        return function cleanup() {
            chart.dispose();
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

function snakeToTitle(string: String) {
    let parts = string.split("_");
    let ans: Array<String> = [];
    for (let p of parts) {
        ans.push(p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    }
    return ans.join(" ");
}

const shouldUpdate = (prevprops, nextprops) => {
    return prevprops.data.version === nextprops.data.version;
}

export default memo(GraphPanel, shouldUpdate);