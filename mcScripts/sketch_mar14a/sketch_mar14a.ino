#include "Arduino.h"
#include <SimpleDHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>

const char *ssid = "Vodafone-2A54";
const char *password = "81800TAXfelix*198";
const char *serverIp = "https://felixwegener.dev/api/temp";

WiFiClientSecure client;

short minutesTimer = 5;
byte pinDHT11 = 5;
SimpleDHT11 dht11(pinDHT11);
float temp;
float humid;

float getTemp()
{
  float temperature = 0;
  float humidity = 0;
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read2(&temperature, &humidity, NULL)) != SimpleDHTErrSuccess)
  {
    Serial.print("Read DHT11 failed, err=");
    Serial.println(err);
    delay(2000);
  }
  Serial.print("check temp from sensor: ");
  Serial.println(temperature);
  return temperature;
}

float getHumidity()
{
  float temperature = 0;
  float humidity = 0;
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read2(&temperature, &humidity, NULL)) != SimpleDHTErrSuccess)
  {
    Serial.print("Read DHT11 failed, err=");
    Serial.println(err);
    delay(2000);
  }
  Serial.print("check humid from sernsor: ");
  Serial.println(humidity);
  return humidity;
}

void sendPostRequest(float temperature, float humidity)
{
  client.setInsecure();

  HTTPClient http;
  http.begin(client, serverIp);

  http.addHeader("Content-Type", "application/json");

  String room = "wohnzimmer";
  String postData = "{\"room\":\"" + room + "\",\"humidity\":" + String(humidity, 2) + ",\"temperature\":" + String(temperature, 2) + "}";

  Serial.println("Sende POST-Request: " + postData);
  int httpResponseCode = http.POST(postData);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  Serial.println(http.getString()); // Antwort des Servers ausgeben

  http.end(); // Verbindung schließen
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting setup");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Verbindung zu WiFi...");
  }
  Serial.println("WiFi verbunden");
}

void loop()
{
  temp = getTemp();
  delay(500);
  humid = getHumidity();

  sendPostRequest(temp, humid);

  delay(minutesTimer * 60 * 1000);
}
