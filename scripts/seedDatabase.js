require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');

// IMAGE ASSIGNMENTS (based on visual content of each photo):
// Women's clothing photos:
//   f8e0a4890c23e5d61aef471df1b74039.jpg  - woman in kitenge pencil dress
//   14095d41061e0f899bf662a6fef669fe.jpg  - woman in kitenge wrap dress
//   eb87c22d59a058b965b0b15d13bf9e45.jpg  - woman in ankara peplum dress
//   e3b29c618f38caf520fb6a800799b6f4.jpg  - woman in kitenge off-shoulder gown
//   04bf22c44bcabc6b72ed15f42e38e2cc.jpg  - woman in ankara bodycon dress
//   56b658941dab5ebc7361f38ccaf15c07.jpg  - woman in kitenge skirt & blouse
//   Classy Style Outfits.jpg              - woman in classy kitenge evening dress
//   584174be4ccaba405a5cb129cdadd5de.jpg  - woman in ankara midi dress
//   eb5e1057feffa4764d4230fdfe7b5be2.jpg  - woman in kitenge jumpsuit
//   f31a2361647e9062367a073ade64449d.jpg  - woman in ankara flare dress
//   be31aa38c917e81506193f649d246809.jpg  - woman in kitenge dress (was wrongly in accessories)
//   DSC_6066.JPG                          - woman in black kitenge dress (was wrongly in accessories)
//   a4f4872d78f5c49961c08805e06b5ff6.jpg  - woman + child in kitenge (was wrongly in accessories)
//
// Men's clothing photos:
//   861c38a0e805f4c155dac11fe8469e2d.jpg  - man in kitenge shirt
//   8fff9b88ac46570ad8c102490e1461d4.jpg  - man in ankara kaftan
//   2351772c970228aeb62b55ffc4e3c920.jpg  - man in kitenge suit
//   17cc08d7ed892547715bec038ec624ba.jpg  - man in dashiki
//   2c7e4b9cf9a5ba63bd916772dd6521b2.jpg  - man in ankara trousers
//   a68f8572b3410fbe86e65fb884cf1d58.jpg  - man in ankara shirt (was wrongly in accessories)
//
// Children's clothing photos:
//   3ac1625a123967529a1be01ddcb3f60a.jpg  - girl in kitenge party dress
//   3b693b3d526f032126a351467cc9cbbc.jpg  - boy in kitenge shirt
//   5a40bb24158a27b377765ea50da13d0c.jpg  - child in ankara outfit set
//   6c04c8180b7d173942e5fb65ed41ddeb.jpg  - girl in kitenge skirt set
//   6c8c756b39fa032cedb7418ecaa1d59d.jpg  - boy in ankara kaftan
//   748bb7a87755837e7ab51aa3d08de6da.jpg  - child in kitenge dress
//   ab5e89192eddcaca65f4a664225c91fb.jpg  - boy in red kitenge suit (was wrongly in accessories)
//
// Accessories (non-clothing items):
//   7ae9546f19636a743c6795d627a42eec.jpg  - kitenge handbag
//   a1291d73b7ce6bdb896f2599bc1db315.jpg  - african beaded necklace

const products = [
    // ===== WOMEN (13 items) =====
    {
        name: 'Elegant Kitenge Pencil Dress',
        description: 'Stunning fitted kitenge pencil dress with bold African prints. Perfect for weddings, parties and special occasions.',
        price: 89.99, category: 'women',
        images: [{ url: 'pics/f8e0a4890c23e5d61aef471df1b74039.jpg', alt: 'Kitenge Pencil Dress' }],
        sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }],
        colors: ['Blue Print', 'Red Print', 'Green Print'], featured: true, ratingAverage: 4.9, ratingCount: 34
    },
    {
        name: 'Kitenge Wrap Dress',
        description: 'Elegant wrap-style kitenge dress with vibrant African patterns. Flattering silhouette for all body types.',
        price: 75.99, category: 'women',
        images: [{ url: 'pics/14095d41061e0f899bf662a6fef669fe.jpg', alt: 'Kitenge Wrap Dress' }],
        sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 9 }, { size: 'L', stock: 6 }],
        colors: ['Multi-color'], featured: true, ratingAverage: 4.8, ratingCount: 27
    },
    {
        name: 'Ankara Peplum Dress',
        description: 'Chic peplum-style ankara dress with modern cut and traditional African prints. Great for office and events.',
        price: 69.99, category: 'women',
        images: [{ url: 'pics/eb87c22d59a058b965b0b15d13bf9e45.jpg', alt: 'Ankara Peplum Dress' }],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 7 }],
        colors: ['Orange', 'Purple', 'Teal'], featured: false, ratingAverage: 4.6, ratingCount: 19
    },
    {
        name: 'Kitenge Off-Shoulder Gown',
        description: 'Glamorous off-shoulder kitenge gown with rich African fabric. Ideal for formal events and celebrations.',
        price: 95.99, category: 'women',
        images: [{ url: 'pics/e3b29c618f38caf520fb6a800799b6f4.jpg', alt: 'Kitenge Off-Shoulder Gown' }],
        sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 5 }],
        colors: ['Blue', 'Gold', 'Red'], featured: true, ratingAverage: 4.9, ratingCount: 41
    },
    {
        name: 'Ankara Bodycon Dress',
        description: 'Fitted bodycon dress in vibrant ankara print. Modern African fashion at its finest.',
        price: 62.99, category: 'women',
        images: [{ url: 'pics/04bf22c44bcabc6b72ed15f42e38e2cc.jpg', alt: 'Ankara Bodycon Dress' }],
        sizes: [{ size: 'XS', stock: 5 }, { size: 'S', stock: 8 }, { size: 'M', stock: 10 }],
        colors: ['Multi-color'], featured: false, ratingAverage: 4.5, ratingCount: 22
    },
    {
        name: 'Kitenge Skirt & Blouse Set',
        description: 'Matching kitenge skirt and blouse two-piece set. Versatile outfit for work and casual wear.',
        price: 78.99, category: 'women',
        images: [{ url: 'pics/56b658941dab5ebc7361f38ccaf15c07.jpg', alt: 'Kitenge Skirt Blouse Set' }],
        sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 9 }, { size: 'L', stock: 7 }],
        colors: ['Blue Pattern', 'Green Pattern'], featured: false, ratingAverage: 4.7, ratingCount: 18
    },
    {
        name: 'Classy Kitenge Evening Dress',
        description: 'Sophisticated kitenge evening dress with elegant draping. A statement piece for any occasion.',
        price: 110.00, category: 'women',
        images: [{ url: 'pics/Classy Style Outfits.jpg', alt: 'Classy Kitenge Evening Dress' }],
        sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 6 }, { size: 'L', stock: 4 }],
        colors: ['Black & Gold', 'Navy & Orange'], featured: true, ratingAverage: 5.0, ratingCount: 15
    },
    {
        name: 'Ankara Print Midi Dress',
        description: 'Stylish midi-length ankara dress with bold geometric prints. Perfect for everyday elegance.',
        price: 58.99, category: 'women',
        images: [{ url: 'pics/584174be4ccaba405a5cb129cdadd5de.jpg', alt: 'Ankara Midi Dress' }],
        sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 11 }, { size: 'L', stock: 9 }],
        colors: ['Multi-color'], featured: false, ratingAverage: 4.4, ratingCount: 20
    },
    {
        name: 'Kitenge Jumpsuit',
        description: 'Trendy kitenge jumpsuit combining comfort and African style. Wide-leg cut for a modern look.',
        price: 82.99, category: 'women',
        images: [{ url: 'pics/eb5e1057feffa4764d4230fdfe7b5be2.jpg', alt: 'Kitenge Jumpsuit' }],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 7 }, { size: 'L', stock: 6 }],
        colors: ['Orange Print', 'Blue Print'], featured: false, ratingAverage: 4.6, ratingCount: 13
    },
    {
        name: 'Ankara Flare Dress',
        description: 'Beautiful flare-cut ankara dress with vibrant prints. Comfortable and stylish for all-day wear.',
        price: 67.99, category: 'women',
        images: [{ url: 'pics/f31a2361647e9062367a073ade64449d.jpg', alt: 'Ankara Flare Dress' }],
        sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }],
        colors: ['Multi-color'], featured: false, ratingAverage: 4.3, ratingCount: 16
    },
    {
        name: 'Kitenge Fitted Dress',
        description: 'Elegant fitted kitenge dress with striking African print. A must-have for every wardrobe.',
        price: 72.99, category: 'women',
        images: [{ url: 'pics/be31aa38c917e81506193f649d246809.jpg', alt: 'Kitenge Fitted Dress' }],
        sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 8 }, { size: 'L', stock: 5 }],
        colors: ['Multi-color'], featured: true, ratingAverage: 4.7, ratingCount: 26
    },
    {
        name: 'Classic Black Kitenge Dress',
        description: 'Sophisticated black kitenge dress with subtle African detailing. Perfect for formal and semi-formal occasions.',
        price: 85.00, category: 'women',
        images: [{ url: 'pics/DSC_6066.JPG', alt: 'Black Kitenge Dress' }],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 7 }, { size: 'L', stock: 6 }],
        colors: ['Black', 'Black & Gold'], featured: false, ratingAverage: 4.8, ratingCount: 31
    },
    {
        name: 'Kitenge Mother & Child Set',
        description: 'Matching kitenge outfits for mother and child. Celebrate African heritage together in style.',
        price: 98.00, category: 'women',
        images: [{ url: 'pics/a4f4872d78f5c49961c08805e06b5ff6.jpg', alt: 'Kitenge Mother Child Set' }],
        sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 6 }, { size: 'L', stock: 4 }],
        colors: ['Gold Print', 'Blue Print'], featured: true, ratingAverage: 5.0, ratingCount: 18
    },

    // ===== MEN (6 items) =====
    {
        name: "Men's Kitenge Shirt",
        description: 'Classic fit kitenge shirt with authentic African patterns. Suitable for formal and casual occasions.',
        price: 55.99, category: 'men',
        images: [{ url: 'pics/861c38a0e805f4c155dac11fe8469e2d.jpg', alt: "Men's Kitenge Shirt" }],
        sizes: [{ size: 'M', stock: 8 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 7 }],
        colors: ['Navy', 'Burgundy', 'Green'], featured: true, ratingAverage: 4.7, ratingCount: 29
    },
    {
        name: "Men's Ankara Kaftan",
        description: 'Traditional African kaftan in premium ankara fabric. Loose, comfortable fit perfect for ceremonies.',
        price: 72.99, category: 'men',
        images: [{ url: 'pics/8fff9b88ac46570ad8c102490e1461d4.jpg', alt: "Men's Ankara Kaftan" }],
        sizes: [{ size: 'M', stock: 7 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 8 }],
        colors: ['White', 'Black', 'Blue'], featured: true, ratingAverage: 4.8, ratingCount: 35
    },
    {
        name: "Men's Kitenge Suit Set",
        description: 'Complete kitenge suit with matching trousers. Sharp, professional look with African flair.',
        price: 125.00, category: 'men',
        images: [{ url: 'pics/2351772c970228aeb62b55ffc4e3c920.jpg', alt: "Men's Kitenge Suit" }],
        sizes: [{ size: 'M', stock: 5 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 6 }],
        colors: ['Blue Print', 'Brown Print'], featured: true, ratingAverage: 4.9, ratingCount: 22
    },
    {
        name: 'Traditional Dashiki',
        description: 'Authentic dashiki with beautiful embroidery and traditional patterns. A wardrobe essential.',
        price: 42.99, category: 'men',
        images: [{ url: 'pics/17cc08d7ed892547715bec038ec624ba.jpg', alt: 'Traditional Dashiki' }],
        sizes: [{ size: 'M', stock: 9 }, { size: 'L', stock: 11 }, { size: 'XL', stock: 8 }],
        colors: ['White', 'Black', 'Red'], featured: false, ratingAverage: 4.5, ratingCount: 31
    },
    {
        name: "Men's Ankara Print Trousers",
        description: 'Comfortable ankara trousers with modern fit and bold traditional prints. Work and casual ready.',
        price: 58.99, category: 'men',
        images: [{ url: 'pics/2c7e4b9cf9a5ba63bd916772dd6521b2.jpg', alt: "Men's Ankara Trousers" }],
        sizes: [{ size: '32', stock: 7 }, { size: '34', stock: 9 }, { size: '36', stock: 6 }],
        colors: ['Blue Print', 'Green Print', 'Brown Print'], featured: false, ratingAverage: 4.2, ratingCount: 14
    },
    {
        name: "Men's Ankara Print Shirt",
        description: 'Bold ankara print shirt for the modern African man. Stands out at any event or gathering.',
        price: 49.99, category: 'men',
        images: [{ url: 'pics/a68f8572b3410fbe86e65fb884cf1d58.jpg', alt: "Men's Ankara Shirt" }],
        sizes: [{ size: 'M', stock: 8 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 7 }],
        colors: ['Orange Print', 'Blue Print', 'Green Print'], featured: false, ratingAverage: 4.6, ratingCount: 20
    },

    // ===== CHILDREN (7 items) =====
    {
        name: "Girls' Kitenge Party Dress",
        description: 'Adorable kitenge party dress for girls. Bright African prints with a comfortable fit for active kids.',
        price: 32.99, category: 'children',
        images: [{ url: 'pics/3ac1625a123967529a1be01ddcb3f60a.jpg', alt: "Girls Kitenge Dress" }],
        sizes: [{ size: '2-3Y', stock: 8 }, { size: '4-5Y', stock: 10 }, { size: '6-7Y', stock: 9 }],
        colors: ['Multi-color'], featured: true, ratingAverage: 4.9, ratingCount: 38
    },
    {
        name: "Boys' Kitenge Shirt",
        description: 'Smart kitenge shirt for boys with traditional African patterns. Great for school events and family occasions.',
        price: 28.99, category: 'children',
        images: [{ url: 'pics/3b693b3d526f032126a351467cc9cbbc.jpg', alt: "Boys Kitenge Shirt" }],
        sizes: [{ size: '4-5Y', stock: 9 }, { size: '6-7Y', stock: 11 }, { size: '8-9Y', stock: 8 }],
        colors: ['Blue', 'Green', 'Orange'], featured: false, ratingAverage: 4.7, ratingCount: 24
    },
    {
        name: "Children's Ankara Outfit Set",
        description: 'Matching top and bottom ankara set for children. Durable fabric that withstands active play.',
        price: 35.99, category: 'children',
        images: [{ url: 'pics/5a40bb24158a27b377765ea50da13d0c.jpg', alt: "Children's Ankara Set" }],
        sizes: [{ size: '2-3Y', stock: 7 }, { size: '4-5Y', stock: 9 }, { size: '6-7Y', stock: 8 }],
        colors: ['Multi-color'], featured: true, ratingAverage: 4.8, ratingCount: 29
    },
    {
        name: "Girls' Kitenge Skirt Set",
        description: 'Cute kitenge skirt and top set for girls. Vibrant prints that make every little girl stand out.',
        price: 30.99, category: 'children',
        images: [{ url: 'pics/6c04c8180b7d173942e5fb65ed41ddeb.jpg', alt: "Girls Kitenge Skirt Set" }],
        sizes: [{ size: '3-4Y', stock: 8 }, { size: '5-6Y', stock: 10 }, { size: '7-8Y', stock: 7 }],
        colors: ['Pink Print', 'Yellow Print'], featured: false, ratingAverage: 4.6, ratingCount: 17
    },
    {
        name: "Boys' Ankara Kaftan",
        description: 'Traditional ankara kaftan for boys. Comfortable and stylish for cultural events and celebrations.',
        price: 27.99, category: 'children',
        images: [{ url: 'pics/6c8c756b39fa032cedb7418ecaa1d59d.jpg', alt: "Boys Ankara Kaftan" }],
        sizes: [{ size: '4-5Y', stock: 9 }, { size: '6-7Y', stock: 11 }, { size: '8-9Y', stock: 8 }],
        colors: ['White', 'Blue', 'Green'], featured: false, ratingAverage: 4.5, ratingCount: 21
    },
    {
        name: "Children's Kitenge Dress",
        description: 'Beautiful kitenge dress for young girls. Soft fabric with authentic African prints for special occasions.',
        price: 33.99, category: 'children',
        images: [{ url: 'pics/748bb7a87755837e7ab51aa3d08de6da.jpg', alt: "Children's Kitenge Dress" }],
        sizes: [{ size: '2-3Y', stock: 6 }, { size: '4-5Y', stock: 8 }, { size: '6-7Y', stock: 7 }],
        colors: ['Multi-color'], featured: false, ratingAverage: 4.7, ratingCount: 19
    },
    {
        name: "Boys' Kitenge Suit",
        description: 'Dapper kitenge suit for boys. Perfect for ceremonies, graduations and family celebrations.',
        price: 38.99, category: 'children',
        images: [{ url: 'pics/ab5e89192eddcaca65f4a664225c91fb.jpg', alt: "Boys Kitenge Suit" }],
        sizes: [{ size: '4-5Y', stock: 7 }, { size: '6-7Y', stock: 9 }, { size: '8-9Y', stock: 8 }],
        colors: ['Red', 'Blue', 'Green'], featured: true, ratingAverage: 4.9, ratingCount: 33
    },

    // ===== ACCESSORIES (2 items — actual non-clothing accessories) =====
    {
        name: 'Kitenge Fabric Handbag',
        description: 'Stylish handmade kitenge fabric bag with leather handles. Spacious and durable for everyday use.',
        price: 38.99, category: 'accessories',
        images: [{ url: 'pics/7ae9546f19636a743c6795d627a42eec.jpg', alt: 'Kitenge Handbag' }],
        sizes: [{ size: 'Medium', stock: 10 }, { size: 'Large', stock: 7 }],
        colors: ['Blue Pattern', 'Red Pattern', 'Green Pattern'], featured: true, ratingAverage: 4.8, ratingCount: 43
    },
    {
        name: 'African Beaded Necklace',
        description: 'Handcrafted beaded necklace with authentic African designs. A unique statement piece.',
        price: 22.99, category: 'accessories',
        images: [{ url: 'pics/a1291d73b7ce6bdb896f2599bc1db315.jpg', alt: 'African Beaded Necklace' }],
        sizes: [{ size: 'One Size', stock: 20 }],
        colors: ['Multi-color', 'Red & Gold', 'Blue & Silver'], featured: false, ratingAverage: 4.9, ratingCount: 52
    }
];

async function seed() {
    try {
        await sequelize.sync({ force: true });
        console.log('Tables created');

        await User.create({ name: 'Admin', email: 'admin@jobijad.com', password: 'admin123', role: 'admin' });
        await User.create({ name: 'John Doe', email: 'customer@example.com', password: 'customer123', role: 'customer' });
        console.log('Users created');

        for (const p of products) await Product.create(p);
        console.log(`${products.length} products created`);

        console.log('\nDone! Login credentials:');
        console.log('Admin:    admin@jobijad.com / admin123');
        console.log('Customer: customer@example.com / customer123');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
