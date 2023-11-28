let reactionDiffusion = null;
const resultImage = document.getElementById('resultImage');
let textureImg = null;
let modelo = null;

function preload() {
    modelo = loadModel('./assets/caballo.obj', true);
}

function setup() 
{
	canvas = createCanvas(window.innerWidth, window.innerHeight * 0.8, WEBGL);
    canvas.parent("canvas");

    reactionDiffusion = new ReactionDiffusion(64,64);
    reactionDiffusion.simular();

    windowResized();
    preview();
}

function draw()
{
    background(100);
    frameRate(24);
    ambientLight(128);
    orbitControl();

    noStroke();

/*
    reactionDiffusion.simular();
    textureImg = loadImage(reactionDiffusion.getTexturaSrc(), () => {
        texture(textureImg);
        plane(500, 500); 
      });
*/
  
    texture(textureImg);
    push();
    translate(0,-200,0);
    plane(200, 200);
    pop();
    push();
    rotate(Math.PI,[0,1,0]);
    model(modelo);
    pop();
  

}

function preview() {
    resultImage.src = reactionDiffusion.getTexturaSrc();
    textureImg = loadImage(resultImage.src);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight * 0.8);
  }