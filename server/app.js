const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const myGQLSchema = require('./graphql/schema')
const myGQLResolvers = require('./graphql/resolvers')
const isAuth = require('./middleware/is-auth')
const app = express();
const cors = require('cors')

app.use(cors())
app.options('*',cors())

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next();
})
app.use(cors({
  origin: "*",
  methods: ["POST","GET"],
  credentials: true
}))

// body parser
app.use(express.json());

// middleware

app.use(isAuth);

app.get("/",(req,res)=>{
  res.json("Hello")
})

app.use(
  "/graphql",
  graphqlHTTP({
    schema: myGQLSchema,
    rootValue: myGQLResolvers,
    graphiql: true,
  })
);
app.listen(8000, () => {
  console.log(`Server Running`);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.q6icgu7.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
 
  
 