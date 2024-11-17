// Kiểm tra xem dữ liệu đơn hàng đã có trong localStorage chưa
let orders = JSON.parse(localStorage.getItem('orders'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if(!orders) {
    orders = [
        {
            customerId: 1,
            productId: 3,
            status: 'Đang chờ xử lý',
            quantity: 1,
            date: '2024-11-12'
        },
        {
            customerId: 1,
            productId: 8,
            status: 'Đang chờ xử lý',
            quantity: 2,
            date: '2024-11-15'
        },
        {
            customerId: 2,
            productId: 6,
            status: 'Đã xử lý',
            quantity: 1,
            date: '2024-11-13'
        },
        {
            customerId: 3,
            productId: 2,
            status: 'Đang chờ xử lý',
            quantity: 1,
            date: '2024-11-11'
        },
        {
            customerId: 3,
            productId: 9,
            status: 'Đang chờ xử lý',
            quantity: 3,
            date: '2024-11-20'
        },

    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}