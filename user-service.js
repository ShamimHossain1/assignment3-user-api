const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  favourites: [String],
});

let User;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    // Fix the connection string format for MongoDB Atlas
    let connectionString = mongoDBConnectionString;

    // Ensure the connection string has the correct SSL parameters
    if (connectionString.includes("mongodb+srv://")) {
      connectionString = connectionString.replace(
        /\/\?appName=.*$/,
        "/?retryWrites=true&w=majority&ssl=true",
      );
    }

    console.log("Connecting with:", connectionString.substring(0, 50) + "...");

    let db = mongoose.createConnection(connectionString, {
      ssl: true,
      sslValidate: false, // Temporarily disable SSL validation
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    db.on("error", (err) => {
      console.error("Database connection error:", err);
      reject(err);
    });

    db.once("open", () => {
      console.log("Database connected successfully");
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;

          let newUser = new User(userData);

          newUser
            .save()
            .then(() => {
              resolve("User " + userData.userName + " successfully registered");
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => reject(err));
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((user) => {
        bcrypt.compare(userData.password, user.password).then((res) => {
          if (res === true) {
            resolve(user);
          } else {
            reject("Incorrect password for user " + userData.userName);
          }
        });
      })
      .catch((err) => {
        reject("Unable to find user " + userData.userName);
      });
  });
};

module.exports.getUserById = function (id) {
  return new Promise(function (resolve, reject) {
    User.findById(id)
      .exec()
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject("Unable to find user with id: " + id);
      });
  });
};

module.exports.getFavourites = function (id) {
  return new Promise(function (resolve, reject) {
    User.findById(id)
      .exec()
      .then((user) => {
        resolve(user.favourites);
      })
      .catch((err) => {
        reject(`Unable to get favourites for user with id: ${id}`);
      });
  });
};

module.exports.addFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findById(id)
      .exec()
      .then((user) => {
        if (user.favourites.length < 50) {
          User.findByIdAndUpdate(
            id,
            { $addToSet: { favourites: favId } },
            { new: true },
          )
            .exec()
            .then((user) => {
              resolve(user.favourites);
            })
            .catch((err) => {
              reject(`Unable to update favourites for user with id: ${id}`);
            });
        } else {
          reject(`Unable to update favourites for user with id: ${id}`);
        }
      });
  });
};

module.exports.removeFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(id, { $pull: { favourites: favId } }, { new: true })
      .exec()
      .then((user) => {
        resolve(user.favourites);
      })
      .catch((err) => {
        reject(`Unable to update favourites for user with id: ${id}`);
      });
  });
};
