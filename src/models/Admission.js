// import mongoose from "mongoose";

// // models/Admission.js
// const AdmissionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true }, // Roll no ki jagah email identification ke liye behtar hai
//   password: { type: String, required: true },
//   phone: { type: String, required: true },
//   className: { type: String, required: true },
//   section: { type: String, default: "A" },
//   status: { type: String, default: "pending" }, 
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema);




import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  email: { type: String, required: true },
  // password: { type: String, required: true },
  phone: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, default: "A" },
  photoUrl: { type: String, default: null },
  photoPublicId: { type: String, default: null },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema);