// Kiểm tra xem dữ liệu sản phẩm đã có trong localStorage chưa
let products = JSON.parse(localStorage.getItem('products'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if (!products) {
    products = [
        {
            id: 1,
            name: 'Ô Long Mận Mộc Châu Thạch Quế Hoa',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/O-Long-Man-Moc-Chau-Thach-Que-Hoa.jpg'
        },
        {
            id: 2,
            name: 'Ô Long Tuyết Lê Khổng Lồ',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/O-Long-Tuyet-Le-Khong-Lo.jpg'
        },
        {
            id: 3,
            name: 'Trà Chanh Mật ong Giã Tay Khổng Lồ',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Chanh-Mat-Ong-Gia-Tay-Khong-Lo.jpg'
        },
        {
            id: 4,
            name: 'Trà Chanh Mật Ong Giã Tay',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Chanh-Mat-Ong-Gia-Tay.jpg'
        },
        {
            id: 5,
            name: 'Trà Đào Tiên Quế Hoa',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Dao-Tien-Que-Hoa.png'
        },
        {
            id: 6,
            name: 'Trà Dâu Tầm Pha Lê Tuyế',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Dau-Tam-Pha-Le-Tuyet.jpg'
        },
        {
            id: 7,
            name: 'Trà Dứa Thạch Konjac',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Dua-Thach-Konjac.jpg'
        },
        {
            id: 8,
            name: 'Trà Xanh Nhài Đào Tiên',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'FreshFruitTea',
            image: 'image/products/FreshFruitTea/Tra-Xanh-Nhai-Dao-Tien.png'
        },
        {
            id: 9,
            name: 'Cà Phê Kem Trân Châu Hoàng Kim',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'Ice',
            image: 'image/products/Ice/Ca-Phe-Kem-Tran-Chan-Hoang-Kim.jpg'
        },
        {
            id: 10,
            name: 'Kem Ly Vani Dâu',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'Ice',
            image: 'image/products/Ice/Kem-Ly-Vani-Dau.jpg'
        },
        {
            id: 11,
            name: 'Kem Trà Sữa Trân Châu Hoàng Kim',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'Ice',
            image: 'image/products/Ice/Kem-Tra-Sua-Tran-Chau-Hoang-Kim.png'
        },
        {
            id: 12,
            name: 'Kem Trân Châu Hoàng Kim',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'Ice',
            image: 'image/products/Ice/Kem-Tran-Chau-Hoang-Kim.jpg'
        },
        {
            id: 13,
            name: 'Kem Vani Trà Sữa Trân Châu Hoàng Kim',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'Ice',
            image: 'image/products/Ice/Kem-Vani-Tra-Sua-Tran-Chau-Hoang-Kim.png'
        },
        {
            id: 14,
            name: 'Người Bạn Xanh Sữa Nhài Khổng Lồ',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Nguoi-Ban-Xanh-Sua-Nhai-Khong-Lo.jpg'
        },
        {
            id: 15,
            name: 'Ô Long Sữa Tươi Trân Châu Ngũ Cốc',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/O-Long-Sua-Tuoi-Tran-Chau-Ngu-Coc.jpg'
        },
        {
            id: 16,
            name: 'Sữa Tươi Trân Châu Đường Hổ Khổng Lồ',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Sua-Tuoi-Tran-Chau-Duong-Ho-Khong-Lo.jpg'
        },
        {
            id: 17,
            name: 'Tiger Sugar',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tiger-Sugar.jpg'
        },
        {
            id: 18,
            name: 'Trà Sữa Ba Anh Em',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Ba-Anh-Em.jpg'
        },
        {
            id: 19,
            name: 'Trà Sữa BoBa Cheese',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-BoBa-Cheese.png'
        },
        {
            id: 20,
            name: 'Trà Sữa Dâu Tây',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Dau-Tay.jpg'
        },
        {
            id: 21,
            name: 'Trà Sữa Ô Long',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-O-Long.jpg'
        },
        {
            id: 22,
            name: 'Trà Sữa Okinawa',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Okinawa.png'
        },
        {
            id: 23,
            name: 'Trà Sữa Phô Mai Tươi',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Pho-Mai-Tuoi.png'
        },
        {
            id: 24,
            name: 'Trà Sữa Socola',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Socola.jpg'
        },
        {
            id: 25,
            name: 'Trà Sữa Trân Châu Đường Đen',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Tran-Chau-Duong-Den.jpg'
        },
        {
            id: 26,
            name: 'Trà Sữa Trân Châu Hoàng Gia',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Tran-Chau-Hoang-Gia.jpg'
        },
        {
            id: 27,
            name: 'Trà Sữa Trân Châu Sợi',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua-Tran-Chau-Soi.jpg'
        },
        {
            id: 28,
            name: 'Trà Sữa',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Sua.jpg'
        },
        {
            id: 29,
            name: 'Trà Xanh Sữa Vị Nhài',
            sizes: [
                { size: 'M', price: 35000 },
                { size: 'L', price: 43000 }
            ],
            type: 'MilkTea',
            image: 'image/products/Milktea/Tra-Xanh-Sua-Vi-Nhai.jpg'
        },

    
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
}