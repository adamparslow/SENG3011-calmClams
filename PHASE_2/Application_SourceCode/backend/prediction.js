// Exported function for predicting future values for datasets that follow
// a logistic curve.
//
// Parameters
//  - series: A series of data matching the format accepted by the front-end.
//            Prediction entries will be added to this list.
//  - country: The name of the country to generate predictions for, or "global"
//             for global data.
//  - inKeys: A list of keys to identify datasets for prediction.
//  - outKeys: A list of keys to output the prediction values to. Should be as
//             the inKeys list.
//  - additionalDays: The number of days into the future to populate prediction
//                    values for.
const predict = (series, country, inKeys, outKeys, additionalDays) => {
    let data = [];

    // Clean data
    for (const entry of series) {
        let dateString = entry["date_" + country];

        let obj = {}
        obj["date"] = Date.parse(dateString.substring(0, dateString.length - " 00:00:00".length))
        for (const inKey of inKeys) obj[`value_${inKey}`] = entry[`${inKey}_${country}`];
        
        data.push(obj);
    }

    // Create prediction date entries
    const n = data.length;
    const lastDate = data[n - 1].date;
    series[n - 1][`pdate_${country}`] = `${new Date(lastDate).toDateString()} 00:00:00`;

    for (let i = n; i < n + additionalDays; i++) {
        date = new Date(lastDate);
        date.setDate(date.getDate() + i - n + 1);

        entry = {};
        entry[`pdate_${country}`] = `${date.toDateString()} 00:00:00`;

        series.push(entry);
    }

    // Make predictions for each specified dataset
    for (let keyIdx = 0; keyIdx < inKeys.length; keyIdx++) {
        const inKey = inKeys[keyIdx];
        const outKey = outKeys[keyIdx];

        // Determine 1st derivative
        differentiate(data, `value_${inKey}`, `rawD1_${inKey}`);
        smooth(data, 4, `rawD1_${inKey}`, `d1_${inKey}`);

        // Determine 2nd derivative
        differentiate(data, `d1_${inKey}`, `rawD2_${inKey}`);
        smooth(data, 3, `rawD2_${inKey}`, `d2_${inKey}`);

        // Get inflection point
        const inflectionX = determinePOI(data, `d1_${inKey}`, `d2_${inKey}`, false);
        if (inflectionX < 0) {
            // Inflection point could not be calculated, skip predictions for
            // this dataset
            break;
        }

        // Get y-coordinate and gradient of the point of inflection
        const inflectionY = getY(data, `value_${inKey}`, inflectionX);
        const inflectionD1 = getY(data, `d1_${inKey}`, inflectionX);

        // Calculate curve parameters
        const L = inflectionY * 2;
        const k = 4 * inflectionD1 / L;
        const xOff = inflectionX;

        curve = logisticCurve(k, L, xOff, n + additionalDays);

        // Align with final point on curve
        const yOff = curve[n - 1] - data[n - 1][`value_${inKey}`];

        // Add prediction values to series entries
        series[n - 1][`${outKey}_${country}`] = curve[n - 1] - yOff;

        for (let i = n; i < n + additionalDays; i++) {
            series[i][`${outKey}_${country}`] = curve[i] - yOff;
        }
    }
}

// Differentiate a dataset by calculating the difference between successive values
const differentiate = (data, inKey, outKey) => {
    const n = data.length;

    for (let i = 0; i < n; i++) {
        if (i == 0) data[i][outKey] = data[i][inKey];
        else data[i][outKey] = data[i][inKey] - data[i - 1][inKey];
    }
}

// Smooth/dampen data by taking the average of local values
const smooth = (data, radius, inKey, outKey) => {
    const n = data.length;

    for (let i = 0; i < n; i++) {
        let min = Math.max(0, i - radius);
        let max = Math.min(n - 1, i + radius);

        let total = 0;
        for (let j = min; j <= max; j++) total += data[j][inKey];

        data[i][outKey] = total / (max - min + 1);
    }
}

// Determines the most likely point of inflection using the 1st and
// 2nd derivatives of a set of data
const determinePOI = (data, keyD1, keyD2, useMaxGradient) => {
    const n = data.length;

    let inflection = -1;
    let bestInflectionScore = 0;

    if (useMaxGradient) {
        // Determine inflection point based on steepest gradient
        for (let i = 1; i < n; i++) {
            let score = data[i][keyD1];
                
            if (score > bestInflectionScore) {
                bestInflectionScore = score;
                inflection = i;
            }
        }
    }
    else {
        // Determine inflection point based on 2nd derivative
        for (let i = 1; i < n; i++) {
            if (
                data[i][keyD2] > 0 && data[i - 1][keyD2] < 0
                || data[i][keyD2] < 0 && data[i - 1][keyD2] > 0
            ) {
                let score = data[i][keyD1] + data[i - 1][keyD1];
    
                if (score > bestInflectionScore) {
                    bestInflectionScore = score;
    
                    let w1 = Math.abs(data[i][keyD2]);
                    let w2 = Math.abs(data[i - 1][keyD2]);
                    inflection = (w1 * i + w2 * (i - 1)) / (w1 + w2);
                }
            }
        }
    }

    return inflection;
}

// Gets the y-value for a dataset from a given x-value.
// If the x-value is not an integer, returns the y-value determined by
// interpolation between the two nearest points.
const getY = (data, key, x) => {
    if (Number.isInteger(x)) return data[x][key];

    let i = Math.floor(x);
    let bias = x % 1;

    return bias * data[i][key] + (1 - bias) * data[i + 1][key];
}

// Creates an array of values for a logistic curve given the parameters of the
// logistic curve equation
const logisticCurve = (k, L, xOff, xMax) => {
    values = []

    for (let x = 0; x < xMax; x++) {
        values.push(L / (1 + Math.exp(-k * (x - xOff))));
    }

    return values;
} 

module.exports = predict;