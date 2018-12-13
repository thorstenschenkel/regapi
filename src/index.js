'use strict';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

//=========================================================================================================================================
// DB
//=========================================================================================================================================

const DB_NAME = 'reg';
const DB_COLLECTION = 'snapshots';
const DB_PWD = process.env.DB_PWD; // 'Byd0RYnRUq1S9Nkp';
const DB_URI = 'mongodb://snowinfo:' + DB_PWD + '@cluster0-shard-00-00-bavvq.mongodb.net:27017,cluster0-shard-00-01-bavvq.mongodb.net:27017,cluster0-shard-00-02-bavvq.mongodb.net:27017/snowinfo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

function compareEvents(e1, e2) {
    const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    const date1 = new Date(e1.dateStrg.replace(pattern,'$3-$2-$1'));
    const date2 = new Date(e2.dateStrg.replace(pattern,'$3-$2-$1'));
    return date1 - date2;
}


exports.handler = async (event, context, callback) => {

    let responseCode = 200;

    console.log(' -- t7 - DBG -- handler was called');
    // console.log(' -- t7 - DBG -- request: ' + JSON.stringify(event));

    let eventId;
    let year;
    if (event.queryStringParameters) {
        if (event.queryStringParameters.eventId) {
            eventId = event.queryStringParameters.eventId;
        } else if (event.queryStringParameters.year) {
            year = event.queryStringParameters.year;
        }
    }

    const responseBody = {};
    if (eventId) {
        const client = await MongoClient.connect(DB_URI);
        const db = await client.db(DB_NAME);
        const o_id = new ObjectId(eventId);
        const query = { _id: o_id };
        // console.log(' -- t7 - DBG -- query:' + JSON.stringify(query) );
        const event = await db.collection(DB_COLLECTION).findOne(query);
        await client.close();
        if (event) {
            responseBody.event = event;
        } else {
            responseCode = 404;
        }
    } else if (year) {
        const client = await MongoClient.connect(DB_URI);
        const db = await client.db(DB_NAME);
        const query = { year: parseInt(year) };
        // console.log(' -- t7 - DBG -- query:' + JSON.stringify(query) );
        const projection = { name: 1, dateStrg: 1 };
        let events = await db.collection(DB_COLLECTION).find(query).project(projection).toArray();
        await client.close();
        events.sort(compareEvents);
        if (events && events.length > 0) {
            responseBody.events = events;
        } else {
            responseCode = 404;
        }
    } else {
        responseBody.years = [2017, 2018, 2019];
    }

    var response = {
        statusCode: responseCode,
        body: JSON.stringify(responseBody)
    }
    callback(null, response);

};
