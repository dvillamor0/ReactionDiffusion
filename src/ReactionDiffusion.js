class ReactionDiffusion {

  textura = null;

  constructor(size, steps = 9, dA = 1, dB = 0.07, feed = 0.055, kill = 0.062) {
    this.size = size;
    this.steps = steps;

    this.dA = dA;
    this.dB = dB;
    this.feed = feed;
    this.kill = kill;

    this.textura = [];
    this.texturaNext = [];

    this.resetear();

  }

  simular() {

    for (let n = 0; n < this.steps; n++) {

      for (let i = 1; i < this.size-1; i++) {
        for (let j = 1; j < this.size-1; j++) {
          const a = this.textura[i][j].a;
          const b = this.textura[i][j].b;

          this.texturaNext[i][j].a = a +
                                    (this.dA * this.laplace("a",i,j)) -
                                    (a*b*b) +
                                    (this.feed * (1-a));

          this.texturaNext[i][j].b = b +
                                    (this.dB * this.laplace("b",i,j)) +
                                    (a*b*b) -
                                    ((this.kill + this.feed) * b);

          this.texturaNext[i][j].a = constrain(this.texturaNext[i][j].a,0,1);
          this.texturaNext[i][j].b = constrain(this.texturaNext[i][j].b,0,1);

        }
      }
      this.intercambiar();
    }
  }

  resetear(){
    for (let i = 0; i < this.size; i++) {

      this.textura[i] = [];
      this.texturaNext[i] = [];

      for (let j = 0; j < this.size; j++) {
        this.textura[i][j] = { a: 1, b: Math.random()};
        this.texturaNext[i][j] = { a: 1, b: 0 };
      }
    }

    /*
    const medio = Math.floor(this.size/2);

    for (let i = medio; i < medio+5; i++) {

      for (let j = medio; j < medio+5; j++) {
        this.textura[i][j].b = 1;
      }
    }
    */
  }

  laplace(L,i,j){
    let sum = 0;

    sum += this.textura[i][j][L] * -1;

    sum += this.textura[i-1][j][L] * 0.2;
    sum += this.textura[i+1][j][L] * 0.2;
    sum += this.textura[i][j-1][L] * 0.2;
    sum += this.textura[i][j+1][L] * 0.2;

    sum += this.textura[i-1][j-1][L] * 0.05;
    sum += this.textura[i-1][j+1][L] * 0.05;
    sum += this.textura[i+1][j-1][L] * 0.05;
    sum += this.textura[i+1][j+1][L] * 0.05;

    return sum;
  }


  intercambiar() {
    const aux = this.texturaNext;
    this.texturaNext = this.textura;
    this.textura = aux;
  }

  getTexturaSrc() {
    const canvas2 = document.getElementById('canvas2');
    canvas2.width = this.size;
    canvas2.height = this.size;
    const ctx = canvas2.getContext('2d');
    const imageData = ctx.createImageData(this.size, this.size);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const pixelPosition = (i * this.size + j) * 4;

        const a = this.textura[i][j].a
        const b = this.textura[i][j].b

        let val = Math.floor((a-b) * 255);
        val = constrain(val,0,255);

        /*
        let aVal = Math.floor(a * 255);
        aVal = constrain(aVal,0,255);
        let bVal = Math.floor(b * 255);
        bVal = constrain(bVal,0,255);
        */

        imageData.data[pixelPosition] = val; // R
        imageData.data[pixelPosition + 1] = val; // G
        imageData.data[pixelPosition + 2] = val; // B
        imageData.data[pixelPosition + 3] = 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas2.toDataURL();
  }


}
