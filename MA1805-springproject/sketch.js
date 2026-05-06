let image_intro;
let image_cartoons = [];
let myGeometry;
let image_bg =[];
let finalImage = [];
let londonImage =[];
let londonIndex = 0;
let nextLondonSwitch =0;
let londonDelay = 800;
let textAlpha = 0;

let revealedImages = 0;
let lastImageFrame = 0;
let textLayer;

const STATE_INITIAL = 0;
const STATE_REVEAL_CARTOON = 2;
const STATE_REVEAL_MYGEOMETRY = 3;
const STATE_REVEAL_LONDON = 4;
const STATE_FINAL = 5;

let state = STATE_INITIAL;

function preload() {
  image_intro = loadImage("Images/page-1.png");
  image_bg[0] = loadImage("Images/lebculture.png");
  image_bg[1] = loadImage("Images/frenchdress.png");
  londonImage[0] = loadImage("Images/lnd11.jpg");
  londonImage[1] = loadImage("Images/lnd22.jpg");
  londonImage[2] = loadImage("Images/lnd33.jpg");

  image_cartoons[0]  = loadImage("Images/spacetoon1.jpg");
  image_cartoons[1]  = loadImage("Images/spacetoon2.png");
  image_cartoons[2]  = loadImage("Images/tfou1.png");
  image_cartoons[3]  = loadImage("Images/tiji1.png");
  image_cartoons[4]  = loadImage("Images/tiji2.png");
  image_cartoons[5]  = loadImage("Images/spacetoon3.png");
  image_cartoons[6]  = loadImage("Images/spacetoon4.png");
  image_cartoons[7]  = loadImage("Images/spacetoon5.png");
  image_cartoons[8]  = loadImage("Images/tiji4.png");
  image_cartoons[9]  = loadImage("Images/tfou2.png");
  image_cartoons[10] = loadImage("Images/tfou3.png");

  finalImage[0] = loadImage("Images/leb1.png");
  finalImage[1] = loadImage("Images/france1.png");
  finalImage[2] = loadImage("Images/lnd1.png");
  finalImage[3] = loadImage("Images/w.e.b du bois.png");
}

function setup() {
  createCanvas(2000, 1000, WEBGL);
  imageMode(CENTER);

  textLayer = createGraphics(2000, 1000);
  textLayer.textFont('monospace');

  beginGeometry();
  cone(100, 200, 3);
  myGeometry = endGeometry();
  myGeometry.computeNormals();
}

function draw() {
  if (state === STATE_INITIAL) {
    background(240);
    drawIntro();

  } else if (state === STATE_REVEAL_CARTOON) {
    background(0, 0, 255);
    drawAnimation();

  } else if (state === STATE_REVEAL_MYGEOMETRY) {
    background(255, 255, 255);
    drawmyGeometry();
} else if (state === STATE_REVEAL_LONDON) {
    drawLondonimages();
  } 
  else if (state === STATE_FINAL) {
    background(0);
    drawFinalPage();
  }
}

function drawIntro() {
  image(image_intro, 0, 0, 2000, 1000);
}

function drawAnimation() {
  orbitControl();

  let spacingX = 300;
  let spacingY = 300;
  let index = 0;
  noStroke();

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      let img = image_cartoons[index % image_cartoons.length];
      if (img) {
        push();
        let x = col * spacingX - 600;
        let y = row * spacingY - 400;
        translate(x, y, 0);
        beginShape();
        texture(img);
        vertex(-100, -100, 0, 0, 0);
        vertex( 100, -100, 0, 1, 0);
        vertex( 100,  100, 0, 1, 1);
        vertex(-100,  100, 0, 0, 1);
        endShape(CLOSE);
        pop();
      }
      index++;
    }
  }

  textLayer.clear();
  textLayer.textSize(24);
  textLayer.noStroke();
  textLayer.fill(255);
  textLayer.text("kids shows ,both in arabic and french that shaped my childhood ", 40, 60);

  push();
  resetMatrix();
  noStroke();
  texture(textLayer);
  plane(2000, 1000);
  pop();
}

function drawmyGeometry() {
  orbitControl();
  lights();
  rotateY(frameCount * 0.03);
  rotateX(frameCount * 0.01);

 
push();
resetMatrix();
translate(-width / 2 + 400, height / 2 - 300, -100);
imageMode(CENTER);
if (image_bg[0]) image(image_bg[0], 0, 0, 800, 600);
pop();


push();
resetMatrix();
translate(width / 2 - 250, height / 2 - 450, -100);
imageMode(CENTER);
if (image_bg[1]) image(image_bg[1], 0, 0, 500, 900);
pop();

  // Cone
  stroke(0);
  fill(200, 0, 0);
  model(myGeometry);

  stroke(255, 80, 0);
  strokeWeight(1.5);
  for (let i = 0; i < myGeometry.vertices.length; i++) {
    let v = myGeometry.vertices[i];
    let n = myGeometry.vertexNormals[i];
    let p = p5.Vector.mult(n, 30);
    push();
    translate(v.x, v.y, v.z);
    line(0, 0, 0, p.x, p.y, p.z);
    pop();
  }


  textLayer.clear();
  textLayer.textSize(24);
  textLayer.noStroke();
  textLayer.fill(0);
  textLayer.text("effect of 2 polar opposite cultures", 40, 60);

  push();
  resetMatrix();
  noStroke();
  texture(textLayer);
  plane(2000, 1000);
  pop();
}
function drawLondonimages() {
  background(255);

  // switch london images
  if (millis() > nextLondonSwitch) {
    londonIndex = (londonIndex + 1) % londonImage.length;
    nextLondonSwitch = millis() + londonDelay;
  }

  // ✅ IMPORTANT: draw in screen space
  push();
  resetMatrix();
  imageMode(CENTER);

  if (londonImage[londonIndex]) {
    image(londonImage[londonIndex], 100, 100, 2000, 1000);
  }

  pop();

  // fade-in text
  if (textAlpha < 255) {
    textAlpha += 0.5;
  }

  textLayer.clear();
  textLayer.textSize(28);
  textLayer.fill(0, textAlpha);
  textLayer.noStroke();
  textLayer.text("life in LONDON", 40, 60);

  push();
  resetMatrix();
  noStroke();
  texture(textLayer);
  plane(2000, 1000);
  pop();
}
function drawFinalPage() {
  if (frameCount - lastImageFrame > 60 && revealedImages < 4) {
    revealedImages++;
    lastImageFrame = frameCount;
  }

  if (revealedImages >= 1) {
    push();
    resetMatrix();
    translate(-width / 2 + 250, -height / 2 + 200, 0);
    if (finalImage[0]) image(finalImage[0], 0, 0, 400, 350);
    pop();
  }

  if (revealedImages >= 2) {
    push();
    resetMatrix();
    translate(width / 2 - 250, -height / 2 + 200, 0);
    if (finalImage[1]) image(finalImage[1], 0, 0, 400, 350);
    pop();
  }

  if (revealedImages >= 3) {
    push();
    resetMatrix();
    translate(-width / 2 + 250, height / 2 - 200, 0);
    if (finalImage[2]) image(finalImage[2], 0, 0, 400, 350);
    pop();
  }

  if (revealedImages >= 4) {
    push();
    resetMatrix();
    translate(width / 2 - 250, height / 2 - 200, 0);
    if (finalImage[3]) image(finalImage[3], 0, 0, 400, 350);
    pop();
  }

  if (revealedImages >= 4) {
    textLayer.clear();
    textLayer.textSize(32);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.noStroke();
    textLayer.fill(255);
    textLayer.text("Diaspora, growing up with different cultures that shape you ,presented by the american sociologist W.E.B du bois", 1000, 500);

    push();
    resetMatrix();
    noStroke();
    texture(textLayer);
    plane(2000, 1000);
    pop();
  }
}

function mousePressed() {
  if (state === STATE_INITIAL) {
    state = STATE_REVEAL_CARTOON;

  } else if (state === STATE_REVEAL_CARTOON) {
    state = STATE_REVEAL_MYGEOMETRY;

  } else if (state === STATE_REVEAL_MYGEOMETRY) {
    state = STATE_REVEAL_LONDON;
   londonIndex =0;
   textAlpha = 0;
   nextLondonSwitch = millis() +1000;
} else if (state === STATE_REVEAL_LONDON) {
    state = STATE_FINAL;
    revealedImages = 0;
    lastImageFrame = frameCount;
  }
}