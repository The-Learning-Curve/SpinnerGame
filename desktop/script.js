//game object
function Game ()
{
    this.rotorSpin = 0; //what the current rotational position of the rotor is
    this.lastSpin = 0; //what the last spin state was
    this.rotorSpeed = 0; //what the current rotational speed of the rotor is
    this.deltaSpin = 0; //counts change in spin
    this.startX = -1; //starting angle of click
    this.startY = -1;
}

function Upgrades ()
{
    this.points = 0; //number of points
    this.rotorFriction = 0.00025; //how much the rotor slows down by per tick

    this.bearingLevel = 1; //bearing upgrade level
    this.bladeLevel = 1; //blade upgrade level
    this.rotorLevel = 1; //rotor upgrade level
    this.lubricant = -1; //lubricant upgrade level
    this.bladeColour = 0; //rotor blade colour
    this.trail = false; //is there a trail to be displayed
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
    if (bearingLoaded [upgrades.bearingLevel - 1] && bladeLoaded [upgrades.bladeColour])
    {
        ctx.save (); //save coordinate system
        ctx.translate (width / 2, height / 2); //set center of screen as origin
        ctx.rotate (game.rotorSpin); //spin the screen around the center
        ctx.drawImage (bearing [upgrades.bearingLevel - 1], -bearing [upgrades.bearingLevel - 1].width / 2, -bearing [upgrades.bearingLevel - 1].height / 2); //draw the bearing at the center
        ctx.drawImage (blade [upgrades.bladeColour], -blade [upgrades.bladeColour].width / 2, -blade [upgrades.bladeColour].height / 2); //draw the blade at the center
        ctx.restore (); //reset coordinate system
    }

    //if the bar is loaded, draw the bar with appropriate clipping
    if (barLoaded)
    {
        ctx.drawImage (
            bar,
            0, 0,
            bar.width * (Math.abs (game.deltaSpin) / ((2 * Math.PI) / upgrades.bearingLevel)), bar.height,
            0.06416 * width, 0.0526 * height,
            0.90791 * width * (Math.abs (game.deltaSpin) / ((2 * Math.PI) / upgrades.bearingLevel)), bar.height
        );
    }

    ctx.textAlign = "right"; //text is right, aligned to top 60 px courier new
    ctx.textBaseline = "top";
    ctx.font = "60px Courier New";

    ctx.fillStyle = "#FFF"; //text is white

    ctx.fillText (upgrades.points + " POINTS", width - 10, 0.1063829787 * height); //write the points counter just below the top center of the screen
}

//ticks game logic
function tick ()
{
    game.rotorSpin = (game.rotorSpin + (Math.PI * 2)) % (Math.PI * 2); //normalize rotorSpin to between zero and 2pi

    game.deltaSpin += Math.abs (game.rotorSpeed); //add speed (whatever the current speed is) to deltaSpin

    game.lastSpin = game.rotorSpin; //note down current velocity
    game.rotorSpin += game.rotorSpeed; //tick velocity

    //rotor stops if speed is low enough, otherwise speed is reduced.
    if (Math.abs (game.rotorSpeed) < upgrades.rotorFriction)
    {
        game.rotorSpeed = 0;
    }
    else if (game.rotorSpeed < 0)
    {
        game.rotorSpeed += upgrades.rotorFriction;
    }
    else if (game.rotorSpeed > 0)
    {
        game.rotorSpeed -= upgrades.rotorFriction;
    }
    else
    {
        throw "Gameerror: Speed out of bounds"; //this throws if the speed is neither zero, positive, nor negative
    }

    //rotor is limited to maximum speed
    if (game.rotorSpeed > upgrades.bladeLevel * Math.PI / 70)
    {
        game.rotorSpeed = upgrades.bladeLevel * Math.PI / 70;
    }
    else if (game.rotorSpeed < -upgrades.bladeLevel * Math.PI / 70)
    {
        game.rotorSpeed = -upgrades.bladeLevel * Math.PI / 70;
    }

    if (Math.abs (game.deltaSpin) > (2 * Math.PI) / upgrades.bearingLevel)
    {
        game.deltaSpin -= Math.sign (game.deltaSpin) * ((2 * Math.PI) / upgrades.bearingLevel);
        upgrades.points++;
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

    x -= width / 2; //adjust coordinates
    y -= height / 2;

    //calculate change in angle
    if (Math.sign (y) == -1 && Math.sign (game.startY) == 1)
    {
        var angle = Math.atan2 (y, x) - Math.atan2 (game.startY, game.startX) + 2 * Math.PI; //special case patch for the straight left
    }
    else
    {
        var angle = Math.atan2 (y, x) - Math.atan2 (game.startY, game.startX); //normal case
    }

    console.log (angle);

    game.rotorSpeed = angle; //new spin speed is the change in mouse angle

    game.startY = y;
    game.startX = x;
}

//marks the start of the mouse click
function markStart (event)
{
    mouseDown = true; //toggle flag

    var x = event.offsetX; //get coordinates of click
    var y = event.offsetY;

    x -= width / 2; //adjust coordinates
    y -= height / 2;

    game.startX = x; //save coordinates
    game.startY = y;
}

//marks the end of the mouse click
function markEnd (event)
{
    mouseDown = false; //toggle flag

    game.startX = 0; //reset mouse start (so error is thrown if bug exists)
    game.startY = 0;
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

init (); //initialize canvas

//set background image
var background = new Image ();
background.src = "../assets/desktopBackground.png";

//set bearing images
var bearing = [];
bearing.push (new Image ());
bearing [0].src = "../assets/bearing1.png";

//set blade images
var blade = [];
blade.push (new Image ());
blade [0].src = "../assets/bladeGrey.png";

//set bar image
var bar = new Image();
bar.src = "../assets/progressBar.png";

var backgroundLoaded = false; //flag if the background image has loaded
var bearingLoaded = []; //flags for bearings
var bladeLoaded = []; //flags for blades
var barLoaded = false; //flag if the bar is loaded
var mouseDown = false; //flag if the mouse is down

for (var i = 0; i < bearing.length; i++) //set bearing and blade flags
{
    bearingLoaded.push (false);
}

for (var i = 0; i < blade.length; i++)
{
    bladeLoaded.push (false);
}

var tickTimer = setInterval (tick, 15); //ticks once every 15 ms (about 70 fps max), using ticktimer as a handle

var game = new Game (); //create the game object
var upgrades = new Upgrades ();

window.addEventListener ("resize", resizeHandler); //resize canvas on window resize

background.addEventListener ("load", function () {backgroundLoaded = true;}); //toggles flags when loaded
bar.addEventListener ("load", function () {barLoaded = true;});

//blade and bearing flag toggles
bearing [0].addEventListener ("load", function () {bearingLoaded [0] = true;});
blade [0].addEventListener ("load", function () {bladeLoaded [0] = true;});

canvas.addEventListener ("mousedown", markStart); //toggles flag when mouse is down, remembers where the mouse started
canvas.addEventListener ("mouseup", markEnd); //toggles flag whem mouse is up
canvas.addEventListener ("click", clickHandler); //clicks are handled by clickHandler
canvas.addEventListener ("mousemove", moveHandler); //mouse moving handled by moveHandler