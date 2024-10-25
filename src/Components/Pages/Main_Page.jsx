// src/Components/Pages/Main_Page.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import OrdersList from "../Blocks/OrdersList/OrdersList";
import Dashboard from "../Blocks/Dashboard/Dashboard";
import ProductsPage from "../Blocks/ProductsPage/ProductsPage";
import WarehousePage from "../Blocks/WarehousePage/WarehousePage";

function Main_Page() {
    const { page } = useParams();
    const [userEmail, setUserEmail] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouseData, setWarehouseData] = useState([]);
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

    useEffect(() => {
        fetch("/warehouse.json")
            .then((response) => response.json())
            .then((data) => setWarehouseData(data))
            .catch((error) => console.error("Ошибка загрузки данных склада:", error));
    }, []);

    const handleAddStock = (newStock) => {
        setWarehouseData((prevData) => [...prevData, newStock]);
    };

    const handleEditStock = (editedStock) => {
        setWarehouseData((prevData) =>
            prevData.map((item) =>
                item.productId === editedStock.productId ? editedStock : item
            )
        );
    };

    const handleDeleteStock = (productId) => {
        setWarehouseData((prevData) =>
            prevData.filter((item) => item.productId !== productId)
        );
    };

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


    const handleAddProduct = (newProduct) => {
        const maxId = products.length > 0 ? Math.max(...products.map(product => parseInt(product.id))) : 0;
        const nextId = (maxId + 1).toString().padStart(5, '0');

        const productWithId = { ...newProduct, id: nextId };
        setProducts((prevProducts) => [...prevProducts, productWithId]);
    };

    const handleEditProduct = (editedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === editedProduct.id ? editedProduct : product))
        );
    };

    const handleDeleteProduct = (productId) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    };

    const handleUpdateStock = (productId, newStock) => {
        setWarehouseData((prevData) =>
            prevData.map((item) =>
                item.productId === productId ? { ...item, stock: newStock } : item
            )
        );
    };
    const renderContent = () => {
        switch (page) {
            case 'dashboard':
                return <Dashboard orders={orders} products={products} />;
            case 'orders':
                return (
                    <OrdersList
                        orders={orders}
                        products={products}
                        warehouseData={warehouseData}
                        onEditOrder={handleEditOrder}
                        onDeleteOrder={handleDeleteOrder}
                        onAddOrder={handleAddOrder}
                        onUpdateStock={handleUpdateStock}
                    />
                );
            case 'products':
                return (
                    <ProductsPage
                        products={products}
                        warehouseData={warehouseData} // Передаем данные о складе
                        onAddProduct={handleAddProduct}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                );
            case 'warehouse':
                return (
                    <WarehousePage
                        products={products}
                        warehouseData={warehouseData}
                        onAddStock={handleAddStock}
                        onEditStock={handleEditStock}
                        onDeleteStock={handleDeleteStock}
                    />
                );
            default:
                return <Dashboard orders={orders} />;
        }
    };

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Система розлива воды
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
                    <Button color="inherit" component={Link} to="/warehouse">
                        Склад
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
