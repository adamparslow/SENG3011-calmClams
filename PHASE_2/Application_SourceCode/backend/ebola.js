// import readCSV, {head} from 'zebras'
const z = require('zebras');

const handleEbola = () => {
    console.error("Not implemented");
    const cases = getEbolaData('Ebola Confirmed Cases.csv');
    console.log(z.getCol('Country', cases));
    const deaths = getEbolaData('Ebola Confirmed Deaths.csv');
    console.log(z.getCol('Country', deaths));
};

const getEbolaData = (file) => {
    const data = z.readCSV(file);
    console.log(z.head(3, data));
    return data;
};

handleEbola();

module.exports = handleEbola;