function drawTriangle(ctx,dir,x,y,fillColor,lineColor,lineWidth){
    ctx.beginPath();
    if (dir==0) {
        ctx.moveTo(x+10,y)
        ctx.lineTo(x,y);
        ctx.lineTo(x+25,y-50);
        ctx.lineTo(x+50,y);
        ctx.lineTo(x+10,y);
    } else if (dir==1) {
        ctx.moveTo(x,y-10)
        ctx.lineTo(x,y-50);
        ctx.lineTo(x+50,y-25);
        ctx.lineTo(x,y);
        ctx.lineTo(x,y-10);
    } else if (dir==2) {
        ctx.moveTo(x+10,y-50)
        ctx.lineTo(x,y-50);
        ctx.lineTo(x+25,y);
        ctx.lineTo(x+50,y-50);
        ctx.lineTo(x+10,y-50);
    } else if (dir==3) {
        ctx.moveTo(x+50,y-10)
        ctx.lineTo(x+50,y-50);
        ctx.lineTo(x,y-25);
        ctx.lineTo(x+50,y);
        ctx.lineTo(x+50,y-10);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.stroke();
}

function drawFigures(ctx,x,y,dirs,colors){
    ctx.beginPath();
    ctx.roundRect(x,y,250,70,10);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "AntiqueWhite";
    ctx.fill();
    ctx.stroke();
    drawTriangle(ctx,dirs[0],x+10,y+60,colors[0],"black",3);
    drawTriangle(ctx,dirs[1],x+70,y+60,colors[1],"black",3);
    drawTriangle(ctx,dirs[2],x+130,y+60,colors[2],"black",3);
    drawTriangle(ctx,dirs[3],x+190,y+60,colors[3],"black",3);
}

function drawNode(ctx,x,y,text,color,textColor) {
    ctx.beginPath();
    ctx.roundRect(x,y,150,50,5);
    ctx.strokeStyle="black";
    ctx.lineWidth = 4;
    ctx.fillStyle=color;
    ctx.fill();
    ctx.stroke();
    ctx.font ="30px Courier";
    ctx.textAlign ="center"
    ctx.textBaseline = "middle";
    ctx.fillStyle=textColor;
    ctx.fillText(text,x+75,y+25);
}


function drawEdge(ctx,xstart,ystart,xend,yend,lineWidth=4,color="LightGray") {
    let yendNew=yend;
    let ystartNew=ystart;
    if (yend<ystart){
        yendNew = ystart;
        ystartNew = yend;
    }
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(xstart,ystartNew);
    xdiff=xend-xstart;
    ydiff=yendNew-ystartNew;
    if (xdiff==0){
        ctx.lineTo(xend,yendNew);
    } else {
        radius=ydiff/4;
        if (radius>Math.abs(xdiff)){
            radius = xdiff/4;
        }
        if (xdiff>0) {
            ctx.lineTo(xstart,ystartNew+ydiff/2-radius);
            ctx.arc(xstart+radius,ystartNew+ydiff/2-radius,radius,Math.PI,Math.PI*1/2,true);
            ctx.lineTo(xend-radius,ystartNew+ydiff/2);
            ctx.arc(xend-radius,ystartNew+ydiff/2+radius,radius,Math.PI*3/2,0);
            ctx.lineTo(xend,yendNew);
        } else {
            ctx.lineTo(xstart,ystartNew+ydiff/2-radius);
            ctx.arc(xstart-radius,ystartNew+ydiff/2-radius,radius,0,Math.PI/2);
            ctx.lineTo(xend+radius,ystartNew+ydiff/2);
            ctx.arc(xend+radius,ystartNew+ydiff/2+radius,radius,Math.PI*3/2,Math.PI,true);
            ctx.lineTo(xend,yendNew);
        }
    }

    ctx.stroke();
}
