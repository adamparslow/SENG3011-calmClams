import React, { useEffect, memo } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import config from '../../config';

const style = { height: "93vh", width: "100%", backgroundColor: "#FFFFFF" };

interface GraphPanelProps {
    data: any,
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

        // Add data
        chart.data = generateChartData();

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
        

        // Create series
        function createAxisAndSeries(field, name, opposite, bulletType) {
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            // Move the axis titles to the top
            valueAxis.layout = "absolute";
            valueAxis.title.text = name;
            valueAxis.title.align = "center";
            valueAxis.title.valign = "top";
            valueAxis.title.rotation = 0;
            valueAxis.title.dy = -40;
            valueAxis.title.fontWeight = "600";
            valueAxis.paddingRight = 10;
            if (chart.yAxes.indexOf(valueAxis) != 0) {
                // valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
            }

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.yAxis = valueAxis;

            series.name = name;
            series.tooltipText = "{valueY}";
            series.tensionX = 0.9;
            series.showOnInit = true;
            series.events.on("hidden", toggleAxes);
            series.events.on("shown", toggleAxes);
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
                default:
                    shape = series.bullets.push(new am4charts.CircleBullet());
                    break;
            }

            shape.stroke = interfaceColors.getFor("background");
            shape.strokeWidth = 2;
            shape.direction = "top";
            shape.width = 12;
            shape.height = 12;


            valueAxis.renderer.line.strokeOpacity = 1;
            valueAxis.renderer.line.strokeWidth = 2;
            valueAxis.renderer.line.stroke = series.stroke;
            valueAxis.renderer.line.align = "right";
            valueAxis.renderer.labels.template.fill = series.stroke;
            valueAxis.renderer.opposite = opposite;
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


        createAxisAndSeries("total_cases", "Total Cases", false, "rectangle");
        createAxisAndSeries("total_deaths", "Total Deaths", false, "triangle");
        createAxisAndSeries("new_cases", "New Cases", false, "circle");

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";
        //chart.legend.labels.template.text = '[bold {color}]{name}[\]';

        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        // generate some random data, quite different range
        function generateChartData() {
            let chartData = [] as any[];
            let firstDate = new Date();
            firstDate.setDate(firstDate.getDate() - 100);
            firstDate.setHours(0, 0, 0, 0);

            let new_cases = 1600;
            let total_cases = 2900;
            let total_deaths = 8700;

            for (var i = 0; i < 15; i++) {
                // we create date objects here. In your data, you can have date strings
                // and then set format of your dates using chart.dataDateFormat property,
                // however when possible, use date objects, as this will speed up chart rendering.
                let newDate = new Date(firstDate);
                newDate.setDate(newDate.getDate() + i);

                new_cases += Math.round((Math.random() < 0.8 ? 1 : -1) * Math.random() * 10);
                total_cases += Math.round((Math.random() < 0.85 ? 1 : -1) * Math.random() * 10);
                total_deaths += Math.round((Math.random() < 0.9 ? 1 : -1) * Math.random() * 10);

                chartData.push({
                    "date": newDate,
                    "new_cases": new_cases,
                    "total_cases": total_cases,
                    "total_deaths": total_deaths
                });
            }
            return chartData;
        }

        return function cleanup() {
            chart.dispose();
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

const shouldUpdate = (prevprops, nextprops) => {
    return prevprops.data.version === nextprops.data.version;
}

export default memo(GraphPanel, shouldUpdate);