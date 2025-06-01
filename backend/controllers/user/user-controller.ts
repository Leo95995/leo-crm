import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user/user-model";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { validators } from "../../validators/validators";
// ----- UTILS ------------
import { JWT_UTILS } from "./JWT_utils";
import dataUtils from "../../utils/utils";
import { roles } from "../../config/roles";

import { userSanitizer } from "../../utils/sanitizers/userSanitizer";
import { Resend } from "resend";
// User controller
import dotenv from 'dotenv'
dotenv.config()

const generic_utils = dataUtils();

// ------------- GET FAKE JWT ---------------------
const jwt_mocked = async (req: Request, res: Response, next: NextFunction) => {
  const {
    body: { id, username, role },
  } = req;
  try {
    if (id === "92133") {
      const myJWTforTestingPurpose = JWT_UTILS.generateJwt({
        id: id,
        username: username,
        role: role,
      });
      res.status(200).json(`Bearer ${myJWTforTestingPurpose}`);
    } else {
      res.status(403).json("Special id provided not allowed");
    }
  } catch (error) {
    res.json(error);
  }
};

// --------------- GET REQUESTS --------------------



const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  let pageSize = 10;

  const user = req.user;

  const { full } = req.query;

  if (full) {
    const users = await User.find().select("-password");
    const sanitizedUserList = userSanitizer.sanitizeUserList(
      users as any[],
      user?.role as any
    );
    res.status(200).json({ users: sanitizedUserList });
  } else {
    const query = req.query;
    const { page, search, filter, order, field } = query;
    const limit = pageSize || 10;
    const skip = (Number(page) - 1) * limit;
    try {
      if ((page && search) || (order && field)) {
        let searchQuery = {};
        if (filter && search) {
          const key = generic_utils?.getFilter(filter as string);
          if (key) {
            searchQuery = {
              [key]: { $regex: search, $options: "i" },
            };
          }
        }
        let sortOptions = {};
        if (order && field) {
          const sortKey = generic_utils?.getFilter(field as string);
          const sortOrder = order === "ASC" ? 1 : order === "DESC" ? -1 : null;
          if (sortKey && sortOrder !== null) {
            sortOptions = { [sortKey]: sortOrder };
          }
        }
        const usersFiltered = await User.find(searchQuery)
          .sort(sortOptions)
          .select("-password")
          .skip(skip)
          .limit(limit);
        const total = await User.find(searchQuery).countDocuments();
        const sanitizedUserList = userSanitizer.sanitizeUserList(
          usersFiltered as any[],
          user?.role as any
        );

        res.status(200).json({
          users: sanitizedUserList,
          total: total,
          page: page,
        });
        return;
      } else {
        const users = await User.find()
          .skip(skip)
          .limit(limit)
          .select("-password");
        const sanitizedUserList = userSanitizer.sanitizeUserList(
          users as any[],
          user?.role as any
        );

        const totalUsers = await User.find().countDocuments();

        if (users?.length) {
          res.status(200).json({ users: sanitizedUserList, total: totalUsers });
        } else {
          res.status(404).json(`Users list empty`);
        }
      }
    } catch (error) {
      res.status(500).json(`Internal Server Error`);
    }
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = req.params.id;
  const user = await User.findById(paramsId);
  try {
    if (user) {
      const toRet = {
        _id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
        username: user?.username,
      };

      res.status(200).json(toRet);
    } else {
      res.status(404).json(`User not found`);
    }
  } catch (error) {
    res.status(500).json(`Internal server error`);
  }
};

const promoteUser = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = req.params.id;
  const newRole = req.body["role"];

  try {
    if (!newRole || !paramsId) {
      res.status(404);
      return;
    }

    const user = await User.findByIdAndUpdate(paramsId, { role: newRole });
    await user?.save();
    if (user) {
      res.status(200).json(`User role updated`);
    } else {
      res.status(404).json(`User not found`);
    }
  } catch (error) {
    res.status(500).json(`Internal server error`);
  }
};

const uptime = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(`Server up`);
  } catch (error) {
    res.status(500).json(`Server down`);
  }
};


// --------------- POST REQUESTS --------------------

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json("ok");
  } catch (error) {
    res.status(500).json(`Err`);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next("errore");
  }

  let errorList: any = {};
  const { email, username, password, firstName, lastName, termsCondition } =
    req.body;

  const isValidPassword = validators().passwordValidator(password);
  const isValidUser = validators().usernameValidator(username);
  const isValidEmail = validators().emailValidator(email);
  const termConditionsAccepted =
    validators().termConditionsValidator(termsCondition);

  errorList = {
    password: isValidPassword,
    username: isValidUser,
    email: isValidEmail,
    termsCondition: termConditionsAccepted,
  };

  try {
    if (
      email &&
      username &&
      password &&
      !isValidPassword.status &&
      firstName &&
      lastName &&
      termsCondition
    ) {
      let user = await User.findOne({ username: username });
      if (user) {
        errorList.globalError = "Username gia utilizzato";
        res.status(401).json(errorList);
        return;
      }
      const hashedPass = await JWT_UTILS.hashPassword(password);
      const createdUser = await User.create({
        email,
        username,
        password: hashedPass,
        role: "viewer",
        firstName,
        lastName,
        termsCondition,
      });

      res.status(201).json({
        user: createdUser,
      });
    } else {
      res.status(401).json(errorList);
      return;
      // res.status(404).json(`Registrazione Fallita, non hai inserito tutti i campi necessari`);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};
//  --------------- PATCH REQUESTS --------------------
const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = req.params.id;
  const body = req.body;
  const { email, firstName, lastName } = req.body;
  try {
    const userToPatch = await User.findByIdAndUpdate(paramsId, {
      email,
      firstName,
      lastName,
    });
    await userToPatch?.save();
    if (userToPatch) {
      const toRet = {
        _id: userToPatch._id,
        email: userToPatch.email,
        firstName: userToPatch.firstName,
        lastName: userToPatch.lastName,
        role: userToPatch.role,
        username: userToPatch.username,
      };

      let userToRet = btoa(JSON.stringify(toRet));

      res.status(200).json(userToRet);
    } else {
      res.status(404).json("User to update not found");
    }
  } catch (error) {
    res.status(500).json("Error in the user updating process");
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = req.params.id;
  try {
    const userToDelete = await User.findByIdAndDelete(paramsId);
    if (userToDelete) {
      res.status(200).json(userToDelete);
    } else {
      res.status(404).json(`User not found`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next("errore");
  }
  const body = req.body;
  const { username, password } = body;

  const user = await User.findOne({ username: username as string });

  try {
    if (user) {
      const hashedPassword = user.password;
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (isMatch) {
        let encoded = {
          username: user.username,
          email: user.email,
          _id: user._id,
          firstName: user.firstName,
          lastName: user?.lastName,
          role: user?.role,
        };
        let userToRet = btoa(JSON.stringify(encoded));
        res.status(200).json({
          userToRet,
          token: JWT_UTILS.generateJwt({
            id: user?._id,
            role: user?.role,
            username: user?.username,
          }),
        });
      } else {
        res.status(401).json("Unauthorized");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(500).json("Internal server Error");
  }
};

const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roledata = roles.find((role) => role.name === req?.user?.role);

    res.status(200).json(roledata);
  } catch (error) {
    res.status(500).json("problem getting datas");
  }
};

// Function who send the reset link email

const sendMailReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resend = new Resend(process.env.RESEND_KEY as string);
  const body = req.body;

  const { username } = body;
  try {
    const userToRecover = await User.findOne({ username: username });

    if (userToRecover) {
      const token = JWT_UTILS.resetLinkJwt(String(userToRecover?._id));

      //  Url del frontend a cui l'utente sarà redirezionato per effettuare il reset della password
      const tokenUrl = `${process.env.FRONTEND_RESET_URL}?token=${token}`;

      await resend.emails.send({
        from: "noreply@leolab.dev",
        to: [userToRecover.email],
        subject: "Reset Password CRM",
        html: `<p>
        Ciao  <b>${userToRecover?.username}</b>,</p>
        <p>Clicca sul seguente link per effettuare il reset password: ${tokenUrl}</p>`,
      });
      await userToRecover.save();
      res.status(200).json("Password inviata con successo");
    } else {
      res.status(404).json(`Nessun utente trovato`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(JSON.stringify(error));
  }
};

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const params = req.params;
  const { token } = params;

  try {
    const result = await JWT_UTILS.jwt_validator(token as string);
    if (result) {
      const { id } = result as any;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json({ user_id: id });
      } else {
        res.status(404).json(`Nessun utente trovato con tale nome`);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json("Attenzione stai utilizzando un link già utilizzato o scaduto");
  }
};
// Function who reset the user password
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next("errore");
  }
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const isValidPassword = validators().passwordValidator(newPassword);
    if (isValidPassword.status) {
      res.status(500).json(isValidPassword.message);
      return;
    }
    let userToPatch = await User.findById(id);
    if (userToPatch) {
      const hashedPass = await JWT_UTILS.hashPassword(newPassword);
      userToPatch.password = hashedPass as string;
      userToPatch.save();
      res.status(200).json(`Password modificata con successo`);
    } else {
      res.status(404).json("Errore nel reset della password ");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error as string);
  }
};

export const UserController = {
  getUser,
  getAllUsers,
  modifyUser,
  createUser,
  deleteUser,
  jwt_mocked,
  signin,
  verifyToken,
  uptime,
  getUserRole,
  promoteUser,
  // Nuovo flusso di reset utente
  sendMailReset,
  checkToken,
  resetPassword,
};
