import axios from 'axios';

export const getCommonHeaders = () => {
  const headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    authorization: localStorage.getItem("authorization") != null ? localStorage.getItem("authorization") : ''
  };
  return headers;
};


export const httpGet = async (url) => {
    return axios
      .get(url, {
        headers: getCommonHeaders(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.res;
      });
  };



  export const httpDelete = async (url) => {
    return axios
      .delete(url, {
        headers: getCommonHeaders(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.res;
      });
  };
  
  export const httpPost = async (url, body) => {
    console.log('valueof url and body is',url,body)
    return axios
      .post(url, body, {  
        headers: getCommonHeaders(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  };
  
  export const httpPut = async (url, body) => {
    return axios
      .put(url, body, {
        headers: getCommonHeaders(),
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.res;
      });
  };
  
  export const httpPostFormData = async (url, body) => {
    let commonHeaders = getCommonHeaders();
    delete commonHeaders.Accept;
  
    return axios
      .post(url, body, {  
        headers: commonHeaders,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  };
  
  
  export const httpPutFormData = async (url, body) => {
    let commonHeaders = getCommonHeaders();
    delete commonHeaders.Accept;
  
    return axios
      .put(url, body, {  
        headers: commonHeaders,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  };