document.getElementById("info-object").style.display = "none";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;

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

function onClickMouse(event){
    var x = event.offsetX;
    var y = event.offsetY;
    console.log("x: " + x + ", y: " + y );
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
            objectSelected.setFill(borda);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}