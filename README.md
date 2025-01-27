# E-commerce Project

## Overview
This is a fully functional e-commerce platform built using modern web technologies. It allows users to browse products, add items to their cart, update quantities, and proceed to checkout. The project integrates a backend API for user authentication, product management, and cart functionality.

---

## Features

### User Features
- **Authentication**: Secure user login and registration with JWT.
- **Product Browsing**: View a list of available products with details such as name, price, and image.
- **Shopping Cart**:
  - Add products to the cart.
  - Update product quantities in the cart.
  - Automatically remove items from the cart when the quantity is set to zero.
- **Checkout**: A button to proceed to checkout when items are present in the cart.
- **Error Handling**: Display appropriate error messages for issues like network errors or failed operations.

### Admin Features
- **Product Management**:
  - Add, edit, and remove products.
  - Upload product images.
- **Order Management**: Track customer orders.

---

## Technologies Used

### Frontend
- **React.js**: For building the user interface.
- **Tailwind CSS**: For styling the application.
- **Axios**: For making HTTP requests.
- **Lucide-React**: For icons like `Plus`, `Minus`, and `Trash`.

### Backend
- **Node.js**: For the server-side application.
- **Express.js**: For handling backend API routes.
- **MongoDB**: For storing user, product, and cart data.
- **Mongoose**: For database modeling.

### Additional Tools
- **React Icons**: For additional icons.
- **JWT**: For secure user authentication.
- **Bootstrap**: For reusable components.

---

## Folder Structure

```
project-root/
|-- public/                # Public assets
|-- src/
|   |-- components/        # Reusable React components
|   |-- pages/             # Application pages (e.g., CartPage, HomePage)
|   |-- lib/               # Context and utility functions
|   |-- styles/            # Global styles
|-- backend/               # Backend server code
|-- README.md              # Project documentation
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.

### Products
- `GET /api/products`: Get all products.
- `POST /api/products`: Add a new product (Admin only).

### Cart
- `GET /api/cart`: Get the user's cart.
- `POST /api/cart/update`: Update the quantity of a product in the cart.
- `POST /api/cart/remove`: Remove a product from the cart.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rehmankhan786/ecommerce
   ```

2. Navigate to the project directory:
   ```bash
   cd project-root
   ```

3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd backend && npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables
Create a `.env` file in the root of your project with the following variables:

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

---

## Deployment

### Frontend
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to a static hosting service like Netlify or Vercel.

### Backend
1. Deploy the backend to a server or cloud service like Heroku, AWS, or DigitalOcean.
2. Ensure the `MONGO_URI` and `JWT_SECRET` variables are configured in the production environment.

---

## Future Enhancements
- Add payment gateway integration.
- Implement wishlist functionality.
- Add user reviews and ratings for products.
- Enhance admin panel for detailed analytics.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact
- **Developer**: Atta-ur-Rehman Khan
- **Email**: arkhan434@gmail.com
- **Phone**: +91-8755414329

Feel free to reach out for any questions or feedback!

