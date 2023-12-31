const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        //  client.connect();



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


//get users data
app.post('/users', async (req, res) => {
  const user = req.body;
  const query = { user: user.email };
  const existingUsers = await usersCollection.findOne(query);

  if(existingUsers) {
    return res.send({message : "User already exists"})
  }

  const result = await usersCollection.insertOne(user);
  res.send(result);
});

//get users data

app.get('/users', async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
});

//get users role

app.patch('/users/admin/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const filter = {_id: new ObjectId(id)};
  const updateDoc = {
    $set: {
     role: 'admin'
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result);
});

app.get('/users/admin/:email', async(req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await userService.findOne(query);
  const result = {admin : user.role === 'admin'};
  res.send(result);
})

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