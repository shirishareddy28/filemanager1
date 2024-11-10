import './App.css';  // Ensure this path is correct

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StaticsBox';
import TransactionsBarChart from './components/TransactionsBarChart';
import TransactionsPieChart from './components/TransactionsPieChart';

const App = () => {
    const [month, setMonth] = useState('March');
    const [search, setSearch] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [priceData, setPriceData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [loading, setLoading] = useState(false); // To handle loading state

    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
        fetchPriceData();
        fetchCategoryData();
    }, [month, search, currentPage]); // Adding currentPage to dependencies

    const fetchTransactions = async () => {
        setLoading(true);  // Set loading to true when fetching data
        try {
            const response = await axios.get('/transactions', { params: { month, search, page: currentPage } });
            setTransactions(response.data.transactions);
            setTotalTransactions(response.data.totalTransactions); // Assuming the backend sends this info
        } catch (error) {
            console.error('Error fetching transactions', error);
        }
        setLoading(false); // Set loading to false after data is fetched
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/statistics', { params: { month } });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics', error);
        }
    };

    const fetchPriceData = async () => {
        try {
            const response = await axios.get('/bar-chart', { params: { month } });
            setPriceData(response.data);
        } catch (error) {
            console.error('Error fetching price data', error);
        }
    };

    const fetchCategoryData = async () => {
        try {
            const response = await axios.get('/pie-chart', { params: { month } });
            setCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching category data', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);  // Reset to page 1 when search changes
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
        setCurrentPage(1);  // Reset to page 1 when month changes
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalTransactions / 10)) { // Assuming 10 items per page
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="app-container">
            <div className="filters">
                <select value={month} onChange={handleMonthChange}>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                      .map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <input 
                    type="text" 
                    placeholder="Search transactions" 
                    value={search} 
                    onChange={handleSearchChange} 
                />
            </div>

            {loading ? (
                <div>Loading...</div>  // Show loading indicator
            ) : (
                <>
                    <TransactionsTable 
                        transactions={transactions} 
                        fetchTransactions={fetchTransactions} 
                        handleNextPage={handleNextPage}
                        handlePreviousPage={handlePreviousPage}
                        currentPage={currentPage}
                    />
                    <StatisticsBox statistics={statistics} />
                    <TransactionsBarChart data={priceData} />
                    <TransactionsPieChart data={categoryData} />
                </>
            )}

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage} disabled={currentPage * 10 >= totalTransactions}>Next</button>
            </div>
        </div>
    );
};

export default App;
