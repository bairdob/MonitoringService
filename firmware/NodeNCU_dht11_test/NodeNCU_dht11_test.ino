#include "DHT.h"
#include <ESP8266WiFi.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>
#include <ArduinoJson.h>

#define WIFI_SSID "Keenetic-3556"
#define WIFI_PASSWORD "bair457589"

// Raspberri Pi Mosquitto MQTT Broker
#define MQTT_HOST IPAddress(192, 168, 1, 39)
// For a cloud MQTT broker, type the domain name
//#define MQTT_HOST "broker.emqx.io"
#define MQTT_PORT 1883

// Temperature MQTT Topics
#define MQTT_PUB_TOPIC "/flask/mqtt"

// Digital pin connected to the DHT sensor
#define DHTPIN D4  

// Uncomment whatever DHT sensor type you're using
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

//geoJSON settings
#define DEVICE_MAC "DEVICE_MAC"
#define DEVICE_NAME "DEVICE_NAME"
#define LAT 1.0
#define LNG 1.0


// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Variables to hold sensor readings
int temp;
int hum;

// Variables to hold JSON
String JSON_start = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]},\"properties\":{\"mac\":\"DEVICE_MAC\",\"name\":\"DEVICE_NAME\",\"temperature\":";
String JSON_mid = ",\"humidity\":";
String JSON_end = "}}";
String JSON_result = "";

AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 1000;        // Interval at which to publish sensor readings

void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void onWifiConnect(const WiFiEventStationModeGotIP& event) {
  Serial.println("Connected to Wi-Fi.");
  connectToMqtt();
}

void onWifiDisconnect(const WiFiEventStationModeDisconnected& event) {
  Serial.println("Disconnected from Wi-Fi.");
  mqttReconnectTimer.detach(); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
  wifiReconnectTimer.once(2, connectToWifi);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected()) {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

/*void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}

void onMqttUnsubscribe(uint16_t packetId) {
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}*/

void onMqttPublish(uint16_t packetId) {
  Serial.print("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}


void setup() {
  Serial.begin(115200);
  Serial.println();
  
  dht.begin();
  
  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  //mqttClient.onSubscribe(onMqttSubscribe);
  //mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  // If your broker requires authentication (username and password), set them below
  //mqttClient.setCredentials("REPlACE_WITH_YOUR_USER", "REPLACE_WITH_YOUR_PASSWORD");
  
  connectToWifi();
}

void loop() {
  unsigned long currentMillis = millis();
  // Every X number of seconds (interval = 1 seconds) 
  // it publishes a new MQTT message
  if (currentMillis - previousMillis >= interval) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
    // New DHT sensor readings
    hum = dht.readHumidity();
    // Read temperature as Celsius (the default)
    temp = dht.readTemperature();
    // Read temperature as Fahrenheit (isFahrenheit = true)
    //temp = dht.readTemperature(true);
  
    // Publish an MQTT message JSON on topic /flask/mqtt
//    JSON_result = JSON_start + String(temp) + JSON_mid + String(hum)+ JSON_end;
//    uint16_t packetIdPub3 = mqttClient.publish(MQTT_PUB_TOPIC, 1, true, JSON_result.c_str());
//    Serial.printf("%s\n", JSON_result.c_str());

    StaticJsonDocument<200> geoJsonFeature;
    geoJsonFeature["type"] = "Feature";
    geoJsonFeature["geometry"]["type"] = "Point";
    JsonArray coordinates = geoJsonFeature["geometry"].createNestedArray("coordinates");
    coordinates.add(1.0);
    coordinates.add(1.0); // "coordinates":[1.0,1.0]
    geoJsonFeature["properties"]["mac"] = DEVICE_MAC;
    geoJsonFeature["properties"]["name"] = DEVICE_NAME; 
    geoJsonFeature["properties"]["temperature"] = temp;
    geoJsonFeature["properties"]["humidity"] = hum; 
    String json_string;
    serializeJson(geoJsonFeature, json_string);
    uint16_t packetIdPub4 = mqttClient.publish(MQTT_PUB_TOPIC, 1, true, json_string.c_str());
    Serial.printf("%s\n", json_string.c_str());
  }
}
