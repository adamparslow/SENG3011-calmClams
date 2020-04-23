const request = require('request-promise');

const apiUrl = "https://api.covid19api.com/country/";
const globalUrl = "https://covid-api.com/api/reports/total?";
const handleCovid = async (body) => {
    const graphData = [];
    for (const country of body.countries) {
        if (country === "Global" || country === "global") {
            await getGlobalData(country, body.start_date, body.end_date, graphData);
        } else {
            await getCountryData(country, body.start_date, body.end_date, graphData);
        }
    }

    return {
        seriesTitles: body.countries,
        graphData
    };
};

const getGlobalData = async (country, startDate, endDate, graphData) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let curr = start;

    const promises = [];

    while (start <= end) {
        const requestData = `date=${curr.getFullYear()}-` + `${curr.getMonth() + 1}`.padStart(2, "0") + "-" + `${curr.getDate()}`.padStart(2, "0");

        const options = {
            method: 'GET',
            uri: globalUrl + requestData,
            json: true 
        }

        promises.push(request(options));
        curr.setDate(curr.getDate() + 1);
    }

    const response = await Promise.all(promises);

    const globalData = [];

    for (const data of response) {
        let graphDataObj = {};
        graphDataObj[`date_${country}`] = `${new Date(data.data.date).toDateString()} 00:00:00`;
        graphDataObj[`total_cases_${country}`] = data.data.confirmed;
        graphDataObj[`total_deaths_${country}`] = data.data.deaths;
        graphDataObj[`new_cases_${country}`] = data.data.confirmed_diff;
        graphDataObj[`new_deaths_${country}`] = data.data.deaths_diff;

        globalData.push(graphDataObj);
    }
    graphData.push(globalData);
}

const getCountryData = async (country, startDate, endDate, graphData) => {
    const requestData = `${country}?from=${startDate}T00:00:00Z&to=${endDate}T00:00:00Z`;

    const options = {
        method: 'GET',
        uri: apiUrl + requestData,
        json: true 
    }

    const response = await request(options);

    // group by date
    let max = 8;
    const grouped = [];
    let previousConfirmed = 0;
    let previousDeaths = 0;
    // Grab next value

    // If the date is same as current date
    let currentDate = response[0].Date;
    let currGroup = [
        response[0]
    ];
    for (let i = 1; i < response.length; i++) {
        const next = response[i];
        if (next.Date === currentDate) {
            currGroup.push(next);
            continue;
        }

        grouped.push({
            date: currentDate, 
            entries: currGroup
        });

        currGroup = [
            next
        ];

        currentDate = next.Date;
    }

    const countryData = [];

    for (const date of grouped) {
        let confirmed = 0;
        let deaths = 0;
        for (const entry of date.entries) {
            confirmed += entry.Confirmed;
            deaths += entry.Deaths;
        }

        let graphDataObj = {};
        graphDataObj[`date_${country}`] = `${new Date(date.date).toDateString()} 00:00:00`;
        graphDataObj[`total_cases_${country}`] = confirmed;
        graphDataObj[`total_deaths_${country}`] = deaths;
        graphDataObj[`new_cases_${country}`] = confirmed - previousConfirmed;
        graphDataObj[`new_deaths_${country}`] = deaths - previousDeaths;
        previousDeaths = deaths;
        previousConfirmed = confirmed;

        countryData.push(graphDataObj);
    }
    graphData.push(countryData);
}

module.exports = handleCovid;