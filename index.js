//these two lines would only be appropriate if I needed access to a db or similar.
//const remote = require('electron').remote;
//const main = remote.require('./main.js');
const $ = require('jquery');

//------------------Globals------------------
let mainScene

//------------------Classes------------------
class ReferenceStack {
  constructor() {
    this.boxRefs = []
    this.freeBoxRefs = []

    this.matRefs = []
    this.freeMatRefs = []
  }

  createRef(type){
    switch (type) {
      case "matrix":
        if (this.freeMatRefs.length > 0) {
          return this.freeMatRefs.pop()
        } else {
          let a = "matrix" + this.matRefs.length
          this.matRefs.push(a)
          return a
        }
        break;
      default:
        //default will create an empty 1x1 box.
        if (this.freeBoxRefs.length > 0) {
          return this.freeBoxRefs.pop()
        } else {
          let a = "box" + this.boxRefs.length
          this.boxRefs.push(a)
          return a
        }
    }
  }
}

class Scene {
  constructor(cellSize) {
    this.refStack = new ReferenceStack()

  	this.ghostObject = null
  	this.currentObject = null

  	this.cellSize = cellSize
  }
}

//------------------Functions------------------
function selectBox(box) {
  if (mainScene.currentObject) {
    mainScene.currentObject.removeClass("selected")
    mainScene.currentObject = box
    mainScene.currentObject.addClass("selected")
  } else {
    mainScene.currentObject = box
    mainScene.currentObject.addClass("selected")
  }
}

function create(type) {
  //creates an html object and returns a reference to that object
  let ref
  let x
  let y
  switch (type) {
    case "matrix":
      ref = mainScene.refStack.createRef("box")
      //create the html object
      x = document.createElement("table")
      $(x).attr("id", ref)
      $(x).addClass("box")
      y = document.createElement("td")
      y.innerHTML = "Matrix"
      x.appendChild(y)
      document.body.appendChild(x)
      $("#"+ref).click( function(){
        //console.log(ref + " was clicked.");
      });
      return ref
      break;
    default:
      //by default will create a empty 1x1 box
      ref = mainScene.refStack.createRef("box")
      //create the html object
      x = document.createElement("table")
      $(x).attr("id", ref)
      $(x).addClass("box")
      y = document.createElement("td")
      y.innerHTML = "y = mx + c"
      x.appendChild(y)
      document.body.appendChild(x)
      $("#"+ref).on("mousedown", function(event){
        boxClicked(event)
      });
      return ref

  }
}

function boxClicked(e){
  selectBox(e.target)
}

function getClosestBoxRef(element) {
  let closest = $(element).closest(".box")
  if (closest.length === 1) {
    box = closest[0]
    return $(box).attr("id")
  }
}

$("body").on("mousedown", function(event){
  let key = event.which
  let type = event.type
  let ctx = $("#contextmenu")
  let rootBox = getClosestBoxRef(event.target)
  let menu = event.target.closest(".menu")
  //console.log(event);
  console.log(event.type + " " + event.button);

  if (rootBox && event.button === 0) {
    // left click on a box so select it
    selectBox(rootBox)
  } else if (event.button == 2) {
    //right click
    let x = Math.floor(event.pageX/mainScene.cellSize) * mainScene.cellSize
    let y = Math.floor(event.pageY/mainScene.cellSize) * mainScene.cellSize
    $("#contextmenu").css({"top": y+"px", "left": x+"px",})
    $("#contextmenu").show()
  } else {
    //Check collisions?
    //create a new box
    let refx = create("box")
    let x = Math.floor(event.pageX/mainScene.cellSize) * mainScene.cellSize
    let y = Math.floor(event.pageY/mainScene.cellSize) * mainScene.cellSize
    $("#"+refx).css({"top": y+"px", "left": x+"px",})
    mainScene.currentObject = refx
    mainScene.ghostObject = refx
  }

  if (ctx.is(":visible")) {
    if (menu) {
      console.log("clicked on menu right?");
    } else {
      ctx.hide()
    }
  }
});
/*
$("body").contextmenu(function(){
  //console.log("right click?");
  //fade body to background to highlight context menu

});
*/
//------------------binding callbacks/initialization------------------
mainScene = new Scene(40)
//customElements.define("origin-node", Node);

$(document).ready(function(){
 console.log("Ready!");

});
