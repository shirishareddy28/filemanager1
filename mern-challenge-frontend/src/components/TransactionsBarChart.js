// Add this at the top of each component file where you're using Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api'; // Axios instance

const TransactionsBarChart = ({ month }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchBarChartData = async () => {
            try {
                const response = await api.get('/bar-chart', { params: { month } });
                const data = response.data; // Assuming it returns an array with count for each range

                // Prepare data for Chart.js
                setChartData({
                    labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-above'],
                    datasets: [
                        {
                            label: 'Number of Items',
                            data: data.map(item => item.count),  // Ensure each item has a 'count' field
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
            }
        };

        fetchBarChartData();
    }, [month]); // Re-fetch when the `month` prop changes

    return (
        <div>
            <h3>Transactions Bar Chart</h3>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Items',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Price Range',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                }}
            />
        </div>
    );
};

export default TransactionsBarChart;

