'use strict';
const MongoClient = require('mongodb').MongoClient;

const DB_NAME = 'reg';
const DB_COLLECTION = 'snapshots';

//=========================================================================================================================================
// DB
//=========================================================================================================================================

const DB_PWD = process.env.DB_PWD; // 'Byd0RYnRUq1S9Nkp';
const DB_URI = 'mongodb://snowinfo:' + DB_PWD + '@cluster0-shard-00-00-bavvq.mongodb.net:27017,cluster0-shard-00-01-bavvq.mongodb.net:27017,cluster0-shard-00-02-bavvq.mongodb.net:27017/snowinfo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

function trimEvents(events) {
    const trimmedEvents = [];
    for (const event of events) {
        const trimmedEvent = {};
        trimmedEvent.id = event._id;
        trimmedEvent.name = event.name;
        trimmedEvent.dateStrg = event.dateStrg;
        trimmedEvents.push(trimmedEvent);
    }
    return trimmedEvents;
}

exports.handler = async (event, context, callback) => {

    const responseCode = 200;

    console.log(' -- t7 - DBG -- handler was called');
    console.log(' -- t7 - DBG -- request: ' + JSON.stringify(event));

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
        responseBody.event = { name: 'test 1' };
    } else if (year) {
        const client = await MongoClient.connect(DB_URI);
        const db = await client.db(DB_NAME);
        const query = { year: parseInt(year) };
        let events = await db.collection(DB_COLLECTION).find(query).toArray();
        events = trimEvents(events);
        // let events = await db.collection(DB_COLLECTION).find(query, { _id: 1, name: 1, dateStrg: 1, year: 0, contests: 0 }).toArray();
        await client.close();
        responseBody.events = events;
    } else {
        responseBody.years = [2017, 2019];
    }

    const response = {
        statusCode: responseCode,
        body: JSON.stringify(responseBody)
    };
    callback(null, response);

};
