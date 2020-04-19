import React, { useEffect, memo } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

const style={height: "93vh", width: "100%", backgroundColor: "#00A8E8"};

interface MapPanelProps {
    data: any,
    toggleReport: (id: number) => void,
};

const tooltipClickHandler = (id: string) => {
    console.log(id);
}

const MapPanel = (props: MapPanelProps) => {
    useEffect(() => {
        // Include chart code here
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create map instance
        const chart = am4core.create("chartdiv", am4maps.MapChart);

        // Set map definition
        chart.geodata = am4geodata_worldLow;

        chart.chartContainer.wheelable = false;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Exclude Antartica
        polygonSeries.exclude = ["AQ"];

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        const polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.polygon.fillOpacity = 0.6;
        polygonTemplate.fill = am4core.color('#003459');


        // Create hover state and set alternative fill color
        const hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(0);

        // Add image series
        const imageSeries = chart.series.push(new am4maps.MapImageSeries());
        if (imageSeries.tooltip) {
            imageSeries.tooltip.keepTargetHover = true;
            imageSeries.tooltip.label.interactionsEnabled = true;
        }

        imageSeries.mapImages.template.propertyFields.longitude = "longitude";
        imageSeries.mapImages.template.propertyFields.latitude = "latitude";
        // imageSeries.mapImages.template.tooltipText = "{title}";
        imageSeries.mapImages.template.tooltipHTML = 
        `
            <h1>{title}<h1>
            <button onclick='{click}'>Click to see full report</button>
        `;

        if (imageSeries.tooltip) {
            imageSeries.tooltip.contentValign = "top";
        }
        // const button = imageSeries.mapImages.template. && imageSeries.mapImages.template.tooltip.createChild(am4core.Button);
        // if (button && button.label) {
        //     button.label.text = "Am i here?";
        // }


        // imageSeries.tooltip && imageSeries.tooltip.events.on("hit", () => {
        //     console.log("does this work?");
        // });
        imageSeries.mapImages.template.propertyFields.url = "url";
        imageSeries.mapImages.template.propertyFields.id = "id";

        const circle = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle.radius = 5;
        circle.propertyFields.fill = "color";
        circle.propertyFields.id = "reportId";

        circle.events.on('hit', (event) => {
            const id = Math.floor(Number(event.target.parent && event.target.parent.id || ""));
            props.toggleReport(id); 
        });

        // imageSeries.data = imageData;

        // Mapping multi - locations to single locations
        const imageData : any[] = [];

        for (const article of props.data.articles) {
            // circle.propertyFields.id = article._id;
            const locations = article.reports[0].locations;

            if (locations.length === 0) {
                continue;
            }

            for (let i = 0; i < locations.length; i++) {
                const location = locations[i];
                if (!location.coords) {
                    continue;
                }
                const id = Number(`${article._id}.${i}`);
                console.log(id);
                const result = imageData.filter(data => data.id === id);
                console.log(result);
                if (result.length !== 0) {
                    continue;
                }

                const [lat, long] = location.coords.split(", ");
                console.log(lat);
                console.log(long);

                imageData.push({
                    "title": article.headline,
                    "url": `#${article._id}`,
                    "click": `console.log(${article._id})`,
                    "latitude": Number(lat),
                    "longitude": Number(long),
                    "id": id
                });
            }
        }

        // const imageData = props.data.articles && props.data.articles.map((article) => {
        //     if (article.reports[0].locations.length > 1 || article.reports[0].locations.length === 0) {
        //         console.log(article.reports[0].locations);
        //         return;
        //     }
        //     console.log(article.reports[0].locations)
        //     const coords = article.reports[0].locations[0].coords;
        //     if (!coords) {
        //         return;
        //     }
        //     // console.log(article);
        //     const [lat, long] = coords.split(", ");
        //     return {
        //         "title": article.headline,
        //         "latitude": Number(lat),
        //         "longitude": Number(long), 
        //         "url": `#${article._id}`,
        //         "id": article._id,
        //         "click": `console.log(${article._id})`
        //     };
        // });
        console.log(imageData);
        imageSeries.data = imageData;
        return function cleanup() {
            chart.dispose(); 
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

const shouldUpdate = (prevprops, nextprops) => {
    return prevprops.data.version === nextprops.data.version;
}

export default memo(MapPanel, shouldUpdate);