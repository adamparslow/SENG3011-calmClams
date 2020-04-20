// import readCSV, {head} from 'zebras'
const z = require('zebras');

const handleEbola = () => {
    console.error("Not implemented");
    getEbolaData();
};

const getEbolaData = () => {
    const data = z.readCSV('Ebola Data.csv')
    console.log(z.head(3, data))
    return data;
};

handleEbola();

module.exports = handleEbola;