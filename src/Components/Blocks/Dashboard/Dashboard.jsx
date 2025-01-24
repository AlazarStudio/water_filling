// src/Components/Blocks/Dashboard/Dashboard.js
import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    ButtonGroup,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Функция для форматирования даты
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

function Dashboard({ orders, products }) {
    const [timeRange, setTimeRange] = useState('month');

    const completedOrders = orders.filter(order => order.status === 'completed');
    const activeOrders = orders.filter(order => order.status === 'active');

    // Фильтрация заказов в зависимости от выбранного диапазона времени
    const filterOrdersByRange = (range) => {
        const now = dayjs();
        switch (range) {
            case 'day':
                return {
                    completed: completedOrders.filter(order => dayjs(order.date).isSame(now, 'day')),
                    active: activeOrders.filter(order => dayjs(order.date).isSame(now, 'day')),
                };
            case 'week':
                return {
                    completed: completedOrders.filter(order => dayjs(order.date).isSame(now, 'week')),
                    active: activeOrders.filter(order => dayjs(order.date).isSame(now, 'week')),
                };
            case 'month':
                return {
                    completed: completedOrders.filter(order => dayjs(order.date).isSame(now, 'month')),
                    active: activeOrders.filter(order => dayjs(order.date).isSame(now, 'month')),
                };
            case 'year':
                return {
                    completed: completedOrders.filter(order => dayjs(order.date).isSame(now, 'year')),
                    active: activeOrders.filter(order => dayjs(order.date).isSame(now, 'year')),
                };
            default:
                return { completed: completedOrders, active: activeOrders };
        }
    };

    const { completed: filteredCompletedOrders, active: filteredActiveOrders } = filterOrdersByRange(timeRange);

    let timeRangeRu = timeRange === 'day' ? 'день' : timeRange === 'week' ? 'неделю' : timeRange === 'month' ? 'месяц' : 'год';

    // Группировка заказов по дате с расчетом общего дохода, чистой прибыли и затрат
    const revenueData = {};
    const profitData = {};
    const costData = {};

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalCost = 0;

    filteredCompletedOrders.forEach(order => {
        const product = products?.find(p => p.id === order.productId);
        const formattedDate = formatDate(order.date);

        if (product) {
            const totalOrderRevenue = product.price * order.quantity;
            const totalOrderCost = product.costPrice * order.quantity;
            const totalOrderProfit = totalOrderRevenue - totalOrderCost;

            revenueData[formattedDate] = (revenueData[formattedDate] || 0) + totalOrderRevenue;
            profitData[formattedDate] = (profitData[formattedDate] || 0) + totalOrderProfit;
            costData[formattedDate] = (costData[formattedDate] || 0) + totalOrderCost;

            totalRevenue += totalOrderRevenue;
            totalProfit += totalOrderProfit;
            totalCost += totalOrderCost;
        }
    });

    const chartData = {
        labels: Object.keys(revenueData),
        datasets: [
            {
                label: `Общий доход (${timeRangeRu})`,
                data: Object.values(revenueData),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
            {
                label: `Чистая прибыль (${timeRangeRu})`,
                data: Object.values(profitData),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: `Затраты (${timeRangeRu})`,
                data: Object.values(costData),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Доход, затраты и прибыль за ${timeRangeRu}`,
            },
        },
    };

    return (
        <Container maxWidth={false} sx={{ p: 10, width: '100%', maxWidth: '1400px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Главная страница
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Добро пожаловать в систему розлива воды!</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    {/* Таблица с заказами */}
                    <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography variant="h6">Статистика заказов</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Показатель</TableCell>
                                    <TableCell>Значение за {timeRangeRu}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Общее количество заказов</TableCell>
                                    <TableCell>{filteredCompletedOrders.length + filteredActiveOrders.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Завершенные заказы</TableCell>
                                    <TableCell>{filteredCompletedOrders.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Активные заказы</TableCell>
                                    <TableCell>{filteredActiveOrders.length}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>

                    {/* Таблица с финансовыми показателями */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Финансовые показатели</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Показатель</TableCell>
                                    <TableCell>Значение за {timeRangeRu}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Общий доход</TableCell>
                                    <TableCell>{totalRevenue.toFixed(2)} ₽</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Затраты</TableCell>
                                    <TableCell>{totalCost.toFixed(2)} ₽</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Чистая прибыль</TableCell>
                                    <TableCell>{totalProfit.toFixed(2)} ₽</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button
                            variant={timeRange === 'day' ? 'contained' : 'outlined'}
                            onClick={() => setTimeRange('day')}
                        >
                            День
                        </Button>
                        <Button
                            variant={timeRange === 'week' ? 'contained' : 'outlined'}
                            onClick={() => setTimeRange('week')}
                        >
                            Неделя
                        </Button>
                        <Button
                            variant={timeRange === 'month' ? 'contained' : 'outlined'}
                            onClick={() => setTimeRange('month')}
                        >
                            Месяц
                        </Button>
                        <Button
                            variant={timeRange === 'year' ? 'contained' : 'outlined'}
                            onClick={() => setTimeRange('year')}
                        >
                            Год
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Line data={chartData} options={options} />
                </Box>
            </Paper>
        </Container>
    );
}

export default Dashboard;
