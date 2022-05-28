const JWT_ERR = 'ERR_JWT_1';
const PWD_SCADUTA = 'ERR_PWD_4';
const UTENTE_NON_TROVATO = 'ERR_PWD_3';

export default function (response) {
  try {
    if (response.data.codError === JWT_ERR)
      this.$router.replace('/');
    else if (response.data.codError === PWD_SCADUTA) {
      this.$alert({
        title: 'Attenzione',
        content: 'La password è scaduta. Ti invitiamo a modificarla.'
      })
        .then(() => {
          this.$router.replace('/home/pwdChange');
        })
        .catch(() => {
          this.$router.replace('/home/pwdChange');
        });
    }
    else if (response.data.codError === UTENTE_NON_TROVATO) {
      this.$alert({
        title: 'Attenzione',
        content: 'Utente non trovato.'
      })
        .then(() => {
          this.$router.replace('/');
        })
        .catch(() => {
          this.$router.replace('/');
        });
    }
    else {
      console.log(response.data);
      this.$alert({
        title: 'Attenzione',
        content: response.data.msg
      });
    }
  } catch (ex) {
    console.log(ex);
  }
}
