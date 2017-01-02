function Rotation ()
{
    this.rpos = 0;
    this.rvel = 0;
    this.progress = 0;
}

function Upgrades ()
{
    this.bearing = 1;
    this.blade = 1;
    this.lubricant = -1;
    this.rotorColour = "#AAA";
    this.trail = -1;
}

function Flags ()
{
    
}

rotation = new Rotation ();
upgrades = new Upgrades ();