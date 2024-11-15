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
