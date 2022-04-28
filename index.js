const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server working"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cp8el.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const productCollection = client.db("emaJhon").collection("product");

    // Get ALL products
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if(page || size){
        products = await cursor.skip(page * size).limit(size).toArray();
      }else{
        products = await cursor.toArray();
      }
      res.send(products);
    });
    
    // Product count
    app.get('/productCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount()
      res.send({count})
    })  


  } finally {
    // client.close()
  }
};

run().catch(console.dir);
