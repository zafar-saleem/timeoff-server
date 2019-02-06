const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Client', 'Manager', 'Admin'],
    default: 'Client'
  }
}, { timestamp: true });

UserSchema.pre('save', function(next) {
  let user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.password !== '') {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(update.password, salt, (err, hash) => {
        this.getUpdate().password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
