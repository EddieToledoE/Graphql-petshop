import { Schema, model, models } from "mongoose";

const OwnerSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});

export default models.Owner || model("Owner", OwnerSchema);
