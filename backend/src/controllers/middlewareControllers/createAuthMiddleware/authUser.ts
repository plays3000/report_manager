import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';

export const authUser = async (req: any, res: any, { user, databasePassword, password, UserPasswordModel }: any) => {
  const isMatch = await bcrypt.compare(password, databasePassword.password);

  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });

  if (isMatch === true) {
    const token = jwt.sign(
      { id: user._id },           // 1. Payload
      process.env.JWT_SECRET!,    // 2. Secret Key ( ! 붙여서 string 확정 )
      { expiresIn: req.body.remember ? `${365 * 24}h` : '24h' }        // 3. Options (객체 형태)
    );

    await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    // .cookie(`token_${user.cloud}`, token, {
    //     maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
    //     sameSite: 'None',
    //     httpOnly: true,
    //     secure: true,
    //     domain: req.hostname,
    //     path: '/',
    //     Partitioned: true,
    //   })
    res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        photo: user.photo,
        token: token,
        maxAge: req.body.remember ? 365 : null,
      },
      message: 'Successfully login user',
    });
  } else {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });
  }
};
