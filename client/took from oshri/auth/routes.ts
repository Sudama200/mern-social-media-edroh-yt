import { NextFunction, Request, Response } from "express";
import {
  createAdmin,
  login,
  logout,
  forgotPassword,
  forgotPasswordLink,
  changePassword,
  // register,
  // resetPassword,
  // changePassword,
  // verifyOTP,
  // resendOTP,
  // updateProfile,
  // getProfile,
  // fileUpload,
  // deleteFile,
  // insertPermission,
  // test
} from "./controller";
import config from "config";
import {
  validate,
  checkAuthenticate,
  checkForgotPassword,
  checkChangePassword,
  checkSignup,
  checkOTP,
  checkPassword,
  checkResendOTP
} from "./middleware/check";
const basePath = config.get("BASE_PATH");
const currentPath = "admin";
const currentPathURL = basePath + currentPath;

export default [

  //  create admin  //
  {
    path: currentPathURL + "/auth/createAdmin",
    method: "get",
    handler: [
      async (req: Request, res: Response) => {
        console.log("route")
        const result = await createAdmin();
        res.status(200).send(result);
      },
    ],
  },

  //  login  //
  {
    path: currentPathURL + "/auth/login",
    method: "post",
    handler: [
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await login(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  //  logout  //
  {
    path: currentPathURL + "/auth/logout",
    method: "post",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response) => {
        const result = await logout(req.get(config.get("AUTHORIZATION")));
        res.status(200).send(result);
      },
    ],
  },

  //  admin forgot password  //
  {
    path: currentPathURL + "/auth/forgotPassword",
    method: "post",
    handler: [
      checkForgotPassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPassword(req.body);
        res.status(200).send(result);
      },
    ],
  },

  //  open forgot password link  //
  {
    path: currentPathURL + "/auth/forgotPasswordLink",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPasswordLink();
        res.status(200).send(result);
      },
    ],
  },



  //  admin change password  //
  {
    path: currentPathURL + "/auth/changePassword",
    method: "post",
    handler: [
      checkAuthenticate,
      checkChangePassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await changePassword(req.get(config.get('AUTHORIZATION')), req.body, next);
        res.status(200).send(result);
      },
    ],
  }


  // //  register  //
  // {
  //   path: currentPathURL + "/register",
  //   method: "post",
  //   handler: [
  //     checkSignup,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await register(req.body, next);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },
  // //  Verify OTP
  // {
  //   path: currentPathURL + "/verifyOTP",
  //   method: "post",
  //   handler: [
  //     checkOTP,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await verifyOTP(req.body, next);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },
  // //  Resend OTP
  // {
  //   path: currentPathURL + "/resendOTP",
  //   method: "post",
  //   handler: [
  //     checkResendOTP,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await resendOTP(req.body, next);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },
  // //change password
  // {
  //   path: currentPathURL + '/changePassword',
  //   method: "post",
  //   handler: [
  //     checkAuthenticate,
  //     async (req: Request, res: Response) => {
  //       const result = await changePassword(req.get(config.get('AUTHORIZATION')), req.body.currentPassword, req.body.password);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // //  forgot password  //
  // {
  //   path: currentPathURL + '/forgotPassword',
  //   method: "post",
  //   handler: [
  //     checkForgotPassword,
  //     async (req: Request, res: Response) => {
  //       const result = await forgotPassword(req.body);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // // Reset Password
  // {
  //   path: currentPathURL + '/resetPassword',
  //   method: "post",
  //   handler: [
  //     checkPassword,
  //     async (req: Request, res: Response) => {
  //       const result = await resetPassword(req.body);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // // my Profile
  // {
  //   path: currentPathURL + '/updateProfile',
  //   method: "post",
  //   handler: [
  //     checkAuthenticate,
  //     async (req: Request, res: Response) => {
  //       const result = await updateProfile(req.get(config.get('AUTHORIZATION')), req.body);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // {
  //   path: currentPathURL + '/getProfile',
  //   method: "get",
  //   handler: [
  //     checkPassword,
  //     async (req: Request, res: Response) => {
  //       const result = await getProfile(req.get(config.get('AUTHORIZATION')));
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // {
  //   path: currentPathURL + '/fileUpload',
  //   method: "post",
  //   handler: [
  //     checkAuthenticate,
  //     async (req: Request, res: Response) => {
  //       const result = await fileUpload(req.get(config.get('AUTHORIZATION')), req);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // {
  //   path: currentPathURL + '/deleteFile',
  //   method: "post",
  //   handler: [
  //     checkAuthenticate,
  //     async (req: Request, res: Response) => {
  //       const result = await deleteFile(req.body);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // {
  //   path: currentPathURL + '/insertPermission',
  //   method: "get",
  //   handler: [
  //     async (req: Request, res: Response) => {
  //       const result = await insertPermission();
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
  // {
  //   path: currentPathURL + '/test',
  //   method: "get",
  //   handler: [
  //     checkPassword,
  //     async (req: Request, res: Response) => {
  //       const result = await test();
  //       res.status(200).send(result);
  //     }
  //   ]
  // },

];
