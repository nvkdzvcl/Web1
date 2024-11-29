// Kiểm tra xem dữ liệu đơn hàng đã có trong localStorage chưa
let customers = JSON.parse(localStorage.getItem('customers'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if(!customers) {
    customers = [
        {
            id: 1,
            username: '111',
            password: '111',
            status: 'true'
        },
        {
            id: 2,
            username: '222',
            password: '222',
            status: 'true'
        },
        {
            id: 3,
            username: 'caovn',
            password: '333',
            status: 'true'
        },
        {
            id: 4,
            username: 'hainguyen',
            password: 'hainguyen',
            status: 'true'
        },
        {
            id: 5,
            username: 'ngohongvi',
            password: 'vingo',
            status: 'true'
        },
        {
            id: 6,
            username: 'jack',
            password: '9797',
            status: 'true'
        },
        {
            id: 7,
            username: 'diepvien007',
            password: 'diepvien007',
            status: 'true'
        },
        {
            id: 8,
            username: 'thongtindaotao',
            password: 'mssv',
            status: 'true'
        },
        {
            id: 9,
            username: 'nguyenvana',
            password: 'nguyenvana',
            status: 'true'
        },
        {
            id: 10,
            username: '888',
            password: 'maso8',
            status: 'true'
        },
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
}