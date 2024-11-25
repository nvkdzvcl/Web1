// Format tiền việt
function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}


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

    let bestSellerType = Number.MIN_SAFE_INTEGER;
    let leastSellerType = Number.MAX_SAFE_INTEGER;
    // Tính số lượng nhiều nhất và ít nhất trong các mặt hàng
    for(let type in statisticType) {
        if(statisticType[type].quantity >= bestSellerType) {
            bestSellerType = statisticType[type].quantity;
        }
        if(statisticType[type].quantity <= leastSellerType) {
            leastSellerType = statisticType[type].quantity;
        }
    }

    // Hiển thị thông tin thống kê trong bảng
    const statisticTableType = document.querySelector('.statistic-table-type tbody');
    statisticTableType.innerHTML = ''; // Xóa dữ liệu cũ trước khi hiển thị
    let totalRevenue = 0;   // Tổng doanh thu
    
    for(let type in statisticType) {
        totalRevenue += statisticType[type].totalCost;  // Tính tổng doanh thu
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${type}</td>
            <td>${statisticType[type].quantity}</td>
            <td>${formatCurrencyVND(statisticType[type].totalCost)}</td>
        `;

        if(statisticType[type].quantity === bestSellerType) {
            row.classList.add('best-seller-type');
        }
        if(statisticType[type].quantity === leastSellerType) {
            row.classList.add('least-seller-type');
        }

        statisticTableType.appendChild(row);
    }
    const tableTfootRevenue = document.querySelector('.statistic-table-type tfoot');
    tableTfootRevenue.innerHTML = `
        <tr>
            <td colspan="2"><strong>Tổng thu:</strong></td>
            <td class="total-revenue">${formatCurrencyVND(totalRevenue)}</td>
        </tr>
    `;
}



// Tạo thống kê theo khách hàng
let currentPageStatistic = 1;
let itemStatisticPerPage = 9;

function displayStatisticCustomer(){
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const address = JSON.parse(localStorage.getItem('address')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    orders = filterOrdersByDate(orders);

    let statisticCustomerArray = [];

    orders.forEach(order => {   // Duyet qua danh sach don hang
        let customer = customers.find(cus => cus.id === order.customerId);  // Tim khach hang cua don hang hien tai
        if(customer) {  // Ton tai khach hang
            let customerId = customer.id;
            let index = statisticCustomerArray.findIndex(o => o.customerId === customerId);

            if(index == -1) {
                index = statisticCustomerArray.length;
                let add = address.find(a => a.customerId === customerId);
                statisticCustomerArray.push({
                    customerId: customer.id,
                    name: add.fullname,
                    quantity: 0,
                    totalSpent: 0
                });
            }

            order.orderItems.forEach(orderItem => {
                let product = products.find(p => p.id === orderItem.productId);
                if(product) {
                    orderItem.sizes.forEach(size => {
                        statisticCustomerArray[index].quantity += size.quantity;
    
                        let price = 0;
                        let pSize = product.sizes.find(pSize => pSize.size === size.size);
                        if(pSize) {
                            price = pSize.price;
                        }
                        statisticCustomerArray[index].totalSpent += size.quantity * price;
                    });
                }
            });
            
            
        }
    });
    
    const statisticTableCustomer = document.querySelector('.statistic-table-customer tbody');
    statisticTableCustomer.innerHTML = '';

    let startIndex = (currentPageStatistic - 1) * itemStatisticPerPage;
    let endIndex = Math.min(startIndex + itemStatisticPerPage, statisticCustomerArray.length);

    for(let i = startIndex; i < endIndex; i++) {
        statisticTableCustomer.innerHTML += `
            <tr onclick = "showCustomerDetail(${statisticCustomerArray[i].customerId})">
                <td>${statisticCustomerArray[i].customerId}</td>
                <td>${statisticCustomerArray[i].name}</td>
                <td>${statisticCustomerArray[i].quantity}</td>
                <td>${formatCurrencyVND(statisticCustomerArray[i].totalSpent)}</td>
            </tr>
        `;
    }
    displayStatisticCustomerPagination(statisticCustomerArray.length);
    displayHighestPayingCustomers(statisticCustomerArray);
}

// Hàm in ra danh sách 3 khách hàng mua hàng với tổng tiển cao nhất
let topCustomer = 3;
function displayHighestPayingCustomers (statisticCustomerArray) {   // Nhận vào 1 mảng có cấu trúc {customerId, name, quantity, totalSpent}
    // Sắp xếp mảng theo thứ tự giảm dần (theo totalSpent)
    statisticCustomerArray.sort((a, b) => b.totalSpent - a.totalSpent);
    
    const tableTopCustomer = document.querySelector('.statistic-table-top-customers tbody');
    tableTopCustomer.innerHTML = '';

    for(let i = 0; i < topCustomer; i++) {
        tableTopCustomer.innerHTML += `
            <tr onclick = "showCustomerDetail(${statisticCustomerArray[i].customerId})">
                <td>${statisticCustomerArray[i].customerId}</td>
                <td>${statisticCustomerArray[i].name}</td>
                <td>${statisticCustomerArray[i].quantity}</td>
                <td>${formatCurrencyVND(statisticCustomerArray[i].totalSpent)}</td>
            </tr>
        `;
    }

}

function displayStatisticCustomerPagination(totalCustomer) {
    let pagination = document.querySelector('.statistic-pagination');
    pagination.innerHTML = '';

    let totalPages = Math.ceil(totalCustomer / itemStatisticPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        let pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('statistic-pagination-btn');
        pageBtn.addEventListener('click', () => {
            currentPageStatistic = i;
            displayStatisticCustomer();
        });
        if(i === currentPageStatistic) {
            pageBtn.className = 'active-pagination-btn';
        }
        pagination.appendChild(pageBtn);
    }
}

function showCustomerDetail(customerId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let address = JSON.parse(localStorage.getItem('address')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let customers = JSON.parse(localStorage.getItem('customers')) || [];

    let add = address.find(a => a.customerId === customerId);

    orders = orders.filter(o => o.customerId === customerId);

    let customerDetail = {
        customerId: customerId,
        customerName: add.fullname,
        phone: add.phone,
        ords: [],
        totalSpent: 0,
    };

    orders.forEach(order => {
        let quantity = 0;
        let totalCost = 0;
        order.orderItems.forEach(orderItem => {
            let product = products.find(p => p.id === orderItem.productId);
            orderItem.sizes.forEach(size => {
                quantity += size.quantity;
                let pSize = product.sizes.find(pSize => pSize.size === size.size);
                totalCost += size.quantity * pSize.price;
                customerDetail.totalSpent += size.quantity * pSize.price;
            });
        });

        customerDetail.ords.push({
            orderId: order.id,
            quantity: quantity,
            totalCost: totalCost
        });
    });
    
    const customerHeader = document.querySelector('.customer-header');
    customerHeader.innerHTML = `
        <h2>Chi tiết khách hàng</h2>
        <p><strong>Mã khách hàng: </strong>${customerDetail.customerId}</p>
        <p><strong>Tên khách hàng: </strong>${customerDetail.customerName}</p>
        <p><strong>Số điện thoại: </strong>${customerDetail.phone}</p>
        <button class="btn-close-customer-detail" onclick = "closeCustomerDetail()">+</button>
    `;

    const customerItemsBody = document.querySelector('.customer-items-tbody');
    customerItemsBody.innerHTML = '';

    for(let i = 0; i < customerDetail.ords.length; i++) {
        customerItemsBody.innerHTML += `
            <tr>
                <td>${customerDetail.ords[i].orderId}</td>
                <td>${customerDetail.ords[i].quantity}</td>
                <td>${formatCurrencyVND(customerDetail.ords[i].totalCost)}</td>
            </tr>
        `;
    }

    const customerSummary = document.querySelector('.customer-summary');
    customerSummary.innerHTML = `
        <p><strong>Tổng tiền:</strong> ${formatCurrencyVND(customerDetail.totalSpent)}</p>
    `;

    document.querySelector('.customer-detail').style.display = 'block';
    document.querySelector('.customer-detail').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function closeCustomerDetail() {
    document.querySelector('.customer-detail').style.display = 'none';
}




// Thêm sự kiện cho nút áp dụng
document.querySelector('.btn-accept-filter').addEventListener('click', () => {
    if(document.querySelector('.statistic-type').style.display === 'block') {
        displayStatisticType();
    }
    else if(document.querySelector('.statistic-customer').style.display === 'block'){
        displayStatisticCustomer();
    }
    else {

    }
});

// Thêm sự kiện hiển thị trang thống kê
document.querySelector('.view-statistic').addEventListener('click', () => {
    document.querySelector('.statistic-content').style.display = 'flex';
    document.querySelector('.order-content').style.display = 'none';
    document.querySelector('.product-content').style.display = 'none' ;
    document.querySelector('.customer-content').style.display = 'none'; 

});

// Thêm sự kiện cho nút xem thống kê của mặt hàng
const statisticTypeButton = document.querySelector('.statistic-type-btn');
statisticTypeButton.addEventListener('click', () => {
    document.querySelector('.statistic-type').style.display = 'block';
    document.querySelector('.statistic-customer').style.display = 'none';
    displayStatisticType();
});

// Thêm sự kiện cho nút xem thống kê của khách hàng
const statisticCustomerButton = document.querySelector('.statistic-customer-btn');
statisticCustomerButton.addEventListener('click', () => {
    document.querySelector('.statistic-customer').style.display = 'block';
    document.querySelector('.statistic-type').style.display = 'none';
    displayStatisticCustomer();
});



