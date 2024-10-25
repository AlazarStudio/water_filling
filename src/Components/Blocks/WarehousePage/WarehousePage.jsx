// src/Components/Blocks/WarehousePage/WarehousePage.js
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

function WarehousePage({ products, warehouseData, onAddStock, onEditStock, onDeleteStock }) {
    const [editItem, setEditItem] = useState(null);
    const [newStock, setNewStock] = useState(null);

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleSaveEdit = () => {
        onEditStock(editItem);
        setEditItem(null);
    };

    const handleCancelEdit = () => {
        setEditItem(null);
    };

    const handleNewStockClick = () => {
        setNewStock({ productId: '', stock: 0 });
    };

    const handleSaveNewStock = () => {
        const existingItem = warehouseData.find(item => item.productId === newStock.productId);
        if (existingItem) {
            // Если продукт уже есть на складе, увеличиваем его количество
            const updatedStock = {
                ...existingItem,
                stock: parseInt(existingItem.stock) + parseInt(newStock.stock)
            };
            onEditStock(updatedStock);
        } else {
            // Если продукта еще нет на складе, добавляем его
            onAddStock(newStock);
        }
        setNewStock(null);
    };

    const handleCancelNewStock = () => {
        setNewStock(null);
    };

    return (
        <Container sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Управление складом
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleNewStockClick}
                sx={{ mb: 2 }}
            >
                Добавить на склад
            </Button>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Продукт</TableCell>
                            <TableCell>Количество на складе</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouseData.map((item) => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                <TableRow key={item.productId}>
                                    <TableCell>{product ? product.name : 'Неизвестный продукт'}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleEditClick(item)}
                                        >
                                            Изменить
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => onDeleteStock(item.productId)}
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

            {/* Диалог для редактирования количества на складе */}
            {editItem && (
                <Dialog open={true} onClose={handleCancelEdit}>
                    <DialogTitle>Изменить количество</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Количество"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={editItem.stock}
                            onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
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

            {/* Диалог для добавления новой позиции на склад */}
            {newStock && (
                <Dialog open={true} onClose={handleCancelNewStock}>
                    <DialogTitle>Добавить новый продукт на склад</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="product-select-label">Продукт</InputLabel>
                            <Select
                                labelId="product-select-label"
                                value={newStock.productId}
                                onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
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
                            value={newStock.stock}
                            onChange={(e) => setNewStock({ ...newStock, stock: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveNewStock} color="primary">
                            Сохранить
                        </Button>
                        <Button onClick={handleCancelNewStock} color="secondary">
                            Отмена
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}

export default WarehousePage;
