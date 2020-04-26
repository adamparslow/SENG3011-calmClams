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
        const inflectionX = determinePOI(data, `d1_${inKey}`, `d2_${inKey}`);
        if (inflectionX < 0) break; // TODO Handle no inflection point

        const inflectionY = getY(data, `value_${inKey}`, inflectionX);
        const inflectionD1 = getY(data, `d1_${inKey}`, inflectionX);

        // console.log(`POI: (${inflectionX}, ${inflectionY})`);

        const L = inflectionY * 2;
        const k = 4 * inflectionD1 / L;
        const xOff = inflectionX;

        curve = logisticCurve(k, L, xOff, n + additionalDays);
        // for (const y of curve) console.log(y);

        // console.log(`k: ${k}, L: ${L}, xOff: ${xOff}`);

        // for (let i = 0; i < n; i++) {
        //     series[i][`${outKey}_${country}`] = curve[i];
        // }

        // Align with final point on curve
        const yOff = curve[n - 1] - data[n - 1][`value_${inKey}`];
        series[n - 1][`${outKey}_${country}`] = curve[n - 1] - yOff;

        for (let i = n; i < n + additionalDays; i++) {
            series[i][`${outKey}_${country}`] = curve[i] - yOff;
        }
    }
}

const differentiate = (data, inKey, outKey) => {
    const n = data.length;

    for (let i = 0; i < n; i++) {
        if (i == 0) data[i][outKey] = data[i][inKey];
        else data[i][outKey] = data[i][inKey] - data[i - 1][inKey];
    }
}

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

const determinePOI = (data, keyD1, keyD2) => {
    const n = data.length;

    let inflection = -1;
    let bestInflectionScore = 0;
    
    for (let i = 1; i < n; i++) {
        if (
            data[i][keyD2] > 0 && data[i - 1][keyD2] < 0
            || data[i][keyD2] < 0 && data[i - 1][keyD2] > 0
        ) {
            let score = data[i][keyD1] + data[i - 1][keyD1];
            // console.log(`Between ${i - 1} and ${i}, score: ${score}`);

            if (score > bestInflectionScore) {
                bestInflectionScore = score;

                let w1 = Math.abs(data[i][keyD2]);
                let w2 = Math.abs(data[i - 1][keyD2]);
                inflection = (w1 * i + w2 * (i - 1)) / (w1 + w2);
            }
        }
    }

    // console.log(`Inflection: ${inflection}`);

    return inflection;
}

const getY = (data, key, x) => {
    if (Number.isInteger(x)) return data[x][key];

    let i = Math.floor(x);
    let bias = x % 1;

    return bias * data[i][key] + (1 - bias) * data[i + 1][key];
}

const logisticCurve = (k, L, xOff, xMax) => {
    values = []

    for (let x = 0; x < xMax; x++) {
        values.push(L / (1 + Math.exp(-k * (x - xOff))));
    }

    return values;
} 

module.exports = predict;