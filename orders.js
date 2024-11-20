// Kiểm tra xem dữ liệu đơn hàng đã có trong localStorage chưa
let orders = JSON.parse(localStorage.getItem('orders'));

// Nếu chưa có dữ liệu trong localStorage => thì gán giá trị mặc định
if(!orders) {
    orders = [
        {
            id: 1,
            customerId: 1,
            status: 'Chưa liên hệ',
            date: '2024-11-12',
            orderItems: [
                {
                    productId: 3,
                    sizes: [
                        { size: 'M', quantity: 1 },
                    ]
                },
                {
                    productId: 8,
                    sizes: [
                        { size: 'M', quantity: 1 },
                        { size: 'l', quantity: 1 }
                    ]
                },
            ]
        },
        {
            id: 2,
            customerId: 5,
            status: 'Chưa liên hệ',
            date: '2024-11-15',
            orderItems: [
                {
                    productId: 1,
                    sizes: [
                        { size: 'M', quantity: 1 },
                        { size: 'L', quantity: 2 }
                    ]
                },
                {
                    productId: 12,
                    sizes: [
                        { size: 'L', quantity: 3 }
                    ]
                },
                {
                    productId: 22,
                    sizes: [
                        { size: 'M', quantity: 6 }
                    ]
                },
            ]
        },
        {
            id: 3,
            customerId: 4,
            status: 'Chưa liên hệ',
            date: '2024-11-22',
            orderItems: [
                {
                    productId: 2,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 2 }
                    ]
                },
            ]
        },
        {
            id: 4,
            customerId: 3,
            status: 'Chưa liên hệ',
            date: '2024-11-12',
            orderItems: [
                {
                    productId: 6,
                    sizes: [
                        { size: 'M', quantity: 8 },
                        { size: 'L', quantity: 4 }
                    ]
                },
                {
                    productId: 11,
                    sizes: [
                        { size: 'M', quantity: 3 },
                    ]
                },
                {
                    productId: 4,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 4 }
                    ]
                },
                {
                    productId: 17,
                    sizes: [
                        { size: 'M', quantity: 5 },
                    ]
                },
            ]
        },
        {
            id: 5,
            customerId: 2,
            status: 'Chưa liên hệ',
            date: '2024-12-12',
            orderItems: [
                {
                    productId: 2,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 2 }
                    ]
                },
                {
                    productId: 7,
                    sizes: [
                        { size: 'M', quantity: 2 },
                    ]
                },
                {
                    productId: 5,
                    sizes: [
                        { size: 'M', quantity: 2 },
                    ]
                },
                {
                    productId: 11,
                    sizes: [
                        { size: 'L', quantity: 2 }
                    ]
                },
            ]
        },
        {
            id: 6,
            customerId: 6,
            status: 'Chưa liên hệ',
            date: '2024-10-22',
            orderItems: [
                {
                    productId: 26,
                    sizes: [
                        { size: 'M', quantity: 6 },
                        { size: 'L', quantity: 2 }
                    ]
                },
                {
                    productId: 13,
                    sizes: [
                        { size: 'L', quantity: 5 }
                    ]
                },
                {
                    productId: 1,
                    sizes: [
                        { size: 'L', quantity: 4 }
                    ]
                },
                {
                    productId: 3,
                    sizes: [
                        { size: 'M', quantity: 1 },
                        { size: 'L', quantity: 1 }
                    ]
                },
            ]
        },
        {
            id: 7,
            customerId: 8,
            status: 'Chưa liên hệ',
            date: '2024-10-02',
            orderItems: [
                {
                    productId: 29,
                    sizes: [
                        { size: 'M', quantity: 2 },
                    ]
                },
                {
                    productId: 6,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 3 }
                    ]
                },
                {
                    productId: 1,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 2 }
                    ]
                },
                {
                    productId: 14,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 5 }
                    ]
                },
            ]
        },
        {
            id: 8,
            customerId: 2,
            status: 'Chưa liên hệ',
            date: '2024-12-25',
            orderItems: [
                {
                    productId: 1,
                    sizes: [
                        { size: 'M', quantity: 1 },
                        { size: 'L', quantity: 1 }
                    ]
                },
                {
                    productId: 13,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 3 }
                    ]
                },
                {
                    productId: 5,
                    sizes: [
                        { size: 'M', quantity: 1 },
                        { size: 'L', quantity: 5 }
                    ]
                },
                {
                    productId: 11,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 2 }
                    ]
                },
            ]
        },
        {
            id: 9,
            customerId: 2,
            status: 'Chưa liên hệ',
            date: '2024-12-29',
            orderItems: [
                {
                    productId: 11,
                    sizes: [
                        { size: 'M', quantity: 1 },
                    ]
                },
                {
                    productId: 23,
                    sizes: [
                        { size: 'M', quantity: 2 },
                        { size: 'L', quantity: 2 }
                    ]
                },
                {
                    productId: 9,
                    sizes: [
                        { size: 'M', quantity: 6 },
                    ]
                },
                {
                    productId: 7,
                    sizes: [
                        { size: 'L', quantity: 1 }
                    ]
                },
            ]
        },
        {
            id: 10,
            customerId: 4,
            status: 'Chưa liên hệ',
            date: '2024-11-23',
            orderItems: [
                {
                    productId: 4,
                    sizes: [
                        { size: 'M', quantity: 2 }
                    ]
                },
            ]
        },
        {
            id: 11,
            customerId: 4,
            status: 'Chưa liên hệ',
            date: '2024-11-29',
            orderItems: [
                {
                    productId: 4,
                    sizes: [
                        { size: 'L', quantity: 1 }
                    ]
                },
            ]
        },
        {
            id: 12,
            customerId: 6,
            status: 'Chưa liên hệ',
            date: '2024-11-17',
            orderItems: [
                {
                    productId: 8,
                    sizes: [
                        { size: 'L', quantity: 3 }
                    ]
                },
            ]
        },
        {
            id: 13,
            customerId: 7,
            status: 'Chưa liên hệ',
            date: '2024-09-04',
            orderItems: [
                {
                    productId: 5,
                    sizes: [
                        { size: 'M', quantity: 1 },
                    ]
                },
            ]
        },
    ]
    // Lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}