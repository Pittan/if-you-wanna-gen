import { Component, OnInit } from '@angular/core';

import 'fabric';
declare const fabric: any;

@Component({
  selector: 'ph-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'ph';

  imageRed = '';
  imageBlue = '';
  imageGreen = '';

  image = '';
  showDialog = false;

  canvas = null;

  ngOnInit() {
    this.canvas = new fabric.Canvas('main-canvas', {
      isDrawingMode: false,
    });
  }

  onImageSelect(color: string, file, target) {
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.makeColorPhoto(color, myReader.result, target);
    };
    myReader.readAsDataURL(file);
  }

  makeColorPhoto(color, file, target) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = file;
    img.onload = () => {
      const canvas = <HTMLCanvasElement>document.querySelector('.cooker');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.fillRect(0, 0, 2000, 2000);

      const hRatio = canvas.width / img.width    ;
      const vRatio = canvas.height / img.height  ;
      const ratio  = Math.min ( hRatio, vRatio );

      const centerShift_x = ( canvas.width - img.width * ratio ) / 2;
      const centerShift_y = ( canvas.height - img.height * ratio ) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      ctx.save();

      ctx.globalCompositeOperation = 'source-over';  // 重なる部分だけを描画するというモード

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 2000, 2000);

      if (target === 'red') {
        this.imageRed = canvas.toDataURL();
      }
      if (target === 'blue') {
        this.imageBlue = canvas.toDataURL();
      }
      if (target === 'green') {
        this.imageGreen = canvas.toDataURL();
      }
    };
  }

  mixup() {
    fabric.Image.fromURL(this.imageRed, (img1) => {
      img1.scale(0.25);
      img1.set({'left': 0});
      img1.set({'top': 0});

      fabric.Image.fromURL(this.imageBlue, (img2) => {
        img2.scale(0.25);
        img2.set({'left': 0});
        img2.set({'top': 0});

        fabric.Image.fromURL(this.imageGreen, (img3) => {
          img3.scale(0.25);
          img3.set({'left': 0});
          img3.set({'top': 0});
          img1.globalCompositeOperation = 'lighten';
          img2.globalCompositeOperation = 'lighten';
          img3.globalCompositeOperation = 'lighten';

          this.canvas.add(img1);
          this.canvas.add(img2);
          this.canvas.add(img3);
        }, { crossOrigin: 'Anonymous' });
      }, { crossOrigin: 'Anonymous' });
    }, { crossOrigin: 'Anonymous' });
  }

  upload(selector: string) {
    const element = <HTMLElement>document.querySelector(selector);
    element.click();
  }

  save() {
    this.image = this.canvas.toDataURL();
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

}
