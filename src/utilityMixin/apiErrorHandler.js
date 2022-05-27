const JWT_ERR = 'ERR_JWT_1';
const PWD_SCADUTA = 'ERR_PWD_4';

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