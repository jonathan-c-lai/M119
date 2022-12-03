#include <ArduinoBLE.h>
#include <Arduino_LSM6DS3.h>

// used the skeleton code from professor's guide:
// https://github.com/ucla-hci/m119/blob/main/m2b_peripheral/m2b_peripheral.ino
// provided as a resource to help us complete this assignment

#define BLE_UUID_ACCELEROMETER_SERVICE "1101" //1101
#define BLE_UUID_ACCELEROMETER_X "2101"
#define BLE_UUID_ACCELEROMETER_Y "2102"
#define BLE_UUID_ACCELEROMETER_Z "2103"
#define BLE_UUID_GYROSCOPE_X "2104"
#define BLE_UUID_GYROSCOPE_Y "2105"
#define BLE_UUID_GYROSCOPE_Z "2106"

BLEService accelerometerService(BLE_UUID_ACCELEROMETER_SERVICE);

BLEFloatCharacteristic accelerometerCharacteristicX(BLE_UUID_ACCELEROMETER_X, BLERead | BLENotify);
BLEFloatCharacteristic accelerometerCharacteristicY(BLE_UUID_ACCELEROMETER_Y, BLERead | BLENotify);
BLEFloatCharacteristic accelerometerCharacteristicZ(BLE_UUID_ACCELEROMETER_Z, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicX(BLE_UUID_GYROSCOPE_X, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicY(BLE_UUID_GYROSCOPE_Y, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicZ(BLE_UUID_GYROSCOPE_Z, BLERead | BLENotify);


void setup() {
  Serial.begin(9600);
  //while (!Serial);

  delay(2000);

  // initialize IMU
  if (!IMU.begin()) {
    Serial.println("IMU initialization failed");

    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");
  Serial.println();
  Serial.println("Acceleration in g's");
  Serial.println("X\tY\tZ");

  // initialize bluetooth
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy failed!");

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("Nano 33 IoT");
  BLE.setAdvertisedService(accelerometerService);

  // add the characteristics to the service
  accelerometerService.addCharacteristic(accelerometerCharacteristicX);
  accelerometerService.addCharacteristic(accelerometerCharacteristicY);
  accelerometerService.addCharacteristic(accelerometerCharacteristicZ);
  accelerometerService.addCharacteristic(gyroscopeCharacteristicX);
  accelerometerService.addCharacteristic(gyroscopeCharacteristicY);
  accelerometerService.addCharacteristic(gyroscopeCharacteristicZ);

  // add service
  BLE.addService(accelerometerService);

  // start advertising
  BLE.advertise();

  Serial.println("BLE Accelerometer/Gyroscope Peripheral");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // setup IMU vars
      float ax, ay, az;
      float gx, gy, gz;

      if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
        delay(200); // CHANGING THIS DELAY IN M6
        IMU.readAcceleration(ax, ay, az);
        IMU.readGyroscope(gx, gy, gz);

        Serial.print(ax);
        Serial.print('\t');
        Serial.print(ay);
        Serial.print('\t');
        Serial.print(az);
        Serial.print('\t');
        Serial.print(gx);
        Serial.print('\t');
        Serial.print(gy);
        Serial.print('\t');
        Serial.println(gz);
        accelerometerCharacteristicX.writeValue(ax);
        accelerometerCharacteristicY.writeValue(ay);
        accelerometerCharacteristicZ.writeValue(az);
        gyroscopeCharacteristicX.writeValue(gx);
        gyroscopeCharacteristicY.writeValue(gy);
        gyroscopeCharacteristicZ.writeValue(gz);
      }
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }
}