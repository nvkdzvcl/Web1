// Đơn hàng
// Trang đơn hàng
document.querySelector('.view-order').addEventListener('click', () => {
    document.querySelector('.order-content').style.display = 'flex';
    document.querySelector('.statistic-content').style.display ='none';
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
                <td>${totalCost}đ</td>
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
                <td>${prod.sizes[0].price}</td>
                <td rowspan="${count}">${prod.prodCost}</td>
            </tr>
        `;
        for (let i = 1; i < count; i++) {
            row += `
                <tr>
                    <td>${prod.sizes[i].size}</td>
                    <td>${prod.sizes[i].quantity}</td>
                    <td>${prod.sizes[i].price}</td>
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
        <p><strong>Tổng tiền:</strong> ${totalCost}</p>
    `;

    // hien thi chi tiet don hang
    document.querySelector('.order-detail').style.display = 'block';
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

// thong ke
function filterOrdersByDate(orders){
    const startDate = document.querySelector('#start-date-filter').value;
    const endDate = document.querySelector('#end-date-filter').value;

    if (new Date(startDate) > new Date(endDate)) {
        alert('Ngày không hợp lệ!');
        startDate.focus();
        return orders;
    }

    if(startDate){
        orders = orders.filter(order => new Date(order.date) >= new Date(startDate));

    }
    
    if(endDate){
        orders = orders.filter(order => new Date(order.date) <= new Date(endDate));
    }

    return orders;

}
// Tạo thống kê mặt hàng
function displayStatisticType() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    orders = filterOrdersByDate(orders);
    console.log(orders);

    let statisticType = {};
    orders.forEach(order => {
        order.orderItems.forEach(orderItem => {
            let product = products.find(p => p.id === orderItem.productId);
            
            if(product) {
                let type = product.type;
    
                // Nếu loại mặt hàng chưa tồn tại trong thống kê thì khởi tạo
                if(!statisticType[type]){
                    statisticType[type] = {
                        quantity: 0,
                        totalCost: 0,
                    }
                }
                
                let sizes = orderItem.sizes;
                sizes.forEach(size => {
                    statisticType[type].quantity += size.quantity;
                    let price = 0;
                    let pSize = product.sizes.find(pSize => pSize.size === size.size);
                    if(pSize){
                        price = pSize.price;
                    }   
                    statisticType[type].totalCost += size.quantity * price;
                });

            } 
        });
    });

    // Hiển thị thông tin thống kê trong bảng
    const statisticTableType = document.querySelector('.statistic-table-type tbody');
    statisticTableType.innerHTML = ''; // Xóa dữ liệu cũ trước khi hiển thị

    for(let type in statisticType) {
        statisticTableType.innerHTML += `
            <tr>
                <td>${type}</td>
                <td>${statisticType[type].quantity}</td>
                <td>${statisticType[type].totalCost}đ</td>
            </tr>
        `;
    }
}


// Tạo thống kê theo sản phẩm
function displayStatisticProduct() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    orders = filterOrdersByDate(orders);

    // Chưa xong
    let statisticProduct = {};
    orders.forEach(order => {
        order.orderItems.forEach(orderItem => {
            let product = products.find(p => p.id === orderItem.productId);
            // Kiểm tra xem product có lấy được không
            if(product){
                if(!statisticProduct[product.id]) {
                    statisticProduct[product.id] = {
                        name: product.name,
                        quantity: 0,
                        totalCost: 0
                    }
                }

                orderItem.sizes.forEach(size => {
                    // Lay so luong
                    statisticProduct[product.id].quantity += size.quantity;
                    let price = 0;

                    let pSize = product.sizes.find(pSize => pSize.size === size.size);
                    if(pSize){
                        price = pSize.price;
                    }

                    statisticProduct[product.id].totalCost += size.quantity * price;
                });
            }
        });
    });
    // Hiển thị thông tin thống kê trong bảng
    const statisticTableProduct = document.querySelector('.statistic-table-product tbody');
    statisticTableProduct.innerHTML = '';   // Xoa thong tin cu

    for(let id in statisticProduct) {
        statisticTableProduct.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${statisticProduct[id].name}</td>
                <td>${statisticProduct[id].quantity}</td>
                <td>${statisticProduct[id].totalCost}đ</td>
            </tr>
        `;
    }
}

// Tạo thống kê theo khách hàng
function displayStatisticCustomer(){
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const address = JSON.parse(localStorage.getItem('address')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    orders = filterOrdersByDate(orders);

    let statisticCustomer = {};

    orders.forEach(order => {   // Duyet qua danh sach don hang
        let customer = customers.find(cus => cus.id === order.customerId);  // Tim khach hang cua don hang hien tai
        if(customer) {  // Ton tai khach hang
            let customerId = customer.id;
            if(!statisticCustomer[customerId]){
                let customerAddress = address.find(add => add.customerId === customerId);
                if(customerAddress) {
                    statisticCustomer[customerId] = {
                        name: customerAddress.fullname,
                        quantity: 0,
                        totalSpent: 0
                    }
                } 
                else {
                    statisticCustomer[customerId] = {
                        name: 'Chưa có thông tin',
                        quantity: 0,
                        totalSpent: 0
                    }
                }
            }

            order.orderItems.forEach(orderItem => {
                let product = products.find(p => p.id === orderItem.productId);
                if(product) {
                    orderItem.sizes.forEach(size => {
                        statisticCustomer[customerId].quantity += size.quantity;
    
                        let price = 0;
                        let pSize = product.sizes.find(pSize => pSize.size === size.size);
                        if(pSize) {
                            price = pSize.price;
                        }
                        statisticCustomer[customerId].totalSpent += size.quantity * price;
                    });
                }
            });
            
            
        }
    });
    
    const statisticTableCustomer = document.querySelector('.statistic-table-customer tbody');
    statisticTableCustomer.innerHTML = '';

    for(let id in statisticCustomer) {
        statisticTableCustomer.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${statisticCustomer[id].name}</td>
                <td>${statisticCustomer[id].quantity}</td>
                <td>${statisticCustomer[id].totalSpent}đ</td>
            </tr>
        `;
    }
}

// Trang thống kê
document.querySelector('.view-statistic').addEventListener('click', () => {
    document.querySelector('.statistic-content').style.display = 'flex';
    document.querySelector('.order-content').style.display = 'none';

});

// Thêm sự kiện cho nút xem thống kê của mặt hàng
const statisticTypeButton = document.querySelector('.statistic-type-btn');
statisticTypeButton.addEventListener('click', () => {
    document.querySelector('.statistic-type').style.display = 'block';
    document.querySelector('.statistic-product').style.display = 'none';
    document.querySelector('.statistic-customer').style.display = 'none';
    displayStatisticType();
});

// Thêm sự kiện cho nút xem thống kê của sản phẩm
const statisticProductButton = document.querySelector('.statistic-product-btn');
statisticProductButton.addEventListener('click', () => {
    document.querySelector('.statistic-product').style.display = 'block';
    document.querySelector('.statistic-type').style.display = 'none';
    document.querySelector('.statistic-customer').style.display = 'none';
    displayStatisticProduct();
});

// Thêm sự kiện cho nút xem thống kê của khách hàng
const statisticCustomerButton = document.querySelector('.statistic-customer-btn');
statisticCustomerButton.addEventListener('click', () => {
    document.querySelector('.statistic-customer').style.display = 'block';
    document.querySelector('.statistic-type').style.display = 'none';
    document.querySelector('.statistic-product').style.display = 'none';
    displayStatisticCustomer();
});



