class DebugCircle {
  constructor(x,y,r,fill) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
    this.renders = 100;
  }
  render(ctx) {
    if(this.renders <= 0) {
      return;
    }
    this.renders--;
    ctx.beginPath();
    ctx.arc(this.x, ctx.canvas.height - this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
}

export default DebugCircle;
