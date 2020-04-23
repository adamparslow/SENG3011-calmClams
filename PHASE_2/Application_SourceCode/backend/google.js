const googleTrends = require('google-trends-api');

const handleGoogle = async (start, end) => {
    console.log("google works");

    const response = await googleTrends.interestOverTime({
        keyword: "covid19", 
        startTime: new Date(start),
        endTime: new Date(end)
    });

    console.log(response);
};

module.exports = handleGoogle;