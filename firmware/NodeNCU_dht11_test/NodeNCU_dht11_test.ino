//This example for use ESP8266 with Adafruit DHT11 library: 
//https://github.com/adafruit/DHT-sensor-library
#include "DHT.h"
// connect data pin of DHT11 to D2 ESP8266 NodeMCU
#define DHTPIN D4    

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);
bool led_status=false;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  delay(2000);
  led_status=!led_status;

  float h = dht.readHumidity();     // get humidity
  float t = dht.readTemperature();  // get temperature
  if ( !isnan(h) && !isnan(t)) {
      Serial.print("Humidity: ");
      Serial.print(h);
      Serial.print(" %  Temperature: ");
      Serial.print(t);
      Serial.println(" *C ");
  }
  digitalWrite(LED_BUILTIN,led_status);
}
