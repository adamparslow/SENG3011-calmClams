const request = require('request-promise');

const apiUrl = "https://www.codeonavirus.com/jhu/daily_reports";
const handleCovid = async (body) => {
    const graphData = [];
    for (const country of body.countries) {
        const bodyData = {
            "start_date": body.start_date,
            "end_date": body.end_date,
            "country": country
        }

        const options = {
            method: 'PUT',
            uri: apiUrl,
            body: bodyData,
            json: true 
        }

        const response = await request(options);

        const dates = [];
        for (const date of response) {
            let confirmed = 0;
            let deaths = 0;
            for (const entry of date.entries) {
                confirmed += entry.confirmed;
                deaths += entry.deaths;
            }

            dates.push({
                date: date.date,
                confirmed,
                deaths
            });

            const graphDataObj = {};
            graphDataObj[`date_${country}`] = date.date;
            if (body.total_cases) {
                graphDataObj[`total_cases_${country}`] = confirmed;
            }
            if (body.total_deaths) {
                graphDataObj[`total_deaths_${country}`] = deaths;
            }

            graphData.push(graphDataObj);
        }

        console.log(dates);
    }

    console.log({
        countries: body.countries,
        graphData
    });

    return {
        countries: body.countries,
        graphData
    };
};

module.exports = handleCovid;