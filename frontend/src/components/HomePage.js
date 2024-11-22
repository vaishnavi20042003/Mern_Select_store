import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        categoryId: ''
    });

    // Fetch categories and products on component mount
    useEffect(() => {
        // Fetch Categories
        axios.get('http://localhost:5000/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        // Fetch Products
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data); // Initially show all products
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    // Handle category selection to filter products
    const handleCategorySelect = (categoryId) => {
        setNewProduct({ ...newProduct, categoryId }); // Set selected category in product form
        if (categoryId) {
            setFilteredProducts(products.filter(product => product.category._id === categoryId));
        } else {
            setFilteredProducts(products); // Show all products if no category is selected
        }
    };

    // Handle input changes for category and product forms
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleCategoryInputChange = (e) => {
        setNewCategory(e.target.value);
    };

    // Submit new category
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (!newCategory) {
            alert('Category name is required!');
            return;
        }

        axios.post('http://localhost:5000/api/add/category', { name: newCategory })
            .then(response => {
                alert('Category added successfully!');
                setCategories([...categories, response.data.category]); // Update categories list
                setNewCategory(''); // Reset category form
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
    };

    // Submit new product
    const handleProductSubmit = (e) => {
        e.preventDefault();
        const { name, price, categoryId } = newProduct;
        if (!name || !price || !categoryId) {
            alert('All fields are required!');
            return;
        }

        axios.post('http://localhost:5000/api/add/product', { name, price, categoryId })
            .then(response => {
                alert('Product added successfully!');
                setProducts([...products, response.data.product]); // Update products list
                setFilteredProducts([...products, response.data.product]); // Update filtered products list
                setNewProduct({ name: '', price: '', categoryId: '' }); // Reset product form
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    return (
        <div className="homepage-container">
            <h1>Select-Store</h1>
            <h3>Premium skincare product store</h3>

            <div className="category-form-box">
                <h2>Add Category</h2>
                <form onSubmit={handleCategorySubmit} className="category-form">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={handleCategoryInputChange}
                        placeholder="Enter category name"
                        required
                    />
                    <button type="submit">Add Category</button>
                </form>
            </div>

            <div className="product-filter-box">
                <h2>Products</h2>
                <h3>Filter by Category</h3>
                <button onClick={() => handleCategorySelect('')}>All Products</button>
                {categories.map(category => (
                    <button key={category._id} onClick={() => handleCategorySelect(category._id)}>
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="products-display">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product._id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>

            <div className="product-form-box">
                <h2>Add New Product</h2>
                <form onSubmit={handleProductSubmit} className="product-form">
                    <div>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Category</label>
                        <select
                            name="categoryId"
                            value={newProduct.categoryId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
