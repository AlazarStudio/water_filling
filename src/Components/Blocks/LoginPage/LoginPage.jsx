// src/Components/Pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка данных пользователей из JSON файла
        fetch("/users.json")
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Ошибка загрузки пользователей:", error));
    }, []);

    const handleLogin = () => {
        // Проверка наличия пользователя в списке
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            // Сохраняем пользователя в localStorage
            localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
            navigate("/");
        } else {
            alert("Неправильный email или пароль");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Вход
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    fullWidth
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Войти
                </Button>
            </Box>
        </Container>
    );
}

export default LoginPage;
