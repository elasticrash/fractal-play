import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'fractal';
  @ViewChild('fractal') fractal: ElementRef;
  public width = 3.5;
  public height = 2;
  public canvasWidth = 875;
  public canvasHeight = 500;
  public offsetX = 2.5;
  public offsetY = 1;

  ngAfterViewInit(): void {
    this.execute();
  }

  public doubleup(e) {
    console.log(e);

    const scaleX = this.width / this.canvasWidth;
    const scaleY = this.height / this.canvasHeight;

    const clickedX = e.x * scaleX - this.offsetX;
    const clickedY = e.y * scaleY - this.offsetY;

    this.width = this.width / 2;
    this.height = this.height / 2;

    this.offsetX = Math.abs(clickedX - (this.offsetX / 2));
    this.offsetY = Math.abs(clickedY - (this.offsetY / 2));

    this.execute();
  }

  private execute() {
    const ctx = this.fractal.nativeElement.getContext('2d');
    const maxIteration = 1000;

    const scaleX = this.width / this.canvasWidth;
    const scaleY = this.height / this.canvasHeight;

    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < 500; j++) {
        let iteration = 0;
        let zx = i * scaleX - this.offsetX;
        let zy = j * scaleY - this.offsetY;
        const cx = i * scaleX - this.offsetX;
        const cy = j * scaleY - this.offsetY;

        while (zx * zx + zy * zy < 4 && iteration < maxIteration) {
          const xtemp = zx * zx - zy * zy;
          zy = 2 * zx * zy + cy;
          zx = xtemp + cx;
          iteration++;
        }

        if (iteration === maxIteration) {
          this.render('#000000', i, j, ctx).then();
        } else {
          this.render(this.fullColorHex(iteration), i, j, ctx).then();
        }
      }
    }
  }

  private rgbToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  private fullColorHex(g) {
    const overflowTimes = Math.floor(g / 255);
    const finalValue = g - (255 * overflowTimes);

    const red = this.rgbToHex(finalValue);
    const green = this.rgbToHex(finalValue);
    const blue = this.rgbToHex(finalValue);
    return '#' + red + green + blue;
  }

  private async render(color: string, i, j, ctx: any) {
    return new Promise((resolve, reject) => {
      ctx.fillStyle = color;
      ctx.fillRect(i, j, i + 1, j + 1);
      resolve(true);
    });
  }
}
