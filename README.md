Simple Inventory Management
===========================

Author: Ben Lu

This is an entry for the MCC MYOB IT Challenge 2015, under team Fluffy.

TODO
----

* Add callbacks for after something has been added, update tabledata and piechart
* Add arrows to sortable headers and add more sortable headers

Installation
------------

Ensure node is installed, then run `npm install` to install packages
Run the code using `DEBUG=myob-it-2015:* npm start`. 
That should be about it

AWS
---

```
ssh -i myobit.pem ec2-user@ec2-52-89-199-232.us-west-2.compute.amazonaws.com
```

About
-----

This project is run using NodeJS, with the Express framework, using Stylus for CSS and autoprefixer. The backend is a NoSQL database using MongoDB.
Templating engine is Jade, and node service is done through nodemon.
The charts use the HighCharts library.

### Database record structure

MongoDB uses collections, of which in this case is 'inventory', and has the datastructure:

```
[
    {
        "itemName": "Nuts"
      , "inv": [
            {
                "date": "2015-10-13T08:03:29+13:00"
              , "currentCount": "6"
              , "desiredCount": "10"
            }
          , {
                "date": "2015-10-15T00:07:45+13:00"
              , "currentCount": "7"
              , "desiredCount": "9"
            }
        ]
      , "itemValue": "90"
    },
]
```

API
---

These are the main ways of interacting with the system

Finding database data

```
GET /getinventory
```

Adding an inventory item:

```
POST /addinventory
{
    "itemName": "Nuts"
  , "currentCount": "8"
  , "desiredCount": "6"
  , "itemValue": "3"
}
```

Updating an inventory item:

```
POST /updateinventory
{
    "id": "3sdf3"
  , "itemName": "Bolts"
  , "currentCount": "5"
  , "desiredCount": "12"
  , "itemValue": "7"
}
```

Deleting an inventory item:

```
POST /deleteinventory
{
    "id": "3sdf3"
}
```


Extras
------

Click the MYOB logo for an amazing 3D cube animation
