from flask import Flask
from flask import redirect, render_template, url_for, request, jsonify

from flask_mqtt import Mqtt

import ast
import geojson

app = Flask(__name__)

app.config['MQTT_BROKER_URL'] = '192.168.1.39'
# app.config['MQTT_BROKER_URL'] = 'broker.emqx.io'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = ''  # Set this item when you need to verify username and password
app.config['MQTT_PASSWORD'] = ''  # Set this item when you need to verify username and password
app.config['MQTT_KEEPALIVE'] = 5  # Set KeepAlive time in seconds
app.config['MQTT_TLS_ENABLED'] = False  # If your server supports TLS, set it True
topic = '/flask/mqtt'

mqtt_client = Mqtt(app)

mqtt_json = ''
devices = {}
devices_features = ''

@app.route('/')
def index():
    return redirect(url_for('maps'))

@app.route('/maps', methods=['GET', 'POST'])
def maps() -> 'html': 
    return render_template('maps.html')

@app.route('/mapsfull', methods=['GET'])
def mapsFull() -> 'html': 
    return render_template('mapsFullScreen.html')

@mqtt_client.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
       print('Connected successfully')
       mqtt_client.subscribe(topic) # subscribe topic
    else:
       print('Bad connection. Code:', rc)

@mqtt_client.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(topic=message.topic, payload=message.payload.decode())
    # print('Received message on topic: {topic} with payload: {payload}'.format(**data))

    global mqtt_json, devices, devices_features
    device_geojson_feature = geojson.loads(data['payload'])
    devices[device_geojson_feature.properties['mac']] = geojson.dumps(device_geojson_feature)

    devices_features = ', '.join(list(devices.values()))
    mqtt_json = '{"type": "FeatureCollection", "features": ['+devices_features+']}'

@app.route('/publish', methods=['POST'])
def publish_message():
    request_data = request.get_json()
    publish_result = mqtt_client.publish(request_data['topic'], request_data['msg'])
    return jsonify({'code': publish_result[0]})

@app.route('/json', methods = ['GET'])
def json():
    global mqtt_json 
    return str(mqtt_json)


if __name__ == '__main__':
    app.run(debug=True)
