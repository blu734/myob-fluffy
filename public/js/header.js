// Cube
// -----
qget('figure.front').onclick = function(){
  qget('#cube').className = 'show-top';
}
qget('figure.top').onclick = function(){
  qget('#cube').className = 'show-right';
}
qget('figure.right').onclick = function(){
  qget('#cube').className = 'show-back';
}
qget('figure.back').onclick = function(){
  qget('#cube').className = 'show-bottom';
}
qget('figure.bottom').onclick = function(){
  qget('#cube').className = 'show-left';
}
qget('figure.left').onclick = function(){
  qget('#cube').className = 'show-front';
}
