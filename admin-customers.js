document.querySelector('.view-customers').addEventListener('click',()=>{ 
    document.querySelector('.customer-content').style.display = 'flex'; 
    document.querySelector('.order-content').style.display = 'none';
    document.querySelector('.product-content').style.display = 'none';
    document.querySelector('.statistic-content').style.display = 'none';
}); 


    document.querySelector('.view-customers').addEventListener('click',()=>{
        const storeData2 = localStorage.getItem('address'); 
        const storeData1 = localStorage.getItem('customers'); 
        const customer2 = JSON.parse(storeData2); 
        const customer1 = JSON.parse(storeData1); 
    
        var html = ""; 
    
        customer2.forEach(customers2 => {
            const status = customer1.find(customers1 => customers1.id === customers2.customerId && customers1.status === "true") ? "Active" : "Inactive";
            
            const newRow = `
            <tr>
                <td>${customers2.customerId}</td> 
                <td>${customers2.fullname}</td>
                <td>${customers2.phone}</td> 
                <td class = "email">${customers2.email}</td>
                <td class = "ranking">regular</td>
                <td class = "status">${status}</td>
                <td>
                    <button>Edit-customer</button>
                    <button>Delete-customer</button>
                </td>
            </tr>
            `;
            
            html += newRow; 
      
           
      
        });
        
        const tableBody = document.querySelector('.customers--detail'); 
        // console.log(tableBody); 
        tableBody.innerHTML = html;    
    });


    function display(){
        const storeData2 = localStorage.getItem('address'); 
        // const storeData1 = localStorage.getItem('customers'); 
        const customer2 = JSON.parse(storeData2); 
        // const customer1 = JSON.parse(storeData1); 

        var html = ""; 
        
        customer2.forEach(customers2 => {
            console.log(getStatusThroughId(customers2.customerId)); 
            const newRow = `
            
            <tr>
                <td>${customers2.customerId}</td> 
                <td>${customers2.fullname}</td>
                <td>${customers2.phone}</td> 
                <td class = "email">${customers2.email}</td>
                <td class = "ranking">regular</td>
                <td class = "status">${getStatusThroughId(customers2.customerId) === "true" ? "Active" : "Inactive"}</td>
                <td>
                    <button>Edit-customer</button>
                    <button>Delete-customer</button>
                </td>
            </tr>
            `;
            
            html += newRow; 
            
      
        });

        
        
        const tableBody = document.querySelector('.customers--detail'); 
        // console.log(tableBody); 
        tableBody.innerHTML = html;    
    }

    function getStatusThroughId(id){
        const storeData = JSON.parse(localStorage.getItem('customers')); 
        const find1 = storeData.find(customers => parseInt(customers.id) === parseInt(id));
        return find1.status; 
    }   




document.getElementById('timkiem').addEventListener('click', ()=>{
    const username = document.getElementById('searchcustomername').value;
    if(username === ''){
        alert('Vui lòng nhập thông tin tìm kiếm'); 
        return; 
    } 
    const storeData = JSON.parse(localStorage.getItem('address')); 
    const tableBody = document.querySelector('.customers--detail'); 
    tableBody.innerHTML = ''; 
    
    // console.log(storeData); 

    const find = storeData.filter(customers => customers.fullname.includes(username)); 
    // console.log(getStatusThroughId(find.customerId)); 
    // console.log(find); 
    if(find){
        find.forEach(find=>{
            const newRow = `
            <tr>
                <td>${find.customerId}</td> 
                <td>${find.fullname}</td>
                <td>${find.phone}</td> 
                <td class = "email">${find.email}</td>
                <td class = "ranking">regular</td>
                <td class = "status">${ getStatusThroughId(find.customerId) === "true" ? "Active" : "Inactive"}</td>
                <td>
                    <button>Edit-customer</button>
                    <button>Delete-customer</button>
                </td>
            </tr>
        `; 
         tableBody.innerHTML += newRow; 
        })
    }

    
    else{
        alert('not found'); 
    }

    document.getElementById('searchcustomername').value = '';  



    
}); 

// them khach hang 
document.getElementById('add--customer').addEventListener('click',()=>{
    // const codeCustomers =  document.getElementById('customer--code').value.trim(); 
    const username = document.getElementById('username--name').value.trim(); 
    const password = document.getElementById('password--name').value.trim(); 
    // console.log(username); 
    // console.log(password); 
    const nameCustomers = document.getElementById('customer--name').value.trim(); 
    const phoneCustomers = document.getElementById('customer--phone').value.trim(); 
    const emailCustomers = document.getElementById('customer--email').value.trim(); 
    // const rankingCustomers = document.getElementById('customer--ranking').value; 
    const statusCustomers = document.getElementById('customer--status').value; 
    // console.log(statusCustomers); 

    const district = document.getElementById('customer--district').value.trim(); 
    const province = document.getElementById('customer--province').value.trim(); 
    const street = document.getElementById('customer--street').value.trim(); 
    const ward = document.getElementById('customer--ward').value.trim(); 

    if(username === '' || password === '' || nameCustomers === '' || phoneCustomers === '' || emailCustomers === '' || statusCustomers === '' || district === '' || province === '' || street === '' ||ward===''){
        alert('Vui lòng nhập đủ thông tin'); 
        return; 
    }

    // const storeData1 = localStorage.getItem('address');   
    // const storeData2 = localStorage.getItem('customers'); 
    const customers = JSON.parse(localStorage.getItem('address'));
    const customers2 = JSON.parse(localStorage.getItem('customers')); 
    const lastCustomerId = parseInt(customers.at(-1).customerId); 
    const lastCustomerId2 = parseInt(customers2.at(-1).id); 

    // console.log(lastCustomerId); 
    
    // lastCustomerId++; 
    // console.log(lastCustomerId); 
    let newcustomer = {
        customerId:lastCustomerId+1,
        district:district, 
        email:emailCustomers, 
        fullname:nameCustomers, 
        phone:phoneCustomers,
        province:province,
        street:street,
        ward:ward   
    }; 

    let updatestatus = (statusCustomers === "active" ? "true" : "false"); 
    console.log(updatestatus); 
    let newcustomer2 = {
        id: lastCustomerId2+1, 
        password: password, 
        status: updatestatus, 
        username: username 
    }

    // console.log(newcustomer2); 


    // console.log(newcustomer); 
    // const customerString = JSON.stringify(newcustomer);
    // console.log(customerString); 
    // localStorage.setItem('address',customerString); 

    let storeData1 = JSON.parse(localStorage.getItem('address')); 
    let storeData2 = JSON.parse(localStorage.getItem('customers')); 
    // console.log(storeData1); 
    storeData1.push(newcustomer); 
    storeData2.push(newcustomer2); 
    // console.log(JSON.stringify(storeData1));
     

    localStorage.setItem('address',JSON.stringify(storeData1));
    localStorage.setItem('customers',JSON.stringify(storeData2)); 

    const tableBody = document.querySelector('.customers--detail'); 

    tableBody.innerHTML = ''; 


    // storeData1.forEach(customers2 => {
        // const status = storeData2.find(customers1 => customers1.id === customers2.customerId && customers1.status === "true") ? "Active" : "Inactive";
        // console.log(status.status); 
        // const newRow = `
        // <tr>
        //     <td>${customers2.customerId}</td> 
        //     <td>${customers2.fullname}</td>
        //     <td>${customers2.phone}</td> 
        //     <td>${customers2.email}</td>
        //     <td>regular</td>
        //     <td>${getStatusThroughId(customers2.customerId) === "true" ? "Active" : "Inactive"}</td>

        // </tr>
        // `;
        
  
        // console.log(tableBody); 
        // tableBody.innerHTML += newRow;    
  
    // });
    
    document.getElementById('username--name').value = ''; 
    document.getElementById('password--name').value = ''; 
    document.getElementById('customer--name').value =''; 
    document.getElementById('customer--phone').value =''; 
    document.getElementById('customer--email').value =''; 
    document.getElementById('customer--ranking').value =''; 
    document.getElementById('customer--status').value =''; 
    document.getElementById('customer--district').value =''; 
    document.getElementById('customer--province').value =''; 
    document.getElementById('customer--street').value =''; 
    document.getElementById('customer--ward').value =''; 
    display(); 
});



document.getElementById('button-close').addEventListener('click',()=>{
    // console.log('hello'); 
    document.getElementById('modal').style.display = 'none'; 

})


let customerId; 

document.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'BUTTON' && e.target.textContent === 'Edit-customer') {
        const row = e.target.closest('tr'); 
        
        customerId = row.querySelector('td:first-child').textContent; 

        document.querySelector('.modal').style.display = 'flex';
        
        const customerData = {
            id: customerId,
            name: row.querySelector('td:nth-child(2)').textContent,
            phone: row.querySelector('td:nth-child(3)').textContent,
            email: row.querySelector('td:nth-child(4)').textContent,
            ranking: row.querySelector('td:nth-child(5)').textContent,
            status: row.querySelector('td:nth-child(6)').textContent
        };

        const addressdata = JSON.parse(localStorage.getItem('address')); 
       
        document.getElementById('change-name').value = customerData.name;
        document.getElementById('change-phone').value = customerData.phone;
        document.getElementById('change-email').value = customerData.email;
        document.getElementById('change-ranking').value = customerData.ranking; 
        document.getElementById('change-status').value = customerData.status;  
        document.getElementById('change-city').value = addressdata[customerId].province; 
        document.getElementById('change-street').value = addressdata[customerId].street; 
        document.getElementById('change-ward').value = addressdata[customerId].ward; 



    }
});


document.addEventListener('click',(e)=>{
    if(e.target && e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete-customer'){
        console.log('hello'); 
        const row = e.target.closest('tr');
        const customerId = parseInt(row.querySelector('td:first-child').textContent);   
        console.log(customerId); 
        const storeData1 = JSON.parse(localStorage.getItem('customers')); 
        const storeData2 = JSON.parse(localStorage.getItem('address')); 
        const updatedCustomers = storeData1.filter(cus => parseInt(cus.id) !== customerId);
        
        
        const updatedAddresses = storeData2.filter(cus => parseInt(cus.customerId) !== customerId);

        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        localStorage.setItem('address', JSON.stringify(updatedAddresses));

        row.remove();
    }
})





document.getElementById("submit").addEventListener('click', (e) => {
    // Get form values
    const name = document.getElementById("change-name").value;
    const phone = document.getElementById("change-phone").value;
    const email = document.getElementById("change-email").value;
    const province = document.getElementById("change-city").value;
    const street = document.getElementById("change-street").value;
    const ward = document.getElementById("change-ward").value;
    const status = document.getElementById("change-status").value; 
    // console.log(status); 


    const row = e.target.closest('tr');
    // Get the current customer data from localStorage
    const addressData = JSON.parse(localStorage.getItem('address'));
    const customersData = JSON.parse(localStorage.getItem('customers'));

    // Update address data
    const customerIndex = addressData.findIndex(cust => parseInt(cust.customerId) === parseInt(customerId));
    const customerDataIndex = customersData.findIndex(cust => parseInt(cust.id) === parseInt(customerId));
    if (customerIndex !== -1) {
        addressData[customerIndex] = {
            ...addressData[customerIndex],
            fullname: name || addressData[customerIndex].fullname,
            phone: phone || addressData[customerIndex].phone,
            email: email || addressData[customerIndex].email,
            province: province || addressData[customerIndex].province,
            street: street || addressData[customerIndex].street,
            ward: ward || addressData[customerIndex].ward
        };
        
        // Save updated data back to localStorage
        localStorage.setItem('address', JSON.stringify(addressData));

        // change status  
        // console.log(customerDataIndex); 
        // console.log(customersData[customerDataIndex]); 

        const updateStatus = status === "true" ? "true" : "false"; 

        customersData[customerDataIndex] = {
            id: customersData[customerDataIndex].id, 
            password: customersData[customerDataIndex].password, 
            status: updateStatus,
            username: customersData[customerDataIndex].username
        }; 

        // console.log(customersData[customerDataIndex]); 

        localStorage.setItem('customers',JSON.stringify(customersData)); 


       
    }

    document.querySelector('.modal').style.display = 'none';
    clearForm();

    display(); 
});

function clearForm() {
    document.getElementById("change-name").value = '';
    document.getElementById("change-phone").value = '';
    document.getElementById("change-email").value = '';
    document.getElementById("change-city").value = '';
    document.getElementById("change-street").value = '';
    document.getElementById("change-ward").value = '';
}



