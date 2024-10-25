import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

function AddOrder({ onAddOrder }) {
    const [client, setClient] = useState("");
    const [volume, setVolume] = useState("");
    const [packageType, setPackageType] = useState("");
    const [date, setDate] = useState("");

    const handleAddOrder = () => {
        const newOrder = {
            id: Date.now(), // Используем текущую метку времени в качестве ID
            client,
            volume,
            packageType,
            date,
        };
        onAddOrder(newOrder);
        setClient("");
        setVolume("");
        setPackageType("");
        setDate("");
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Добавить новый заказ
            </Typography>
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="Клиент"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                />
                <TextField
                    label="Объем"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />
                <TextField
                    label="Тип упаковки"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                />
                <TextField
                    label="Дата"
                    variant="outlined"
                    fullWidth
                    type="date"
                    margin="normal"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleAddOrder}
                >
                    Добавить заказ
                </Button>
            </Box>
        </Container>
    );
}

export default AddOrder;
