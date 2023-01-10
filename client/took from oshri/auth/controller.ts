import jwt, { decode } from "jsonwebtoken";
import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../../utils/httpErrors";
import config from "config";
import { userModel } from "../../../db/User";
import { ListingUtilities } from "../../../utils/ListingUtilities";
var mongoose = require("mongoose");
import * as bcrypt from "bcrypt";
import ejs from "ejs";
import moment from "moment";
import { MailerUtilities } from '../../../utils/MailerUtilities';
import { FileUploadUtilities } from '../../../utils/FileUploadUtilities';


//  Create admin if no admin exist in database  //
export const createAdmin = async () => {
  console.log("controller")

  let pass = await ListingUtilities.cryptPassword("Qwerty@1");
  let userRes: any = await userModel.findOne({ email: "admin@gmail.com", isDeleted: false });
  if (!userRes) {
    let adminArr = [
      {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: pass,
        isDeleted: false,
        role: 'Admin',
        userType: 'Admin'
      },
    ];
    return await userModel.create(adminArr);
  } else {
    userRes.userType = 'Admin';
    userRes.role = 'Admin';
    return await userRes.save();
  }
};

//  login api  //
export const login = async (req: any, next: any) => {
  try {
    const { email, password } = req;
    const user = await userModel.findOne({ email: email, isDeleted: false });
    if (!user) {
      throw new HTTP400Error(
        ListingUtilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HTTP400Error(
        ListingUtilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.INVALID_PASSWORD"),
        })
      );
    }
    let userToken = await ListingUtilities.createJWTToken({
      id: user._id,
      email: user.email,
      name: user.name
    });
    user.accessToken = userToken;
    await user.save(user);

    let result = {
      userDetail: user,
      token: userToken
    };


    return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: result });

  } catch (error) {
    next(error);
  }
};

//  logout api  //
export const logout = async (token: any) => {
  const decoded: any = await ListingUtilities.getDecoded(token);

  let userRes: any = await userModel.findOne({
    _id: mongoose.Types.ObjectId(decoded.id),
    isDeleted: false
  });
  if (userRes) {
    userRes.accessToken = "";
    await userRes.save();
    return ListingUtilities.sendResponsData({ code: 200, message: "Success" });
  } else {
    throw new HTTP400Error(
      ListingUtilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
      })
    );
  }
};

//  Forgot password  //
export const forgotPassword = async (body: any) => {
  let userRes: any = await userModel.findOne({ email: body.email, isDeleted: false });
  if (userRes) {
    let forgotPasswordLink = "http://localhost:4200/auth/reset-password/" + userRes._id.toString();
    console.log("********** forgotPasswordLink : ", forgotPasswordLink);

    userRes.forgotPasswordLink = forgotPasswordLink;
    userRes.linkVerified = false;
    userRes.linkExipredAt = moment().add(5, 'm')

    //Get template to send email
    let message = await ejs.renderFile(process.cwd() + "/src/views/forgotPasswordEmail.ejs", { link: forgotPasswordLink }, { async: true });
    let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });

    await userRes.save();
    return ListingUtilities.sendResponsData({ code: 200, message: 'Mail is sent with link', data: {} });
  } else {
    throw new HTTP400Error(ListingUtilities.sendResponsData({
      code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST')
    }));
  }
};

//  Forgot Password Link  //
export const forgotPasswordLink = async () => {
  let userRes: any = await userModel.findOne({ role: 'Admin', isDeleted: false });
  if (userRes) {
    if (userRes.linkVerified) {
      throw new HTTP400Error(ListingUtilities.sendResponsData({
        code: 400, message: config.get("ERRORS.LINK_ERRORS.INVALID_LINK"),
      }));
    }

    // Check if link is expired or not ( link valid for 5 minutes)
    let currentDateTime = moment();
    let date = new Date(userRes.linkExipredAt);
    let linkExpireTime = moment(date);
    if (currentDateTime.diff(linkExpireTime, 'm') > 5) {
      throw new HTTP400Error(ListingUtilities.sendResponsData({
        code: 400, message: config.get("ERRORS.LINK_ERRORS.LINK_EXPIRED"),
      }));
    }

    userRes.linkVerified = true;
    await userRes.save();
    return ListingUtilities.sendResponsData({ code: 200, message: config.get("ERRORS.LINK_ERRORS.LINK_VERIFIED") });
  } else {
    throw new HTTP400Error(ListingUtilities.sendResponsData({
      code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST')
    }));
  }
};

// Qwerty1@#

//  Change password  //
export const changePassword = async (token: any, bodyData: any, next: any) => {
  try {

    const decoded: any = await ListingUtilities.getDecoded(token);
    
    let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
    if (userRes) {
      const match = await ListingUtilities.VerifyPassword(bodyData.oldPassword, userRes.password);

      if(match){
        let hashedPassword = await ListingUtilities.cryptPassword(bodyData.password);
        userRes.password = hashedPassword;
        userRes.save();
        return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
      }
    } else {
      throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
    }
      
    } catch (error) {
      next(error);
    }
};













// //  new user register api  //
// export const register = async (req: any, next: any) => {
//   try {
//     const { email } = req;
//     const user = await userModel.findOne({ email: email, isDeleted: false });
//     if (user) {
//       throw new HTTP400Error(
//         ListingUtilities.sendResponsData({
//           code: 400,
//           message: config.get("ERRORS.USER_ERRORS.USER_EXISTS"),
//         })
//       );
//     }

//     let randomOTP = ListingUtilities.genNumericCode(6);
//     // req.otp = randomOTP;
//     // req.otpVerified = false;
//     // req.otpExipredAt = moment().add(1, 'm');

//     let userObj = {
//       firstName: req.fullName,
//       email: req.email,
//       otp: randomOTP,
//       otpVerified: false,
//       otpExipredAt: moment().add(1, 'm')
//     }
//     // Get email template to send email
//     let messageHtml = await ejs.renderFile(process.cwd() + "/src/views/otpEmail.ejs", { otp: randomOTP }, { async: true });
//     let mailResponse = MailerUtilities.sendSendgridMail({ recipient_email: [req.email], subject: "OTP Verification", text: messageHtml });

//     //await new userModel(req).save();
//     await new userModel(userObj).save();
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Mail is sent with otp', data: {} });
//   } catch (error) {
//     next(error)
//   }
// };

// //  Verify otp  //
// export const verifyOTP = async (req: any, next: any) => {
//   try {
//     const { email, otp, } = req;
//     if (otp === "") {
//       throw new HTTP400Error(ListingUtilities.sendResponsData({
//         code: 400,
//         message: config.get('ERRORS.ERRORS.OTP_ERRORS.OTP_REQUIRED')
//       }));
//     }
//     const user = await userModel.findOne({ email: email, otp: otp, isDeleted: false });
//     if (!user) {
//       throw new HTTP400Error(
//         ListingUtilities.sendResponsData({
//           code: 400,
//           message: config.get("ERRORS.OTP_ERRORS.INVALID_OTP"),
//         })
//       );
//     }
//     // Check if otp is expired or not ( otp valid for 1 minutes)
//     let currentDateTime = moment();
//     if (currentDateTime.diff(user.otpExipredAt, 'm') > 1) {
//       throw new HTTP400Error(
//         ListingUtilities.sendResponsData({
//           code: 400,
//           message: config.get("ERRORS.OTP_ERRORS.OTP_EXPIRED"),
//         })
//       );
//     }
//     user.otpVerified = true;
//     await user.save();
//     return ListingUtilities.sendResponsData({
//       code: 200,
//       message: config.get("ERRORS.OTP_ERRORS.OTP_VERIFIED"),
//       data: {}
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// //  resend otp  //
// export const resendOTP = async (req: any, next: any) => {
//   try {
//     const { email, password, cnfrm_password } = req;
//     const user = await userModel.findOne({ email: email, isDeleted: false });
//     if (user) {
//       let randomOTP = ListingUtilities.genNumericCode(6);
//       req.otp = randomOTP;
//       req.otpVerified = false;
//       req.otpExipredAt = moment().add(10, 'm')

//       // Get email template to send email
//       let message = await ejs.renderFile(process.cwd() + "/src/views/otpEmail.ejs", { otp: randomOTP }, { async: true });
//       let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [req.email], subject: "OTP Verification", text: message });

//       await new userModel(req).save();
//       return ListingUtilities.sendResponsData({ code: 200, message: 'Mail is sent with otp', data: {} });
//     } else {
//       throw new HTTP400Error(
//         ListingUtilities.sendResponsData({
//           code: 400,
//           message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
//         })
//       );
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// //  Change password  //
// export const changePassword = async (token: any, currentPassword: string, password: string) => {
//   const decoded: any = await ListingUtilities.getDecoded(token);

//   let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
//   if (userRes) {
//     const match = await ListingUtilities.VerifyPassword(currentPassword, userRes.password);
//     if (match) {
//       let hashedPassword = await ListingUtilities.cryptPassword(password);
//       userRes.password = hashedPassword;
//       userRes.save();
//       return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
//     } else {
//       throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.INVALID_CURRENT_PASSWORD') }));
//     }
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
//   }
// }

// //  Forgot password  //
// export const forgotPassword = async (body: any) => {
//   let userRes: any = await userModel.findOne({ email: body.email, isDeleted: false });
//   if (userRes) {
//     let randomOTP = ListingUtilities.genNumericCode(6);
//     userRes.otp = randomOTP;
//     userRes.otpVerified = false;
//     userRes.otpExipredAt = moment().add(10, 'm')

//     //Get template to send email
//     let message = await ejs.renderFile(process.cwd() + "/src/views/otpEmail.ejs", { otp: randomOTP }, { async: true });
//     let mailResponse = await MailerUtilities.sendSendgridMail({ recipient_email: [body.email], subject: "Forgot Password", text: message });

//     await userRes.save();
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Mail is sent with otp', data: {} });
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({
//       code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST')
//     }));
//   }
// }

// //  Reset password  //
// export const resetPassword = async (body: any) => {
//   let userRes: any = await userModel.findOne({ email: body.email, isDeleted: false });
//   if (userRes) {
//     let hashedPassword = await ListingUtilities.cryptPassword(body.password);
//     userRes.password = hashedPassword;
//     userRes.resetPasswordToken = "";
//     await userRes.save();
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({
//       code: 400, message: config.get('ERRORS.USER_ERRORS.LINK_EXPIRED')
//     }));
//   }
// }

// //  update Profile  //
// export const updateProfile = async (token: any, body: any) => {
//   const decoded: any = await ListingUtilities.getDecoded(token);

//   let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
//   if (userRes) {
//     userRes.firstName = body.firstName;
//     userRes.lastName = body.lastName;
//     userRes.address = body.address;
//     userRes.alternateAddress = body.alternateAddress;
//     userRes.phone = body.phone;
//     userRes.alternatePhone = body.alternatePhone;
//     userRes.dob = body.dob;
//     userRes.gender = body.gender;
//     userRes.role = body.role;
//     if (body.profilePicture != "") {
//       console.log("************* userRes.profilePicture : ", userRes.profilePicture)
//       FileUploadUtilities.deleteFile(`${userRes.profilePicture}`);
//       userRes.profilePicture = body.profilePicture;
//     }

//     if (body.password && body.reTypePassword) {
//       if (body.password != body.reTypePassword) {
//         throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.INVALID_PASSWORD') }));
//       }
//       let hashedPassword = await ListingUtilities.cryptPassword(body.password);
//       userRes.password = hashedPassword;
//     }
//     await userRes.save();
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
//   }
// }

// //  get Profile  //
// export const getProfile = async (token: any) => {
//   const decoded: any = await ListingUtilities.getDecoded(token);

//   let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
//   if (userRes) {

//     return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: userRes });
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
//   }
// }

// //  file upload  //
// export const fileUpload = async (token: any, req: any) => {
//   const decoded: any = await ListingUtilities.getDecoded(token);
//   let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
//   if (userRes) {
//     try {
//       let bodyData: any = JSON.parse(JSON.stringify(req.body));
//       const fileArr: any = [];
//       for (const file of req.files) {
//         fileArr.push(await FileUploadUtilities.uploadFileToAzure(file, decoded.id, bodyData));
//       }
//       return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: fileArr });
//     }
//     catch (error) {
//       throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: error }));
//     }
//   } else {
//     throw new HTTP400Error(ListingUtilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
//   }

// };

// //  Delete file  //
// export const deleteFile = async (body: any) => {
//   const AccountName = config.get('AZURE_STORAGE.ACCOUNT_NAME');
//   let fileName = body.file.replace(`https://${AccountName}.blob.core.windows.net`, "");
//   console.log("fileName", fileName);
//   FileUploadUtilities.deleteFile(fileName);
//   return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: {} });
// }

// //  insertPermission  //
// export const insertPermission = async () => {
//   let exists = await permissionModel.find();
//   console.log("exists", exists);
//   if (exists.length === 0) {
//     let result = await permissionModel.create([{
//       "name": "Can manage all products",
//       "type": "products"
//     }, {
//       "name": "Can create products",
//       "type": "products"
//     }, {
//       "name": "Can edit products",
//       "type": "products"
//     }, {
//       "name": "Can delete products",
//       "type": "products"
//     }, {
//       "name": "Can add/remove products members",
//       "type": "products"
//     }, {
//       "name": "Can create tasks",
//       "type": "tasks"
//     }, {
//       "name": "Can edit tasks",
//       "type": "tasks"
//     }, {
//       "name": "Can delete tasks",
//       "type": "tasks"
//     }, {
//       "name": "Can comment on tasks",
//       "type": "tasks"
//     }, {
//       "name": "Show assigned tasks only",
//       "type": "tasks"
//     }, {
//       "name": "Can delete files",
//       "type": "products"
//     }, {
//       "name": "Hide team members list?",
//       "type": "teams"
//     }, {
//       "name": "Can view team member's contact info?",
//       "type": "teams"
//     }, {
//       "name": "Can view team member's social links?",
//       "type": "teams"
//     }, {
//       "name": "Can update team member's general info and social links?",
//       "type": "teams"
//     }, {
//       "name": "Can manage announcements",
//       "type": "announcement"
//     }, {
//       "name": "Can view team member's social links?",
//       "type": "default"
//     }])
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: result });
//   } else {
//     return ListingUtilities.sendResponsData({ code: 200, message: 'Success', data: {} });
//   }
// }

//>>>>>>>>>>>>>
export const test = async () => {
  try {
    console.log("hi");
    //await MailerUtilities.sendSendgridMail({});
    //let aaa = await FileUploadUtilities.listShares({});
    //let aaa = await FileUploadUtilities.downloadFileFromAzure({});
    let aaa = await FileUploadUtilities.deleteFile('badezimmer-spa-deluxe-room-und-spa-suite.jpg');
    console.log("aaa", aaa);
    console.log("hello");

  } catch (error) {
    console.log("err", error);
  }
};