const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();




app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.mpiyq8b.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const categoryCollection = client.db('EndGameProject').collection('media');
    // const postCollection = client.db('EndGameProject').collection('post');
    const allMediaPostCollection = client.db('EndGameProject').collection('allMedia');
    const userCollection = client.db('EndGameProject').collection('user');
    const userAboutCollection = client.db('EndGameProject').collection('About');

    try {
        app.get('/category', async (req, res) => {
            const query = {};
            const options = await categoryCollection.find(query).toArray();
            res.send(options);
        })

        app.post('/allmediaposts',async (req, res) => {
                const posts = req.body;
                const result = await allMediaPostCollection.insertOne(posts);
                // console.log(result);
                res.send(result);
            });
        app.get('/allmediaposts',async (req, res) => {
                const query = {};
                const result = await allMediaPostCollection.find(query).toArray();
                res.send(result);
            });


        app.post('/aboutusers',async (req, res) => {
            const user = req.body;
            const result = await userAboutCollection.insertOne(user);
            res.send(result);
        });
        app.get('/aboutusers',async (req, res) => {
            const query = {};
            const result = await userAboutCollection.find(query).toArray();
            res.send(result);
        });






        app.post('/users',async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users',async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/users/:email',async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            console.log(user);
            res.send(user);
        });




        app.put('/users/:email',async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const alluser = req.body;
            const option = {upsert: true};
            const updatedUser ={
                $set: {
                    name: alluser.username,
                    address: alluser.address,
                    university:alluser.universityName,
                    email:alluser.email
                }
            }
            const result = await userCollection.updateOne(query,updatedUser,option)
            console.log(alluser);
            res.send(result);
        });


    }
    finally {

    }
}

run().catch(console.log);







app.get('/', async (req, res) => {
    res.send('socialBooking is running');
})

app.listen(port, () => console.log(`socialBooking running on ${port}`))