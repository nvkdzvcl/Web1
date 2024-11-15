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
