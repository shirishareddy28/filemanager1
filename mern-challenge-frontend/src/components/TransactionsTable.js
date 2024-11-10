import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month }) => {
    // State for transactions, page, and search text
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // Function to fetch transactions based on page and search
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/transactions', {
                params: {
                    month,
                    page,
                    search,
                    per_page: 10,  // Adjust per page as needed
                },
            });
            setTransactions(response.data.transactions); // Assume response has transactions data
            setTotalPages(response.data.totalPages); // Total pages for pagination
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Fetch transactions on component mount or when dependencies change
    useEffect(() => {
        fetchTransactions();
    }, [month, page, search]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    // Pagination controls
    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div>
            {/* Search box */}
            <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={handleSearchChange}
            />

            {/* Transactions table */}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionsTable;
