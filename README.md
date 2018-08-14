"# regapi" 

simple "REST"-API with 3 end point to get informations about events
- https://bl78p0futl.execute-api.eu-west-1.amazonaws.com/public/regapi
  returns all years with events
- https://bl78p0futl.execute-api.eu-west-1.amazonaws.com/public/regapi?year={year}
  returns all events for the given year
- https://bl78p0futl.execute-api.eu-west-1.amazonaws.com/public/regapi?eventId={id}
  returns all counts of registrations for the given event 
