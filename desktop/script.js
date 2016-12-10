//game object
function Game ()
{
    this.rotorSpin = 0; //what the current rotational position of the rotor is
    this.lastSpin = 0; //what the last spin state was
    this.rotorSpeed = 0; //what the current rotational speed of the rotor is
    this.rotorFriction = 0.001; //how much the rotor slows down by per tick
    this.deltaSpin = 0; //counts change in spin
    this.points = 0; //number of points
    this.pointsPerSpin = 1; //points per spin
}

//draws the canvas based on the current state
function draw ()
{
    fill ("#000"); //background is black, to be drawn over

    //if the background has loaded, draw that
    if (backgroundLoaded)
    {
        ctx.drawImage (background, 0, 0, c.width, c.height);
    }

    //if the rotos is loaded, draw the rotor
    if (rotorLoaded)
    {
        ctx.save (); //save coordinate system
        ctx.translate (width / 2, height / 2); //set center of screen as origin
        ctx.rotate (game.rotorSpin); //spin the screen around the center
        ctx.drawImage (rotor, -rotor.width / 2, -rotor.height / 2); //draw the rotor at the center
        ctx.restore (); //reset coordinate system
    }

    /*line (width / 2, 0, width / 2, height);
    line (0, height / 2, width, height / 2);*/ //crosshairs for alignment

    ctx.textAlign = "center"; //text is centered, aligned to top 60 px courier new
    ctx.textBaseline = "top";
    ctx.font = "60px Courier New";

    ctx.fillStyle = "#FFF"; //text is black

    ctx.fillText (game.points, width / 2, 10); //write the points counter just below the top center of the screen
}

//ticks game logic
function tick ()
{
    game.rotorSpin = (game.rotorSpin + (Math.PI * 2)) % (Math.PI * 2); //normalize rotorSpin to between zero and 2pi

    game.deltaSpin += getDeltaSpin (); //add speed (whatever the current speed is) to deltaSpin

    game.lastSpin = game.rotorSpin; //note down current velocity
    game.rotorSpin += game.rotorSpeed; //tick velocity

    //rotor stops if speed is low enough, otherwise speed is reduced.
    if (Math.abs (game.rotorSpeed) < game.rotorFriction)
    {
        game.rotorSpeed = 0;
    }
    else if (game.rotorSpeed < 0)
    {
        game.rotorSpeed += game.rotorFriction;
    }
    else if (game.rotorSpeed > 0)
    {
        game.rotorSpeed -= game.rotorFriction;
    }
    else
    {
        throw "Gameerror: Speed out of bounds"; //this throws if the speed is neither zero, positive, nor negative
    }

    if (Math.abs (game.deltaSpin) > (2 * Math.PI) / game.pointsPerSpin)
    {
        game.deltaSpin -= Math.sign (game.deltaSpin) * ((2 * Math.PI) / game.pointsPerSpin);
        game.points++;
    }

    draw (); //draw the screen for the frame
}

//handles clicking
function clickHandler (event)
{
    var x = event.offsetX; //get coordinates of click
    var y = event.offsetY;

    //todo: add funcionality
}

//gets the change in rotational position
function getDeltaSpin ()
{
    var deltaSpin = game.rotorSpin - game.lastSpin;

    if (Math.abs (deltaSpin) > 1.9 * Math.PI)
    {
        if (deltaSpin < 0)
        {
            deltaSpin += (2 * Math.PI);
        }
        else
        {
            deltaSpin -= (2 * Math.PI);
        }
    }

    return deltaSpin;
}

//handles mouse moving
function moveHandler (event)
{
    //do nothing if mouse is not clicked
    if (!mouseDown)
    {
        return;
    }

    var x = event.offsetX; //get coordinates of click
    var y = event.offsetY;

    //calculate angle of new click

    x -= width / 2; //adjust coordinates
    y -= height / 2;

    var angle = Math.atan2 (y, x); //get angle of click (from center)
    angle += Math.PI / 2; //normalize angle so that up is zero
    angle = (angle + (Math.PI * 2)) % (Math.PI * 2); //normalize angle to between zero and 2pi

    game.rotorSpin = rotorStartAngle + angle - startAngle; //new spin is the change in mouse angle minus the initial spin angle
}

//marks the start of the mouse click
function markStart (event)
{
    mouseDown = true; //toggle flag

    var x = event.offsetX; //get coordinates of click
    var y = event.offsetY;

    x -= width / 2; //adjust coordinates
    y -= height / 2;

    startAngle = Math.atan2 (y, x); //mark starting angle of mouse
    startAngle += Math.PI / 2; //normalize angle so that up is zero
    startAngle = (startAngle + (Math.PI * 2)) % (Math.PI * 2); //normalize angle to between zero and 2pi

    rotorStartAngle = game.rotorSpin; //set starting angle of rotor

    game.rotorSpeed = 0; //zero off the rotor speed
}

//marks the end of the mouse click
function markEnd (event)
{
    mouseDown = false; //toggle flag

    game.rotorSpeed = getDeltaSpin ();
}

//resizes the canvas when the window is resized.
function resizeHandler ()
{
    ctx.canvas.width = window.innerWidth; //updates canvas size
    ctx.canvas.height = window.innerHeight;

    width = c.width; //updates internal state variables
    height = c.height;

    draw (); //force draw a frame
}

init (); //initialize game

//set background image
var background = new Image ();
background.src = "../assets/desktopBackground.png";

//set rotor image
var rotor = new Image ();
rotor.src = "../assets/rotor.png";

var backgroundLoaded = false; //flag if the background image has loaded
var rotorLoaded = false; //flag if the rotor image is loaded
var mouseDown = false; //flag if the mouse is down

var tickTimer = setInterval (tick, 15); //ticks once every 15 ms (about 70 fps max), using ticktimer as a handle

var startAngle; //starting angle of the mouse
var rotorStartAngle; //starting angle of the rotor

var game = new Game (); //create the game object

window.addEventListener ("resize", resizeHandler); //resize canvas on window resize

background.addEventListener ("load", function () {backgroundLoaded = true;}); //toggles flags when loaded
rotor.addEventListener ("load", function () {rotorLoaded = true;});

canvas.addEventListener ("mousedown", markStart); //toggles flag when mouse is down, remembers where the mouse started
canvas.addEventListener ("mouseup", markEnd); //toggles flag whem mouse is up
canvas.addEventListener ("click", clickHandler); //clicks are handled by clickHandler
canvas.addEventListener ("mousemove", moveHandler); //mouse moving handled by moveHandler