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
    InputLabel
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

function OrdersList({ orders, onEditOrder, onDeleteOrder, onAddOrder }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [editOrder, setEditOrder] = useState(null);
    const [newOrder, setNewOrder] = useState(null);

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
        setNewOrder({ client: '', volume: '', packageType: '', date: '', status: 'active' });
    };

    const handleSaveNewOrder = () => {
        onAddOrder(newOrder);
        setNewOrder(null);
    };

    const handleCancelNewOrder = () => {
        setNewOrder(null);
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
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'id'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'client'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('client')}
                                >
                                    Клиент
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'volume'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('volume')}
                                >
                                    Объем
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'packageType'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('packageType')}
                                >
                                    Тип упаковки
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'date'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('date')}
                                >
                                    Дата
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'status'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('status')}
                                >
                                    Состояние
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.client}</TableCell>
                                <TableCell>{order.volume}</TableCell>
                                <TableCell>{order.packageType}</TableCell>
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
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Диалог редактирования заказа */}
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
                        <TextField
                            label="Объем"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editOrder.volume}
                            onChange={(e) => setEditOrder({ ...editOrder, volume: e.target.value })}
                        />
                        <TextField
                            label="Тип упаковки"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editOrder.packageType}
                            onChange={(e) => setEditOrder({ ...editOrder, packageType: e.target.value })}
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
                        <TextField
                            label="Объем"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newOrder.volume}
                            onChange={(e) => setNewOrder({ ...newOrder, volume: e.target.value })}
                        />
                        <TextField
                            label="Тип упаковки"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newOrder.packageType}
                            onChange={(e) => setNewOrder({ ...newOrder, packageType: e.target.value })}
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
        </Container>
    );
}

export default OrdersList;
