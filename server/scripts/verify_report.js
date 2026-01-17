const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/reports/fast-sellers?startDate=2020-01-01&endDate=2030-12-31',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('Response is valid JSON.');
            console.log(`Record Count: ${jsonData.length}`);
            if (jsonData.length > 0) {
                console.log('Sample Record:', jsonData[0]);
            }
        } catch (e) {
            console.log('Response is NOT JSON:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
