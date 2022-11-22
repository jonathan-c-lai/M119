// based on the example on https://www.npmjs.com/package/@abandonware/noble
// What: Skeleton Code for reading Arduino IMU data with bluetooth
// Where: example that professor Xiang 'Anthony' Chen allowed students to use on https://github.com/ucla-hci/m119/tree/main/m3
// Why: Professor allowed us to use skeleton for our assignments to save time and give us some direction.

const noble = require('@abandonware/noble');

const uuid_service = "1101" //1101
const uuid_valueX = "2101"
const uuid_valueY = "2102"
const uuid_valueZ = "2103"
const uuid_valuegX = "2104"
const uuid_valuegY = "2105"
const uuid_valuegZ = "2106"

const characteristicUUIDs = [uuid_valueX, uuid_valueY, uuid_valueZ, uuid_valuegX, uuid_valuegY, uuid_valuegZ]

let sensorValueX = NaN
let sensorValueY = NaN
let sensorValueZ = NaN
let sensorValuegX = NaN
let sensorValuegY = NaN
let sensorValuegZ = NaN


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
    readDatagX(characteristics[3]);
    readDatagY(characteristics[4]);
    readDatagZ(characteristics[5]);
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

let readDatagX = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValuegX = value.readFloatLE(0);
    
    setTimeout(() => {
        readDatagX(characteristic)
    }, 10);

    console.log("gX: ", sensorValuegX)
}

let readDatagY = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValuegY = value.readFloatLE(0);
    
    setTimeout(() => {
        readDatagY(characteristic)
    }, 10);

    console.log("gX: ", sensorValuegY)
}

let readDatagZ = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValuegZ = value.readFloatLE(0);
    
    setTimeout(() => {
        readDatagZ(characteristic)
    }, 10);

    console.log("gZ: ", sensorValuegZ)
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
        sensorValueZ: sensorValueZ,
        sensorValuegX: sensorValuegX,
        sensorValuegY: sensorValuegY,
        sensorValuegZ: sensorValuegZ
    }))

})

app.listen(port, () => {
    console.log(`Using flicking up/down for Two Player Pong Game on Port: ${port}`)
})
