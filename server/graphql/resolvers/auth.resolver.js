const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')


module.exports = {
  users: () => {
    return User.find({})
      .populate("createdEvents")
      .then((users) => {
        return users.map((user) => {
          return { ...user._doc };
        });
      })
      .catch((err) => {
        throw err;
      });
  },

  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPw) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPw,
        });
        return user.save();
      })
      .then((res) => {
        return { ...res._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if(!isEqual){
        throw new Error('Password is incorrect')
      }
      const token = jwt.sign({userId:user.id, email: user.email},process.env.SECRET_KEY,{
        expiresIn: '4h'
      })
      return {userId:user.id,token,tokenExpiration: 4}

    } catch (err) {
      throw err;
    }
  },
};
