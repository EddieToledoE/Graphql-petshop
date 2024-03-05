import { Schema, model, models } from "mongoose";

const Webhookschema = new Schema({
  url: { type: String, required: true },
  event: [{ type: String, required: true }],
});

export default models.Webhook || model("Webhook", Webhookschema);
