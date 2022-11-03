// based on the example on https://www.npmjs.com/package/@abandonware/noble
// based on example that professor Xiang 'Anthony' Chen gave us on https://github.com/ucla-hci/m119/tree/main/m3

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_valueX = "2101"
const uuid_valueY = "2102"
const uuid_valueZ = "2103"

const characteristicUUIDs = [uuid_valueX, uuid_valueY, uuid_valueZ]

let sensorValueX = NaN
let sensorValueY = NaN
let sensorValueZ = NaN

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
    sensorValueX = value.readFloatLE(0);
    
    // read data again in t milliseconds
    setTimeout(() => {
        readDataX(characteristic)
    }, 10);

    console.log("X: ", sensorValueX)
}

let readDataY = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValueY = value.readFloatLE(0);
    
    setTimeout(() => {
        readDataY(characteristic)
    }, 10);

    console.log("Y: ", sensorValueY)
}

let readDataZ = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValueZ = value.readFloatLE(0);
    
    setTimeout(() => {
        readDataZ(characteristic)
    }, 10);

    console.log("Z: ", sensorValueZ)
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
        sensorValueX: sensorValueX,
        sensorValueY: sensorValueY,
        sensorValueZ: sensorValueZ
    }))

})

app.listen(port, () => {
    console.log(`Displaying X/Y/Z Accelerometer as R/G/B Background Color on Port: ${port}`)
})
