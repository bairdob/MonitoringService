import random
import time

from paho.mqtt import client as mqtt_client
import requests

broker = '192.168.1.39'
# broker = 'broker.emqx.io'
port = 1883
topic = "/flask/mqtt"
# topic = "flask/mqtt"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 1000)}'
username = ''
password = ''
url = 'http://127.0.0.1:5000/publish'

json_text = '{ "devices": [{ "mac": "MAC", "name": "305", "sensors": [{ "id": "T1", "value": 25.50, "unit": "°C"} ]} ]}'

def genJson(number):
    return '{"type":"Feature","geometry":{"type":"Point","coordinates":['+ str(random.randint(0, 25)) +','+str(random.randint(0, 25)) +']},"properties":{"mac":"DEVICE_MAC1'+str(random.randint(1,number))+'","name":"DEVICE NAME","temperature": '+ str(random.randint(20, 25)) + ',"humidity": ' + str(random.randint(20, 30)) + '}}'

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client):
    msg_count = 0
    while True:
        time.sleep(1)
        # msg = f"temperature: {msg_count}"
        msg = genJson(2)
        # requests.post(url, json = {"topic": "/flask/mqtt", "msg": msg})
        result = client.publish(topic, msg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        msg_count += 1


def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)


if __name__ == '__main__':
    run()
