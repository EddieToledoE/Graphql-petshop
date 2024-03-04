import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        minlength: [4, "La contraseña debe tener al menos 4 caracteres."],
        select : false
    }
},
    {
        timestamps: false,
        versionKey: false,
    }
);

export default models.user || model("user", userSchema);