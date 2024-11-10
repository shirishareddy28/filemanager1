import React from 'react';

const StatisticsBox = ({ statistics }) => {
    return (
        <div>
            <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.soldItems}</p>
            <p>Total Unsold Items: {statistics.unsoldItems}</p>
        </div>
    );
};

export default StatisticsBox;
