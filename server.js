const express = require("express");
const app = express();
const axios = require("axios");
const dialogflow = require("./dialogflow");

app.use(express.json());

app.post("/webhook", async function (req, res) {
  console.log("Esto ha llegado: ", JSON.stringify(req.body, null, " "));
  if (!req.body.statuses) {
    let phone = req.body.messages[0].from;
    let receivedMessage = req.body.messages[0].text.body;
    let payload = await dialogflow.sendToDialogFlow(receivedMessage, "aaa");
    let responses = payload.fulfillmentMessages;
    for (const response of responses) {
      await sendMessageToWhatsapp(phone, response.text.text[0]);
    }
  }
  res.status(200);
});

async function sendMessageToWhatsapp(phone, response) {
  try {
    let payload = await axios.post(
      "https://waba-sandbox.360dialog.io/v1/messages",
      {
        recipient_type: "individual",
        to: phone,
        type: "text",
        text: {
          body: response,
        },
      },
      {
        headers: {
          "D360-API-KEY": "fGeiRo_sandbox",
        },
      }
    );
    return payload.data;
  } catch (error) {
    console.log(error);
  }
}

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
