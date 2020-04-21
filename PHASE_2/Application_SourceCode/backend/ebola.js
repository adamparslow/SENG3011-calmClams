// import readCSV, {head} from 'zebras'
const z = require('zebras');

const handleEbola = () => {
    const cases = getEbolaData('Ebola Confirmed Cases.csv');
    const deaths = getEbolaData('Ebola Confirmed Deaths.csv');
    const combined = z.concat(cases, deaths);
    const uniqueCountries = getUniqueCountries(combined);
    const graphData = getGraphData(combined, uniqueCountries);
    const serverData = getServerData(graphData, uniqueCountries);
    console.log('SERVER DATA: ', serverData);
};

const getEbolaData = (file) => {
    const data = z.readCSV(file);
    return data;
};

const getUniqueCountries = (data) => {
    return z.unique(z.getCol(getColumnName(data, 0, true), data));    
};

const getGraphData = (data, uniqueCountries) => {
    const dataGroupedByCountry = z.groupBy(x => x[getColumnName(data, 0, true)], data);
    const graphData = {};
    for (var country of uniqueCountries) {
        graphData[country] = {};
        for (var stat of dataGroupedByCountry[country]) {
            graphData[country][stat.Date] = graphData[country][stat.Date] ? graphData[country][stat.Date] : {};
            if (Object.keys(stat).includes(getColumnName(data, 3, true))) {
                graphData[country][stat.Date]['new_cases'] = stat[getColumnName(data, 3, true)];
                graphData[country][stat.Date]['cases_total'] = stat.Cumulative;
            } else {
                graphData[country][stat.Date]['new_deaths'] = stat[getColumnName(data, 3, false)];
                graphData[country][stat.Date]['deaths_total'] = stat.Cumulative;
            }
        }
    }
    return graphData;
};

const getServerData = (data, uniqueCountries) => {
    const serverData = {};
    serverData['countries'] = uniqueCountries;
    serverData['graphData'] = [];
    for (var country of uniqueCountries) {
        for (var date of Object.keys(data[country])) {
            const graphElement = {};
            graphElement['date_' + country] = formatDate(date); // TODO re-format date
            graphElement['new_cases_' + country] = parseInt(data[country][date].new_cases);
            graphElement['new_deaths_' + country] = parseInt(data[country][date].new_deaths);
            graphElement['total_cases_' + country] = parseInt(data[country][date].cases_total);
            graphElement['total_deaths_' + country] = parseInt(data[country][date].deaths_total);
            serverData['graphData'].push(graphElement);
        }
    }
    return serverData;
};

const formatDate = (date) => {
    var day = date.slice(0, 2);
    var month = date.slice(3, 5);
    var year = '20' + date.slice(6, 8);
    return new Date(year + '-' + month + '-' + day).toDateString();
};

// Have to use this messed up method because the csv converts into an object with weird keys
const getColumnName = (data, colNum, isCases) => {
    if (isCases) {
        return Object.keys(data[0])[colNum];
    }
    return Object.keys(data[3333])[colNum];
};

handleEbola();

module.exports = handleEbola;