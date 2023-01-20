import kaboom from "kaboom"

kaboom({
	width:800,
	height:676,
	font:"sinko",
	background:[180, 255, 255]
})

loadSprite("wall", "assets/wall.png")
loadSprite("player", "assets/player.png")
loadSprite("enemy", "assets/enemy.png")
loadSprite("coin", "assets/coin.png")
loadSprite("robot", "assets/robot.png")
loadSprite("powerUps", "assets/powerUps.png")
loadSprite("door", "assets/door.png")

let currentLevel = 0

const LEVELS = [
	[
		"wwwwwwwwwwwwwwwwwwww",
		"w                  w",
		"w    e         e   w",
		"w  wwwwww  wwwwww  w",
		"w  w    w cw    w  w",
		"w  w c  wwww  c w  w",
		"w  w            w  w",
		"w                  w",
		"wr   e  wwwww e   rw",
		"w  w        w   w  w",
		"w  w    wwwww   w  w",
		"w  w c        c w  w",
		"w  w            w  w",
		"w  wwwwwwwwwwwwww  w",
		"w                  w",
		"w                  w",
		"wwww  r       r wwww",
		"w                  w",
		"w                  w",
		"wwwwwwwwwwwwwwwwwwww"
	  ],


	  [
		"wwwwwwwwwwwwwwwwwwww",
		"wwww          www  w",
		"w     e       w    w",
		"w c     www   w c  w",
		"wwww    w     www  w",
		"w       w       e  w",
		"w       www        w",
		"w   e              w",
		"w  www        www  w",
		"w    w        w    w",
		"w  c w   h    w c  w",
		"w  www        www  w",
		"w                  w",
		"w   www    www     w",
		"w     w    w       w",
		"w h c w    w c  h  w",
		"w   www e  www     w",
		"w                  w",
		"w                  w",
		"wwwwwwwwwwwwwwwwwwww"
	  ],

	  [
		"wwwwwwwwwwwwwwwwwwww",
		"w      w c  w c    w",
		"w      w    w      w",
		"w  wwwwww  wwwwwwh w",
		"w        v         w",
		"w                  w",
		"wwww  wwwwwwwwwwwwww",
		"w     w            w",
		"w     w c          w",
		"we wwwwwwwwwwwwww  w",
		"w                h w",
		"w       c   e      w",
		"wwwwwwwwwwwww  wwwww",
		"w                  w",
		"w       e        c w",
		"w hwwwwwwwwwwwwwwwww",
		"w              w   w",
		"w      wwww  e w c w",
		"w       c w        w",
		"wwwwwwwwwwwwwwwwwwww"
	  ] 
]



const levelConfig = {
	width:32,
	height:32,
	w: () =>[sprite("wall"), area(), solid()], 
	e: () =>[sprite("enemy"), area(), "enemy"],
	c: () =>[sprite("coin"), area(), "coin"],
	v: () =>[sprite("robot"), area(), "robotV","enemies"],
	h: () =>[sprite("robot"), area(), "robotH", "enemies"],
	p: () =>[sprite("powerUps"), area(), "powerUps"],
	//d: () =>[sprite("door"), area(), "door"],
}

scene("mapGame", (levelNumber)=>{
	let playing = true
	let maxTime = 20;
	let robotVSpeed = 30;
	let robotHSpeed = 30;
switch (levelNumber) {
	case 0:
		 maxTime = 30;
		 robotVSpeed = 30;
		 robotHSpeed = 30;
		break;

		case 1:
			 maxTime = 40;
			 robotVSpeed = 20;
			 robotHSpeed = 20;
			break;
	default:
		maxTime = 40;
		robotVSpeed = 20;
		robotHSpeed = 20;
		break;
}


	
	


addLevel(
	LEVELS[levelNumber ?? 0],
	levelConfig
);

const score = add([
	text("Score: 0", {size: 28}),
	pos(50,70),
	fixed(),
	{value: 0},
]);

const lives = add([
	text("Lives: 3", {size: 28}),
	pos(530,70),
	fixed(),
	{value: 3},
]);


const myTimer = add([
	text(`Time: ${maxTime}`, {size: 28}),
	pos(300,70),
	fixed(),
	{value: maxTime},
]);

const gameOverText = add([
	text("Game Over", {size: 28}),
	pos(250,300),
	fixed(),
	opacity (0)
]);

const youWinText = add([
	text("You Win!", {size: 28}),
	pos(250,350),
	fixed(),
	opacity (0)
]);


const allCoins = get("coin").length

  let player = add([
	// list of components
	sprite("player"),
	pos(50, 100),
	area(), //give collision area around sprite
	solid(), //cannot go through walls
	"player", //tag to use later in the code
  ]);


  let door = add([
	// list of components
	sprite("door"),
	pos(400, 50),
	area(), //give collision area around sprite
	opacity (0),
	"door", //tag to use later in the code
    
  ]);


  function gameOver(){
	playing = false;
	gameOverText.opacity = 1;
  }





  function youWinGame(){
	playing = false;
	youWinText.opacity = 1;

	currentLevel ++;

	if (currentLevel==LEVELS.length){
		currentLevel=0;
	}
	// currentLevel = 0;
  }

  player.onCollide("enemy",(theEnemy)=>{
	if(theEnemy.opacity==1){
		lives.value -= 1;
		lives.text = `Lives: ${lives.value}`;
	}

	if(lives.value==0){
		
		gameOver();
	}
	
  })

  player.onCollide("enemies",(rob)=>{
	
	lives.value -= 1;
	lives.text = `Lives: ${lives.value}`;
	if(lives.value==0){
		
		gameOver();
	}
	
  })

  loop(3, () => {
	if(playing){
		every("enemy", (aEnemy) => {
		
			if (aEnemy.opacity == 1) {
			aEnemy.opacity = 0;
			} else {
			aEnemy.opacity = 1;
			}
	
		});
 }
    
})

loop(1,()=>{
if(playing){
	if(myTimer.value>0){
		myTimer.value -=1;
		myTimer.text=`Time: ${myTimer.value}`;
	}else{
		gameOver()
	}
}
})


   onKeyDown("right", () => {
	 if (playing) player.move(200, 0);
   });

   onKeyDown("left", () => {
	 if (playing) player.move(-200, 0);
   });

   onKeyDown("up", () => {
	 if (playing) player.move(0, -200);
   });
   onKeyDown("down", () => {
	if (playing) player.move(0, 200);
  });

camScale(1.2, 1.2);

player.onUpdate(() => {
	camPos(player.pos);
});

onUpdate("robotH",(robotH)=>{
	if(playing) robotH.move(robotHSpeed,0)
});

onUpdate("robotV",(robotV)=>{
	if(playing) robotV.move(0,-robotVSpeed)
});


loop(3,()=>{
	robotHSpeed *= -1;
});


loop(3,()=>{
	robotVSpeed *= -1;
})

player.onCollide("coin",(theCoin)=>{
	destroy(theCoin);
	score.value += 1;
	score.text = `Score: ${score.value}`;
 if(score.value==allCoins)door.opacity=1;
 
	 
})


player.onCollide("powerUps",(thePowerUps)=>{
	destroy(thePowerUps);
	lives.value += 1;
	lives.text = `Lives: ${lives.value}`;
	 
})

player.onCollide("door",(door)=>{
	go("mapGame", currentLevel++);
	 
})

// onClick((door) =>{
// 	if(!playing)go("mapGame", currentLevel);
// })

})
go("mapGame",currentLevel)

