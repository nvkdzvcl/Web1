const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navbar li a');
const products = document.querySelectorAll('.pro');

let currentPage = 1;
const productsPerPage = 8;
let currentCategory = 'Tất cả'; // Mặc định là hiển thị tất cả sản phẩm

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
        event.preventDefault(); // Ngăn chặn hành động mặc định

        // Xóa lớp 'active' khỏi tất cả liên kết
        navLinks.forEach(nav => nav.classList.remove('active'));

        // Thêm lớp 'active' cho liên kết được nhấn
        link.classList.add('active');

        // Cập nhật danh mục hiện tại
        currentCategory = link.textContent.trim();

        // Quay lại trang đầu tiên khi chuyển danh mục
        currentPage = 1;

        // Hiển thị sản phẩm theo danh mục và trang
        displayProducts(currentPage);
    });
});

// Hàm để hiển thị sản phẩm dựa trên trang hiện tại và danh mục
function displayProducts(page) {
    // Lấy danh sách sản phẩm phù hợp với danh mục
    const filteredProducts = Array.from(products).filter(product => 
        currentCategory === 'Tất cả' || product.dataset.category === currentCategory
    );

    // Tính toán chỉ mục bắt đầu và kết thúc
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    // Ẩn tất cả sản phẩm
    products.forEach(product => product.style.display = 'none');

    // Hiển thị sản phẩm trong phạm vi trang hiện tại
    for (let i = start; i < end && i < filteredProducts.length; i++) {
        filteredProducts[i].style.display = 'block';
    }

    // Cập nhật phân trang
    updatePagination(filteredProducts.length);
}

// Hàm để cập nhật hiển thị phân trang
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

        // Thêm class 'active' cho trang hiện tại
        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pagination.appendChild(pageLink);
    }
}

// Khởi tạo hiển thị lần đầu
displayProducts(currentPage);


// Lấy các phần tử thanh tìm kiếm
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Thêm sự kiện click vào nút tìm kiếm
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    // Lọc sản phẩm dựa trên từ khóa tìm kiếm
    products.forEach(product => {
        const productName = product.querySelector('.des h5').textContent.toLowerCase();
        if (productName.includes(query)) {
            product.style.display = 'block'; // Hiển thị sản phẩm phù hợp
        } else {
            product.style.display = 'none'; // Ẩn sản phẩm không phù hợp
        }
    });

    // Xóa phân trang vì tìm kiếm hiển thị tất cả kết quả trong một trang
    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';
});

// Cho phép tìm kiếm bằng phím Enter
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// Lấy các phần tử liên quan
const searchSuggestions = document.getElementById('search-suggestions');

// Hàm để hiển thị gợi ý tìm kiếm
function showSuggestions(query) {
    const suggestions = [];
    const lowercaseQuery = query.toLowerCase();

    // Tìm các sản phẩm phù hợp với từ khóa
    products.forEach(product => {
        const productName = product.querySelector('.des h5').textContent.toLowerCase();
        if (productName.includes(lowercaseQuery)) {
            suggestions.push(product.querySelector('.des h5').textContent);
        }
    });

    // Xóa nội dung cũ
    searchSuggestions.innerHTML = '';

    if (suggestions.length > 0) {
        // Hiển thị danh sách gợi ý
        suggestions.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestions-item');
            suggestionItem.textContent = item;

            // Thêm sự kiện click vào từng gợi ý
            suggestionItem.addEventListener('click', () => {
                searchInput.value = item; // Gán gợi ý vào ô tìm kiếm
                searchButton.click(); // Thực hiện tìm kiếm
                searchSuggestions.style.display = 'none'; // Ẩn gợi ý
            });

            searchSuggestions.appendChild(suggestionItem);
        });

        searchSuggestions.style.display = 'block';
    } else {
        searchSuggestions.style.display = 'none'; // Ẩn gợi ý nếu không có kết quả
    }
}

// Sự kiện khi nhập vào ô tìm kiếm
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        showSuggestions(query); // Hiển thị gợi ý nếu có từ khóa
    } else {
        searchSuggestions.style.display = 'none'; // Ẩn gợi ý nếu ô tìm kiếm trống
    }
});

// Ẩn gợi ý khi nhấn bên ngoài
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
        let addressinput = document.querySelector('.register .address');
        let phoneinput = document.querySelector('.register .number');


        let email = document.querySelector('.register .name').value;
        let password = document.querySelector('.register .pass').value;
        let confirmPassword = document.querySelector('.register .pass2').value;
        let address = document.querySelector('.register .address').value;
        let phone = document.querySelector('.register .number').value;

        if (!email || !password || !confirmPassword || !address || !phone) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        accounts.push({ email: email,phone: phone, password: password,address: address });
        localStorage.setItem('accounts', JSON.stringify(accounts));
        emailinput.value = "";
        passwordinput.value = "";
        confirmPasswordinput.value = "";
        addressinput.value = "";
        phoneinput.value = "";
        alert("Đăng ký thành công");
    });

    // Xư lý đăng suất
    document.getElementById('logoutButton').addEventListener('click', () => { 
        // localStorage.removeItem('accounts');
        document.getElementById('loginLink').innerText = 'Đăng nhập';
        document.getElementById('login-item').classList.remove('logged-in');
        islogin = false;
    });

    //  Giỏ hàng 

    // Mở giỏ hàng
    document.getElementById('lg-bag').addEventListener('click', () => {
        document.getElementById('shopping-cart').style.display = 'initial';
    });

    // Đóng giỏ hàng
    document.getElementById('cart-back').addEventListener('click', () =>{
        document.getElementById('shopping-cart').style.display = 'none';
    })

});


//mô tả sản phẩm
// Get modal elements
document.addEventListener('DOMContentLoaded', () => {
    // Define necessary variables
    const searchBar = document.getElementById('search-bar'); // Fix `searchBar` error
    let islogin = false;

    // Auto-login check
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    if (accounts.length > 0) {
        const account = accounts[0];
        document.getElementById('loginLink').innerText = account.email;
        document.getElementById('login-item').classList.add('logged-in');
        islogin = true;
    }

    // Modal elements for product details
    const productModal = document.getElementById('productModal');
    const modalProductImage = document.getElementById('modalProductImage');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductSize = document.getElementById('modalProductSize');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const closeProductModal = document.getElementById('closeProductModal');

    // Open modal on product click
    document.querySelectorAll('.pro').forEach(product => {
        product.addEventListener('click', () => {
            const productImage = product.querySelector('img').src;
            const productName = product.querySelector('.des h5').textContent;
            const productPriceM = 35000; // Example prices
            const productPriceL = 43000;

            // Populate modal details
            modalProductImage.src = productImage;
            modalProductName.textContent = productName;
            modalProductPrice.textContent = productPriceM; // Default size M
            modalProductSize.value = 'M';

            productModal.style.display = 'flex';

            // Update price on size change
            modalProductSize.addEventListener('change', () => {
                modalProductPrice.textContent = modalProductSize.value === 'M' ? productPriceM : productPriceL;
            });

            // Add to cart functionality
            addToCartBtn.onclick = () => {
                if (!islogin) {
                    alert('Bạn cần phải đăng nhập');
                    return;
                }

                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const selectedSize = modalProductSize.value;
                const price = selectedSize === 'M' ? productPriceM : productPriceL;

                cart.push({
                    name: productName,
                    size: selectedSize,
                    price,
                    image: productImage,
                });

                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Sản phẩm đã được thêm vào giỏ hàng');
                productModal.style.display = 'none';
            };
        });
   
    });

    // Close modal functionality
    closeProductModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Logout button functionality
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('accounts');
        document.getElementById('loginLink').innerText = 'Đăng nhập';
        document.getElementById('login-item').classList.remove('logged-in');
        islogin = false;
    });

    // Cart visibility toggle
    document.getElementById('lg-bag').addEventListener('click', () => {
        document.getElementById('shopping-cart').style.display = 'block';
        populateCart(); // Update cart items dynamically
    });

    document.getElementById('cart-back').addEventListener('click', () => {
        document.getElementById('shopping-cart').style.display = 'none';
    });

    // Function to populate the cart dynamically
    function populateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTable = document.querySelector('#cart tbody');
        cartTable.innerHTML = ''; // Clear existing items

        cart.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td><a href="#" class="remove-item" data-index="${index}"><i class="fa-regular fa-circle-xmark"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString('vi-VN')}</td>
                <td>${item.size}</td>
            `;
            cartTable.appendChild(row);
        });

        // Add event listeners to remove items
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const index = button.dataset.index;
                cart.splice(index, 1); // Remove item from cart
                localStorage.setItem('cart', JSON.stringify(cart));
                populateCart(); // Refresh cart display
            });
        });
    }
});

// Hàm tính toán và cập nhật tổng phụ và tổng tiền trong giỏ hàng
function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price;
    });

    // Cập nhật tổng phụ của giỏ hàng trên giao diện
    document.getElementById('cartSubtotal').textContent = `${subtotal.toLocaleString()} VND`;

    // Tính và hiển thị tổng tiền (ban đầu bằng tổng phụ)
    const couponCode = document.getElementById('couponCode').value.trim();
    let total = subtotal;

    if (couponCode === 'sinhviensgu') {
        total = subtotal * 0.8; // Áp dụng giảm giá 20%
    }

    document.getElementById('cartTotal').textContent = `${total.toLocaleString()} VND`;
}

// Lắng nghe sự kiện nhấn nút áp dụng mã giảm giá
document.getElementById('applyCoupon').addEventListener('click', () => {
    updateCartTotals();
});

// Hàm hiển thị sản phẩm trong giỏ hàng
function populateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.querySelector('#cart tbody');
    cartTable.innerHTML = ''; // Xóa các mục đã có

    cart.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name} (Size: ${item.size})</td>
            <td>${item.price.toLocaleString()} VND</td>
            <td>1</td>
            <td>${item.price.toLocaleString()} VND</td>
        `;

        cartTable.appendChild(row);
    });

    // Thêm sự kiện lắng nghe cho nút xóa từng mục
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            populateCart();
            updateCartTotals();
        });
    });

    updateCartTotals(); // Cập nhật tổng tiền sau khi hiển thị giỏ hàng
}

// Khởi tạo giỏ hàng và tổng tiền
populateCart();

//  lấy địa chỉ mặc định
document.getElementById('lg-bag').addEventListener('click', () =>{
    console.log("abc");
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const loggedInEmail = document.getElementById('loginLink').innerText; // Giả sử bạn có phần tử hiển thị email đã đăng nhập
    if (accounts.length > 0) {
        const currentUser = accounts.find(acc => acc.email === loggedInEmail);

        if (currentUser) {
            // Lấy địa chỉ từ tài khoản
            const address = currentUser.address;
            document.getElementById('addressInput').value = address; 
            document.getElementById('defaultAddressDisplay').innerText = `Địa chỉ mặc định: ${address}`;
        } else {
            document.getElementById('defaultAddressDisplay').innerText = "Địa chỉ mặc định: Chưa có";
        }
    }
});

// Thanh toán

document.getElementById('payButton').addEventListener('click', () => {
    const cartTableBody = document.querySelector('#cart tbody');
    // const paidProductList = document.getElementById('paidProductList');
    const paidProductList = document.querySelector('#paidProductList table');


    // Kiểm tra xem có sản phẩm trong giỏ hàng hay không
    if (cartTableBody.rows.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
    }

    // Lấy danh sách sản phẩm từ giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const paidProducts = [];

    // Lặp qua các sản phẩm trong giỏ hàng
    Array.from(cartTableBody.rows).forEach(row => {
        const productName = row.cells[2].innerText; // Tên sản phẩm
        const productPrice = row.cells[3].innerText; // Giá sản phẩm
        const productImage = row.cells[1].querySelector('img').src; // Hình ảnh sản phẩm
        const productQuantity = row.cells[4].innerText;

        // Tạo đối tượng sản phẩm đã thanh toán
        const paidProduct = {
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: productQuantity
        };

        // Thêm sản phẩm vào danh sách đã thanh toán
        paidProducts.push(paidProduct);

        // Tạo một phần tử mới cho sản phẩm đã thanh toán
        const paidProductItem = document.createElement('tr');
        paidProductItem.innerHTML = ` 
                        <td><img src="${productImage}" alt=""></td>
                        <td>${productName}</td>
                        <td>${productPrice}</td>
                        <td>${productQuantity}</td>
                        <td>Chưa sử lí</td>`;
        
        // Thêm sản phẩm vào danh sách đã thanh toán
        paidProductList.appendChild(paidProductItem);
    });

    // Cập nhật localStorage: xóa giỏ hàng và lưu danh sách sản phẩm đã thanh toán
    localStorage.setItem('cart', JSON.stringify([])); // Xóa giỏ hàng
    localStorage.setItem('paidProducts', JSON.stringify(paidProducts)); // Lưu sản phẩm đã thanh toán

    // Xóa tất cả sản phẩm trong giỏ hàng
    cartTableBody.innerHTML = '';

    // Thông báo thành công
    alert("Thanh toán thành công!");
});