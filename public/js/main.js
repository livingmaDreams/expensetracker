

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
    }
   })
    .catch(err => {
      if(err.response.status == 500){
         error.value="*Something went wrong*"
         error.style.display = 'block';
        }
    });
    document.getElementById('name').value ='';
    document.getElementById('mail').value='';
    document.getElementById('password').value='';
 setTimeout(()=>{
    error.style.display = 'none';
   },2000);
}

function login(event){
    event.preventDefault();
    const mail = event.target.mail.value;
    const password = event.target.password.value;
    const error = document.getElementById('error')
    
    const obj = {mail,password};
    axios.post('http://localhost:3000/login',obj)
    .then(res => {
      console.log(res.data)
       if(res.status == 200){ 
         localStorage.setItem('expenseTracker',res.data.id);
         const url = `http://localhost:3000/home`
         window.location.href = url;
       }

     })
    .catch(err => {
      if(err.response.status == 404){
         error.value="*User not found*"
         error.style.display = 'block';
        }
      if(err.response.status == 401){
         error.value="*Wrong password*"
         error.style.display = 'block';
        } 
        if(err.response.status == 500){
         error.value="*Something went wrong*"
         error.style.display = 'block';
        } 
      });
      document.getElementById('mail').value='';
      document.getElementById('password').value='';
       setTimeout(()=>{
        error.style.display = 'none';
       },2000);
}

function dailyExpenses(event){
   event.preventDefault();
   const name = event.target.name.value;
   const amount = event.target.amount.value;
   const description = event.target.description.value;
   const category = event.target.category.value;
   const id = localStorage.getItem('expenseTracker');

   const obj ={name,amount,description,category,id};
   axios.post(`http://localhost:3000/home/daily/${id}`,obj)
   .then(res => {
      expenseList(res.data.newexpense)
      event.target.name.value = '';
      event.target.amount.value = '';
      event.target.description.value = '';
      event.target.category.value = '';
   })
   .catch(err => console.log(err));
}

function homePage(){
   const id = localStorage.getItem('expenseTracker');

   axios.get(`http://localhost:3000/home/daily/${id}`)
   .then(res =>{
      for(let data of res.data.expenses)
      expenseList(data);
   })
   .catch(err => console.log(err));
}
function expenseList(data){   
   const name = data.name;
   const category = data.category;
   const description = data.description;
   const amount = data.amount;
   let parEle;

   const divEle = document.createElement('div');
   divEle.id= data.id;
   
   divEle.innerHTML = `<div class="data"><span>${name}</span><span>₹<span id="amount">${amount}</span></span>
   <button id="data-editbutton" onClick="editExpense(event)">edit</button>
    <button id="data-delbutton" onClick="delExpense(event)">del</button>
    <button id="data-detailbutton" onClick="details(event)">details</button>
    </div>
    <div class="description">${description}</div>
   <div class="category">${category}</div>`;
   if(category == 'credit'){
   parEle = document.getElementById('credit');
   }
   else{
   parEle = document.getElementById('debit');
   }
   
   parEle.appendChild(divEle);

}

function details(event){
   const parELe = event.target.parentElement;
   const description = parELe.nextElementSibling;
   const category = description.nextElementSibling;
   description.style.display = 'block';
      category.style.display = 'block';
   setTimeout(()=>{
      description.style.display = 'none';
      category.style.display = 'none';
   },2000)
    
}

function delExpense(event){
   const parELe = event.target.parentElement.parentElement;
   const eId = parELe.id;
   const id = localStorage.getItem('expenseTracker');

   axios.delete(`http://localhost:3000/home/daily/delete/${id}?Eid=${eId}`)
   .then(res => parELe.remove())
   .catch(err => console.log(err));

}

