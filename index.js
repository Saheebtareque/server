const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT ||  5000;

// middlewaree
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuy06.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      console.log('connectet to database')

      const meals = client.db("meals");
      const mealsInfo = meals.collection("mealsInfo");
      const orderedMeals = meals.collection("orderedMeals");

      //Get api
      app.get('/meals',async(req,res)=>{
          console.log('hitting it hard');
          const cursor = mealsInfo.find({});
          const meals = await cursor.toArray();
          res.send(meals);

      });

       // GET Single Service
       app.get('/meals/:id', async (req, res) => {
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id) };
        const service = await mealsInfo.findOne(query);
        res.json(service);
    });
     
      //post api
      app.post('/meals',async(req,res)=>
      {
          const mealInfo = req.body;
          console.log('hitting the post',mealInfo);
          const result = await mealsInfo.insertOne(mealInfo);
          console.log(result);
          res.json(result);
      });


       //Get api
       app.get('/orderedmeals',async(req,res)=>{
        console.log('get ordered meals');
        const cursor = orderedMeals.find({});
        const meals = await cursor.toArray();
        res.send(meals);

    });


      
      //post api
      app.post('/orderedmeals',async(req,res)=>
      {
          const mealInfo = req.body;
          console.log('hitting the ordered post',mealInfo);
          const result = await orderedMeals.insertOne(mealInfo);
          console.log(result);
          res.json(result);
      });



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Hello all');
});

app.listen(port,()=>{
    console.log('this port is run on:',port);
})


// saheeb_tareque
// DsrqV7E1ZQL3KnyQ