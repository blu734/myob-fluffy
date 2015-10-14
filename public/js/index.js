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

        var itemids = [0,3,4,7];
        for (var i = 0; i < itemids.length; ++i) {
          var item = items[itemids[i]];
          item.contentEditable=true;
          if (item.classList.contains('number'))
            item.innerText = item.innerText.replace(/\D/g,'');
        }
        items[0].focus();

        edits[j].classList.add('hidden');
        updates[j].classList.remove('hidden');
        updates[j].onclick=function(k){
          return function(event){
            var edits = qgeta('img.edit');
            var updates = qgeta('img.update');
            // TODO: Add Ajax in here
            saveItemChanges(edits[k].parentNode.parentNode);

            var isEdit = edits[k].parentNode.parentNode.classList.remove('edit');
            var itemids = [0,3,4,7];
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
function saveItemChanges(row){
  var items = row.children;
  var data = {
    id: row.id
  , itemName: items[0].innerText
  , currentCount: items[3].innerText
  , desiredCount: items[4].innerText
  , itemValue: items[7].innerText
  };
  console.log(row, data);
  ajaxPost('/updateinventory',data,function(responseText){
    console.log(responseText);
  },function(responseText){
    console.log(responseText);
  },true)
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
    items[0].focus();
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
  newCell.innerHTML = "<img class=\"icon edit\" src=\"/img/pencil-black.png\"><img class=\"icon update hidden\" src=\"/img/save.png\">";
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
function numbersOnly(){
  var numbers = qgeta('.number');
  for (var i = 0; i < numbers.length; ++i) {
    numbers[i].onkeypress = function(event) {
      return event.charCode >= 48 && event.charCode <= 57;
    }
  }
}
// s = s.replace(/\D/g,'');
setupListTable();
toggleGraphs();
toggleEdit();
addItem();
deleteItem();
numbersOnly();


function drawGraph() {
  //var tabledata = '';
  var seriesData = [];
  var desiredData = [];
  for (var i = 0; i < tabledata.length; ++i) {
    var inventory = {name: tabledata[i].itemName, data: []}
    var desired = {name: 'Desired', data: []}
    //if (tabledata[i].inv.length>0) {
    //  inventory.data.push([Date.parse(tabledata[i].inv[0].date), 0]);
    //  desired.data.push([Date.parse(tabledata[i].inv[0].date), 0]);
    //}
    for (var j = 0; j < tabledata[i].inv.length; ++j) {
      inventory.data.push([
        Date.parse(tabledata[i].inv[j].date), parseInt(tabledata[i].inv[j].currentCount)]);
      desired.data.push([
        Date.parse(tabledata[i].inv[j].date), parseInt(tabledata[i].inv[j].desiredCount)]);
      //console.log(Date.parse(tabledata[i].inv[j].date));
    }
    var currentCount = parseInt(tabledata[i].inv[tabledata[i].inv.length-1].currentCount);
    var desiredCount = parseInt(tabledata[i].inv[tabledata[i].inv.length-1].desiredCount);
    inventory.data.push([(new Date()).getTime(), currentCount]);
    desired.data.push([(new Date()).getTime(), desiredCount]);
    seriesData.push(inventory);
    desiredData.push(desired);
  }
  $('div.graph').each(function(){
    var graph = this;
    var idx = graph.getAttribute('idx');
    var chart = new Highcharts.Chart({
      chart: {
        renderTo: this
      , backgroundColor: null
      },
      title: {
        text: 'Inventory levels',
        x: -20 //center
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Count'
        },
        //plotLines: [{
        //  value: 0,
        //  width: 1,
        //  color: '#808080'
        //}]
        min: 0
      },
      tooltip: {
        valueSuffix: ''
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      plotOptions: {
        series: {
          step: 'left'
        }
      },
      // name, data, step
      series: [seriesData[idx],desiredData[idx]],
      credits: {
        enabled: false
      },
    });
  });
}
function drawPieChart(){
  //var tabledata;
  var piedata = [];
  var max = -1;
  for (var i = 0; i < tabledata.length; ++i){
    var latestData = tabledata[i].inv[tabledata[i].inv.length-1];
    var currentCount = parseInt(latestData.currentCount);
    var entry = {name:tabledata[i].itemName, y:parseInt(tabledata[i].itemValue)*currentCount};
    piedata.push(entry);
    if (max == -1 || piedata[max].y < piedata[i].y)
      max = i;
  }
  if (max >= 0){
    piedata[max].sliced = true;
    piedata[max].selected = true;
  }
  var pieChartSeriesData = [{
    name:"Items",
    colorByPoint: true,
    data: piedata
  }];
  $('#piechartdist').highcharts({
    chart: {
      plotBackgroundColor: null
    , plotBorderWidth: null
    , plotShadow: false
    , type: 'pie'
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
    series: pieChartSeriesData,
    credits: {
        enabled: false
    },
  });
}
