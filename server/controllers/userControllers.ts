import { comparePassword, hashPassword } from "../helpers/authHelpers";
import userModels from "../models/userModels";
import JWT from "jsonwebtoken";
export const register = async (req: any, res: any) => {
  try {
    const { name, email, password, phone, confirmPassword } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new userModels({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();
    res.status(201).send({
      success: true,
      message: "Registration successfully. Please log in!",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Registration API",
      error,
    });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    //compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    const { password: _, ...userData } = user.toObject();

    res.status(200).send({
      success: true,
      message: "Login successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed in login API",
      error,
    });
  }
};

export const validateStep = async (req: any, res: any) => {
  const { step, name, email, phone, password, confirmPassword, agreeToTerms } =
    req.body;

  try {
    switch (step) {
      case 0:
        if (!name) {
          return res
            .status(400)
            .send({ success: false, message: "Name is required" });
        }
        if (!email) {
          return res
            .status(400)
            .send({ success: false, message: "Email is required" });
        }
        const existingUser = await userModels.findOne({ email });
        if (existingUser) {
          return res.status(400).send({
            success: false,
            message: "User already register with this email",
          });
        }
        return res.status(200).send({ success: true });

      case 1:
        if (!phone) {
          return res
            .status(400)
            .send({ success: false, message: "Phone is required" });
        }
        if (!password || password.length < 6) {
          return res.status(400).send({
            success: false,
            message: "Password must be at least 6 characters",
          });
        }
        return res.status(200).send({ success: true });

      case 2:
        if (password !== confirmPassword) {
          return res.status(400).send({
            success: false,
            message: "Confirm password does not match",
          });
        }
        if (!agreeToTerms) {
          return res.status(400).send({
            success: false,
            message: "You must agree to the terms",
          });
        }
        return res.status(200).send({ success: true });

      default:
        return res
          .status(400)
          .send({ success: false, message: "Invalid step" });
    }
  } catch (err) {
    return res.status(500).send({ success: false, message: "Server error" });
  }
};
