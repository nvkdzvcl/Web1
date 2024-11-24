// Lắng nghe sự kiện hiển thị sản phẩm
let filteredProducts = [];
document.querySelector('.view-product').addEventListener('click', () => {
    document.querySelector('.product-content').style.display = 'flex';
    document.querySelector('.order-content').style.display = 'none';
    document.querySelector('.statistic-content').style.display = 'none';
});

// Lấy danh sách sản phẩm từ localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Lưu sản phẩm vào localStorage
function saveToLocalStorage(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render danh sách sản phẩm
function renderProductList(products) {
    const container = document.querySelector('.product-detail');
    container.innerHTML = '';  // Clear previous content

    products.forEach(product => {
        const productElement = document.createElement('tr');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"/></td>
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td>${product.sizes.map(size => size.size).join(', ')}</td>
            <td>${product.sizes.map(size => size.price).join(', ')}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="editImgProduct(${product.id})">Edit img</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        container.appendChild(productElement);
    });
}
// Hàm xóa sản phẩm
function deleteProduct(productId) {
    // Hiển thị hộp thoại xác nhận
    const confirmation = confirm("Do you want to delete this product?");

    // Nếu người dùng chọn "OK", tiếp tục xóa sản phẩm
    if (confirmation) {
        // Lấy danh sách sản phẩm từ localStorage
        let products = getProducts();

        // Tìm sản phẩm cần xóa và lọc nó ra khỏi mảng
        products = products.filter(product => product.id !== productId);

        // Lưu lại danh sách sản phẩm đã cập nhật vào localStorage
        saveToLocalStorage(products);

        // Hiển thị thông báo thành công
        alert("Product has been successfully deleted!");

        // Hiển thị lại danh sách sản phẩm sau khi xóa (có thể cần gọi paginate hoặc renderProductList)
        if (filteredProducts.length === 0) {
            paginate(products); // Phân trang lại nếu không có tìm kiếm
        } else {
            renderProductList(filteredProducts); // Hiển thị kết quả tìm kiếm (không phân trang)
        }
    } else {
        // Nếu người dùng chọn "Cancel", không làm gì cả
        alert("Product deletion was canceled.");
    }
}
document.getElementById('size-all').addEventListener('change', function() {
    const sizeS = document.getElementById('size-s');
    const sizeM = document.getElementById('size-m');
    const sizeL = document.getElementById('size-l');
    
    // Nếu "All" được chọn, vô hiệu hóa các checkbox S, M, L
    if (this.checked) {
        sizeS.disabled = true;
        sizeM.disabled = true;
        sizeL.disabled = true;
        
        // Nếu "All" được chọn, tự động đánh dấu tất cả các checkbox S, M, L là không chọn
        sizeS.checked = false;
        sizeM.checked = false;
        sizeL.checked = false;
    } else {
        sizeS.disabled = false;
        sizeM.disabled = false;
        sizeL.disabled = false;
    }
});

// Xử lý khi các checkbox S, M, L được thay đổi
document.getElementById('size-s').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('size-all').checked = false;
    }
});

document.getElementById('size-m').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('size-all').checked = false;
    }
});

document.getElementById('size-l').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('size-all').checked = false;
    }
});


// Hàm thay đổi ảnh sản phẩm
function editImgProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (file) {
                const newImage = URL.createObjectURL(file);
                product.image = newImage;

                saveToLocalStorage(products);
                paginate(products);
            }
        });

        fileInput.click();
    } else {
        alert("Product not found.");
    }
}

// Thêm sản phẩm mới
function handleAddProduct() {
    const name = document.getElementById('productname').value;
    const type = document.getElementById('Loai').value;
    const priceS = parseInt(document.getElementById('price-s-input').value);
    const priceM = parseInt(document.getElementById('price-m-input').value);
    const priceL = parseInt(document.getElementById('price-l-input').value);
    const image = document.getElementById('productimage').files.length > 0 ? URL.createObjectURL(document.getElementById('productimage').files[0]) : '';

    let products = getProducts();
    const lastProductId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    const newProductId = lastProductId + 1;

    const selectedSizes = [];
    if (document.getElementById('size-all').checked) {
        selectedSizes.push({ size: 'S', price: priceS }, { size: 'M', price: priceM }, { size: 'L', price: priceL });
    } else {
        if (document.getElementById('size-s').checked) selectedSizes.push({ size: 'S', price: priceS });
        if (document.getElementById('size-m').checked) selectedSizes.push({ size: 'M', price: priceM });
        if (document.getElementById('size-l').checked) selectedSizes.push({ size: 'L', price: priceL });
    }

    if (selectedSizes.length === 0) {
        alert("Please select at least one size.");
        return;
    }

    const newProduct = { id: newProductId, name, type, sizes: selectedSizes, image };
    products.push(newProduct);
    saveToLocalStorage(products);

    if (filteredProducts.length === 0) {
        paginate(products); // Phân trang nếu không có tìm kiếm
    } else {
        renderProductList(filteredProducts); // Hiển thị kết quả tìm kiếm (không phân trang)
    }
}

// Hàm tìm kiếm sản phẩm
function searchProduct() {
    const name = document.getElementById('searchproductname').value.toLowerCase();
    const size = document.getElementById('searchproductsize').value;
    const type = document.getElementById('searchproductype').value;

    filteredProducts = getProducts();

    if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name));
    if (size !== "all") filteredProducts = filteredProducts.filter(p => p.sizes.some(s => s.size.toLowerCase() === size.toLowerCase()));
    if (type !== "all") filteredProducts = filteredProducts.filter(p => p.type.toLowerCase() === type.toLowerCase());

    renderProductList(filteredProducts); // Render tất cả các sản phẩm tìm được (không phân trang)
}

// Lắng nghe sự kiện nhấn nút tìm kiếm
document.querySelector('.search button').addEventListener('click', searchProduct);

// Hàm phân trang
let currentPage = 1;
const productsPerPage = 10;

function paginate(products) {
    const productsToPaginate = filteredProducts.length > 0 ? filteredProducts : products;

    const totalPages = Math.ceil(productsToPaginate.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = productsToPaginate.slice(startIndex, endIndex);

    renderProductList(currentProducts);

    // Cập nhật trạng thái của nút "Prev" và "Next"
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Hàm xử lý thay đổi trang khi nhấn vào nút "Prev" hoặc "Next"
function changePage(direction) {
    const products = filteredProducts.length > 0 ? filteredProducts : getProducts();
    const totalPages = Math.ceil(products.length / productsPerPage);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    paginate(products);
}

// Lắng nghe sự kiện phân trang
document.getElementById('prev-page').addEventListener('click', () => changePage('prev'));
document.getElementById('next-page').addEventListener('click', () => changePage('next'));

// Ban đầu, hiển thị trang đầu tiên với danh sách tất cả sản phẩm
paginate(getProducts());
