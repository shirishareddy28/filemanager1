const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction'); // Adjust the path as needed

// Database connection
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Error connecting to the database:', err);
});

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Fetch data from third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        
        // Check if data was returned
        if (response.data && Array.isArray(response.data)) {
            // Insert data into the database
            const result = await Transaction.insertMany(response.data);
            console.log(`${result.length} transactions inserted into the database`);

            // Close the database connection after seeding is done
            mongoose.connection.close();
        } else {
            console.error('No data returned from the API');
            mongoose.connection.close();
        }
    } catch (error) {
        console.error('Error while seeding database:', error);
        mongoose.connection.close();
    }
};

// Run the seeding function
seedDatabase();
