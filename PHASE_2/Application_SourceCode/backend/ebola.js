import readCSV from 'zebras'

const handleEbola = () => {
    console.error("Not implemented");
};

const getEbolaData = () => {
    const data = readCSV('Ebola Data.csv')
    return data;
};

module.exports = handleEbola;