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
  public canvasWidth = 1750;
  public canvasHeight = 1000;
  public offsetX = 2.5;
  public offsetY = 1;
  public fractalPositionLeft: number;
  public fractalPositionTop: number;
  public maxIteration = 255;

  ngAfterViewInit(): void {
    this.fractalPositionLeft = this.fractal.nativeElement.offsetLeft;
    this.fractalPositionTop = this.fractal.nativeElement.offsetTop;
    this.execute();
  }

  public doubleup(e) {
    const x = e.pageX - this.fractalPositionLeft;
    const y = e.pageY - this.fractalPositionTop;

    const scaleX = this.width / this.canvasWidth;
    const scaleY = this.height / this.canvasHeight;

    const clickedX = x * scaleX - this.offsetX;
    const clickedY = y * scaleY - this.offsetY;

    this.width = this.width / 2;
    this.height = this.height / 2;

    this.offsetX = -(clickedX - (this.width / 2));
    this.offsetY = -(clickedY - (this.height / 2));

    this.execute();
  }

  private execute() {
    const ctx = this.fractal.nativeElement.getContext('2d');

    const scaleX = this.width / this.canvasWidth;
    const scaleY = this.height / this.canvasHeight;

    for (let i = 0; i < this.canvasWidth; i++) {
      for (let j = 0; j < this.canvasHeight; j++) {
        let iteration = 0;
        let zx = i * scaleX - this.offsetX;
        let zy = j * scaleY - this.offsetY;
        const cx = i * scaleX - this.offsetX;
        const cy = j * scaleY - this.offsetY;

        while (zx * zx + zy * zy < 4 && iteration < this.maxIteration) {
          const xtemp = zx * zx - zy * zy;
          zy = 2 * zx * zy + cy;
          zx = xtemp + cx;
          iteration++;
        }

        if (iteration === this.maxIteration) {
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
