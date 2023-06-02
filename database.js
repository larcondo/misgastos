// Base de datos
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://lucas:4141Lucas@localhost:27017';
const client = new MongoClient(url);
var dbName = 'mispagos';

// mp_findAll()
//   .then((resultado) => console.log(resultado))
//   .catch((error) => console.log(error))

async function mp_findAll(collectionName) {
  await client.connect();
  // console.log('Conneccted successfully to: ' + url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const resultado = await collection.find().toArray();
  
  return resultado;
};

async function mp_insertOne(collectionName, objInsert) {
  await client.connect();
  // console.log('Conneccted successfully to: ' + url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const resultado = await collection.insertOne(objInsert);
  
  return resultado;
};

async function mp_updateOne(collectionName, id, setObject) {
  await client.connect();
  // console.log('Conneccted successfully to: ' + url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const objID = { _id: new ObjectId(id)};
  
  const resultado = await collection.updateOne(objID, {$set: setObject});
  
  return resultado;
};

async function mp_deleteOne(collectionName, id) {
  await client.connect();
  // console.log('Conneccted successfully to: ' + url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const objDelete = { _id: new ObjectId(id)};

  const resultado = await collection.deleteOne(objDelete);
  
  return resultado;
};

async function mp_delete(collectionName, objDelete) {
  await client.connect();
  // console.log('Conneccted successfully to: ' + url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const resultado = await collection.deleteOne(objDelete);
  
  return resultado;
};

module.exports = {
  mp_findAll, mp_insertOne, mp_deleteOne,
  mp_updateOne, mp_delete
}