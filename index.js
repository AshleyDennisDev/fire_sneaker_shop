const {initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const credentials = require('./credentials.json');

initializeApp({
    credential: cert(credentials)
});

const express = require("express")
const app= express()
app.use(express.json())


const db = getFirestore();

function connectToFirestore(){
    if(!getApps().length){
    initializeApp({
      credential: cert(credentials),
  });
} return getFirestore();
}   


app.get("/", (req, res) => {
    const db= connectToFirestore();
    res.send("HELLO")
  });


const getUserCollection = (db) => {
    const col = db.collection("users");
    return col;
  };
  

const getUsers = async () => {
    const col = getUserCollection();
    const users = await col.find({}).toArray();
    return users;
  };

  const insertUser = async (user) => {
    const db = connectToFirestore();  
    const col = getUserCollection(db);
    const res = await col.add(user);
    console.log("User Inserted by user!");
  };

  app.post("/insertuser", async (req, res) => {
    const db = connectToFirestore();  
    const user = req.body;
    if (!user.name || !user.phone || !user.email) {
      res.send("Name, phone, and/or email not entered");
      return; //IF RETURN NOT THERE YOU DOnt prevent from happeniing
    }
    await insertUser(user);
    res.send(`succesfully inserted user: ${JSON.stringify(user)}`);
  });


  const getProductCollection = (db) => {
    const col = db.collection("product");
    return col;
  };

  const insertProduct = async (product) => {
    const db = connectToFirestore();  
    const col = getProductCollection(db);
    const res = await col.add(product);
    console.log("Product Inserted!");
  };


  app.post("/product", async (req, res) => {
    const db = connectToFirestore();  
    const product = req.body;
    if (!product.brand || !product.type || !product.color) {
      res.send("product not entered");
      return; //IF RETURN NOT THERE YOU DOnt prevent from happeniing
    }
    await insertProduct(product);
    res.send(`succesfully inserted product: ${JSON.stringify(product)}`);
  });
  
  app.get("/", (req, res) => {
    const db = connectToFirestore();
    db.collection("users")
      .get()
      .then((snapshot) => {
        const users = snapshot.docs.map((doc) => {
          let user = doc.data();
          user.id = doc.id;
          return user;
        });
        res.status(200).send(users);
      })
      .catch(console.error);
  });


  app.listen(3000,() => {console.log('listening on port 3000')})
