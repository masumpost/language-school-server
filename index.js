const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.givoou3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
         client.connect();



        // Send a ping to confirm a successful connection
         client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch(error) {
        // Ensures that the client will close when you finish/error
        // await client.close();
        console.log(error)
    }
}
run().catch(console.dir);


const usersCollection = client.db('schoolDB').collection('users');
const teachersCollection = client.db('schoolDB').collection('teachers');
const classesCollection = client.db('schoolDB').collection('classes');

//get teachers data
app.get('/teachers', async (req, res) => {
    const result = await teachersCollection.find().toArray();
    res.send(result);
});

//get classes data

app.get('/classes', async (req, res) => {
    const result = await classesCollection.find().toArray();
    res.send(result);
})

app.get('/', (req, res) => {
    res.send('school server is running')
});

app.listen(port, () => {
    console.log(`Language server is running on port: ${port}`)
})