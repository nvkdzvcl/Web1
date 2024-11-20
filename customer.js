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
            username: 'caovn',
            password: '333'
        },
        {
            id: 4,
            username: 'homnayangi',
            password: 'com'
        },
        {
            id: 5,
            username: 'homquatroimua',
            password: 'nang'
        },
        {
            id: 6,
            username: 'muaroi',
            password: 'mua'
        },
        {
            id: 7,
            username: 'diepvien007',
            password: 'diepvien007'
        },
        {
            id: 8,
            username: 'thongtindaotao',
            password: 'mssv'
        },
        {
            id: 9,
            username: 'xehu',
            password: 'quatangcuocsong'
        },
        {
            id: 10,
            username: '888',
            password: 'baso8'
        },
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('customer', JSON.stringify(customer));
}