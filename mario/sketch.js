var marioAnimation, marioCollided, groundImg;
var brickImg,obstacleAnimation;
var restartImg,restart,gameoverImg,gameover;
var mario,ground,invisibleGround;
var jumpsound,checksound,diesound;
var bricksGroup, obstaclesGroup;
var score = 0;
var bgImg;
var PLAY =1;
var END =0;
var gameState = PLAY;

function preload(){
  marioAnimation = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided = loadAnimation("collided.png");
  
  groundImg = loadImage("ground1.png");
  
  brickImg = loadImage("brick.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  checksound = loadSound("checkPoint.mp3");
  diesound = loadSound("die.mp3");
  
obstacleAnimation = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  bgImg = loadImage("bg.png");
  
}

function setup(){
  createCanvas(600,400);
  mario = createSprite(100,280,20,40);
  mario.addAnimation("running",marioAnimation);
  mario.addAnimation("collided",marioCollided);
  mario.scale = 2;

  ground = createSprite(300,360,600,40);
  ground.addImage(groundImg);
  ground.x = ground.width /2;
 ground.scale = 1.1;
  ground.velocityX =-2;
  
  invisibleGround = createSprite(200,325,600,10);
  invisibleGround.visible = false;
  
gameover = createSprite(300,200);
  gameover.addImage(gameoverImg);
  
  restart = createSprite(300,240);
  restart.addImage(restartImg);
  
  gameover.scale = 0.5;
  restart.scale = 0.5;

  gameover.visible = false;
  restart.visible = false;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
}

function draw(){
  background(bgImg);
  stroke("black");
  textSize(25);
  text("Score: "+ score, 480,30);
  
  if (gameState===PLAY){
    
    ground.velocityX = -(12);
  
    if(keyDown("space") && mario.y >= 250) {
      mario.velocityY = -12;
      jumpsound.play();
    }
  if(score>0 && score%10 === 0){
       checksound.play() 
    }
    mario.velocityY = mario.velocityY + 0.5
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

 
    for (var i = 0; i < bricksGroup.length; i++) {
    
      if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove();
      score =score+1;
    }
    }
    mario.collide(invisibleGround);
    spawnbricks();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
      jumpsound.play();
    }
  }
  else if (gameState === END) {
    gameover.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);

    mario.changeAnimation("collided",marioCollided);

    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

mario.collide(invisibleGround);
  drawSprites();
}

function spawnbricks() {
  
  if (frameCount % 60 === 0) {
    var brick = createSprite(600,120,40,10);
    //brick.debug=true
    brick.y = Math.round(random(150,180));
    brick.addImage(brickImg);
    brick.scale = 1;
    brick.velocityX = -3;
    brick.lifetime = 200;

    brick.depth = mario.depth;
    mario .depth = mario.depth + 1;
    
    bricksGroup.add(brick);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,290,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6);
 obstacle.addAnimation("obstacles",obstacleAnimation)

    obstacle.scale = 1;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",marioAnimation);
  score = 0;
  
}