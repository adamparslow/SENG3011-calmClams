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

 /**
  * Example output
  * {
  *     countries: [italy, germany],
  *     graphData: [
  *         {
  *             date_italy: Sat Jan 11 2020 00:00:00,
  *             new_cases_italy: 1602,
  *             new_deaths_italy: 3,
  *             total_casesitaly: 2906
  *         }, (repeat this many times for each date of the italy data)
  *         {
  *             date germany: Sat Jan 11 2020 00:00:00,
  *             newcases germany: 1599,
  *             newdeaths germany: 8,
  *             totalcases germany: 2906,
  *         } (repeat this many times for each date of the germany data)
  *     ]
  * }
  */

app.put("/get_data", async (req, res) => {
    console.log(req.body);
    const data = req.body;

    if (!data.start_date || !data.end_date || !data.disease || !data.countries) {
        res.status(400);
        res.send();
        return;
    }

    let response = {};
    switch (data.disease) {
        case "covid19":
            response = await handleCovid(data);
            break;
        case "ebola":
            response = handleEbola();
            break;
    }

    res.send(JSON.stringify(response));
}) 

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})