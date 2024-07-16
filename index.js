const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://animalApp-user:SJoThAbHeWhLitPF@cluster0.2rm9pnz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();
        const animalCollection = client.db("animalAppDB").collection("animals");
        const categoryCollection = client.db("animalAppDB").collection("category");



        app.post('/animals', async (req, res) => {
            const item = req.body;
            const result = await animalCollection.insertOne(item);
            res.send(result)
        })


        app.get('/animals', async (req, res) => {
            const animal_category = req.query.category;
            try {
                const cursor = animalCollection.find({ animal_category: animal_category });
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching animal data:", error);
                res.status(500).send("Error fetching animal data");
            }
        });
        
        app.get('/allAnimal', async (req, res) => {
            const cursor = animalCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });


        app.post('/categories', async (req, res) => {
            const item = req.body;
            const result = await categoryCollection.insertOne(item);
            res.send(result)
        })

        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Animal App is running')
})

app.listen(port, () => {
    console.log(`Animal App is running on port ${port}`)
})