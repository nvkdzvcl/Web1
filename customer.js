// Kiểm tra xem dữ liệu đơn hàng đã có trong localStorage chưa
let customer = JSON.parse(localStorage.getItem('customer'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if(!customer) {
    customer = [
        {
            id: 1,
            username: '111',
            password: '111'
        },
        {
            id: 2,
            username: '222',
            password: '222'
        },
        {
            id: 3,
            username: '333',
            password: '333'
        },
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('customer', JSON.stringify(customer));
}