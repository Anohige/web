// MQTT Broker details
// Using EMQX public broker via WSS on port 8084
const brokerUrl = "wss://broker.emqx.io:8083/mqtt";
const inputTopic = "mytopic/input";
const outputTopic = "mytopic/output";

// Create a new MQTT client instance
const client = new Paho.MQTT.Client(brokerUrl, "webClient_" + Math.random());

// Set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Connect options
const options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};

// Connect the client
client.connect(options);

function onConnect() {
    console.log("Connected to MQTT broker");
    // Subscribe to the output topic
    client.subscribe(outputTopic);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("Connection lost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("Message arrived: " + message.payloadString);
    // Display the result
    document.getElementById('result').textContent = message.payloadString;
}

// Handle form submission
document.getElementById('calcForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;
    const payload = JSON.stringify({ num1: Number(num1), num2: Number(num2) });

    const msg = new Paho.MQTT.Message(payload);
    msg.destinationName = inputTopic;
    client.send(msg);

    // Optionally show a "Calculating..." message
    document.getElementById('result').textContent = "Calculating...";
});