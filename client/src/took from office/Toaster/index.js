import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./style.scss";

export const successToaster = (msg) => {
  return toast.success(msg,{
    className: 'toast-message',
  });
};
export const errorToaster = (msg) => {
    return toast.error(msg,{
      className: 'toast-message',
    }); 
  };

// export const warningToaster = (msg, title) => {
//     return toast.warning(msg, title);
//   };
  

  
//   export const infoToaster = (msg, title) => {
//     return toast.info(msg, title);
//   };