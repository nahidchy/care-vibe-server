const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
require('dotenv').config()
// care-vibe-db
// QVLi2maRjBOnmXd3

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e4eedzq.mongodb.net/?retryWrites=true&w=majority`;
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
    const serviceCollections = client.db("careVibeDb").collection("services");
    const reviewCollections = client.db("careVibeDb").collection("reviews");
    app.get('/servicesThree', async (req, res) => {
      const query = {};
      const cursor = serviceCollections.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services)
    })
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollections.find(query);
      const services = await cursor.toArray();
      res.send(services)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollections.findOne(query);
      res.send(service)
    })
    app.get('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = {serviceId: id};
      const reviews = await reviewCollections.find(query).toArray();
      res.send(reviews)
    })

    app.patch('/reviews/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const {comment}= req.body;

      const option ={upsert:true};
      const updateReview={
        $set:{
          commnet: comment
        }
      }
      const result= await reviewCollections.updateOne(query,updateReview,option);
      res.send(result)
    })
    app.delete('/reviews/:id',async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)};
      const result = await reviewCollections.deleteOne(query);
      res.send(result)
    })
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollections.insertOne(review);
      res.send(result)
    })

  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})