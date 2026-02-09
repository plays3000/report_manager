import Joi from 'joi';
import mongoose from 'mongoose';
import authUser from './authUser.js';

const login = async (req: any, res: any, {userModel}: any) => {
    const UserPasswordModel = mongoose.model(userModel + 'Password');
    const UserModel = mongoose.model(userModel);
    const {id, password} = req.body;

    const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ id, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await UserModel.findOne({ id: id, removed: false });

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  //  authUser if your has correct password
  authUser(req, res, {
    user,
    databasePassword,
    password,
    UserPasswordModel,
  });
};