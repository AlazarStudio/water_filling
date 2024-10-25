// src/Components/Blocks/Products/ProductsPage.js
import React, { useState } from "react";
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";

// Функция для форматирования даты
const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

function ProductsPage({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
    const [editProduct, setEditProduct] = useState(null);

    const handleEditClick = (product) => {
        setEditProduct(product);
    };

    const handleSaveEdit = () => {
        if (editProduct) {
            if (editProduct.id) {
                onEditProduct(editProduct);
            } else {
                onAddProduct(editProduct);
            }
            setEditProduct(null);
        }
    };

    const handleCancelEdit = () => {
        setEditProduct(null);
    };

    return (
        <Container sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Управление продукцией
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditProduct({ id: '', name: '', description: '', price: '', stock: '', category: '', date: '' })}
                >
                    Добавить продукт
                </Button>
            </Box>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>Количество на складе</TableCell>
                            <TableCell>Категория</TableCell>
                            <TableCell>Дата добавления</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.price} ₽</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{formatDate(product.date)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={() => onDeleteProduct(product.id)}
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

            {/* Диалог для добавления/редактирования продукта */}
            {editProduct && (
                <Dialog open={true} onClose={handleCancelEdit}>
                    <DialogTitle>{editProduct.id ? "Редактировать продукт" : "Добавить продукт"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Название"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        />
                        <TextField
                            label="Описание"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editProduct.description}
                            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        />
                        <TextField
                            label="Цена"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        />
                        <TextField
                            label="Количество на складе"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={editProduct.stock}
                            onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-label">Категория</InputLabel>
                            <Select
                                labelId="category-label"
                                value={editProduct.category}
                                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                label="Категория"
                            >
                                <MenuItem value="Напитки">Напитки</MenuItem>
                                <MenuItem value="Вода">Вода</MenuItem>
                                <MenuItem value="Соки">Соки</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Дата добавления"
                            variant="outlined"
                            fullWidth
                            type="date"
                            margin="normal"
                            value={editProduct.date}
                            onChange={(e) => setEditProduct({ ...editProduct, date: e.target.value })}
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

export default ProductsPage;
