// src/Components/Pages/RegisterPage.js
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        // Простая проверка для демонстрации
        if (email && password) {
            alert("Регистрация успешна!");
            navigate("/login");
        } else {
            alert("Пожалуйста, заполните все поля");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Регистрация
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
                    onClick={handleRegister}
                >
                    Зарегистрироваться
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/login")}
                >
                    Уже есть аккаунт? Войти
                </Button>
            </Box>
        </Container>
    );
}

export default RegisterPage;
