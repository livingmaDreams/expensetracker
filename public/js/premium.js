window.addEventListener('DOMContentLoaded',premiumPage);

function premiumPage(){   
    let page=1; 
    getDailyExpenses(page);
    const perPage = localStorage.getItem('expenseTrackerperPage');
    document.getElementById('rows-per-page').value = perPage;
    axios.get('http://3.111.42.108:3000/home/leadership')
    .then(res =>{
       leadershipBoard(res.data.leadership);
    })
    .catch(err => console.log(err));
  }

function leadershipBoard(obj){
    let rank=1;
    const table = document.getElementById('leadership-table');
    for(let i of obj){
    const tr = document.createElement('tr');
    tr.innerHTML=`
    <td class="data-leadership">${rank++}</td>
    <td class="data-leadership"><a class='leadership-list' id='leadership-list'>${i.username}</a></td>
    <td style='display:none'>${i.total}</td>`;
    table.appendChild(tr);
    }
  }

document.getElementById('leadership-table').addEventListener('click', (event) =>{
  if(event.target.id == 'leadership-list' )
  leadershipDetail(event);
})

function leadershipDetail(event){
  const div = document.createElement('div');
  div.id = 'leadership-details';
  div.innerHTML=`<div><p>Username:   ${event.target.textContent}</div>
  <div><p>Balance:   ₹${event.target.parentElement.nextElementSibling.textContent}</div>
  <button id='leadership-detail-close'>X</button>`;
  document.body.appendChild(div);
  // setTimeout(()=>{
  //    div.remove();
  // },2000)
}

document.body.addEventListener('click',(event)=>{
  if(event.target.id == 'leadership-detail-close')
  leadershipDetailClose();
})

function leadershipDetailClose(){
   document.getElementById('leadership-details').remove();
}


//PAY

document.getElementById('premium').addEventListener('click', pay);

function pay(){
  const token = localStorage.getItem('expenseTracker');

  axios.get('http://3.111.42.108:3000/purchase/premiumUser',{ headers:{"Authorization":token}})
  .then(res => {
    console.log('hi')
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
      axios.post('http://3.111.42.108:3000/purchase/premiumUser',obj,{ headers:{"Authorization":token}} )
      .then(() => {
        alert('You are a Premium User Now')
        window.location.href = 'http://3.111.42.108:3000/premium'})
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

//DARK THEME

document.getElementById('darkmode').addEventListener('click', darkTheme, false);

function darkTheme(){
 document.body.classList.toggle('dark')
}

//STORING DATA

document.getElementById('form-homepage').addEventListener('submit', dailyExpenses);

function dailyExpenses(event){
  const name = event.target.name.value;
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const token = localStorage.getItem('expenseTracker');

  const obj ={name,amount,description,category};

  axios.post(`http://3.111.42.108:3000/home/daily`,obj,{ headers:{"Authorization":token}})
  .then(res => {
     expenseList(res.data.newexpense)
     event.target.name.value = '';
     event.target.amount.value = '';
     event.target.description.value = '';
     event.target.category.value = '';
  })
  .catch(err => console.log(err));
}


// PER PAGE

document.getElementById('rows-per-page').addEventListener('change', perPage);

function perPage(event){
   localStorage.setItem('expenseTrackerperPage',event.target.value);
   location.reload();
}

//EXPENSES LIST

document.getElementById('daily-expense-link').addEventListener('click', () => { getDailyExpenses(1);});

function getDailyExpenses(page){
  const list = document.getElementsByClassName('data-list');
  if(page == '1')
  document.getElementById('pagination').innerHTML ='';
  for(let i=list.length-1;i>=0;i--)
  list[i].remove();
  document.getElementById('balance-amount').textContent = 0;
  document.getElementById('total-credit-amount').textContent = 0;
  document.getElementById('total-debit-amount').textContent = 0;  
  const token = localStorage.getItem('expenseTracker');
  const perPage = localStorage.getItem('expenseTrackerperPage');
  axios.get(`http://3.111.42.108:3000/home/daily/${page}?perPage=${perPage}`,{ headers:{"Authorization":token}})
  .then(res =>{
     let totalPage = res.data.totalpages;
     if(totalPage != 0){
        for(let i=1;i<=totalPage;i++){
        const aTag = document.createElement('a');
        aTag.className = 'daily-expense-pagination';
        aTag.id = 'daily-expense-pagination';
        aTag.textContent= i;
        document.getElementById('pagination').appendChild(aTag);
     }
    
     }
     for(let data of res.data.expenses){
     expenseList(data);
     }  
  })
  .catch(err => console.log(err));
}

document.getElementById('monthly-expense-link').addEventListener('click', () => {getMonthlyExpenses(1);});

function getMonthlyExpenses(page){
  const list = document.getElementsByClassName('data-list');
  if(page == '1')
  document.getElementById('pagination').innerHTML ='';
  for(let i=list.length-1;i>=0;i--)
  list[i].remove();
  document.getElementById('balance-amount').textContent = 0;
  document.getElementById('total-credit-amount').textContent = 0;
  document.getElementById('total-debit-amount').textContent = 0; 
  const token = localStorage.getItem('expenseTracker');
  const perPage = localStorage.getItem('expenseTrackerperPage');
  axios.get(`http://3.111.42.108:3000/home/monthly/${page}?perPage=${perPage}`,{ headers:{"Authorization":token}})
  .then(res =>{
     let totalPage = res.data.totalpages;
     if(totalPage != 0){
     for(let i=1;i<=totalPage;i++){
        const aTag = document.createElement('a');
        aTag.className = 'monthly-expense-pagination';
        aTag.id = 'monthly-expense-pagination';
        aTag.textContent= i;
        document.getElementById('pagination').appendChild(aTag);
     }
     }
     
     for(let data of res.data.expenses){
     expenseList(data);
     }  
  })
  .catch(err => console.log(err));
}

document.getElementById('yearly-expense-link').addEventListener('click',() =>{ getYearlyExpenses(1);});

function getYearlyExpenses(page){
  const list = document.getElementsByClassName('data-list');
  if(page == '1')
  document.getElementById('pagination').innerHTML ='';
  for(let i=list.length-1;i>=0;i--)
  list[i].remove();
  document.getElementById('balance-amount').textContent = 0;
  document.getElementById('total-credit-amount').textContent = 0;
  document.getElementById('total-debit-amount').textContent = 0; 
  const token = localStorage.getItem('expenseTracker');
  const perPage = localStorage.getItem('expenseTrackerperPage');
  axios.get(`http://3.111.42.108:3000/home/yearly/${page}?perPage=${perPage}`,{ headers:{"Authorization":token}})
  .then(res =>{
     let totalPage = res.data.totalpages;
     if(totalPage != 0){
     for(let i=1;i<=totalPage;i++){
        const aTag = document.createElement('a');
        aTag.className = 'yearly-expense-pagination';
        aTag.id = 'yearly-expense-pagination';
        aTag.textContent= i;
        document.getElementById('pagination').appendChild(aTag);
     }
  }
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
    let credit = document.getElementById('total-credit-amount').textContent; 
    let debit = document.getElementById('total-debit-amount').textContent;  
    if(data.category == 'credit'){
       total = +total + data.amount;
       credit = +credit + data.amount;
    }
    else{
       total = +total - data.amount;
       debit = +debit + data.amount;
    }
    
    document.getElementById('balance-amount').textContent = total.toFixed(2);
    document.getElementById('total-credit-amount').textContent = credit;
    document.getElementById('total-debit-amount').textContent = debit;  
  
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

//PAGINATION
document.getElementById('pagination').addEventListener('click', (event)=>{
    if(event.target.id == 'daily-expense-pagination')
    getDailyExpenses(event.target.textContent);
    if(event.target.id == 'monthly-expense-pagination')
    getMonthlyExpenses(event.target.textContent);
    if(event.target.id == 'yearly-expense-pagination')
    getYearlyExpenses(event.target.textContent);
  });
  