const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navbar li a');

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


// Lấy các phần tử thanh tìm kiếm
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Hàm để hiển thị sản phẩm dựa trên trang hiện tại và danh mục
function displayProducts(page) {
    // Lấy dữ liệu danh sách sản phẩm từ localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    console.log(products);

    // Lấy danh sách sản phẩm phù hợp với danh mục
    if(currentCategory !== 'Tất cả') {
        products = products.filter(p => p.type === currentCategory);
    }

    
    const query = searchInput.value.trim().toLowerCase();
    console.log(query);
    if(query !== '') {
        // Lọc sản phẩm dựa trên từ khóa tìm kiếm
        products = products.filter(p => p.name.toLowerCase().includes(query));
    }

    // Lọc theo khoảng giá
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    products = products.filter(p => {
        const price = p.sizes[0].price;
        return price >= minPrice && price <= maxPrice;
    });

    // Tính toán chỉ mục bắt đầu và kết thúc
    const start = (page - 1) * productsPerPage;
    const end = Math.min(start + productsPerPage, products.length);

    // Hiển thị sản phẩm trong phạm vi trang hiện tại
    const productContainer = document.querySelector('.pro-container');
    productContainer.innerHTML = '';

    for (let i = start; i < end; i++) {
        productContainer.innerHTML += `
            <div class="pro" data-category="${products[i].type}" onclick = "showProductModal(${products[i].id})">
                <img src="${products[i].image}" alt="">
                <div class="des">
                    <span>${products[i].type}</span>
                    <h5>${products[i].name}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>${products[i].sizes[0].price}</h4>
                </div>
                <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
            </div>
        `;
    }
    


    // Cập nhật phân trang
    updatePagination(products.length);
}

// Hàm để cập nhật hiển thị phân trang
function updatePagination(totalProducts) {
    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.textContent = i;
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

function showProductModal(productId) {
    let products = JSON.parse(localStorage.getItem('products'));

    let product = products.find(p => p.id === productId);

    const productDetail = document.querySelector('.product-details');
    productDetail.innerHTML = '';

    const pImg = document.createElement('div');
    pImg.classList.add('product-image');
    pImg.innerHTML = `<img id="modalProductImage" src="${product.image}" alt="Product Image">`;

    productDetail.appendChild(pImg);

    

    let productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    console.log("hello world");
    productInfo.innerHTML = `
        <h3 id="modalProductName">${product.name}</h3>
        <!-- Số lượng sản phẩm -->
        <label for="quantity">Quantity:</label>
        <div id="quantityWrapper">
            <input type="number" id="modalProductQuantity" value="1" min="1">
        </div>
        <!-- Kích thước sản phẩm -->
        <label for="size">Size:</label>
    `;

    let modalProductSize = document.createElement('select');
    modalProductSize.id = 'modalProductSize';
    product.sizes.forEach(pSize => {
        let opt = document.createElement('option');
        opt.value = pSize.size;
        opt.textContent = `${pSize.size} - ${pSize.price}`;
        modalProductSize.appendChild(opt);
    });
    productInfo.appendChild(modalProductSize);

    const btn = document.createElement('button');
    btn.id = 'addToCartBtn';
    btn.classList.add('btn', 'btn--primary');
    btn.textContent = 'Add to Cart';
    productInfo.appendChild(btn);

    productDetail.appendChild(productInfo);
    const productModal = document.getElementById('productModal');
    productModal.style.display = 'flex';

    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.onclick = function() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || false;
        if (!loggedInUser) {
            alert('Bạn cần phải đăng nhập');
            return;
        }

        const carts = JSON.parse(localStorage.getItem('carts')) || [];


        const sle = document.querySelector('#modalProductSize');
        let price = 0;
        let pSize = product.sizes.find(pSize => pSize.size === sle.value);

        const qua = document.querySelector('#modalProductQuantity');
        carts.push({
            name: product.name,
            size: sle.value,
            price: pSize.price,
            quantity: qua.value,
            image: product.image
        });

        localStorage.setItem('carts', JSON.stringify(carts));
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
        productModal.style.display = 'none';
    }
}

const addToCartBtn = document.getElementById('addToCartBtn');
    // Add to cart functionality


// Khởi tạo hiển thị lần đầu
displayProducts(currentPage);


// Thêm sự kiện click vào nút tìm kiếm
searchButton.addEventListener('click', () => displayProducts(1));


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

    let products = JSON.parse(localStorage.getItem('products'));

    // Tìm các sản phẩm phù hợp với từ khóa
    products.forEach(product => {
        if (product.name.toLowerCase().includes(lowercaseQuery)) {
            suggestions.push(product.name);
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
const searchBar = document.getElementById('search-bar');
document.addEventListener('click', (event) => {
    if (searchBar && !searchBar.contains(event.target)) {
        searchSuggestions.style.display = 'none';
    }
});


//  js cho form đăng nhập đăng kí
document.addEventListener('DOMContentLoaded', (event) => {

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Đọc trạng thái từ localStorage
    if (loggedInUser) {
        document.getElementById('loginLink').innerText = loggedInUser.username; // Hiển thị tên người dùng
        document.getElementById('login-item').classList.add('logged-in'); // Thêm class logged-in
    }

    // Hiển thị form đăng nhập
    document.getElementById('loginLink').addEventListener('click', () => {
        if(!loggedInUser){
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
        let usernameInput = document.querySelector('.login .name'); 
        let passwordInput = document.querySelector('.login .pass');
        let username = usernameInput.value.trim(); 
        let password = passwordInput.value.trim();
    
        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
    
        // Lấy dữ liệu customers từ localStorage
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
        // Tìm kiếm tài khoản có username và password trùng khớp
        let customer = customers.find(cust => cust.username === username && cust.password === password);
    
        if (customer) {
            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem('loggedInUser', JSON.stringify({ username: customer.username }));

            // Thay đổi nội dung phần hiển thị đăng nhập thành username của người dùng
            document.getElementById('loginLink').innerText = customer.username;
            document.querySelector('.modal').style.display = 'none';
    
            // Thêm class 'logged-in' vào phần tử khi đăng nhập thành công
            document.getElementById('login-item').classList.add('logged-in');
    
            // Xóa nội dung trong ô nhập liệu sau khi đăng nhập thành công
            usernameInput.value = "";
            passwordInput.value = "";

            alert('Đăng nhập thành công.')

        } else {
            alert("Tài khoản hoặc mật khẩu không chính xác.");
        }

    });
    

    // Xử lý đăng ký
    document.querySelector('.btn--primary1').addEventListener('click', () => {
        // Lấy các ô nhập liệu từ form đăng ký
        let usernameInput = document.querySelector('.register .name');
        let passwordInput = document.querySelector('.register .pass');
        let confirmPasswordInput = document.querySelector('.register .pass2');
    
        // Lấy giá trị từ các ô nhập liệu
        let username = usernameInput.value.trim();
        let password = passwordInput.value.trim();
        let confirmPassword = confirmPasswordInput.value.trim();
    
        // Kiểm tra các trường nhập liệu không được để trống
        if (!username || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
    
        // Kiểm tra mật khẩu xác nhận có khớp với mật khẩu không
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }
    
        // Lấy dữ liệu customers từ localStorage
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
        // Kiểm tra xem username đã tồn tại chưa
        let existingCustomer = customers.find(cust => cust.username === username);
        if (existingCustomer) {
            alert("Tên người dùng đã tồn tại, vui lòng chọn tên khác");
            return;
        }
    
        // Thêm tài khoản mới vào mảng customers
        customers.push({
            id: customers.length > 0 ? customers[customers.length - 1].id + 1 : 1, // Tự động tăng ID
            username: username,
            password: password,
            status: 'true'
        });
    
        // Lưu dữ liệu mới vào localStorage
        localStorage.setItem('customers', JSON.stringify(customers));
    
        // Xóa nội dung các ô nhập liệu sau khi đăng ký thành công
        usernameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
    
        alert("Đăng ký thành công");
    });
    

    // Xư lý đăng suất
    document.getElementById('logoutButton').addEventListener('click', () => { 
        
        document.getElementById('loginLink').innerText = 'Đăng nhập';
        document.getElementById('login-item').classList.remove('logged-in');
        localStorage.setItem('loggedInUser', JSON.stringify(false));
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


    // Close modal functionality
    const closeProductModal = document.getElementById('closeProductModal');
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
        const carts = JSON.parse(localStorage.getItem('carts')) || [];
        const cartTable = document.querySelector('#cart tbody');
        cartTable.innerHTML = ''; // Clear existing items

        carts.forEach((item, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td><a href="#" class="remove-item" data-index="${index}"><i class="fa-regular fa-circle-xmark"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString('vi-VN')}</td>
                <td>${item.size}</td>
                <td>
                <button class="decrease-qty" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-qty" data-index="${index}">+</button>
                </td>
                <td>${(item.price * item.quantity).toLocaleString()} VND</td>
            `;

            cartTable.appendChild(row);
        });

        // Thêm sự kiện tăng/giảm số lượng
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                carts[index].quantity++;
                localStorage.setItem('carts', JSON.stringify(carts));
                populateCart();
                updateCartTotals();
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                if (carts[index].quantity > 1) {
                    carts[index].quantity--;
                    localStorage.setItem('carts', JSON.stringify(carts));
                    populateCart();
                    updateCartTotals();
                }
            });
        });


        // Add event listeners to remove items
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const index = button.dataset.index;
                carts.splice(index, 1); // Remove item from cart
                localStorage.setItem('carts', JSON.stringify(carts));
                populateCart(); // Refresh cart display
                updateCartTotals(); // Cập nhật tổng tiền
            });
        });

        updateCartTotals(); // Cập nhật tổng phụ và tổng tiền
    }
});

// Hàm tính toán và cập nhật tổng phụ và tổng tiền trong giỏ hàng
function updateCartTotals() {
    const carts = JSON.parse(localStorage.getItem('carts')) || [];
    let subtotal = 0;

    carts.forEach(item => {
        subtotal += item.price * item.quantity; // Giá x số lượng
    });

    document.getElementById('cartSubtotal').textContent = `${subtotal.toLocaleString()} VND`;
    document.getElementById('cartTotal').textContent = `${subtotal.toLocaleString()} VND`;
}





// Thanh toán


// Mở khung thanh toán
document.getElementById('payButton').addEventListener('click', () => {
    const shippingModal = document.querySelector('.ship-modal');
    shippingModal.style.display = 'flex';
})

// đóng khu thanh toán
document.querySelector('.ship-modal__overlay').addEventListener('click', () => {
    const shippingModal = document.querySelector('.ship-modal');
    shippingModal.style.display = 'none'; 
});

document.querySelector('.btn-cart.back').addEventListener('click', () => {
    const shippingModal = document.querySelector('.ship-modal');
    shippingModal.style.display = 'none'; 
});



document.querySelector('.btn-cart.btn--primary1').addEventListener('click', () => {
    const cartTableBody = document.querySelector('#cart tbody');

    // Kiểm tra giỏ hàng trống
    if (cartTableBody.rows.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
    }

    // kiểm tra nhập vào
    const customerName = document.getElementById('customerName').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName || !customerAddress || !customerPhone) {
        alert("Vui lòng nhập đầy đủ thông tin khách hàng (Tên, Địa chỉ và Số điện thoại).");
        return;
    }

    // Kiểm tra định dạng số điện thoại
    const phonePattern = /^[0-9]{10,11}$/;
    if (!phonePattern.test(customerPhone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập 10 hoặc 11 chữ số.");
        return;
    }


    // Lấy giỏ hàng từ localStorage
    const carts = JSON.parse(localStorage.getItem('carts')) || [];

    // Lấy danh sách đơn hàng hiện tại từ localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Lấy loại thanh toán từ select
    const paymentTypeElement = document.getElementById('paymentSelect');
    const paymentTypeValue = paymentTypeElement.value;

    // Đổi tên hiển thị loại thanh toán
    let paymentTypeText = '';
    switch(paymentTypeValue) {
        case 'cash': paymentTypeText = 'Tiền mặt'; break;
        case 'bank-transfer': paymentTypeText = 'Chuyển khoản'; break;
        case 'card': paymentTypeText = 'Thẻ'; break;
    }

    // Tạo đơn hàng mới
    const newOrder = {
        id: orders.length + 1,
        customerId: 1, // Giả sử ID khách hàng cố định
        status: 'Chưa liên hệ',
        date: new Date().toISOString().split('T')[0],
        PaymentType: paymentTypeText,
        orderItems: []
    };

    // Lặp qua các sản phẩm trong giỏ hàng
    Array.from(cartTableBody.rows).forEach(row => {
        const productId = row.getAttribute('data-product-id'); // Giả sử có thuộc tính data-product-id
        const productName = row.cells[2].innerText;
        const productPrice = row.cells[3].innerText;
        const productQuantity = row.cells[4].innerText;
        const productImage = row.cells[1].querySelector('img').src;

        // Thêm vào orderItems
        newOrder.orderItems.push({
            productId: parseInt(productId),
            sizes: [
                { size: 'M', quantity: parseInt(productQuantity) }
            ]
        });

        // Tạo hàng mới cho danh sách đã thanh toán
        const paidProductItem = document.createElement('tr');
        paidProductItem.innerHTML = `
            <td><img src="${productImage}" alt="" width="50"></td>
            <td>${productName}</td>
            <td>${productPrice}</td>
            <td>${productQuantity}</td>
            <td>${paymentTypeText}</td>
        `;

        // Thêm vào bảng sản phẩm đã thanh toán
        document.querySelector('#paidProductList table').appendChild(paidProductItem);
    });

    // Thêm đơn hàng vào danh sách orders và cập nhật localStorage
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('carts', JSON.stringify([])); // Xóa giỏ hàng

    // Xóa giỏ hàng trên giao diện
    cartTableBody.innerHTML = '';

    // Đóng modal và thông báo
    const shippingModal = document.querySelector('.ship-modal');
    shippingModal.style.display = 'none';
    alert("Thanh toán thành công!");
});


// Chọn địa chỉ
    // Map các phường theo quận
    const wardsByDistrict = {
        "district 1": ["Bến Thành","Bến Nghé","Đa Kao","Nguyễn Cư Trinh","Nguyễn Thái Bình","Tân Định","Cô Giang","Cầu Ông Lãnh","Phạm Ngũ Lão","Cầu Kho"],
        "district 2": ["An Lợi Đông","Thảo Điền", "Cát Lái","An Phú","Bình An","Bình Khánh","Bình Trưng Đông","Bình Trưng Tây","An Khánh","Thạnh Mỹ Lợi","Thủ Thiêm"],
        "district 3": ["Phường 1","Phường 2","Phường 3","Phường 4","Phường 5","Phường 9","Phường 10", "Phường 11","Phường 12","Phường 13","Phường 14","Võ Thị Sáu",],
        "district 4": ["Phường 1","Phường 2","Phường 3","Phường 4", "Phường 6","Phường 8","Phường 9","Phường 10","Phường 13","Phường 14","Phường 15","Phường 16","Phường 18",],
        "district 5": ["Phường 1","Phường 2","Phường 4","Phường 5","Phường 7","Phường 9","Phường 11","Phường 12","Phường 13","Phường 14"],
        "district 6": ["Phường 1","Phường 2","Phường 7","Phường 8","Phường 9","Phường 10","Phường 11","Phường 12","Phường 13"],
        "district 7": ["Bình Thuận","Phú Mỹ","Phú Thuận","Tân Hưng","Tân Kiểng","Tân Phong","Tân Phú","Tân Quy","Tân Thuận Đông","Tân Thuận Tây"],
        "district 8": ["Xóm Củi","Hưng Phú","Bình An","Chánh Hưng","Rạch Ông"],
        "district 9": ["Hiệp Phú","Long Bình","Long Phước","Long Thạnh Mỹ","Long Trường","Phú Hữu","Phước Bình","Phước Long A","Phước Long B","Tân Phú","Tăng Nhơn Phú A","Tăng Nhơn Phú B","Trường Thạnh"],
        "district 10": ["Phường 1","Phường 2","Phường 4","Phường 6","Phường 8","Phường 9","Phường 10","Phường 12","Phường 13","Phường 14","Phường 15"],
        "district 11": ["Phường 1","Phường 3","Phường 5","Phường 7","Phường 8","Phường 10","Phường 11","Phường 14","Phường 15","Phường 16"],
        "district 12": ["An Phú Đông","Đông Hưng Thuận","Hiệp Thành","Tân Chánh Hiệp","Tân Hưng Thuận","Tân Thới Hiệp","Tân Thới Nhất","Thạnh Lộc","Thạnh Xuân","Thới An","Trung Mỹ Tây"],
        "district TanBinh": ["Phường 1","Phường 2","Phường 3","Phường 4","Phường 5","Phường 6","Phường 7","Phường 8","Phường 9","Phường 10","Phường 11","Phường 12","Phường 13","Phường 14","Phường 15"],
        "district BinhTan": ["An Lạc","An Lạc A","Tân Tạo","Tân Tạo A","Bình Trị Đông","Bình Trị Đông A","Bình Trị Đông B","Bình Hưng Hòa","Bình Hưng Hòa A"],
        "district BinhThanh": ["Phường 1","Phường 2","Phường 3","Phường 5","Phường 6","Phường 7","Phường 11","Phường 12","Phường 13","Phường 14","Phường 15","Phường 17","Phường 19","Phường 21","Phường 22","Phường 24","Phường 25","Phường 26","Phường 27","Phường 28"],
        "district GoVap": ["Phường 1","Phường 3","Phường 5","Phường 6","Phường 8","Phường 10","Phường 11","Phường 12","Phường 14","Phường 15","Phường 16","Phường 17"],
        "district PhuNhuan": ["Phường 1","Phường 2","Phường 4","Phường 5","Phường 7","Phường 8","Phường 9","Phường 10","Phường 11","Phường 13","Phường 15",],
        "district BinhChanh": ["Thị trấn An Lạc","Xã Qui Đức","Xã Phong Phú","Xã Đa Phước","Xã Bình Hưng","Xã Hưng Long","Xã Tân Quý Tây","Xã An Phú Tây","Xã Bình Chánh","Xã Tân Túc","Xã Tân Nhựt","Xã Tân Kiên","Xã Tân Tạo","Xã Bình Trị Đông","Xã Bình Hưng Hòa","Xã Vĩnh Lộc A","Xã Vĩnh Lộc B","Xã Lê Minh Xuân","Xã Phạm Văn Hai","Xã Bình Lợi"],
        "district HocMon": ["Thị trấn Hóc Môn","Xã Đông Thạnh","Xã Bà Điểm","Xã Nhị Bình","Xã Tân Thới Nhì","Xã Tân Hiệp","Xã Tân Xuân","Xã Thới Tam Thôn","Xã Trung Chánh","Xã Xuân Thới Sơn","Xã Xuân Thới Thượng","Xã Xuân Thới Đông"],
        "district CanGio": ["Xã An Thới Đông","Xã Bình Khánh","Xã Cần Thạnh","Xã Long Hòa","Xã Lý Nhơn","Xã Tam Thôn Hiệp","Xã Thạnh An"],
        "district NhaBe": ["Thị trấn Nhà Bè","Xã Phước Kiển","Xã Phước Lộc","Xã Nhơn Đức","Xã Phú Xuân","Xã Long Thới","Xã Hiệp Phước"]
    };

    // Lấy các phần tử dropdown
    // Xác định dropdown cho quận và phường
    const districtDropdown = document.getElementById('district-dropdown'); // Thay ID phù hợp
    const wardDropdown = document.getElementById('ward-dropdown'); // Thay ID phù hợp

    // Lắng nghe sự kiện thay đổi trên dropdown quận
    districtDropdown.addEventListener('change', () => {
        const selectedDistrict = districtDropdown.value; // Lấy giá trị quận được chọn
        const wards = wardsByDistrict[selectedDistrict] || []; // Lấy danh sách phường theo quận
        
        // Xóa các tùy chọn cũ
        wardDropdown.innerHTML = '<option value="">Chọn Phường / Xã</option>';
        
        // Thêm các tùy chọn mới
        wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward;
            option.textContent = ward;
            wardDropdown.appendChild(option);
        });
    });

    districtDropdown.addEventListener('change', () => {
        const selectedDistrict = districtDropdown.value;
        console.log("Quận được chọn:", selectedDistrict);
        const wards = wardsByDistrict[selectedDistrict] || [];
        console.log("Danh sách phường:", wards);

        wardDropdown.innerHTML = '<option value="">Chọn Phường / Xã</option>';
        wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward;
            option.textContent = ward;
            wardDropdown.appendChild(option);
        });
    });
