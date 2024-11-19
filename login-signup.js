const form = document.querySelector("#formm"); 

const button1 = document.getElementById("sign-up-button"); 
const button2 = document.getElementById("login-button"); 

button1.addEventListener("click", ()=>{
    button2.style.display = "none"; 
}); 

button2.addEventListener("click",()=>{
    button1.style.display = "none"; 
})


function loadAccounts() {
    const accounts = localStorage.getItem("accounts");
    return accounts ? JSON.parse(accounts) : [];
}

function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

function checkLogin(emailInput,passwordInput){
    const storeAccounts = loadAccounts();
    for(const account of storeAccounts){
        if(account.email === emailInput && account.password === passwordInput){
            return true; 
        }
    } 
    return false; 
}

document.getElementById("login-button").addEventListener("click", (e) => {
    e.preventDefault(); 
    const email = form.elements.mail.value; 
    const password = form.elements.pass.value; 
    if(email === "" || password === ""){
        return; 
    }
    else{
        const loginSuccess = checkLogin(email,password); 
        if(loginSuccess){
            console.log("login success"); 
            alert("login success"); 
        }   
        else{
            console.log("login failed"); 
            alert("login fail"); 
        }
    }
});


document.getElementById("sign-up-button").addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById("input-1").value;
    const password = document.getElementById("input-2").value;
    if(email === "" || password === ""){
        return; 
    }
    else{
        const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

        const existingAccount = accounts.find(account => account.email === email);
        
        if (existingAccount) {
            alert("Email already registered!");
            return;
        }
    
        accounts.push({ email, password });
        
        localStorage.setItem("accounts", JSON.stringify(accounts));
        
        alert("Registration successful!");
    }
   
});
