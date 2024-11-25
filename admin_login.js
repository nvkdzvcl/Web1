document.getElementById('register').addEventListener('click', (e) => {
    e.preventDefault(); 
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

const registerForm = document.getElementById('registerForm'); 
registerForm.addEventListener('submit', (e) => { 
    e.preventDefault(); 
    const username = document.getElementById('taiKhoan').value; 
    const email = document.getElementById('mail').value; 
    const password = document.getElementById('pass').value; 
    const confirmPassword = document.getElementById('confirmpass').value; 
    
    if (!username || !email || !password || !confirmPassword) {
        alert('Vui lòng nhập đầy đủ thông tin'); 
        return; 
    }
    
    if (password !== confirmPassword) {
        alert('Vui lòng nhập mật khẩu đúng mật khẩu đã nhập'); 
        document.getElementById('pass').value = ""; 
        document.getElementById('confirmpass').value = ""; 
        return; 
    }
    
        const userdata = JSON.parse(localStorage.getItem('userData')) || [];
    
        const existingAccount = userdata.find(user => user.email === email)
        if (existingAccount) {
            alert("Email đã được đăng ký");
            return;
        }

        userdata.push({ email, password, username });

        localStorage.setItem("userData", JSON.stringify(userdata));

        alert('Đăng ký thành công'); 
        registerForm.reset(); 
    
});


const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault(); 
    const name = document.getElementById('tendangnhap').value; 
    const pass = document.getElementById('matkhau').value; 
    if(!name || !pass){
        alert('vui lòng nhập đầy đủ thông tin'); 
        return; 
    }
    const listOfAccounts = JSON.parse(localStorage.getItem('userData')) || []; 
    const user = listOfAccounts.find(account => account.username === name && account.password === pass);
    if(user){
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Đăng nhập thành công'); 
        
        window.location.href = "admin.html"; 
        loginForm.reset(); 

    }
    else{ 
        alert('Đăng nhập thất bại'); 
    }
    
})
