
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



import {MongoClient, ObjectId} from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/")

await client.connect();

const db = client.db("school2");

const student_collection = db.collection("students1");

// const result1=await  student_collection.insertOne({name:"Raju",age:23});
// this  only trigger db call ^
// console.log(result1);
// const delting = await student_collection.drop();
// console.log(delting)
// const a = await student_collection.deleteOne({
//     _id: new ObjectId("6ac9e57148f8f52b758f169b")
// });
//cusors in mongodb.
//object id in mongodb. if we store as string then it will take the 24 bytes that why,

console.log(a)


client.close()

// application architecture
// one-tier two-tier three-tier
