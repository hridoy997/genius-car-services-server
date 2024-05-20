const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mcflvwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try{

        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const servises = await cursor.toArray();
            res.send(servises);
        })

        app.get('/service/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //POST
        app.post('/service',async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // Delete
        app.delete('/service/:id',async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running server');
})

app.listen(port, () => {
    console.log('Listening port : ', port);
})


