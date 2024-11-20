// Kiểm tra xem dữ liệu địa chỉ đã có trong localStorage chưa
let address = JSON.parse(localStorage.getItem('address'));

if(!address){
    address = [
        {
            customerId: 1,
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 6',
            ward: 'Phường 13',
            street: '185/9/22, Bà Hom',
        },
        {
            customerId: 2,
            fullname: 'Hồ Thị Bích',
            email: 'bichho123@gmail.com',
            phone: '0123456888',
            province: 'Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Phường 11',
            street: '8/9, Tân Hóa',
        },
        {
            customerId: 3,
            fullname: 'Nguyễn Thị Thủy',
            email: 'thuynguyen312@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 6',
            ward: 'Phường 13',
            street: 'E56 Cư Xá Phú Lâm B',
        },
        {
            customerId: 4,
            fullname: 'Trần Văn Khánh',
            email: 'khanhvan555@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 3',
            ward: 'Phường 6',
            street: '18-22, Trương Định',
        },
        {
            customerId: 5,
            fullname: 'Nguyễn Văn Hai',
            email: 'haivan@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 6',
            ward: 'Phường 13',
            street: '40-60, Đường số 11',
        },
        {
            customerId: 6,
            fullname: 'Ngô Hồng Vĩ',
            email: 'vingoo@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 6',
            ward: 'Phường 13',
            street: '321, Đường số 2',
        },
        {
            customerId: 7,
            fullname: 'Trần Văn Đông',
            email: 'trandong@gmail.com',
            phone: '0123456879',
            province: 'Hồ Chí Minh',
            district: 'Quận 6',
            ward: 'Phường 13',
            street: '798, An Dương Vương',
        },
        
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('address', JSON.stringify(address));
}