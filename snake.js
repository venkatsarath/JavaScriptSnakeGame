$(function(){
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');

    var snake = [
     {x:50,y:100,oldX:0,oldY:0},
     {x:50,y:90,oldX:0,oldY:0},
     {x:50,y:80,oldX:0,oldY:0},
    ];

    var food = {x: 200,y:200, eaten:false};

    var snakeWidth = snakeHeight = 10;
    var blockSize = 10;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    var keyPressed = DOWN;

    var score = 0;

    var game;
    var speed = 300;
    //game = setInterval(gameLoop, speed);
    startInterval(speed);

    function startInterval(speed){
     game = setInterval(gameLoop, speed);
    }

    function gameLoop(){
     console.log("drawing");
     clearCanvas();
     drawFood();
     moveSnake();
     drawSnake();
    }

    function moveSnake(){
     $.each(snake,function(index,value){
      snake[index].oldX = value.x;
      snake[index].oldY = value.y;
      if(index == 0){
       if(keyPressed == DOWN){
        snake[index].y = value.y + blockSize;
       } else if(keyPressed == UP){
        snake[index].y = value.y - blockSize;
       }else if(keyPressed == RIGHT){
        snake[index].x = value.x + blockSize;
       }else if(keyPressed == LEFT){
        snake[index].x = value.x - blockSize;
       }
      }else{
       snake[index].x = snake[index - 1].oldX;
       snake[index].y = snake[index -1].oldY;
       }
     })
    }

    function drawSnake(){
     $.each(snake,function(index,value){
       ctx.fillStyle = 'red';
       ctx.fillRect(value.x,value.y,snakeWidth,snakeHeight);
       ctx.strokeStyle = 'black';
       ctx.strokeRect(value.x,value.y,snakeWidth,snakeHeight);

       if(index == 0){
        if(collided(value.x,value.y)){
        gameOver();

        }
        if(didEatFood(value.x,value.y)){
         score +=10;
         $("#score").text(score);
         increaseSnake();
         food.eaten = true;
         if(score > 500){
          $("#level").text("TOP Level");
          speed = 300;
          clearInterval(game);
          startInterval(speed);
         }else if(score > 300){
          $("#level").text("5");
          speed = 200;
          clearInterval(game);
          startInterval(speed);
         }else if(score > 200){
          $("#level").text("4");
          speed = 100;
          clearInterval(game);
          startInterval(speed);
         }else if(score > 100){
          $("#level").text("3");
          speed = 50;
          clearInterval(game);
          startInterval(speed);
         }else if(score > 50){
            $("#level").text("2");
          speed = 100;
          clearInterval(game);
          startInterval(speed);
         }
        }
       }
      });
    }

    function collided(x,y){
     return snake.filter(function(value,index){
      return index != 0 && value.x == x && value.y == y;
     }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height ;
    }

    function increaseSnake(){
     snake.push({
      x:snake[snake.length-1].oldX,
      y:snake[snake.length-1].oldY
     });
    }

    function didEatFood(x,y) {
     return food.x == x && food.y == y;
    }
    function drawFood(){
     ctx.fillStyle = 'yellow';
     if(food.eaten == true){
      food = getNewPositionForFood();
     }
     ctx.fillRect(food.x,food.y,snakeWidth,snakeHeight);
    }

    function clearCanvas(){
     ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    $(document).keydown(function(evt){
     if($.inArray(evt.which,[DOWN,UP,LEFT,RIGHT]) != -1){
      keyPressed = checkIsThisKeyAllowed(evt.which);
     }

    });

    function checkIsThisKeyAllowed(tempKey){
     let key;

     if(tempKey == DOWN){
      key = (keyPressed != UP) ? tempKey : keyPressed;
     }else if(tempKey == UP){
      key = (keyPressed != DOWN) ? tempKey : keyPressed;
     }else if(tempKey == RIGHT){
      key = (keyPressed != LEFT) ? tempKey : keyPressed;
     }else if(tempKey == LEFT){
      key = (keyPressed != RIGHT) ? tempKey : keyPressed;
     }
     return key;
    }

    function gameOver(){
     clearInterval(game);
     $("#gameUp").text("GAME OVER");
     $("#gameUp").show();
    }

    function getNewPositionForFood(){
     let xArr = yArr = [],xy;
     $.each(snake,function(index,value){
      if($.inArray(value.x, xArr) != -1 ){
       xArr.push(value.x);
      }
      if($.inArray(value.y,yArr) == -1){
       yArr.push(value.y);
      }
     });
     xy = getEmptyXY(xArr,yArr);
     return xy;
    }

    function getEmptyXY(xArr,yArr){
     let newX,newY;
     newX = getRandomNumber(canvas.width - 10,10);
     newY = getRandomNumber(canvas.height - 10,10);

     if($.inArray(newX, xArr) == -1 && $.inArray(newY,yArr) != -1){
      return {
       x:newX,
       y:newY,
       eaten:false
      }
     }else{
      return getEmptyXY(xArr,yArr);
     }
    }

    function getRandomNumber(max,multipleOf){

     let result = Math.floor(Math.random() * max);
     result = (result % 10 == 0) ? result : result + (multipleOf - result % 10);
     return result;
    }
   });
