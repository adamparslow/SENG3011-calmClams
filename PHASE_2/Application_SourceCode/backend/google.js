const googleTrends = require('google-trends-api');

const handleGoogle = async (start, end, keywords, response) => {
    console.log("google works");

    for (const keyword of keywords) {
        const keywordData = [];
        const googleResponse = await googleTrends.interestOverTime({
            keyword: keyword,
            startTime: new Date(start),
            endTime: new Date(end)
        });

        const json = JSON.parse(googleResponse);

        for (const timeData of json.default.timelineData) {
            const googleObj = {};
            googleObj[`gdate_${keyword}`] = new Date(timeData.time).toDateString();
            googleObj[`google_${keyword}`] = timeData.formattedValue[0];
            
            keywordData.push(googleObj);
        }

        response.seriesTitles.push(keyword);
        response.graphData.push(keywordData);
    }
};

module.exports = handleGoogle;