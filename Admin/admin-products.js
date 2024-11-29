// Lắng nghe sự kiện hiển thị sản phẩm
document.querySelector('.view-product').addEventListener('click', () => {
    document.querySelector('.product-content').style.display = 'flex';
    document.querySelector('.order-content').style.display = 'none';
    document.querySelector('.statistic-content').style.display = 'none';
    document.querySelector('.customer-content').style.display = 'none'; 
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
                <button onclick="openEditForm(${product.id})">Edit</button>
                <button onclick="editImgProduct(${product.id})">Edit img</button>
                <button onclick="deleteProduct(${product.id} )">Delete</button>
            </td>
        `;
        container.appendChild(productElement);
    });
}

// Xử lý khi xóa sản phẩm
function deleteProduct(productId) {
    const confirmation = confirm("Do you want to delete this product?");
    if (confirmation) {
        let products = getProducts();
        products = products.filter(product => product.id !== productId);
        saveToLocalStorage(products);
        alert("Product has been successfully deleted!");
        renderProductList(products);
    } else {
        alert("Product deletion was canceled.");
    }
}

// Thay đổi ảnh sản phẩm
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
                renderProductList(products);
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
    const priceS = parseInt(document.getElementById('price-s-input').value, 10);
    const priceM = parseInt(document.getElementById('price-m-input').value, 10);
    const priceL = parseInt(document.getElementById('price-l-input').value, 10);

    // Kiểm tra nếu checkbox size nào được chọn nhưng giá trị nhập vào không hợp lệ
    if (document.getElementById('size-s').checked && isNaN(priceS)) {
        alert("Please enter a valid price for size S.");
        return;
    }
    if (document.getElementById('size-m').checked && isNaN(priceM)) {
        alert("Please enter a valid price for size M.");
        return;
    }
    if (document.getElementById('size-l').checked && isNaN(priceL)) {
        alert("Please enter a valid price for size L.");
        return;
    }

    const image = document.getElementById('productimage').files.length > 0 
                    ? URL.createObjectURL(document.getElementById('productimage').files[0]) 
                    : '';

    let products = getProducts();
    const lastProductId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    const newProductId = lastProductId + 1;

    const selectedSizes = [];
    // Kiểm tra các checkbox size đã được chọn
    if (document.getElementById('size-s').checked) selectedSizes.push({ size: 'S', price: priceS });
    if (document.getElementById('size-m').checked) selectedSizes.push({ size: 'M', price: priceM });
    if (document.getElementById('size-l').checked) selectedSizes.push({ size: 'L', price: priceL });

    // Kiểm tra xem người dùng đã chọn ít nhất một size chưa
    if (selectedSizes.length === 0) {
        alert("Please select at least one size.");
        return;
    }

    // Tạo sản phẩm mới
    const newProduct = { id: newProductId, name, type, sizes: selectedSizes, image };

    // Lưu sản phẩm vào localStorage và render lại danh sách sản phẩm
    products.push(newProduct);
    saveToLocalStorage(products);
    renderProductList(products);
}

// Tìm kiếm sản phẩm
function searchProduct() {
    const name = document.getElementById('searchproductname').value.toLowerCase();
    const size = document.getElementById('searchproductsize').value;
    const type = document.getElementById('searchproductype').value;

    let filteredProducts = getProducts();
    if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name));
    if (size !== "all") filteredProducts = filteredProducts.filter(p => p.sizes.some(s => s.size.toLowerCase() === size.toLowerCase()));
    if (type !== "all") filteredProducts = filteredProducts.filter(p => p.type.toLowerCase() === type.toLowerCase());

    renderProductList(filteredProducts);
}

// Lắng nghe sự kiện nhấn nút tìm kiếm
document.querySelector('.search button').addEventListener('click', searchProduct);

// Hàm phân trang
let currentPage = 1;
const productsPerPage = 10;

function paginate(products) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    renderProductList(currentProducts);
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Hàm xử lý thay đổi trang khi nhấn vào nút "Prev" hoặc "Next"
function changePage(direction) {
    const products = getProducts();
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

// Hàm để mở modal chỉnh sửa khi nhấn nút "Delete"
function updateProduct() {
    const productId = parseInt(document.getElementById('editProductId').value, 10);
    const name = document.getElementById('editProductName').value;
    const sizeElements = document.querySelectorAll('.editProductSize');  // Get all size fields
    const priceElements = document.querySelectorAll('.editProductPrice');  // Get all price fields
    const imageFile = document.getElementById('editProductImage').files[0];

    // Check if all size and price fields are filled
    const sizes = [];
    for (let i = 0; i < sizeElements.length; i++) {
        const size = sizeElements[i].value;
        const price = parseFloat(priceElements[i].value);
        if (!size || isNaN(price)) {
            alert("Vui lòng nhập đầy đủ thông tin size và giá.");
            return;
        }
        sizes.push({ size, price });
    }

    if (!name || sizes.length === 0) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Lấy danh sách sản phẩm từ localStorage
    let products = getProducts();
    
    // Tìm sản phẩm theo ID và cập nhật thông tin
    let product = products.find(p => p.id === productId);
    
    if (product) {
        product.name = name;
        product.sizes = sizes; // Cập nhật lại thông tin size và giá
        
        // Cập nhật ảnh nếu có
        if (imageFile) {
            product.image = URL.createObjectURL(imageFile); // Tạo URL cho ảnh mới
        }

        // Lưu lại danh sách sản phẩm đã cập nhật vào localStorage
        saveToLocalStorage(products);
        renderProductList(products); // Render lại danh sách sản phẩm sau khi cập nhật
        closeModal(); // Đóng modal
    } else {
        alert("Không tìm thấy sản phẩm.");
    }
}

// Hàm mở modal chỉnh sửa
function openEditForm(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Điền dữ liệu vào form
        document.getElementById('editProductName').value = product.name;
        
        // Clear existing size fields
        const sizeContainer = document.getElementById('size-fields-container');
        sizeContainer.innerHTML = '';  // Clear previous size fields

        // Add size fields dynamically based on product sizes
        product.sizes.forEach((sizeInfo, index) => {
            const sizeField = document.createElement('div');
            sizeField.classList.add('size-field');
            sizeField.innerHTML = `
                <input type="text" class="editProductSize" value="${sizeInfo.size}" placeholder="Size" />
                <input type="number" class="editProductPrice" value="${sizeInfo.price}" placeholder="Price" />
                <button type="button" onclick="removeSizeField(this)">Remove</button>
            `;
            sizeContainer.appendChild(sizeField);
        });

        // Set ảnh mặc định nếu có
        document.getElementById('editProductImage').value = ''; // reset input file
        // Lưu ID sản phẩm để cập nhật sau
        document.getElementById('editProductId').value = product.id;

        // Hiển thị modal
        document.getElementById('editModal').style.display = "block";
    } else {
        alert("Sản phẩm không tìm thấy.");
    }
}

// Hàm để thêm một trường size mới vào form
function addSizeField() {
    const sizeContainer = document.getElementById('size-fields-container');
    const sizeField = document.createElement('div');
    sizeField.classList.add('size-field');
    sizeField.innerHTML = `
        <input type="text" class="editProductSize" placeholder="Size" />
        <input type="number" class="editProductPrice" placeholder="Price" />
        <button type="button" onclick="removeSizeField(this)">Remove</button>
    `;
    sizeContainer.appendChild(sizeField);
}

// Hàm để xóa một trường size
function removeSizeField(button) {
    button.parentElement.remove();
}

// Hàm lấy thông tin sản phẩm theo ID (sử dụng ví dụ hoặc gọi API thực tế)
function getProductById(productId) {
    // Ở đây chúng ta sẽ giả lập một sản phẩm. Bạn có thể thay đổi để lấy từ cơ sở dữ liệu hoặc API thực tế.
    return {
        id: productId,
        name: "Sản phẩm ví dụ",
        size: "M",
        price: "100"
    };
}
// Hàm cập nhật thông tin sản phẩm
function closeModal() {
    document.getElementById('editModal').style.display = "none";
}
