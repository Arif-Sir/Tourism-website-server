const express = require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT|| 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otaz2zb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // database creat
    const spotCollection = client.db('spotDB').collection('spot');
    // user craet
    const userCollection = client.db('spotDB').collection('user');


    app.get('/spots',async(req,res)=>{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //to get single data (in viewDetails)
    app.get('/spots/:id',async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query);
        res.send(result);
    })

    //  for update 
    app.put('/spots/:id',async(req,res)=>{
      const id= req.params.id;
      const filter={_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateSpot=req.body;
      const spot={
        $set: {
          image :updateSpot.image,
          country :updateSpot.country,
          spot :updateSpot.spot,
          location :updateSpot.location,
          description :updateSpot.description,
          cost :updateSpot.cost,
          season :updateSpot.season,
          time :updateSpot.time,
          visitor :updateSpot.visitor,

        }
      }

      const result = await spotCollection.updateOne(filter,spot,options);
        res.send(result);
    })

    // for add
    app.post('/spots',async(req,res)=>{
        const newSpot =req.body;
        console.log(newSpot);
        const result = await spotCollection.insertOne(newSpot);
        res.send(result);
    })

    //this for delete
    app.delete('/spots/:id',async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query);
        res.send(result);

    })

    //this for user related apis
    app.post('/user',async(req,res)=>{
      const user =req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port,()=>{
    console.log(`tourist site is runninh in port,${port}`)
})
