
// import { MongoClient } from "mongodb";

// const client = new MongoClient("mongodb://localhost:27017/");

// try {
//     await client.connect();
//     console.log("MongoDB connected successfully!");

//     // Replace "myDatabase" with your actual database name
//     const db = client.db("expence_app");

//     console.log("Database:", db.databaseName);

//     const collectionList = await db.listCollections().toArray();

//     console.log("Collections:");

//     console.log(collectionList.map(collection => collection.name));

//     const collection = db.collection("users");
//     const users = await collection.find().toArray();
//     console.log(users)

// } catch (error) {
//     console.error("MongoDB Error:", error);
// } finally {
//     await client.close();
// }



// import { MongoClient } from "mongodb";

// const client = new MongoClient("mongodb://localhost:27017/");

// try {
//     await client.connect();
//     console.log("MongoDB connected successfully!");

//     const admin = client.db().admin();

//     const allDbs = await admin.listDatabases();

//     console.log(allDbs);
// } catch (error) {
//     console.error("Error:", error);
// } finally {
//     await client.close();
// }



import {MongoClient} from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/")

await client.connect();

const db = client.db("school");

const student_collection = db.collection("students");
const teachers_collections = db.collection("teachers");

const result1=await  student_collection.insertOne({name:"Aman",age:23});
const result2 =await teachers_collections.insertOne({name:"Gopal",subject:"Math"});
// this  only trigger db call ^
console.log(result1);
console.log(result2)



client.close();
