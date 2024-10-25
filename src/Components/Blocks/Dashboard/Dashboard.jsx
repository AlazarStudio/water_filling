// src/Components/Blocks/Dashboard/Dashboard.js
import React, { useState } from "react";
import { Container, Typography, Paper, Box, ButtonGroup, Button } from "@mui/material";
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

function Dashboard({ orders }) {
    const [timeRange, setTimeRange] = useState('month'); // Состояние для диапазона времени

    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const activeOrders = orders.filter(order => order.status === 'active').length;

    // Фильтрация заказов в зависимости от выбранного диапазона времени
    const filterOrdersByRange = (range) => {
        const now = dayjs();
        switch (range) {
            case 'day':
                return orders.filter(order => dayjs(order.date).isSame(now, 'day'));
            case 'week':
                return orders.filter(order => dayjs(order.date).isSame(now, 'week'));
            case 'month':
                return orders.filter(order => dayjs(order.date).isSame(now, 'month'));
            case 'year':
                return orders.filter(order => dayjs(order.date).isSame(now, 'year'));
            default:
                return orders;
        }
    };

    const filteredOrders = filterOrdersByRange(timeRange);

    let timeRangeRu = timeRange == 'day' ? 'день' : timeRange == 'week' ? 'неделю' : timeRange == 'month' ? 'месяц' : timeRange == 'year' && 'год';

    // Группировка заказов по дате
    const ordersByDate = filteredOrders.reduce((acc, order) => {
        const formattedDate = formatDate(order.date);
        acc[formattedDate] = (acc[formattedDate] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(ordersByDate),
        datasets: [
            {
                label: `Количество заказов (${timeRangeRu})`,
                data: Object.values(ordersByDate),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
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
                text: `Статистика заказов за ${timeRangeRu}`,
            },
        },
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Главная страница
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Добро пожаловать в систему розлива воды!</Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                        <strong>Всего заказов:</strong> {totalOrders}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Активные заказы:</strong> {activeOrders}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Завершенные заказы:</strong> {completedOrders}
                    </Typography>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button onClick={() => setTimeRange('day')}>День</Button>
                        <Button onClick={() => setTimeRange('week')}>Неделя</Button>
                        <Button onClick={() => setTimeRange('month')}>Месяц</Button>
                        <Button onClick={() => setTimeRange('year')}>Год</Button>
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
