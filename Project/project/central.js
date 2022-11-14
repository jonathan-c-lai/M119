// based on the example on https://www.npmjs.com/package/@abandonware/noble
// based on example that professor Xiang 'Anthony' Chen gave us on https://github.com/ucla-hci/m119/tree/main/m3

const noble = require('@abandonware/noble');

const uuid_service = "181A"
const uuid_temp = "2A1F"
const uuid_humid = "2A6F"
const uuid_dist = "2A57"

const characteristicUUIDs = [uuid_temp, uuid_humid, uuid_dist]

let tempSensorValue = NaN
let humidSensorValue = NaN
let distSensorValue = NaN

noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
        console.log("start scanning")
        await noble.startScanningAsync([uuid_service], false);
    }
});

noble.on('discover', async (peripheral) => {
    await noble.stopScanningAsync();
    await peripheral.connectAsync();
    const {
        characteristics
    } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], characteristicUUIDs);

    readDataX(characteristics[0]);
    readDataY(characteristics[1]);
    readDataZ(characteristics[2]);
});

//
// read data periodically for each of the 3 axis'
//
let readDataX = async (characteristic) => {
    const value = (await characteristic.readAsync());
    tempSensorValue = value.readFloatLE(0);
    
    // read data again in t milliseconds
    setTimeout(() => {
        readDataX(characteristic)
    }, 10);

    console.log("X: ", tempSensorValue)
}

let readDataY = async (characteristic) => {
    const value = (await characteristic.readAsync());
    humidSensorValue = value.readFloatLE(0);
    
    setTimeout(() => {
        readDataY(characteristic)
    }, 10);

    console.log("Y: ", humidSensorValue)
}

let readDataZ = async (characteristic) => {
    const value = (await characteristic.readAsync());
    distSensorValue = value.readFloatLE(0);
    
    setTimeout(() => {
        readDataZ(characteristic)
    }, 10);

    console.log("Z: ", distSensorValue)
}

//
// hosting a web-based front-end and respond requests with sensor data
// based on example code on https://expressjs.com/
//
const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    // send index.ejs the three sensor values to be processed
    res.end(JSON.stringify({
        tempSensorValue: tempSensorValue,
        humidSensorValue: humidSensorValue,
        distSensorValue: distSensorValue
    }))

})

app.listen(port, () => {
    console.log(`Temp and Dist Sensor Warning on Port: ${port}`)
})
