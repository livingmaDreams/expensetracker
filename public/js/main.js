
// function details(event){
//   const parELe = event.target.parentElement;
//   const description = parELe.nextElementSibling;
//   const category = description.nextElementSibling;
//   description.style.display = 'block';
//      category.style.display = 'block';
//   setTimeout(()=>{
//      description.style.display = 'none';
//      category.style.display = 'none';
//   },2000)
   
// }

// function delExpense(event){
//   const parELe = event.target.parentElement.parentElement;
//   const token = localStorage.getItem('expenseTracker');

//   axios.delete(`http://localhost:3000/home/daily/delete`,{ headers:{"Authorization":token}})
//   .then(res => parELe.remove())
//   .catch(err => console.log(err));

// }


document.getElementById('download').addEventListener('click', downloadLink);

function downloadLink(event){
  event.preventDefault();
  const token = localStorage.getItem('expenseTracker');
  const div = document.createElement('div');
  div.id = 'download-tab';
  div.innerHTML=`
  <table id="download-table">
               <tr>
                 <th>Date</th>
                 <th>URL Link</th>
               </tr>
             </table>
     <button id="create-download">DOWNLOAD</button>
     <button id='download-close'>X</button>`;
  const form = document.querySelector('form');
  form.appendChild(div);
  axios.get('http://localhost:3000/premium/download',{ headers:{"Authorization":token}})
  .then(res =>{
     for(let data of res.data.links)
     {
        const date = new Date(data.createdAt).toLocaleDateString("en-GB");
        const link = data.link;
        const tr = document.createElement('tr');
        tr.innerHTML=`
        <td>${date}</td>
        <td><a href=${link}>download</a></td>`;
        document.getElementById('download-table').appendChild(tr);
     }
  })
  .catch(err => console.log(err));
}


document.getElementById('create-download').addEventListener('click', createLink);

function createLink(event){
  event.preventDefault();
  const token = localStorage.getItem('expenseTracker');
  axios.get('http://localhost:3000/premium/createlink',{ headers:{"Authorization":token}})
  .then(res =>{
      window.open(res.data.url);
  })
  .catch(err => console.log(err));
}

document.getElementById('download-close').addEventListener('click', downloadClose);

function downloadClose(){
   document.getElementById('download-tab').remove(); 
}


