import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import OrdersList from "../Blocks/OrdersList/OrdersList";
import AddOrder from "../Blocks/AddOrder/AddOrder";

function Main_Page({ children, ...props }) {
    const [userEmail, setUserEmail] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("/orders.json")
            .then((response) => response.json())
            .then((data) => setOrders(data))
            .catch((error) => console.error("Ошибка загрузки заказов:", error));
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("user");
        if (storedEmail) {
            setUserEmail(storedEmail);
        } else {
            navigate('/login');
        }
    }, [navigate]);

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

    return (
        <>
            {userEmail ? (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Water Bottling System
                        </Typography>
                        <Button color="inherit" onClick={onLogout}>
                            Выйти
                        </Button>
                    </Toolbar>
                </AppBar>
            ) : null}
            <Box sx={{ p: 3 }}>
                <AddOrder onAddOrder={handleAddOrder} />
                <OrdersList orders={orders} />
            </Box>
        </>
    );
}

export default Main_Page;
