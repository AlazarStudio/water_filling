// src/Components/Pages/Main_Page.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import OrdersList from "../Blocks/OrdersList/OrdersList";
import Dashboard from "../Blocks/Dashboard/Dashboard";
import ProductsPage from "../Blocks/ProductsPage/ProductsPage";

function Main_Page() {
    const { page } = useParams();
    const [userEmail, setUserEmail] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("user");
        if (storedEmail) {
            setUserEmail(storedEmail);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetch("/orders.json")
            .then((response) => response.json())
            .then((data) => setOrders(data))
            .catch((error) => console.error("Ошибка загрузки заказов:", error));
    }, []);

    useEffect(() => {
        fetch("/products.json")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Ошибка загрузки продукции:", error));
    }, []);

    const onLogout = () => {
        localStorage.clear();
        setUserEmail(null);
        navigate('/login');
    };

    const handleAddOrder = (newOrder) => {
        const maxId = orders.length > 0 ? Math.max(...orders.map(order => parseInt(order.id))) : 0;
        const nextId = (maxId + 1).toString().padStart(5, '0');

        const orderWithId = { ...newOrder, id: nextId };
        setOrders((prevOrders) => [...prevOrders, orderWithId]);
    };

    const handleEditOrder = (editedOrder) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === editedOrder.id ? editedOrder : order))
        );
    };

    const handleDeleteOrder = (orderId) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    };

    const renderContent = () => {
        switch (page) {
            case 'dashboard':
                return <Dashboard orders={orders} />;
            case 'orders':
                return (
                    <OrdersList
                        orders={orders}
                        onEditOrder={handleEditOrder}
                        onDeleteOrder={handleDeleteOrder}
                        onAddOrder={handleAddOrder}
                    />
                );
            case 'products':
                return (
                    <ProductsPage
                        products={products}
                        onAddProduct={handleAddProduct}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                );
            default:
                return <Dashboard orders={orders} />;
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Water Bottling System
                    </Typography>
                    <Button color="inherit" component={Link} to="/dashboard">
                        Главная
                    </Button>
                    <Button color="inherit" component={Link} to="/orders">
                        Заказы
                    </Button>
                    <Button color="inherit" component={Link} to="/products">
                        Продукция
                    </Button>
                    <Button color="inherit" onClick={onLogout}>
                        Выйти
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
                {renderContent()}
            </Box>
        </>
    );
}

export default Main_Page;
