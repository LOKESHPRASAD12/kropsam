const MongoClient = require("mongodb").MongoClient;
const PDFDocument = require('pdfkit');
const fs = require('fs');

const url = "mongodb://127.0.0.1:27017";
const dbName = "krop";

MongoClient.connect(url, function (err, client) {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to the database successfully!");
  const db = client.db(dbName);

  const collection = db.collection("kropbook");
  const document = {
    txnDate: new Date("2023-07-12"),
    valueDate: new Date("2023-07-13"),
    description: "Sample transaction",
    reference: 123456,
    debits: 100.5,
    credits: 50.25,
    balance: 50.25,
  };

  collection.insertOne(document, function (err, result) {
    if (err) {
      console.error("Error inserting document:", err);
      client.close();
      return;
    }

    console.log("Document inserted successfully!");
    client.close();
  });

  collection.find({}).toArray(function(err, data) {
    if (err) {
      console.error('Error fetching data from the collection:', err);
      client.close();
      return;
    }
  
    
    const doc = new PDFDocument();
    data.forEach((row) => {
      doc.text(row.txnDate.toString());
      doc.text(row.valueDate.toString());
      doc.text(row.description);
      doc.text(row.reference.toString());
      doc.text(row.debits.toString());
      doc.text(row.credits.toString());
      doc.text(row.balance.toString());
    });
  
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.end();
  
    console.log('PDF created successfully!');
  });
});
