Simple Inventory Management
===========================

Author: Ben Lu

This is an entry for the MCC MYOB IT Challenge 2015, under team Fluffy.

TODO
----

* Pretty DateAdded
    * DateJS
* string formatting difference
* limit decimals on difference %
* Prevent wrong values being entered on table entry, both front and backend
* Clean up layout of editing (hovers, cursors etc)
* Add callbacks for after something has been added, update tabledata and piechart
* Add arrows to sortable headers and add more sortable headers
* Dotted desired line?

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

Extras
------

Click the MYOB logo for an amazing 3D cube animation
