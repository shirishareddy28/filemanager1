// controllers/transactionController.js

const axios = require('axios');
const Transaction = require('../models/Transaction');

// 1. Seed the Database with Third-Party API Data
exports.seedDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(response.data);
        res.status(200).json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to seed database' });
    }
};

// 2. Get Transactions with Pagination and Search
exports.getTransactions = async (req, res) => {
    const { month, page = 1, per_page = 10, search = '' } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Convert month name to index

    try {
        // Define query for transactions within the specified month and search criteria
        const query = {
            dateOfSale: {
                $gte: new Date(2000, monthIndex, 1),
                $lt: new Date(2000, monthIndex + 1, 1),
            },
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
            ],
        };

        const transactions = await Transaction.find(query)
            .skip((page - 1) * per_page)
            .limit(Number(per_page));

        const totalTransactions = await Transaction.countDocuments(query);

        res.json({ transactions, totalTransactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// 3. Get Statistics for a Selected Month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    try {
        const start = new Date(2000, monthIndex, 1);
        const end = new Date(2000, monthIndex + 1, 1);

        const totalSaleAmount = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end }, soldStatus: true } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const soldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, soldStatus: true });
        const unsoldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, soldStatus: false });

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems: soldItemsCount,
            unsoldItems: unsoldItemsCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// 4. Get Bar Chart Data for Price Ranges in a Selected Month
exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    try {
        const start = new Date(2000, monthIndex, 1);
        const end = new Date(2000, monthIndex + 1, 1);

        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity },
        ];

        const data = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: start, $lt: end },
                price: { $gte: range.min, $lte: range.max === Infinity ? 1e9 : range.max },
            });
            return { range: `${range.min}-${range.max}`, count };
        }));

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
};

// 5. Get Pie Chart Data for Categories in a Selected Month
exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    try {
        const start = new Date(2000, monthIndex, 1);
        const end = new Date(2000, monthIndex + 1, 1);

        const data = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.json(data.map((item) => ({ category: item._id, count: item.count })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};

// 6. Get Combined Data (Statistics, Bar Chart, Pie Chart)
exports.getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        // Call each function to gather data
        const statisticsResponse = await this.getStatistics(req, res);
        const barChartResponse = await this.getBarChart(req, res);
        const pieChartResponse = await this.getPieChart(req, res);

        res.json({
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};
