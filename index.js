const express =require("express")
const cors =require('cors')
const app =express()

app.use(cors())
app.use(express.json())
//techServer
//l34MFlaIoyJKjIOi
const port =process.env.PORT || 4005


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://techServer:l34MFlaIoyJKjIOi@cluster0.qjppvab.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const productCollection =client.db("productDB").collection("product")
    const addCartCollection =client.db("cartDB").collection("cart")

    app.post('/carts',async(req,res)=>{
        const cart =req.body
        console.log(cart)
        const result =await addCartCollection.insertOne(cart)
        console.log(result)
        res.send(result)
    })
    app.post('/products',async(req,res)=>{
        const product =req.body
        console.log(product)
        const result =await productCollection.insertOne(product)
        console.log(result)
        res.send(result)
    })
    app.get('/carts',async(req,res)=>{  
      const result =await addCartCollection.find().toArray()
      console.log(result)
      res.send(result)
  })
    app.get('/products',async(req,res)=>{  
      const result =await productCollection.find().toArray()
      console.log(result)
      res.send(result)
  })
  app.get('/products/:id',async(req,res)=>{
    const id =req.params.id
    const query ={_id: new ObjectId(id)}
    const result =await productCollection.findOne(query)
    console.log(result)
    res.send(result)
  })
  app.get('/carts/:id',async(req,res)=>{
    const id =req.params.id
    const query ={_id: new ObjectId(id)}
    const result =await addCartCollection.findOne(query)
    console.log(result)
    res.send(result)
  })
 
  app.delete("/carts/:id", async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await addCartCollection.deleteOne(query);
    console.log(result)
    res.send(result);
  });
  app.put('/products/:id',async(req,res)=>{
    const id =req.params.id
    const data =req.body

    const filter ={_id: new ObjectId(id) }
    const options ={upsert:true}
    const updatedData ={
      $set:{
        photo:data.photo,
        name:data.name,
        price:data.price,
        description:data.description,
        brand:data.brand,
        type:data.type,
        rating:data.rating
      }
    }
    

    const result =await productCollection.updateOne(filter,updatedData,options)
    res.send(result)
})
   
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('crud is running')
})
app.listen(port,()=>{
    console.log(`app is running ${port}`)
})