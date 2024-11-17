// Kiểm tra xem dữ liệu đơn hàng đã có trong localStorage chưa
let oders = JSON.parse(localStorage.getItem('orders'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if(!oders) {
    orders = [
        {
            customerId: 1,
            productId: 3,
            status: 'Đang chờ xử lý',
            quantity: 1
            size: 'S'
        },
        {
            customerId: 1,
            productId: 8,
            status: 'Đang chờ xử lý',
            quantity: 2,
            size: 'M'
        },
        {
            customerId: 2,
            productId: 6,
            status: 'Đang chờ xử lý',
            quantity: 1,
            size: 'M'
        },
        {
            customerId: 3,
            productId: 2,
            status: 'Đang chờ xử lý',
            quantity: 1,
            size: 'M'
        },
        {
            customerId: 3,
            productId: 9,
            status: 'Đang chờ xử lý',
            quantity: 3,
            size: 'L'
        },

    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}