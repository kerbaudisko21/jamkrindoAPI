import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body?.role,
      imageProfile: req.file?.filename,
    });
    await newUser.save();
    res.status(200).send('User has been created.');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, 'User not found!'));
    const notHashPassword = req.body.password;

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, 'Wrong password or email!'));

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);

    const { password, role, ...otherDetails } = user._doc;
    res.cookie('access_token', token, {
      httpOnly: true,
    });
    
    res.status(200).json({ details: { ...otherDetails }, role, notHashPassword, password});
  } catch (err) {
    next(err);
  }
};

// export const regisAndLogin = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     console.log(user, 'user login');
//     if (!user) {
//       try {
//         var salt = bcrypt.genSaltSync(10);
//         var hash = bcrypt.hashSync(req.body.password, salt);
//         const newUser = new User({
//           username: req.body.username,
//           email: req.body.email,
//           password: hash,
//           imageProfile: req.file?.filename,
//         });
//         await newUser.save();
//       } catch (err) {
//         next(err);
//       }
//     }
//     await login(req, res, next);
//   } catch (err) {
//     next(err);
//   }
// };
