import { Schema, model, models } from "mongoose";

const PetSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export default models.Pet || model("Pet", PetSchema);
