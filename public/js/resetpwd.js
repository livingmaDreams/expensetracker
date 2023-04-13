document.getElementById('form-forgotpassword-page').addEventListener('submit', forgotPassword);

function forgotPassword(event){
  event.preventDefault();
  const mail = event.target.mail.value;
  const obj = {mail};
  axios.post('http://13.210.128.234:3000/forgotpassword/called',obj)
  .then(() => window.location.href='http://13.210.128.234:3000/login')
  .catch(err => console.log(err));
}