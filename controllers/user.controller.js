const User = require("../models/user.model.js");

const get_users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_user = async (req,res)=>{
  console.log('Request body:', req.body);

  try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    get_users, create_user,
};