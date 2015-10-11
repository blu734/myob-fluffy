function geid(id) {
  return document.getElementById(id);
}
function qget(id) {
  return document.querySelector(id);
}
function qgeta(id) {
  return document.querySelectorAll(id);
}
function ce(id) {
  return document.createElement(id);
}

/**
 * This method performs a get request on the provided url
 *
 * @method ajaxGet
 * @param {String} url is the url to push
 * @param {Function} The callback function that takes a string
 */
function ajaxGet(url,onFinish, onError, lb) {
  var xmlhttp;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
      onFinish(xmlhttp.responseText);
      if (lb)
        updateLoadingBar(-1);
    } else if (xmlhttp.readyState == 4 && onError) {
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
      console.log("Status code: " + xmlhttp.status);
      if (onError)
        onError();
      if (lb)
        updateLoadingBar(-1);
    } else {
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
function ajaxPost(url, jsonData, onFinish, onError, lb) {
  var xmlhttp;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
      onFinish(xmlhttp.responseText);
      if (lb)
        updateLoadingBar(-1);
    } else if (xmlhttp.readyState == 4 && onError) {
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
      console.log("Status code: " + xmlhttp.status);
      if (onError)
        onError();
      if (lb)
        updateLoadingBar(-1);
    } else {
      if (lb)
        updateLoadingBar(xmlhttp.readyState);
    }
  }
  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-type","application/json");
  //xmlhttp.setRequestHeader("Authorization", "key=AIzaSyAUL00gJPrDZ-zCUm0Y__lm8G-Slt_Yh4s");
  xmlhttp.send(JSON.stringify(jsonData));
}
function getDt() {
  var d = new Date();
  return d.toJSON().slice(0,10) + " " + d.toJSON().slice(11,19)
}
function addOnClickListener(item, func) {
  if (item.addEventListener) {   // For all major browsers, except IE 8 and earlier
    item.addEventListener("click", func);
  } else if (item.attachEvent) { // For IE 8 and earlier versions
    item.attachEvent("onclick", func);
  }
}
/* {
  'innerHTML': "..."
  ,'innerText': "..."
  ,'attributes': {
    'id': "idnum"
    , 'type': "sometype"
  }
} */
function createLi(params) {
  var li = document.createElement("li");
  if (params.innerHTML)
    li.innerHTML = params.innerHTML;
  else
    li.innerText = params.innerText;
  for(var key in params.attributes) {
    if (params.attributes.hasOwnProperty(key)) {
      li.setAttribute(key,params.attributes[key]);
    }
  }
  return li
}

function updateLoadingBar(state) {
  lb = qget('.loadingbar');
  lb.classList.remove('notinit')
  lb.classList.remove('connest')
  lb.classList.remove('reqrec')
  lb.classList.remove('procreq')
  lb.classList.remove('reqfin')
  if (state == 0) {
    lb.classList.add('notinit')
  } else if (state == 1) {
    lb.classList.add('connest')
  } else if (state == 2) {
    lb.classList.add('reqrec')
  } else if (state == 3) {
    lb.classList.add('procreq')
  } else if (state == 4) {
    lb.classList.add('reqfin')
  }
}
