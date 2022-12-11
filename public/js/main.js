

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
      const token = res.data.token;
       if(res.status == 200){ 
         localStorage.setItem('expenseTracker',token);
        window.location.href = 'http://localhost:3000/home';
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
   const name = event.target.name.value;
   const amount = event.target.amount.value;
   const description = event.target.description.value;
   const category = event.target.category.value;
   const token = localStorage.getItem('expenseTracker');

   const obj ={name,amount,description,category};
 
   axios.post(`http://localhost:3000/home/daily`,obj,{ headers:{"Authorization":token}})
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
   getDailyExpenses();
   axios.get('http://localhost:3000/home/leadership')
   .then(res =>{
       const obj = JSON.parse(res.data.leadership);
       leadershipBoard(obj);
   })
   .catch(err => console.log(err));
}

function getDailyExpenses(){
   const list = document.getElementsByClassName('data-list');
   for(let i=list.length-1;i>=0;i--)
   list[i].remove();
   document.getElementById('balance-amount').textContent = 0;
   const token = localStorage.getItem('expenseTracker');

   axios.get(`http://localhost:3000/home/daily`,{ headers:{"Authorization":token}})
   .then(res =>{
      for(let data of res.data.expenses){
      expenseList(data);
      }  
   })
   .catch(err => console.log(err));
}

function getMonthlyExpenses(){
   const list = document.getElementsByClassName('data-list');
   for(let i=list.length-1;i>=0;i--)
   list[i].remove();
   document.getElementById('balance-amount').textContent = 0;
   const token = localStorage.getItem('expenseTracker');

   axios.get(`http://localhost:3000/home/monthly`,{ headers:{"Authorization":token}})
   .then(res =>{
      for(let data of res.data.expenses){
      expenseList(data);
      }  
   })
   .catch(err => console.log(err));
}
function getYearlyExpenses(){
   const list = document.getElementsByClassName('data-list');
   for(let i=list.length-1;i>=0;i--)
   list[i].remove();
   document.getElementById('balance-amount').textContent = 0;
   const token = localStorage.getItem('expenseTracker');

   axios.get(`http://localhost:3000/home/yearly`,{ headers:{"Authorization":token}})
   .then(res =>{
      for(let data of res.data.expenses){
      expenseList(data);
      }  
   })
   .catch(err => console.log(err));
}

function expenseList(data){      
   const name = data.name;
   const category = data.category;
   const description = data.description;
   const amount = data.amount;
   let parEle;

   let total = document.getElementById('balance-amount').textContent;
   if(data.category == 'credit')
   total = +total + data.amount;
   else
   total = +total - data.amount;
   document.getElementById('balance-amount').textContent = total.toFixed(2); 

   const divEle = document.createElement('div');
   divEle.className='data-list';
   
   
   divEle.innerHTML = `<div class="data"><span>${name}</span><span>₹<span id="amount">${amount}</span></span>
    </div>
    <div class="description">${description}</div>
   <div class="category">${category}</div>`;
   if(category == 'credit'){
   parEle = document.getElementById('credit');
   divEle.id = `data-credit-${name}`;
   }
   else{
   parEle = document.getElementById('debit');
   divEle.id = `data-debit-${name}`;
   }
   
   parEle.appendChild(divEle); 
   
}

function leadershipBoard(obj){
   let rank=1;
   const table = document.getElementById('leadership-table');
   for(let i in obj){
   const tr = document.createElement('tr');
   tr.innerHTML=`
   <td class="data-leadership">${rank++}</td>
   <td class="data-leadership"><a class='leadership-list' onClick='leadershipDetail(event)'>${i}</a></td>
   <td style='display:none'>${obj[i]}</td>`;
   table.appendChild(tr);
   }
}

function leadershipDetail(event){
   const div = document.createElement('div');
   div.id = 'leadership-details';
   div.innerHTML=`<div><p>USERNAME:   ${event.target.textContent}</div>
   <div><p>EXPENSES:   ₹${event.target.parentElement.nextElementSibling.textContent}</div>
   <button id='leadership-detail-close' onClick="document.getElementById('leadership-details').remove();">X</button>`;
   document.body.appendChild(div);
   setTimeout(()=>{
      div.remove();
   },2000)
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
   const token = localStorage.getItem('expenseTracker');

   axios.delete(`http://localhost:3000/home/daily/delete`,{ headers:{"Authorization":token}})
   .then(res => parELe.remove())
   .catch(err => console.log(err));

}

function pay(){
   const token = localStorage.getItem('expenseTracker');

   axios.get('http://localhost:3000/purchase/premiumUser',{ headers:{"Authorization":token}})
   .then(res => {
var options = {
    "key": res.data.key,
     "orderid": res.data.orderid,
    "amount": res.data.amount,
    "name": "Expense Traacker Premium",
    "description": "To buy premium membership",
    "image": "img/logo.png",
    "handler": function (response) {
      const paymentid = response.razorpay_payment_id;
      const orderid= options.orderid ;

      const obj = {orderid,paymentid };
       axios.post('http://localhost:3000/purchase/premiumUser',obj,{ headers:{"Authorization":token}} )
       .then(() => {
         alert('You are a Premium User Now')
         window.location.href = 'http://localhost:3000/home'})
       .catch(() => {
         alert('Something went wrong. Try Again!!!')
     });
    },
    "prefill": {
        "name": "ABC", // pass customer name
        "email": 'A@A.COM',// customer email
        "contact": '+919123456780' //customer phone no.
    },
    "notes": {
        "address": "address" //customer address 
    },
    "theme": {
        "color": "#15b8f3" // screen color
    }
};
var propay = new Razorpay(options);
propay.open();
   })
   .catch(err => console.log(err));
}

function darkTheme(){
  document.body.classList.toggle('dark')
}

function forgotPassword(event){
   event.preventDefault();
   const mail = event.target.mail.value;
   const obj = {mail};
   axios.post('http://localhost:3000/forgotpassword/called',obj)
   .then(() => window.location.href='http://localhost:3000/login')
   .catch(err => console.log(err));
}

function changePassword(event){
   event.preventDefault();
   const pwd = event.target.password.value;
   const pwdR = event.target.reenterPassword.value;
   let urlFull = location.href.split('?');
   let url = urlFull[0].split('/');
   let id = url[url.length -1];

   if(pwd !== pwdR)
   {
      event.target.error.value="Passwords doesn't match";
      event.target.error.style.display = 'block';
   }
   else{
      const obj ={pwd,id};
      axios.post('http://localhost:3000/forgotpassword/resetpassword',obj)
      .then(res => window.location.href='http://localhost:3000/login')
      .catch(err => console.log(err));
   }
}
