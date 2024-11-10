import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../services/api'; // Axios instance

// Import necessary Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const TransactionsPieChart = ({ month }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const response = await api.get('/pie-chart', { params: { month } });
                const data = response.data; // Assuming it returns an array of { category, count } objects

                // Prepare data for Chart.js
                setChartData({
                    labels: data.map(item => item.category),
                    datasets: [
                        {
                            label: 'Number of Items per Category',
                            data: data.map(item => item.count),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40',
                            ],
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
            }
        };

        fetchPieChartData();
    }, [month]); // Depend on `month` to refetch when it changes

    return (
        <div>
            <h3>Transactions Pie Chart</h3>
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    },
                }}
            />
        </div>
    );
};

export default TransactionsPieChart;
