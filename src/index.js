'use strict';

exports.handler = async (event, context, callback) => {
    
    const responseCode = 200;
    
    console.log(' -- t7 - DBG -- handler was called');
    console.log(' -- t7 - DBG -- request: ' + JSON.stringify(event));
    
    let eventId;
    let year;
    if ( event.queryStringParameters ) {
        if ( event.queryStringParameters.eventId )  {
            eventId = event.queryStringParameters.eventId;
        } else if ( event.queryStringParameters.year ) {
            year = event.queryStringParameters.year;
        }
    }
    
    const responseBody = {};
    if ( eventId ) {
        responseBody.event = { name: 'test 1'};
    } else if ( year ) {
        responseBody.events = [ {name: 'test 2' } ]; 
    } else {
        responseBody.years = [ 2017, 2019 ];
    }


    
    var response = {
        statusCode: responseCode,
        body: JSON.stringify(responseBody)
    }
    callback(null, response);
    
};
