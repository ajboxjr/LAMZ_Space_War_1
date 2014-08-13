var velx = 3;
var vely = 3;
var LEFT_ARROW= 65;
var RIGHT_ARROW = 68;
var UP_ARROW = 87;
var DOWN_ARROW = 83;
var leftPress =false;
var rightPress = false;
var upPress = false;
var downPress =  false;
// var rotateCW = false;
// var rotateCCW = false;
var spacePress = false;
var controlPress1 = false;
var controlPress2 = false;
var controlPress3 = false;
var controlPress4 = false;
// var cwPress  = false;
// var ccwPress=  false;
var rotation = 0;
var myDataRef2;
var shipdata1Base;
var shipdata2Base;
var shipChoose;
var Ship1;
var Ship2;
var Ship3;
var Ship4;
var Shot;
var isControl = false;
var databaseControl;
var shipControl = 0;
var shipDic;
var shotIs = false;
var shots = [];

//float angle = 0;

// var isChanged;

myDataRef2 = new Firebase("https://luminous-fire-510.firebaseio.com/luis");


function setup () {
 // shipChoose = new Firebase("https://luminous-fire-510.firebaseio.com");
  //shipChoose.set({ship1: false, ship2: false,ship3:false,ship4:false});
  var myCanvas = createCanvas(1000, 450);
  myCanvas.parent('gameLAMZ');
  background(51);
  imgUp = loadImage("http://i.imgur.com/0sNYCgg.png");
  imgDown = loadImage("http://i.imgur.com/IolKfjJ.png");
  imgLeft = loadImage("http://i.imgur.com/xWcP92t.png");
  imgRight = loadImage("http://i.imgur.com/8qw8unl.png");
  imgUpL = loadImage("http://i.imgur.com/2UcAWqr.png");
  imgUpR = loadImage("http://i.imgur.com/nfE9tKn.png");
  imgDownL = loadImage("http://i.imgur.com/H27X8r8.png");
  imgDownR = loadImage("http://i.imgur.com/Oej2Y1V.png");
  img = imgUp;

  Ship1 = new Ship(0, 0, 6, 6, "shipdata1", 0, img, 1);
  Ship2 = new Ship(100,100, 6, 6, "shipdata2", 0, img, 2);


  myDataRef2.set({
    shipdata1: {
      x: Ship1.x,
      y: Ship1.y,
      //rotation: Ship1.rotation,
      isControl: isControl
    },
    shipdata2: {
      x: Ship2.x,
      y: Ship2.y,
      //rotation: Ship2.rotation,
      isControl: isControl
    }
  });

}


  //Creating Ship Class
  var Ship = function(x, y, velx, vely, shipdata, rotation, img, shipNum) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.shipdata = shipdata;
    this.rotation = rotation;
    this.img = img;
    this.shipNum = shipNum;

    this.database = new Firebase("https://luminous-fire-510.firebaseio.com/luis/" + shipdata);

    var shipProperties = {
      x: this.x,
      y: this.y,
      //rotation: this.rotation,
      isControl: false

    };

    this.database.set(
      shipProperties
    );

  }
  //Moving Ship Across The Screen
  Ship.prototype.move = function() {
      if(leftPress === true && this.x>0) {
        this.img = imgLeft;
        this.x+=-this.velx;
 
      }
      if (rightPress === true && this.x<870) {
        this.img = imgRight; 
        this.x+=this.velx;
        console.log("Ship1: " + Ship1.x + "Ship2: " + Ship2.x + "this.x " + this.x);
 
      }
      if(upPress === true && this.y>0) {
        this.img = imgUp;
        this.y-=this.vely;

      }
      if (downPress === true && this.y<320){
        this.img = imgDown;
        this.y+=this.vely;
  
      }

      if (upPress === true && leftPress === true){
        this.img = imgUpL;
        this.y-=this.vely;
        this.x+=-this.velx;

      }

      if (upPress === true && rightPress === true){
        this.img = imgUpR;
        this.y-=this.vely;
        this.x+=this.velx;
      }

      if (downPress === true && leftPress === true){
        this.img = imgDownL;
        this.y+=this.vely;
        this.x+=-this.velx;
      }

      if (downPress === true && rightPress === true){
        this.img = imgDownR;
        this.y+=this.vely;
        this.x+=this.velx;
      }      
      // if(cwPress=== true){
      //   this.rotation+=1;
      // }
      // if(ccwPress=== true){
      //   this.rotation-=1;
      // }
      myDataRef2.child(this.shipdata).set({
        //shipdata1: {
          x: this.x,
          y: this.y,
          //rotation: this.rotation,
          isControl: true
        //}
      });

  }


  //Painting ship onto the canvas
  Ship.prototype.paint = function() {
    image(this.img,this.x,this.y);
    
      console.log("Painting " + this.shipdata + "at " + this.x + " " + this.y);
      console.log("the rotation is"+this.rotation);
  }

    /*
    If the ship is false set ship true and creating that ship.
    if (ship1 = false){
      shipChoose.set({ship1: true});
      ship1 = true;
    }
    */

Ship.prototype.checkControl = function(controlPress) {
  var ship = this;
  
  myDataRef2.once('value', function(data){
    var snapshot = data.val();
    databaseControl = snapshot[ship.shipdata].isControl;
  });

  //console.log(databaseControl);
  if(controlPress == true && databaseControl == false && shipControl == 0){

    myDataRef2.child(this.shipdata).set({ 

        x: this.x,
        y: this.y,
        //rotation:this.rotation,
        isControl: true

    });
    shipControl = this.shipNum;    
    console.log("STATEMENT REACHED!!! UPDATE SUCCESS");
  }

}

var Shot = function(x, y, r, xSpd, ySpd){

  this.x = x;
  this.y = y;
  this.r = r;
  this.xSpd = xSpd;
  this.ySpd = ySpd;

}

Shot.prototype.move = function(imgPlace){
  if(imgPlace == imgUp){
    this.y = this.y - this.ySpd;
  }
  if(imgPlace == imgDown){
    this.y = this.y + this.ySpd;
  }
  if(imgPlace == imgLeft){
    this.x = this.x - this.xSpd;
  }  
  if(imgPlace == imgRight){
    this.x = this.x + this.xSpd;
  }  
  if(imgPlace == imgUpL){
    this.y = this.y - this.ySpd;
    this.x = this.x - this.xSpd;
  }
  if(imgPlace == imgUpR){
    this.y = this.y - this.ySpd;
    this.x = this.x + this.xSpd;
  }  
  if(imgPlace == imgDownL){
    this.y = this.y - this.ySpd;
    this.x = this.x - this.xSpd;
  }
  if(imgPlace == imgDownR){
    this.y = this.y - this.ySpd;
    this.x = this.x + this.xSpd;
  }
}  


Shot.prototype.paint = function(){
  ellipse(this.x, this.y, this.r, this.r);
}

Shot.prototype.nullShip = function(){
  
  if(this.y <= -5 || this.y >= 455 || this.x <= -5 || this.x >= 1005){
    shotIs = false;    
    shots[shots.length - 1] = null;
  }
}


//Checking if reading from the database(control).



//
function draw(){
  //Calling functions to redraw
  clear();
  background(51);
  Ship1.paint();
  Ship2.paint();
  if(shipControl == 1){
    console.log("Moving ship 1");
    Ship1.move();

    myDataRef2.child("shipdata2").on('value', function (snapshot){
      var datasnap = snapshot.val();
      Ship2.x = datasnap.x;
      Ship2.y = datasnap.y;
      //Ship2.rotation= datasnap.rotation;
    });
  }
  if(shipControl == 2){
    console.log("Moving ship 2");
    Ship2.move();

    myDataRef2.child("shipdata1").on('value', function (snapshot){
      var datasnap = snapshot.val();
      Ship1.x = datasnap.x;
      Ship1.y = datasnap.y;
      //Ship1.rotation = datasnap.rotation;
    });
  }

  Ship1.checkControl(controlPress1); 
  Ship2.checkControl(controlPress2);
  // checkControl1();
  // checkControl2();

  if(spacePress == true && shotIs == false){
    //debugger
    // for(var i = 0; i < shots.length; i++){
    // }

    shots[shots.length] = new Shot(Ship1.x + 64, Ship1.y, 10, 5, 5);    

    //debugger
    shotIs = true;
  }
  if(shotIs == true){

    shots[shots.length - 1].move(Ship1.img);
    shots[shots.length - 1].paint();
    shots[shots.length - 1].nullShip();    //add shotIs false to nullShip
  }
}


//Key Presses 
$(document).keydown(function (evt) {
  //A Key
  if(evt.keyCode === 65){
    leftPress= true;
  }
  //W Key
  else if(evt.keyCode ===87 ){
    upPress = true;
  }
  //D Key
  else if(evt.keyCode === 68){
    rightPress = true;
  }
  //S Key
  else if (evt.keyCode=== 83){
    downPress = true;
  }
  //Spacebar
  else if (evt.keyCode ===32){
    spacePress = true;
  }
  //Num 1
  else if (evt.keyCode === 49){
    controlPress1 = true;
  }
  //Num 2
  else if (evt.keyCode === 50){
    controlPress2 = true;
  }
  //Num 3
  else if (evt.keyCode === 51){
    controlPress3 = true;
  }
  //Num 4
  else if (evt.keyCode === 52){
    controlPress4 = true;
  }      
  //Left Arrow

});

$(document).keyup(function (evt) { 
  
  if(evt.keyCode === 65){
    leftPress= false;
  }
  else if(evt.keyCode ===87 ){
    upPress = false;
  }
  else if(evt.keyCode === 68){
    rightPress = false;
  }
  else if (evt.keyCode=== 83){
    downPress = false;
  }
  else if (evt.keyCode === 32){ 
    spacePress = false;
  }
  else if (evt.keyCode === 49){
    controlPress1 = false;
  }
  else if (evt.keyCode === 50){
    controlPress2 = false;
  }
  else if (evt.keyCode === 51){
    controlPress3 = false;
  }
  else if (evt.keyCode === 52){
    controlPress4 = false;
  }   
  // else if (evt.keyCode === 37){
  //   rotateCCW = false;
  // }      
  // else if (evt.keyCode === 39){
  //  rotateCW = false;
  // }
  });