const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navbar li a');
const products = document.querySelectorAll('.pro');

let currentPage = 1;
const productsPerPage = 8;
let currentCategory = 'Tất cả';

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Thêm sự kiện click cho các liên kết trong header
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        navLinks.forEach(nav => nav.classList.remove('active'));

        link.classList.add('active');

        currentCategory = link.textContent.trim();

        currentPage = 1;

        // Hiển thị sản phẩm theo danh mục và trang
        displayProducts(currentPage);
    });
});

function displayProducts(page) {
    const filteredProducts = Array.from(products).filter(product => 
        currentCategory === 'Tất cả' || product.dataset.category === currentCategory
    );

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    products.forEach(product => product.style.display = 'none');

    for (let i = start; i < end && i < filteredProducts.length; i++) {
        filteredProducts[i].style.display = 'block';
    }

    updatePagination(filteredProducts.length);
}

function updatePagination(totalProducts) {
    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.href = '#';
        pageLink.onclick = function () {
            currentPage = i;
            displayProducts(currentPage);
            return false;
        };

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pagination.appendChild(pageLink);
    }
}

displayProducts(currentPage);

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    products.forEach(product => {
        const productName = product.querySelector('.des h5').textContent.toLowerCase();
        if (productName.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

const searchSuggestions = document.getElementById('search-suggestions');

function showSuggestions(query) {
    const suggestions = [];
    const lowercaseQuery = query.toLowerCase();

    products.forEach(product => {
        const productName = product.querySelector('.des h5').textContent.toLowerCase();
        if (productName.includes(lowercaseQuery)) {
            suggestions.push(product.querySelector('.des h5').textContent);
        }
    });

    searchSuggestions.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestions-item');
            suggestionItem.textContent = item;

            suggestionItem.addEventListener('click', () => {
                searchInput.value = item;
                searchButton.click(); // Thực hiện tìm kiếm
                searchSuggestions.style.display = 'none';
            });

            searchSuggestions.appendChild(suggestionItem);
        });

        searchSuggestions.style.display = 'block';
    } else {
        searchSuggestions.style.display = 'none';
    }
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        showSuggestions(query);
    } else {
        searchSuggestions.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target)) {
        searchSuggestions.style.display = 'none';
    }
});



//  js cho form đăng nhập đăng kí

document.addEventListener('DOMContentLoaded', (event) => {
    let islogin = false;
    // tự động đăng nhập
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
     if (accounts.length > 0) {
         let account = accounts[0]; 
         document.getElementById('loginLink').innerText = account.email;
         document.getElementById('login-item').classList.add('logged-in');
         islogin = true;
     }
     
    // Hiển thị form đăng nhập
    document.getElementById('loginLink').addEventListener('click', () => {
        if(!islogin){
            document.querySelector('.modal').style.display = 'flex';
            document.querySelector('.login').style.display = 'block';
            document.querySelector('.register').style.display = 'none';
        }
    });

    
    // Ẩn modal
    document.querySelectorAll('.auth-form_controls-back').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.modal').style.display = 'none';
        });
    });

    // Chuyển đổi giữa form đăng nhập và đăng ký
    document.querySelector('.auth-form__switch-btn1').addEventListener('click', () => {
        document.querySelector('.register').style.display = 'none';
        document.querySelector('.login').style.display = 'block';
    });

    document.querySelector('.auth-form__switch-btn2').addEventListener('click', () => {
        document.querySelector('.register').style.display = 'block';
        document.querySelector('.login').style.display = 'none';
    });

    // Ẩn modal khi nhấn ra ngoài form
    document.querySelector('.modal__overlay').addEventListener('click', () => {
        document.querySelector('.modal').style.display = 'none';
    });

    // Xử lý đăng nhập
    document.querySelector('.btn--primary2').addEventListener('click', () => {
        let emailinput = document.querySelector('.login .name');
        let passwordinput = document.querySelector('.login .pass');

        let email = document.querySelector('.login .name').value;
        let password = document.querySelector('.login .pass').value;

        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        let account = accounts.find(acc => acc.email === email && acc.password === password);

        if (account) {
            document.getElementById('loginLink').innerText = account.email;
            document.querySelector('.modal').style.display = 'none';

            document.getElementById('login-item').classList.add('logged-in');

            emailinput.value = "";
            passwordinput.value = "";
            islogin = true;
        } else {
            alert("Đăng nhập thất bại");
        }
    });

    // Xử lý đăng ký
    document.querySelector('.btn--primary1').addEventListener('click', () => {
        let emailinput = document.querySelector('.register .name');
        let passwordinput = document.querySelector('.register .pass');
        let confirmPasswordinput = document.querySelector('.register .pass2');

        let email = document.querySelector('.register .name').value;
        let password = document.querySelector('.register .pass').value;
        let confirmPassword = document.querySelector('.register .pass2').value;

        if (!email || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        accounts.push({ email: email, password: password });
        localStorage.setItem('accounts', JSON.stringify(accounts));
        emailinput.value = "";
        passwordinput.value = "";
        confirmPasswordinput.value = "";
        alert("Đăng ký thành công");
    });

    // Xư lý đăng suất
    document.getElementById('logoutButton').addEventListener('click', () => { 
        localStorage.removeItem('accounts');
        document.getElementById('loginLink').innerText = 'Đăng nhập';
        document.getElementById('login-item').classList.remove('logged-in');
        islogin = false;
    });
});
