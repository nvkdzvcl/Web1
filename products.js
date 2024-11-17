// Kiểm tra xem dữ liệu sản phẩm đã có trong localStorage chưa
let products = JSON.parse(localStorage.getItem('products'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if (!products) {
    products = [
        {
            id: 1,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\O-Long-Man-Moc-Chau-Thach-Que-Hoa.jpg'
        },
        {
            id: 2,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\O-Long-Tuyet-Le-Khong-Lo.jpg'
        },
        {
            id: 3,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Chanh-Mat-Ong-Gia-Tay-Khong-Lo.jpg'
        },
        {
            id: 4,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Chanh-Mat-Ong-Gia-Tay.jpg'
        },
        {
            id: 5,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Dao-Tien-Que-Hoa.png'
        },
        {
            id: 6,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Dau-Tam-Pha-Le-Tuyet.jpg'
        },
        {
            id: 7,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Dua-Thach-Konjac.jpg'
        },
        {
            id: 8,
            name: 'name',
            price: 35000,
            type: 'FreshFruitTea',
            image: 'image\products\FreshFruitTea\Tra-Xanh-Nhai-Dao-Tien.png'
        },
        {
            id: 9,
            name: 'name',
            price: 35000,
            type: 'Ice',
            image: 'image\products\Ice\Ca-Phe-Kem-Tran-Chan-Hoang-Kim.jpg'
        },
        {
            id: 10,
            name: 'name',
            price: 35000,
            type: 'Ice',
            image: 'image\products\Ice\Kem-Ly-Vani-Dau.jpg'
        },
        {
            id: 11,
            name: 'name',
            price: 35000,
            type: 'Ice',
            image: 'image\products\Ice\Kem-Tra-Sua-Tran-Chau-Hoang-Kim.png'
        },
        {
            id: 12,
            name: 'name',
            price: 35000,
            type: 'Ice',
            image: 'image\products\Ice\Kem-Tran-Chau-Hoang-Kim.jpg'
        },
        {
            id: 13,
            name: 'name',
            price: 35000,
            type: 'Ice',
            image: 'image\products\Ice\Kem-Vani-Tra-Sua-Tran-Chau-Hoang-Kim.png'
        }
    
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
}