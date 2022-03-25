import axios from 'axios';

const JWT_ERR = 'ERR_JWT_1';

export const verifyAuthModPwd = function(token) {
  return new Promise((resolve, reject) => {
    try {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/recuperopwd/verificatoken`, {
        headers: {
          'Accept-Version': '1.0.0'
        },
        params: {
          token: token
        }
      })
        .then(response => {
          if (response.data.success)
            resolve('ok');
          else
            reject(response.data.msg);
        })
        .catch(() => {
          reject('Si è verificato un errore. Riprova più tardi');
        })
    } catch (ex) {
      reject('Il servizio non è al momento disponibile');
    }
  })
}

export const apiErrorHandler = function (response) {
  if (response.data.codError === JWT_ERR)
    this.$router.replace('/');
  else {
    this.$alert({
      title: 'Attenzione',
      content: 'Si è verificato un errore riprova più tardi'
    });
  }
}