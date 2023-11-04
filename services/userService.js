const User = require("../models/User");

exports.register = async (params) => {
  const user = await User.create(params);
  return user;
};

exports.login = async (params) => {
  const user = await User.query("email").eq(params).exec();
  return user[0];
};

exports.getUser = async (id) => {
  return await User.get(id);
};

exports.updateUser = async (id, userData) => {
  try {
    const existingUser = await User.get(id);
    if (existingUser) {
      if (userData.name) {
        existingUser.name = userData.name;
      }
      if (userData.email) {
        existingUser.email = userData.email;
      }
      if (userData.password) {
        existingUser.password = userData.password;
      }
      if (userData.profile) {
        existingUser.profile = userData.profile;
      }
      await existingUser.save();
      return existingUser;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
