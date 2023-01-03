const mongoose = require("mongoose");

const Role = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

const userSchema = mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.MEMBER,
  },
  createdBy: {
    type: mongoose.ObjectId,
    ref: "userSchema",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("userSchema", userSchema);
