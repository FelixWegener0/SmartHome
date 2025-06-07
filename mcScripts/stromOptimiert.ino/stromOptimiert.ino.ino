#include <Arduino.h>
#include <SimpleDHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char *ssid = "";
const char *password = "";
const char *serverIp = "";

String room = "";

const short minutesTimer = 5;

const byte pinDHT11Signal = 5;
SimpleDHT11 dht11(pinDHT11Signal);

WiFiClientSecure client;

float getSensorData(float &temperature, float &humidity) {
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read2(&temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
    temperature = -1;
    humidity = -1;
  }
  return err;
}

void sendPostRequest(float temperature, float humidity) {
  client.setInsecure();

  HTTPClient http;
  http.begin(client, serverIp);
  http.addHeader("Content-Type", "application/json");

  String postData = "{\"room\":\"" + room + "\",\"humidity\":" + String(humidity, 2) + ",\"temperature\":" + String(temperature, 2) + "}";

  int httpResponseCode = http.POST(postData);
  http.end();
}

void setup() {
  delay(800);

  float temp, humid;
  getSensorData(temp, humid);

  WiFi.begin(ssid, password);
  uint8_t retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries++ < 20) {
    delay(250);
  }

  delay(800);
  sendPostRequest(temp, humid);

  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);

  ESP.deepSleep(minutesTimer * 60 * 1e6);
}

void loop() {}
