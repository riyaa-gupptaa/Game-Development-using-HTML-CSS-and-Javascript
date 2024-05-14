// Require the MongoClient from the mongodb package
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'gameDB';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect(async (err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Example: Insert a document into the 'users' collection
    const usersCollection = db.collection('users');
    const user = { username: 'example', password: 'password' };
    const insertResult = await usersCollection.insertOne(user);
    console.log('Inserted document:', insertResult.insertedId);

    // Example: Find all documents in the 'users' collection
    const allUsers = await usersCollection.find({}).toArray();
    console.log('All users:', allUsers);

    // Example: Update a document in the 'users' collection
    const updateResult = await usersCollection.updateOne({ username: 'example' }, { $set: { password: 'newpassword' } });
    console.log('Updated document count:', updateResult.modifiedCount);

    // Example: Delete a document from the 'users' collection
    const deleteResult = await usersCollection.deleteOne({ username: 'example' });
    console.log('Deleted document count:', deleteResult.deletedCount);

    // Close the connection
    client.close();
});
