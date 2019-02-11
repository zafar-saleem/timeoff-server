const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeesSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  status: {
    type: Boolean
  },
  active: {
    type: Boolean
  },
  role: {
    type: String,
    required: true
  }
});

EmployeesSchema.pre('save', function(next) {
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

EmployeesSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.password !== '' && update.password !== undefined) {
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
EmployeesSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Employees', EmployeesSchema);
