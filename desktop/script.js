//object definitions--------------------------------------------------------

//game object definition.
function Game ()
{
    this.points = 0; //points the player has
    this.pointsPerSpin = 1; //points per spin
}

//rotor object definition
function Rotor ()
{
    this.rpos = 0; //rotation
    this.rvel = 0; //rotational velocity
    this.friction = 0.001; //friction
    this.progress = 0; //progress towards full spin

    this.tick = function ()
    {
        progress += rvel; //add rvel to progress and position
        rpos += rvel;

        //rotor stops if speed is low enough, otherwise speed is reduced.
        if (Math.abs (rvel) < friction)
        {
            rvel = 0;
        }
        else if (rvel < 0)
        {
            rvel += friction;
        }
        else if (rvel > 0)
        {
            rvel -= friction;
        }
        else
        {
            throw "Gameerror: Speed out of bounds"; //this throws if the speed is neither zero, positive, nor negative
        }

        //if there is enough progress
        if (Math.abs (progress) > (2 * Math.PI) / game.pointsPerSpin)
        {
            progress -= Math.sign (progress) * ((2 * Math.PI) / game.pointsPerSpin);
            game.points++; //take off the extra progress, add one to points.
        }
    }

    this.draw = function ()
    {
        //if rotor os loaded, draw rotor with rotation
        if (flags.rotorLoaded)
        {
            ctx.save (); //save coordinate system
            ctx.translate (width / 2, height / 2); //set center of screen as origin
            ctx.rotate (game.rotorSpin); //spin the screen around the center
            ctx.drawImage (rotor, -rotor.width / 2, -rotor.height / 2); //draw the rotor at the center
            ctx.restore (); //reset coordinate system
        }
    }
}

//upgrades object definition
function Upgrades ()
{
    this.pointsPerSpinLevel = 0; //added to points per spin
    this.frictionLevel = 0; //taken away from friction in a decaying curve
    this.sync = function ()
    {
        game.pointsPerSpin = 1 + this.pointsPerSpinLevel;
        rotor.friction = 0.001 - (0.0001 / (frictionLevel + 1));
    }
}

//gamestate flags definition
function Flags ()
{
    this.rotorLoaded = false; //is the rotor loaded?
    this.backgroundLoaded = false; //is the background loaded?
    this.mouseAngle = -1; //is the mosue clicked? If so, at what angle?
    this.menuMask = 0; //which of the menus are opened?
}

//images used in the game
function Images ()
{
    this.background = new Image (); //background image
    background.src = "../assets/desktopBackground.png";
    background.addEventListener ("load", function () {flags.backgroundLoaded = true;}); //sets flag when background is loaded.

    this.rotor = new Image (); //rotor image
    rotor.src = "../assets/rotor.png";
    rotor.addEventListener ("load", function () {flags.rotorLoaded = true;}); //sets flag when rotor is laoded.
}

//utility functions------------------------------------------------------------

//resizes the canvas when the window is resized.
function resizeHandler ()
{
    ctx.canvas.width = window.innerWidth; //updates canvas size
    ctx.canvas.height = window.innerHeight;

    width = c.width; //updates internal state variables
    height = c.height;

    draw (); //force draw a frame
}

//game logic----------------------------------------------------------------

function draw ()
{
    fill ("#000") //black background

    //if background is loaded
    if (flags.backgroundLoaded)
    {
        //draw it
        ctx.drawImage (
            images.background,
            0, 0,
            images.background.width, images.background.width,
            0, 0,
            width, height
            );
    }
}

function tick ()
{}

function mouseStart (event)
{}

function mouseMove (event)
{}

function mouseEnd (event)
{}

function touchHandler (event)
{}

//initial setup--------------------------------------------------------------

init (); //initialize canvas

//game data objects
var game = new Game (); //game object
var rotor = new Rotor (); //rotor object
var upgrades = new Upgrades (); //upgrades object
var flags = new Flags (); //flags created and cleared
var images = new Images (); //setup images

//event listeners
window.addEventListener ("resize", resizeHandler); //resize canvas on window resize
canvas.addEventListener ("mousedown", mouseStart); //Handles mouse going down
canvas.addEventListener ("mousemove", mouseMove); //mouse moving handled by moveHandler
canvas.addEventListener ("mouseup", mouseEnd); //Handles mouse going up
canvas.addEventListener ("touch", touchHandler); //In case we are on mobile, and we didn't know it

var tickTimer = setInterval (tick, 10); //ticks the game logic every 10 ms.