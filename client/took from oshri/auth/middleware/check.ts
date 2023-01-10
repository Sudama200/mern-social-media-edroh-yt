import { Request, Response, NextFunction } from "express";
import { HTTP400Error, HTTP403Error } from "../../../../utils/httpErrors";
import Joi, { any } from "joi";
import config from "config";
import { ListingUtilities } from "../../../../utils/ListingUtilities";
import { invalidTokenError, errorMessageHander } from "../../../../utils/ErrorHandler";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": `Email should be a valid email`
    }),
    password: Joi.string().trim(true).required().messages({ "string.empty": "Password can not be empty" }),
    role: Joi.string().optional(),
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

export const checkAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.get(config.get("AUTHORIZATION"));
  ListingUtilities.verifyToken(token)
    .then((result: any) => {
      next();
    })
    .catch((error: any) => {
      res
        .status(403)
        .send({ responseCode: 403, responseMessage: error.message, data: {} });
    });
};

export const checkForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};



//  user change Password  //
export const checkChangePassword = (req: Request, res: Response, next: NextFunction) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    oldPassword: Joi.string().trim(true).min(8).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required()
      .messages({
        "string.empty": "Old password can not be empty",
        "string.min": "Old password must include atleast 8 characters",
        "string.pattern.base": "Old password must include atleast 1 number and 1 special character"
      }),
    password: Joi.string().trim(true).min(8).pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required()
      .messages({
        "string.empty": "Password can not be empty",
        "string.min": "Password must include atleast 8 characters",
        "string.pattern.base": "Password must include atleast 1 number and 1 special character"
      })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};











export const checkSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullName: Joi.string().trim(true).required().messages({
      "string.empty": "Full Name can not be empty",
    }),
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};


export const checkOTP = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    otp: Joi.string().trim(true).required().messages({
      "string.empty": "OTP can not be empty"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

export const checkPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    password: Joi.string()
      .trim(true)
      .min(8)
      .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
      .required()
      .messages({
        "string.empty": "Password can not be empty",
        "string.min": "Password must include atleast 8 characters",
        "string.pattern.base": "Password must include atleast 1 number and 1 special character"
      })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

export const checkResendOTP = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Password must include atleast 8 characters including 1 number and 1 special character
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    })
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

