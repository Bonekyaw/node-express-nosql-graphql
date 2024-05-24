### This is Simple Express Starter Kit

##### Node express + Mongoose ODM ( Mongodb ) + graphql api 

You can use it for your project. If it is useful for you,
don't forget to give me a GitHub star, please.

In this node/express template

   - Express framework
   - NoSQL - Mongodb
   - Mongoose ODM
   - graphql api ( graphql, graphql-http, ruru, graphql-file-loader, resolvers-composition, etc.)
   - JWT auth
   - bcrypt
   - validator 
   - error handler etc.

In order to use it,

Create a .env file and add this.  
For Mongodb Atlas

```
MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ropxgna.mongodb.net/lucky?retryWrites=true&w=majority"
TOKEN_SECRET="should something hard to read"

```

For Local Mongodb server

```
MONGO_URI="mongodb://127.0.0.1/lucky"
TOKEN_SECRET="should something hard to read"

```
Please note.   
*TOKEN_SECRET* should be complex and hard to guest.  
After git clone, it should be run.

```
npm install
npm start

```   
Warning - every `*.graphql & *.resolver.js` must be inside two nested folders `./**/**/file` .  
It's ok `./graphql/auth/auth.graphql` or `./graphql/product/product.graphql` or something like that.

If you have something hard to solve,
DM  
<phonenai2014@gmail.com>  
<https://www.facebook.com/phonenyo1986/>  
<https://www.linkedin.com/in/phone-nyo-704596135>  

#### Find more other Starter kits of mine ?   

  [Apollo server + Prisma ORM + SDL modulerized - graphql api](https://github.com/Bonekyaw/apollo-graphql-prisma)  
  [Express + Prisma ORM + graphql js SDL modulerized - graphql api](https://github.com/Bonekyaw/node-express-graphql-prisma)  
  [Express + Prisma ORM + mongodb - rest api](https://github.com/Bonekyaw/node-express-prisma-mongodb)  
  [Express + Prisma ORM + SQL - rest api](https://github.com/Bonekyaw/node-express-prisma-rest)  
  [Express + Apollo server + mongoose - graphql api](https://github.com/Bonekyaw/node-express-apollo-nosql)  
  Now you are here - [Express + graphql js + mongoose - graphql api](https://github.com/Bonekyaw/node-express-nosql-graphql)  
  [Express + graphql js + sequelize ORM - graphql api](https://github.com/Bonekyaw/node-express-sql-graphql)  
  [Express + mongodb - rest api](https://github.com/Bonekyaw/node-express-mongodb-rest)  
  [Express + mongoose ODM - rest api](https://github.com/Bonekyaw/node-express-nosql-rest)  
  [Express + sequelize ORM - rest api](https://github.com/Bonekyaw/node-express-sql-rest)  


