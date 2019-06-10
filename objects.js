//predefined colors
white = "#ffffff65"; //com transparencia
black = "#000000"

SEGMENTS_CIRCLE = 30;

function Box(center = [0, 0, 1], height = 50, width = 50) {
    this.center = center;
    this.height = height;
    this.width = width;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Box.prototype.setName = function(name) {
    this.name = name;
}

Box.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Box.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}
Box.prototype.getInvrTranslate = function() {
    return invrTranslate(this.T);
}

Box.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}
Box.prototype.getInvrRotate = function() {
    return invrRotate(this.R);
}

Box.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}
Box.prototype.getInvrScale = function() {
    return invrScale(this.S);
}

Box.prototype.setFill = function(fill) {
    this.fill = fill;
}

Box.prototype.setStroke = function(stroke) {
    this.stroke = stroke;
}

Box.prototype.tryIntersection = function(coord){
    var inversaS = this.getInvrScale();
    var inversaR = this.getInvrRotate();
    var inversaT = this.getInvrTranslate();
    var inversaM = mult(mult(inversaS, inversaR), inversaT);    
    var coordLocal = multVec(inversaM, coord);

    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);
    
    if(coordLocal[0] >= points[1][0] && coordLocal[0] <= points[0][0]){
        if(coordLocal[1] >= points[2][1] && coordLocal[1] <= points[1][1]){
            console.log("interceptou o box");
            return true;
        }
    }
    return false;
}

Box.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}


function Circle(center = [0, 0, 1], radius = 50) {
    this.center = center;
    this.radius = radius;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Circle.prototype.setName = function(name) {
    this.name = name;
}

Circle.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}
Circle.prototype.getInvrTranslate = function() {
    return invrTranslate(this.T);
}

Circle.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Circle.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}
Circle.prototype.getInvrRotate = function() {
    return invrRotate(this.R);
}

Circle.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}
Circle.prototype.getInvrScale = function() {
    return invrScale(this.S);
}

Circle.prototype.setRadius = function(r) {
    this.radius = r;
}

Circle.prototype.setFill = function(fill) {
    this.fill = fill;
}
Circle.prototype.setStroke = function(stroke) {
    this.stroke = stroke;
}

Circle.prototype.tryIntersection = function(coord){
    var inversaS = this.getInvrScale();
    var inversaR = this.getInvrRotate();
    var inversaT = this.getInvrTranslate();
    var inversaM = mult(mult(inversaS, inversaR), inversaT);    
    var coordLocal = multVec(inversaM, coord);

    //var distancia = Math.sqrt(Math.pow(this.center[0], coordLocal[0]) + Math.pow(this.center[1], coordLocal[1]));
    var distancia = Math.sqrt(Math.pow(coordLocal[0]- this.center[0], 2) + Math.pow(coordLocal[1]- this.center[1], 2));
    
    if(distancia <= this.radius){
        console.log("interceptou o circle");
        return true;
    }
    return false;

}

Circle.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.R, this.S), this.T));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    var alpha = 2 * Math.PI / SEGMENTS_CIRCLE;
    for (i = 0; i < SEGMENTS_CIRCLE; i++) {
        points.push([Math.cos(alpha * i) * this.radius + this.center[0], Math.sin(alpha * i) * this.radius + this.center[1], 1]);
    }
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


function Triangle(center = [0, 0, 1], height = 50, width = 50) {
    this.center = center;
    this.height = height;
    this.width = width;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.name = "";
}

Triangle.prototype.setName = function(name) {
    this.name = name;
}

Triangle.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Triangle.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}
Triangle.prototype.getInvrTranslate = function() {
    return invrTranslate(this.T);
}

Triangle.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}
Triangle.prototype.getInvrRotate = function() {
    return invrRotate(this.R);
}

Triangle.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}
Triangle.prototype.getInvrScale = function() {
    return invrScale(this.S);
}

Triangle.prototype.setFill = function(fill) {
    this.fill = fill;
}

Triangle.prototype.setStroke = function(stroke) {
    this.stroke = stroke;
}

Triangle.prototype.tryIntersection = function(coord){
    var inversaS = this.getInvrScale();
    var inversaR = this.getInvrRotate();
    var inversaT = this.getInvrTranslate();
    var inversaM = mult(mult(inversaS, inversaR), inversaT);    
    var coordLocal = multVec(inversaM, coord);

    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);    
    
    if(coordLocal[0] >= points[1][0] && coordLocal[0] <= points[0][0]){
        if(coordLocal[1] >= points[2][1] && coordLocal[1] <= points[1][1]){
            console.log("interceptou o triangle");
            return true;
        }
    }
    return false;
}

Triangle.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}