document.getElementById("info-object").style.display = "none";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;
var flag = 0;

canvas.width = WIDTH;
canvas.height = HEIGHT;
//faz o desenho do triângulo

var objects = []; //lista de objetos
var objectSelected = null;

function drawCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (var i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    drawAxis();
}

function drawAxis() {
    ctx.strokeStyle = "#f3c1c6";
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1, 1]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);


}

window.addEventListener("load", drawCanvas);

function pushBox() {
    var obj = new Box();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();

}

function pushTriangle() {/////////////////////////////////////////////////////////////////////////
    var obj = new Triangle();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();}/////////////////////////////////////////////////////


function pushCircle() {
    var obj = new Circle();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();
}

function updateDisplay(objectSelected) {
    document.getElementById("posx").value = objectSelected.getTranslate()[0];
    document.getElementById("posy").value = objectSelected.getTranslate()[1];
}
function updateName() {
    if(objectSelected != null){
        try{
            name = document.getElementById("name").value;
            objectSelected.setName(name);
            drawCanvas();
        }
        catch(error){
            alert(error);
        }
    }
}


function updatePosition() {
    if (objectSelected != null) {
        try {
            posx = parseFloat(document.getElementById("posx").value);
            posy = parseFloat(document.getElementById("posy").value);
            objectSelected.setTranslate(posx, posy);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updatePosition1() {
    if (objectSelected != null) {
        try {
            posx = parseInt(document.getElementById("ang").value);            
            objectSelected.setRotate(posx);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updatePosition2() {
    if (objectSelected != null) {
        try {
            posx = parseFloat(document.getElementById("possx").value);
            posy = parseFloat(document.getElementById("possy").value);
            objectSelected.setScale(posx, posy);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updatePosition3() {
    if (objectSelected != null) {
        try {
            cor = document.getElementById("cor").value;
            objectSelected.setFill(cor);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function updatePosition4() {
    if (objectSelected != null) {
        try {
            borda = document.getElementById("bord").value;
            objectSelected.setStroke(borda);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}

function onClickMouse(event){
    var x = event.offsetX;
    var y = event.offsetY;
    console.log("x: " + x + ", y: " + y );
    var M = transformUsual(WIDTH, HEIGHT);
    //console.log("x: " + M );
    var clickCoord = [x, y, 1];
    var coorUsu = multVec(M, clickCoord);
    //console.log("intectptoui");
    objectSelected = null;
    for(var i = 0; i < objects.length;  i++){
        if(objects[i].tryIntersection(coorUsu)){
            objectSelected = objects[i];
            updateDisplay(objectSelected);
            //console.log("intectptoui");
        }
    }

}

function overClick(event){
    flag = 0;
}

function setToMoveObject(){
    flag = 1;
}

document.addEventListener("dblclick", setToMoveObject);
document.addEventListener("mousemove", moveObject);
document.addEventListener("click", overClick);

function moveObject(event){
    if(flag == 1){
        if(objectSelected != null){
            var x = event.offsetX;
            var y = event.offsetY;
            //console.log(WIDTH);
            var M = transformUsual(WIDTH, HEIGHT);
            //console.log(M);
            var clickcoords = [x, y, 1];

            var pos = multVec(M, clickcoords);
            objectSelected.setTranslate(pos[0], pos[1]);
            drawCanvas();
        }
    }
}