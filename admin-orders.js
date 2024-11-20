// Đơn hàng
// Trang đơn hàng
document.querySelector('.view-order').addEventListener('click', () => {
    document.querySelector('.order-content').style.display = 'flex';
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
            <tr class="order-item">
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

// Thêm sự kiện để hiện chi tiết đơn hàng của khách hàng
const orderItems = document.querySelectorAll('.order-item');
orderItems.forEach(orderItem => {
    orderItem.addEventListener('click', () => {
        console.log('Hiện chi tiết sản phẩm ở đây!');
    });
});

// Tạo thống kê mặt hàng
function displayStatisticType() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

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
    
                orderItem.sizes.forEach(size => {
                    statisticType[type].quantity += size.quantity;
                    let price = product.sizes.find(pSize => pSize.size === size.size)?.price || 0;
                    statisticType[type].totalCost += size.quantity * price;
                });

            } 
        });
    });

    // Hiển thị thông tin thống kê trong bảng
    const statisticTableBody = document.querySelector('.statistic-table tbody');
    statisticTableBody.innerHTML = ''; // Xóa dữ liệu cũ trước khi hiển thị

    for(let type in statisticType) {
        statisticTableBody.innerHTML += `
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
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Chưa xong

}


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



