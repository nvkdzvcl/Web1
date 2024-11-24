// Format tiền việt
function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Đơn hàng
// Trang đơn hàng
document.querySelector('.view-order').addEventListener('click', () => {
    document.querySelector('.order-content').style.display = 'flex';
    document.querySelector('.statistic-content').style.display ='none';
    document.querySelector('.product-content').style.display = 'none' ;
});


// In danh sách đơn hàng và phân trang
let currentPageOrder = 1;
let itemOrderPerPage = 9;

function displayOrders(currentPageOrder) {
    const orderList = document.querySelector('.order-list');
    orderList.innerHTML = ''; // Xóa danh sách cũ trước khi hiển thị lại

    // Lấy danh sách đơn hàng
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Lấy danh sách sản phẩm
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Lấy danh sách địa chỉ
    let address = JSON.parse(localStorage.getItem('address')) || [];

    // Lọc sản đơn hàng
    const customerIdFilter = parseInt(document.getElementById('customer-id').value);    // Nếu mã khách hàng là "" thì customerIdFilter là NaN
    const statusFilter = document.getElementById('status-filter-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const districtFilter = document.getElementById('district-filter').value;


    // Kiểm tra mã khách hàng
    if (!isNaN(customerIdFilter)) {
        orders = orders.filter(order => order.customerId === customerIdFilter);
    }

    // Kiểm tra trạng thái
    if(statusFilter !== 'all'){
        orders = orders.filter(order => order.status === statusFilter);
    }

    // Kiểm tra khoảng thời gian
    if(startDate){
        orders = orders.filter(order => new Date(order.date) >= new Date(startDate));
    }
    if(endDate){
        orders = orders.filter(order => new Date(order.date) <= new Date(endDate));
    }

    // Kiểm tra theo quận
    if(districtFilter !== 'all'){
        orders = orders.filter(order => {
            let customerAddress = address.find(add => add.customerId == order.customerId);
            if(customerAddress){
                return customerAddress.district == districtFilter;
            }
            return false;
        });
    }
    
    
    let startIndex = (currentPageOrder - 1) * itemOrderPerPage;
    let endIndex = Math.min(startIndex + itemOrderPerPage, orders.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        let totalCost = 0;
        orders[i].orderItems.forEach(orderItem => {
            let product = products.find(product => product.id === orderItem.productId);
            if (product) {
                // Duyệt qua các kích thước và tính giá tổng cho mỗi kích thước
                orderItem.sizes.forEach(size => {
                    let sizeData = product.sizes.find(pSize => pSize.size === size.size);
                    if (sizeData) {
                        totalCost += sizeData.price * size.quantity;
                    }
                });
            }
        });


        let order = `
            <tr class="order-item" onclick="showOrderDetail(${orders[i].id})">
                <td>${orders[i].id}</td>
                <td>${orders[i].customerId}</td>
                <td>${orders[i].date}</td>
                <td>${orders[i].status}</td>
                <td>${formatCurrencyVND(totalCost)}</td>
            </tr>
        `;

        orderList.innerHTML += order;
    }

    displayPagination(orders.length);
}

// Hiển thị phân trang
function displayPagination(totalOrders) {
    const pagination = document.querySelector('.pagination-order');
    pagination.innerHTML = '';

    let totalPages = Math.ceil(totalOrders / itemOrderPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        let pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('pagination-btn');
        pageBtn.addEventListener('click', () => {
            currentPageOrder = i;
            displayOrders(currentPageOrder);
        });
        pagination.appendChild(pageBtn);
    }
}

// In danh sách sản phẩm
displayOrders(currentPageOrder);

// Hàm để hiển thị chi tiết đơn hàng khi click
function showOrderDetail(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const address = JSON.parse(localStorage.getItem('address')) || [];

    order = orders.find(o => o.id === orderId);

    let orderDetails = {
        customerId: order.customerId,
        date: order.date,
        PaymentType: order.PaymentType,
        prods: []
    };

    let totalCost = 0;
    order.orderItems.forEach(orderItem => {
        let product = products.find(p => p.id === orderItem.productId);
        if(product) {
            let sizes = [];
            orderItem.sizes.forEach(size => {
                let pSize = product.sizes.find(pSize => pSize.size === size.size);
                if(pSize) {
                    sizes.push({
                        size: pSize.size,
                        quantity: size.quantity,
                        price: pSize.price
                    });
                }
            });
            
            let prodCost = sizes.reduce((sum, size) => sum + size.price * size.quantity, 0);

            orderDetails.prods.push({
                productId: product.id,
                name: product.name,
                sizes: sizes,
                prodCost: prodCost
            });
            totalCost += prodCost;
        }
        
    });

    // dia chi
    const add = address.find(a => a.customerId === order.customerId);

    // In ra chi tiet don hang
    // Header
    const orderHeader = document.querySelector('.order-header');
    orderHeader.innerHTML = `
        <h2>Chi tiết đơn hàng</h2>
        <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
        <p><strong>Mã khách hàng:</strong> ${orderDetails.customerId}</p>
        <p><strong>Số điện thoại:</strong> ${add.phone}</p>
        <p><strong>Thời gian đặt:</strong> ${orderDetails.date}</p>
        <p><strong>Hình thức thanh toán:</strong> ${orderDetails.PaymentType}</p>
        <p><strong>Địa chỉ:</strong> ${add ? add.street + ', ' + add.ward + ', ' + add.district + ', ' + add.province : 'Không tìm thấy địa chỉ'}</p>
        <button class="btn-close-order-detail" onclick = "closeOrderDetail()">+</button>
    `;

    // tbody
    const orderItemsBody = document.querySelector('#order-items-tbody');
    orderItemsBody.innerHTML = '';
    orderDetails.prods.forEach(prod => {
        let count = prod.sizes.length;
        let row = `
            <tr>
                <td rowspan="${count}">${prod.productId}</td>
                <td rowspan="${count}">${prod.name}</td>
                <td>${prod.sizes[0].size}</td>
                <td>${prod.sizes[0].quantity}</td>
                <td>${formatCurrencyVND(prod.sizes[0].price)}</td>
                <td rowspan="${count}">${formatCurrencyVND(prod.prodCost)}</td>
            </tr>
        `;
        for (let i = 1; i < count; i++) {
            row += `
                <tr>
                    <td>${prod.sizes[i].size}</td>
                    <td>${prod.sizes[i].quantity}</td>
                    <td>${formatCurrencyVND(prod.sizes[i].price)}</td>
                </tr>
            `;
        }
        orderItemsBody.innerHTML += row;
    });

    // trang thai
    const orderDetailStatus = document.querySelector('.order-detail-status-main');
    orderDetailStatus.innerHTML = `
        <label for=""><strong>Trạng thái:</strong></label>
        <select id="order-detail-status">
            <option value="Chưa liên hệ">Chưa liên hệ</option>
            <option value="Đã liên hệ">Đã liên hệ</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy đơn">Đã hủy đơn</option>
        </select>
        <button class="save-status">Lưu</button>
    `;
    document.querySelector('#order-detail-status').value = order.status;

    document.querySelector('.save-status').addEventListener('click',() => {
        const newStatus = document.getElementById('order-detail-status').value;
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            alert("Đã thay đổi trạng thái đơn hàng!");
            displayOrders(currentPageOrder);
        }
    });

    // tong tien
    const orderSummary = document.querySelector('.order-summary');
    orderSummary.innerHTML = '';
    orderSummary.innerHTML += `
        <p><strong>Tổng tiền:</strong> ${formatCurrencyVND(totalCost)}</p>
    `;

    // hien thi chi tiet don hang
    document.querySelector('.order-detail').style.display = 'block';
}

function closeOrderDetail() {
    document.querySelector('.order-detail').style.display = 'none';
}


// Thêm sự kiện cho áp dụng
const orderFilterButton = document.querySelector('.apply-filter-btn');

orderFilterButton.addEventListener('click', () => {
    
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');

    // Kiểm tra ngày hợp lệ
    if (startDate.value > endDate.value) {
        alert('Ngày không hợp lệ!');
        startDate.focus();
        return; // Dừng lại nếu ngày không hợp lệ
    }

    // Gọi lại hàm hiển thị đơn hàng nếu ngày hợp lệ
    displayOrders(1);
    
});

