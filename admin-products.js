// Lắng nghe sự kiện hiển thị sản phẩm
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
                <button onclick="deleteProduct(${product.id})">Delete</button>
                <button onclick="editImgProduct(${product.id})">Edit img</button>
            </td>
        `;
        container.appendChild(productElement);
    });
}

// Hàm thay đổi ảnh sản phẩm
function editImgProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        // Tạo một form input file để người dùng chọn ảnh mới
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        // Khi người dùng chọn ảnh mới
        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (file) {
                const newImage = URL.createObjectURL(file);
                product.image = newImage;

                // Lưu lại ảnh mới vào localStorage
                saveToLocalStorage(products);

                // Cập nhật lại giao diện
                paginate(products);
            }
        });

        // Mở hộp thoại chọn ảnh
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
    paginate(products); // Gọi hàm phân trang sau khi thêm sản phẩm
}

// Sửa sản phẩm
// Sửa sản phẩm
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
        // Nhập thông tin mới cho sản phẩm
        const newName = prompt("Enter new product name:", product.name);
        const newType = prompt("Enter new product type:", product.type);

        // Kiểm tra số lượng size của sản phẩm
        const sizes = product.sizes;
        let updatedSizes = [];

        // Nếu sản phẩm có 1 size duy nhất
        if (sizes.length === 1) {
            // Chỉ hỏi giá cho size duy nhất
            const size = sizes[0].size;
            let newPrice = prompt(`Enter new price for size ${size}:`, sizes[0].price);

            // Kiểm tra và cập nhật giá mới cho size
            if (newPrice && !isNaN(newPrice)) {
                updatedSizes = [{ size: size, price: parseInt(newPrice) }];
            } else {
                updatedSizes = sizes; // Không thay đổi giá nếu nhập không hợp lệ
            }
        } 
        // Nếu sản phẩm có 2 size (ví dụ: S và M)
        else if (sizes.length === 2) {
            const newPriceS = prompt("Enter new price for size S (leave blank if no change):", sizes.find(s => s.size === 'S')?.price || "");
            const newPriceM = prompt("Enter new price for size M (leave blank if no change):", sizes.find(s => s.size === 'M')?.price || "");

            // Cập nhật lại các giá trị của sản phẩm
            updatedSizes = sizes.map(size => {
                if (size.size === 'S' && newPriceS !== "") {
                    size.price = isNaN(newPriceS) ? size.price : parseInt(newPriceS);
                }
                if (size.size === 'M' && newPriceM !== "") {
                    size.price = isNaN(newPriceM) ? size.price : parseInt(newPriceM);
                }
                return size;
            });
        } 
        // Nếu sản phẩm có nhiều hơn 2 size
        else {
            // Nếu sản phẩm có nhiều size (S, M, L), yêu cầu nhập giá cho từng size
            const newPriceS = prompt("Enter new price for size S (leave blank if no change):", sizes.find(s => s.size === 'S')?.price || "");
            const newPriceM = prompt("Enter new price for size M (leave blank if no change):", sizes.find(s => s.size === 'M')?.price || "");
            const newPriceL = prompt("Enter new price for size L (leave blank if no change):", sizes.find(s => s.size === 'L')?.price || "");

            // Cập nhật lại các giá trị của sản phẩm
            updatedSizes = sizes.map(size => {
                if (size.size === 'S' && newPriceS !== "") {
                    size.price = isNaN(newPriceS) ? size.price : parseInt(newPriceS);
                }
                if (size.size === 'M' && newPriceM !== "") {
                    size.price = isNaN(newPriceM) ? size.price : parseInt(newPriceM);
                }
                if (size.size === 'L' && newPriceL !== "") {
                    size.price = isNaN(newPriceL) ? size.price : parseInt(newPriceL);
                }
                return size;
            });
        }

        if (newName && newType && updatedSizes.length > 0) {
            // Cập nhật lại các giá trị của sản phẩm
            product.name = newName;
            product.type = newType;
            product.sizes = updatedSizes;

            // Lưu lại danh sách sản phẩm đã được sửa đổi vào localStorage
            saveToLocalStorage(products);

            // Hiển thị lại danh sách sản phẩm mới với phân trang
            paginate(products); // Gọi hàm phân trang lại sau khi sửa sản phẩm
        } else {
            alert("Please enter valid data.");
        }
    } else {
        alert("Product not found.");
    }
}

// Xóa sản phẩm
function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        let products = getProducts();
        products = products.filter(product => product.id !== productId);
        saveToLocalStorage(products);
        paginate(products); // Gọi hàm phân trang lại sau khi xóa sản phẩm
    }
}

// Hàm tìm kiếm sản phẩm
function searchProduct() {
    const name = document.getElementById('searchproductname').value.toLowerCase();
    const size = document.getElementById('searchproductsize').value;
    const type = document.getElementById('searchproductype').value;

    let filteredProducts = getProducts();

    if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name));
    if (size !== "all") filteredProducts = filteredProducts.filter(p => p.sizes.some(s => s.size.toLowerCase() === size.toLowerCase()));
    if (type !== "all") filteredProducts = filteredProducts.filter(p => p.type.toLowerCase() === type.toLowerCase());

    paginate(filteredProducts); // Gọi hàm phân trang cho kết quả tìm kiếm
}

// Lắng nghe sự kiện tìm kiếm
document.getElementById('searchproductname').addEventListener('input', searchProduct);
document.getElementById('searchproductsize').addEventListener('change', searchProduct);
document.getElementById('searchproductype').addEventListener('change', searchProduct);

// Lắng nghe sự kiện thêm sản phẩm
document.querySelector('.add form button').addEventListener('click', handleAddProduct);

// Lắng nghe sự kiện chọn "All" cho size và điều chỉnh trạng thái các size khác
document.getElementById('size-all').addEventListener('change', function () {
    const allSelected = this.checked;
    document.getElementById('size-s').disabled = allSelected;
    document.getElementById('size-m').disabled = allSelected;
    document.getElementById('size-l').disabled = allSelected;
    if (allSelected) {
        document.getElementById('size-s').checked = true;
        document.getElementById('size-m').checked = true;
        document.getElementById('size-l').checked = true;
    }
});

// Khi chọn một size, bỏ chọn "All"
document.querySelectorAll('input[name="size"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        if (document.getElementById('size-all').checked) {
            document.getElementById('size-all').checked = false;
        }
    });
});

// Hàm phân trang: Chia danh sách sản phẩm thành các trang
let currentPage = 1;
const productsPerPage = 10; // Mỗi trang sẽ hiển thị tối đa 10 sản phẩm

function paginate(products) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    renderProductList(currentProducts);

    // Cập nhật trạng thái của nút "Prev" và "Next"
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Hàm xử lý thay đổi trang khi nhấn vào nút "Prev" hoặc "Next"
function changePage(direction) {
    const products = getProducts();
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Thay đổi trang hiện tại theo hướng "Prev" hoặc "Next"
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    paginate(products); // Hiển thị lại trang mới
}

// Lắng nghe sự kiện phân trang
document.getElementById('prev-page').addEventListener('click', () => changePage('prev'));
document.getElementById('next-page').addEventListener('click', () => changePage('next'));

// Đầu tiên, hiển thị trang đầu tiên
paginate(getProducts());
