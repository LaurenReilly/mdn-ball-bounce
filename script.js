//variables for ball count

var para = document.querySelector('p');
var count = 0;

// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number within a range of 2 numbers

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//creating the ball

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;  
  }

  //creating the balls

  function Ball (x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  Ball.prototype = Object.create(Shape.prototype);
  Ball.prototype.constructor = Ball;

  //creating the evil circle

  function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = "white";
    this.size = 10;
  }

  EvilCircle.prototype = Object.create(Shape.prototype);
  EvilCircle.prototype.constructor = EvilCircle;

  //draw functions

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();

  }

  //EvilCircles function to keep it on screen

  EvilCircle.prototype.checkBounds = function(){
    if ((this.x + this.size) >= width) {
      this.x -= this.x;
    }
  
    if ((this.x - this.size) <= 0) {
      this.x += this.x;
    }
  
    if ((this.y + this.size) >= height) {
      this.y -= this.y;
    }
  
    if ((this.y - this.size) <= 0) {
      this.y += this.y;
    }
  }

  //EvilCircle movement

  EvilCircle.prototype.setControls = function() {
      var _this = this;
      window.onkeydown = function(e) {
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
  }

  //EvilCircle Collision Detection

  EvilCircle.prototype.collisionDetect = function() {
      for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
          var dx = this.x - balls[j].x;
          var dy = this.y - balls[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);
    
          if (distance < this.size + balls[j].size) {
            balls[j].exists = false;
            count--;
            para.textContent = "Ball Count: " + count;
        }
      }
    }
  }

  //update function

  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }

  //collision detection

  Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
  }


// array to store the balls
  var balls = [];


//creating the evil circle on screen

var evilCircle = new EvilCircle(random(0, width), random(0, height), true);
evilCircle.setControls();

// animation loop

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    while (balls.length < 25) {
      var size = random(10,20);
      var ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        exists = true,
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
        size
      );
      balls.push(ball);
      count++;
      para.textContent = "Ball Count: " + count;
    }
  
    for (var i = 0; i < balls.length; i++) {
      if (balls[i].exists) {
        balls[i].draw();
        balls[i].update()
        balls[i].collisionDetect();
      }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
  }

  loop();


  /*things that confused me: this.color and this.size in the EvilCircle constructor. I 
  didn't understand that at all and so I had just defined them as color: white and
  size: 10. Need to figure out what this really is! Understanding what properties and
  what the parameters are on objects. Not clear on that but I have a better understanding
  now. Read up on the inheritance and prototype stuff! */