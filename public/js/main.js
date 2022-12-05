function signup(event){
    event.preventDefault()
    const name = event.target.name.value;
    const mail = event.target.mail.value;
    const password = event.target.password.value;
    const error = document.getElementById('error')
    
    const obj = { name,mail,password};
    axios.post('http://localhost:3000/signup',obj)
    .then(res => {
        if(res.status == 200)
         {
            error.value="*User already exists*"
            error.style.display = 'block';
          
         }else if(res.status == 201){
            error.value="*NewUser created successfully*"
            error.style.display = 'block';

            document.getElementById('name').value ='';
            document.getElementById('mail').value='';
            document.getElementById('password').value='';
         }
         setTimeout(()=>{
            error.style.display = 'none';
           },2000);
    })
    .catch(err => console.log(err));
}

function login(event){
    event.preventDefault();
    const mail = event.target.mail.value;
    const password = event.target.password.value;
    const error = document.getElementById('error')
    
    const obj = {mail,password};
    axios.post('http://localhost:3000/login',obj)
    .then(res => {
       if(res.data.status == 'usernotfound'){
        error.value="*User not found*"
        error.style.display = 'block';
       } else if(res.data.status == 'wrongpassword'){
        error.value="*Wrong password*"
        error.style.display = 'block';
       } else if(res.data.status == 'userfound'){
        console.log(res.data.status,res.data.name)
       }
       document.getElementById('mail').value='';
       document.getElementById('password').value='';
       setTimeout(()=>{
        error.style.display = 'none';
       },2000);
     })
    .catch(err => console.log(err));
}