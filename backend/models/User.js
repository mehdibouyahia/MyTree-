import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true, default: null },
  dateOfBirth: { type: Date, default: null },
  profession: { type: String, default: '' },
  contacts: {
    addresses: [{ type: String, default: [] }],
    phoneNumbers: [{ type: String, default: [] }]
  },
  photo: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  isValidated: { type: Boolean, default: false },
  familyTree: { type: Object, default: {} },

});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
