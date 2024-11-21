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
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

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
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const address = JSON.parse(localStorage.getItem('address')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

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



