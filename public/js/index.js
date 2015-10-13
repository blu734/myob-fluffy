function setupListTable(){
  var listOptions = {
    valueNames: ['name','dtime']
  };

  var invList = new List('invtable', listOptions);
}
function toggleGraphs(){
  var graphs = qgeta('.info');
  for (var i = 0; i < graphs.length; ++i) {
    graphs[i].onclick=function(seq,j) {
      return function() {
        if (graphs[j].classList.contains('edit'))
          return false;
        var graphrow = qget('.graph-'+seq);
        var isHidden = graphrow.classList.toggle('hide');
      }
    }(graphs[i].id, i)
  }
}
function toggleEdit() {
  var edits = qgeta('img.edit');
  var updates = qgeta('img.update');
  for (var i = 0; i < edits.length; ++i) {
    edits[i].onclick=function(j){
      return function(event) {
        var edits = qgeta('img.edit');
        var updates = qgeta('img.update');
        var isEdit = edits[j].parentNode.parentNode.classList.add('edit');
        var items = edits[j].parentNode.parentNode.children;

        var itemids = [0,2,3,7];
        for (var i = 0; i < itemids.length; ++i) {
          items[itemids[i]].contentEditable=true;
        }

        edits[j].classList.add('hidden');
        updates[j].classList.remove('hidden');
        updates[j].onclick=function(k){
          return function(event){
            var edits = qgeta('img.edit');
            var updates = qgeta('img.update');
            // TODO: Add Ajax in here

            var isEdit = edits[k].parentNode.parentNode.classList.remove('edit');
            var itemids = [0,2,3,7];
            for (var i = 0; i < itemids.length; ++i) {
              items[itemids[i]].contentEditable=false;
            }

            updates[k].classList.add('hidden');
            edits[k].classList.remove('hidden');
            event.stopPropagation();
          }
        }(j);

        event.stopPropagation();
        return false;
      }
    }(i)
  }
}
function addItem() {
  var add = qget('tbody.add img.add');
  var save = qget('tbody.add img.save');
  var addbody = qget('tbody.add');
  var listbody = qget('tbody.list');
  add.onclick = function(){
    var items = add.parentNode.parentNode.children;
    var itemids = [0,2,3,6];
    for (var i = 0; i < itemids.length; ++i) {
      items[itemids[i]].contentEditable=true;
    }
    add.classList.add('hidden');
    save.classList.remove('hidden');
  }
  save.onclick=saveAndAddItem;
}
function saveAndAddItem(){
  //Make post request
  var callback = function(responseText) {
    var add = qget('tbody.add img.add');
    var save = qget('tbody.add img.save');

    var items = add.parentNode.parentNode.children;
    var itemids = [0,2,3,6];
    for (var i = 0; i < itemids.length; ++i) {
      items[itemids[i]].contentEditable=false;
    }
    var item = {
      itemName: items[0].innerText
    , currentCount: items[2].innerText
    , desiredCount: items[3].innerText
    , itemValue: items[6].innerText
    }

    ajaxPost("/addinventory", item, function(responseText){
      add = qget('tbody.add img.add');
      save = qget('tbody.add img.save');

      var response = JSON.parse(responseText);
      console.log(response.data);

      var data = {
        id: response.data.id
      , date: (new Date()).toISOString()
      , itemName: item.itemName
      , currentCount: item.currentCount
      , desiredCount: item.desiredCount
      , itemValue: item.itemValue
      }

      insertRow(data);

      add.classList.remove('hidden')
      save.classList.add('hidden')
    }, function(responseText){
      if (responseText){
        var response = JSON.parse(responseText);
        console.log(response.err);
      }
      console.log("An error has occured in adding an item");
    }, true)
    //
    //add.classList.remove('hidden')
    //save.classList.add('hidden')
  }
  var errorHandler = function() {
    alert('Error connecting to server!');
  }
  callback();
}
function insertRow(data){
  var tbody = qget('tbody.list');
  var newRow = tbody.insertRow(tbody.rows.length);
  newRow.className = "invrow info";
  newRow.id = data.id;
  var newCell = newRow.insertCell(0);
  newCell.className = 'l name';
  newCell.innerText = data.itemName;

  newCell = newRow.insertCell(1);
  newCell.className = 'dtime hidden';
  newCell.innerText = data.date;

  newCell = newRow.insertCell(2);
  newCell.innerText = data.date;
  
  newCell = newRow.insertCell(3);
  newCell.innerText = data.currentCount;
  
  newCell = newRow.insertCell(4);
  newCell.innerText = data.desiredCount;
  
  var currentCount = parseInt(data.currentCount);
  var desiredCount = parseInt(data.desiredCount);
  newCell = newRow.insertCell(5);
  newCell.innerText = currentCount - desiredCount;
  
  newCell = newRow.insertCell(6);
  newCell.innerText = currentCount/desiredCount * 100 - 100;
  
  newCell = newRow.insertCell(7);
  newCell.innerText = "$" + data.itemValue;

  var itemValue = parseInt(data.itemValue);
  newCell = newRow.insertCell(8);
  newCell.innerText = "$" + (itemValue*currentCount);
  newCell = newRow.insertCell(9);
  newCell.innerHTML = "<img class=\"icon edit\" src=\"/img/pencil-black.png\"><img class=\"icon update hidden\" src=\"/img/pencil-white.png\">";
  newCell = newRow.insertCell(10);
  newCell.className = "img del";
  newCell.innerHTML = "<img class=\"icon delete\" src=\"/img/trash.png\">";

  // Graph row
  newRow = tbody.insertRow(tbody.rows.length);
  newRow.className = "invrow graph hide graph-"+data.id;

  newCell = newRow.insertCell(0);
  newCell.className = 'hidden l name';
  newCell.innerText = data.itemName;

  newCell = newRow.insertCell(1);
  newCell.className = 'dtime hidden';
  newCell.innerText = data.date;

  newCell = newRow.insertCell(2);
  newCell.colSpan = 10;
  newCell.innerHTML = '<div class="graph" id="graph"></div>';

  // clean add area
  var add = qget('tbody.add img.add');
  var items = add.parentNode.parentNode.children;
  for (var i = 0; i < items.length-2; ++i) {
    items[i].innerText='';
  }
}
function deleteItem() {
  var delIcons = qgeta('tr.info td.img.del');
  for (var i = 0; i < delIcons.length; ++i) {
    delIcons[i].onclick=function(j){
      return function(event) {
        var item = {id:delIcons[j].parentNode.id};
        ajaxPost("/deleteinventory", item, function(responseText){
          var response = JSON.parse(responseText);
          console.log(response.data);
          geid(response.data.id).remove();
          qget('.graph-'+response.data.id).remove();
        }, function(responseText){
          if (responseText){
            var response = JSON.parse(responseText);
            console.log(response.err);
          }
          console.log("An error has occured in adding an item");
        }, true)
        
        event.stopPropagation();
        return false;
      }
    }(i)
  }
}
setupListTable();
toggleGraphs();
toggleEdit();
addItem();
deleteItem();


$(function () {
    $('div.graph').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            step:true
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            step:true
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
            step:true
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
            step:true
        }],
        credits: {
            enabled: false
        },
    });

    $('#piechartdist').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Inventory cost distribution'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: "Items",
            colorByPoint: true,
            data: [{
                name: "Item 1",
                y: 56.33
            }, {
                name: "Item 2",
                y: 24.03,
                sliced: true,
                selected: true
            }, {
                name: "Item 3",
                y: 10.38
            }, {
                name: "Item 4",
                y: 4.77
            }, {
                name: "Item 5",
                y: 0.91
            }, {
                name: "Item 6",
                y: 0.2
            }]
        }],
        credits: {
            enabled: false
        },
    });
});
