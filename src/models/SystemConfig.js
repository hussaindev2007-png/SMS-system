import mongoose from "mongoose";

const SystemConfigSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Hum yahan "chat_lock" key use karenge
  value: { 
    type: Boolean, 
    default: false 
  } // false ka matlab chat open hye, true ka matlab lock hye
});

export default mongoose.models.SystemConfig || mongoose.model("SystemConfig", SystemConfigSchema);