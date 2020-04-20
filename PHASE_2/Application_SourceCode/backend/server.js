const express = require('express');
const handleCovid = require('./covid');
const handleEbola = require('./ebola');
const app = express();
app.use(express.static('client/build'));
app.use(express.json());

const port = 8080;

/**
 * Data format 
 * disease: string
 * total cases: boolean
 * total deaths: boolean
 * new cases: boolean
 * new deaths: boolean
 * countries: array of strings
 * twitter hashtags: array of strings
 * google search results: array of strings
 * start date: date string
 * end date: date string
 */

app.put("/get_data", (req, res) => {
    console.log(req.body);
    const data = req.body;
    const diseases = req.body.disease;
    const totalCases = req.body.total_cases || false;
    const totalDeaths = req.body.total_deaths || false;
    const newCases = req.body.new_cases || false;
    const newDeaths = req.body.new_deaths || false;
    const countries = req.body.countries;
    const twitterHashtags = req.body.twitter_hashtags;
    const googleSearch = req.body.google_search;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (!data.startDate || !data.endDate || !data.disease) {
        res.status(400);
        res.send();
    }

    switch (data.disease) {
        case "covid19":
            handleCovid();
            break;
        case "ebola":
            handleEbola();
            break;
    }

    res.send();
}) 

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})