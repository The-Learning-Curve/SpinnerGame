//initializes the canvas for 2d work
function init ()
{
    c = document.getElementById ("canvas");
    ctx = c.getContext ("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight; //Active this block if fullScreenCanvas.css is used.

    width = c.width;
    height = c.height;
}

//line from x1 y1 to x2 y2
function line (x1, y1, x2, y2) //draws a line from point 1 to point 2
{
    ctx.beginPath ();
    ctx.moveTo (x1, y1);
    ctx.lineTo (x2, y2);
    ctx.stroke ();
}

//filled circle at x, y with radius r
function fillCircle (x, y, r)
{
    ctx.beginPath ();
    ctx.arc (x, y, r, 0, 2 * Math.PI);
    ctx.fill ();
}

//stroke circle at x, y with radius r
function strokeCircle (x, y, r)
{
    ctx.beginPath ();
    ctx.arc (x, y, r, 0, 2 * Math.PI);
    ctx.stroke ();
}

//filled triangle with vertices 1, 2, and 3
function fillTriangle (x1, y1, x2, y2, x3, y3)
{
    ctx.beginPath ();
    ctx.moveTo (x1, y1);
    ctx.lineTo (x2, y2);
    ctx.lineTo (x3, y3);
    ctx.fill ();
}

//stroked triangle with vertices 1, 2, and 3
function strokeTriangle (x1, y1, x2, y2, x3, y3)
{
    ctx.beginPath ();
    ctx.moveTo (x1, y1);
    ctx.lineTo (x2, y2);
    ctx.lineTo (x3, y3);
    ctx.closePath ();
    ctx.stroke ();
}

//area of triangle with vertices 1, 2, and 3
function areaTriangle (x1, y1, x2, y2, x3, y3)
{
    return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
}

//distance (cartesian) from two points
function distance (x1, y1, x2, y2)
{
    return Math.sqrt (Math.pow (x1 - x2, 2) + Math.pow (y1 - y2, 2));
}

//checks to see if a point is in a triangle given coordinates of all points (exact match)
function inTriangle (x, y, x1, y1, x2, y2, x3, y3)
{
    //check to see if there is an exact match
    if (areaTriangle (x1, y1, x2, y2, x3, y3) == areaTriangle (x, y, x2, y2, x3, y3) + areaTriangle (x, y, x1, y1, x3, y3) + areaTriangle (x, y, x1, y1, x2, y2))
    {
        return true;
    }

    return false;
}

//checks to see if a point is in a triangle given coordinates of all points (allowed error margin as decimal)
function inTriangle (x, y, x1, y1, x2, y2, x3, y3, e)
{
    var testarea = areaTriangle (x, y, x2, y2, x3, y3) + areaTriangle (x, y, x1, y1, x3, y3) + areaTriangle (x, y, x1, y1, x2, y2);
    //check to see if there is an exact match
    if (areaTriangle (x1, y1, x2, y2, x3, y3) == testarea)
    {
        return true;
    }
    //check to see if there is an approximate match
    else if ((areaTriangle (x1, y1, x2, y2, x3, y3) * (1 + e) > testarea)
     && (areaTriangle (x1, y1, x2, y2, x3, y3) * (1 - e) < testarea))
    {
        return true;
    }

    return false;
}

//removes an element from an array by shrinking the array by one
function destroy (array, id)
{
    for (var i = id + 1; i < array.length; i++)
    {
        array [i - 1] = array [i];
    }

    array.length--;
}

//returns the text length of a number
function textLength (input)
{
    return input.toString ().length;
}

//fills the screen with colour
function fill (colour)
{
    ctx.fillStyle = colour;
    ctx.fillRect (0, 0, width, height);
}

function within (x, y, x1, y1, x2, y2)
{
    if (x > x1 && x < x2 && y > y1 && y < y2)
    {
        return true;
    }
    return false;
}
