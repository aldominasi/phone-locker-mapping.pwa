const JWT_ERR = 'ERR_JWT_1';

export default function (response) {
  if (response.data.codError === JWT_ERR)
    this.$router.replace('/');
  else {
    this.$alert({
      title: 'Attenzione',
      content: 'Si è verificato un errore riprova più tardi'
    });
  }
}