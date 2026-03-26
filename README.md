# Jobijad Express E-commerce Platform

A full-stack e-commerce platform for African fashion built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **Frontend**: Responsive design with HTML5, CSS3, and JavaScript
- **Backend**: RESTful API with Node.js and Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based user authentication
- **Shopping Cart**: Persistent cart functionality
- **Order Management**: Complete order processing system
- **Product Management**: CRUD operations for products
- **User Roles**: Customer and Admin roles

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Update the `.env` file with your MongoDB connection string:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/afristyle
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@afristyle.com / admin123
- **Customer**: customer@example.com / customer123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders` - Get all orders (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Deactivate user

## Project Structure

```
afristyle-ecommerce/
├── models/           # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/           # API routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   └── users.js
├── middleware/       # Custom middleware
│   └── auth.js
├── scripts/          # Utility scripts
│   └── seedDatabase.js
├── index.html        # Frontend HTML
├── styles.css        # Frontend CSS
├── script.js         # Frontend JavaScript
├── server.js         # Main server file
├── package.json      # Dependencies
└── .env             # Environment variables
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: express-validator
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details