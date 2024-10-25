// src/Components/Orders/OrdersList.js
import React, { useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert
} from "@mui/material";

// Функция для форматирования даты
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

// Функция для перевода состояния на русский
const translateStatus = (status) => {
    switch (status) {
        case 'active':
            return 'Активный';
        case 'completed':
            return 'Завершённый';
        case 'pending':
            return 'В ожидании';
        case 'canceled':
            return 'Отменённый';
        default:
            return status;
    }
};

function OrdersList({ orders, products, warehouseData, onEditOrder, onDeleteOrder, onAddOrder, onUpdateStock }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [editOrder, setEditOrder] = useState(null);
    const [newOrder, setNewOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const handleEditClick = (order) => {
        setEditOrder(order);
    };

    const handleSaveEdit = () => {
        onEditOrder(editOrder);
        setEditOrder(null);
    };

    const handleCancelEdit = () => {
        setEditOrder(null);
    };

    const handleNewOrderClick = () => {
        setNewOrder({ client: '', productId: '', quantity: 1, date: '', status: 'active' });
    };

    const handleSaveNewOrder = () => {
        const productStock = getStock(newOrder.productId);
        if (newOrder.quantity > productStock) {
            setErrorMessage(`На складе доступно только ${productStock} единиц выбранного продукта.`);
        } else {
            onAddOrder(newOrder);
            onUpdateStock(newOrder.productId, productStock - newOrder.quantity);
            setNewOrder(null);
            setErrorMessage('');
        }
    };

    const handleCancelNewOrder = () => {
        setNewOrder(null);
        setErrorMessage('');
    };

    // Функция для получения количества на складе по productId
    const getStock = (productId) => {
        const item = warehouseData.find((w) => w.productId === productId);
        return item ? item.stock : 0;
    };

    return (
        <Container sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Список заказов
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleNewOrderClick}
                sx={{ mb: 2 }}
            >
                Добавить заказ
            </Button>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Клиент</TableCell>
                            <TableCell>Продукт</TableCell>
                            <TableCell>Количество</TableCell>
                            <TableCell>Цена за единицу</TableCell>
                            <TableCell>Общая стоимость</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Состояние</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedOrders.map((order) => {
                            const product = products.find((p) => p.id === order.productId);
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.client}</TableCell>
                                    <TableCell>{product ? product.name : 'Неизвестный продукт'}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{product ? `${product.price} ₽` : '—'}</TableCell>
                                    <TableCell>{product ? product.price * order.quantity : 0} ₽</TableCell>
                                    <TableCell>{formatDate(order.date)}</TableCell>
                                    <TableCell>{translateStatus(order.status)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleEditClick(order)}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => onDeleteOrder(order.id)}
                                            sx={{ ml: 1 }}
                                        >
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>

            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {/* Диалог для добавления нового заказа */}
            {newOrder && (
                <Dialog open={true} onClose={handleCancelNewOrder}>
                    <DialogTitle>Добавить новый заказ</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Клиент"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newOrder.client}
                            onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="product-label">Продукт</InputLabel>
                            <Select
                                labelId="product-label"
                                value={newOrder.productId}
                                onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                                label="Продукт"
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name} (доступно: {getStock(product.id)})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Количество"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={newOrder.quantity}
                            inputProps={{
                                min: 1,
                                max: getStock(newOrder.productId),
                            }}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10) || 0;
                                const maxStock = getStock(newOrder.productId);

                                if (value <= maxStock) {
                                    setNewOrder({ ...newOrder, quantity: value });
                                } else {
                                    setNewOrder({ ...newOrder, quantity: maxStock });
                                }
                            }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="new-order-status-label">Состояние</InputLabel>
                            <Select
                                labelId="new-order-status-label"
                                value={newOrder.status}
                                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                                label="Состояние"
                            >
                                <MenuItem value="active">Активный</MenuItem>
                                <MenuItem value="completed">Завершённый</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Дата"
                            variant="outlined"
                            fullWidth
                            type="date"
                            margin="normal"
                            value={newOrder.date}
                            onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveNewOrder} color="primary">
                            Сохранить
                        </Button>
                        <Button onClick={handleCancelNewOrder} color="secondary">
                            Отмена
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {editOrder && (
                <Dialog open={true} onClose={handleCancelEdit}>
                    <DialogTitle>Редактировать заказ</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Клиент"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editOrder.client}
                            onChange={(e) => setEditOrder({ ...editOrder, client: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="product-label">Продукт</InputLabel>
                            <Select
                                labelId="product-label"
                                value={editOrder.productId}
                                onChange={(e) => setEditOrder({ ...editOrder, productId: e.target.value })}
                                label="Продукт"
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Количество"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={editOrder.quantity}
                            inputProps={{
                                min: 1,
                                max: getStock(editOrder.productId) + editOrder.quantity, // Добавляем текущее количество к доступному на складе
                            }}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10) || 0;
                                const maxStock = getStock(editOrder.productId) + editOrder.quantity;

                                if (value <= maxStock) {
                                    setEditOrder({ ...editOrder, quantity: value });
                                } else {
                                    setEditOrder({ ...editOrder, quantity: maxStock });
                                }
                            }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="edit-status-label">Состояние</InputLabel>
                            <Select
                                labelId="edit-status-label"
                                value={editOrder.status}
                                onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                                label="Состояние"
                            >
                                <MenuItem value="active">Активный</MenuItem>
                                <MenuItem value="completed">Завершённый</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Дата"
                            variant="outlined"
                            fullWidth
                            type="date"
                            margin="normal"
                            value={editOrder.date}
                            onChange={(e) => setEditOrder({ ...editOrder, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveEdit} color="primary">
                            Сохранить
                        </Button>
                        <Button onClick={handleCancelEdit} color="secondary">
                            Отмена
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}

export default OrdersList;
