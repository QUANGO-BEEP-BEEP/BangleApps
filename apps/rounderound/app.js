
//var file = require("Storage").open("gpspoilog.md","a");

//drawing
var W = g.getWidth();
var H = g.getHeight();
// layout (XXX: this should probably use the Layout library instead)
var L = { // banglejs1
  arrow: {
    x: 120,
    y: 80,
    r1: 79,
    r2: 69,
    bufh: 160,
    bufy: 40,
  },
  text: {
    bufh: 40,
    bufy: 200,
    largesize: 18,
    smallsize: 15,
    waypointy: 20,
  },
};
if (W == 176) {
  L = { // banglejs2
    arrow: {
      x: 88,
      y: 70,
      r1: 70,
      r2: 62,
      bufh: 160,
      bufy: 0,
    },
    text: {
      bufh: 40,
      bufy: 142,
      largesize: 18,
      smallsize: 14,
      waypointy: 20,
    },
  };
}

var pal_bw = new Uint16Array([0x0000,0xffff,0xf800,0x0000],0,4); // black, white, red, black
var buf = Graphics.createArrayBuffer(240,160, 2, {msb:true});

function flip() {
  g.drawImage({width:W,height:H,bpp:2,buffer:buf.buffer, palette:pal_bw},0,0);
  buf.clear();
}

var loc = require("locale");
var uses_miles = false;
var unit_threshold = 1000; //m to km
var unit_text = 'km';
if(loc.name == "en_GB" || loc.name == "en_US" || loc.name == "en_US 2") {uses_miles = true; unit_threshold = 1609; unit_text = 'mi';}

//try and handle turning distances into fractional miles. uses number
function formatDistance(meters)
{
	if(meters > unit_threshold) //keep it to three numerals
	{
		var places = 3; //less than 10: two decimal places
		if( (meters/unit_threshold) >= 10) { places = 2; } //less than 100: 1 decimal place
		if( (meters/unit_threshold) >= 100){places = 1; } //more than 100: 0 decimal places
		return loc.distance(meters,places);
	}
	else
	{
		//less than 1 mi/km; gotta roll our own formatting for decimal mi/km instead of ft/m
		var string = meters/unit_threshold;
		string = string.toFixed(2);
		string = string + unit_text;
		return string;
	}
}

//turn "XXXXm" into XXXX.
function convertStringMeterToNumerical(metersString)
{
	//strip the "m"
	var temp = metersString.replace("m","");
	return Number(temp);
}

//turn "XXXXm" into X.XX miles
function convertDistanceToMiles(distanceString)
{
	return formatDistance(convertStringMeterToNumerical(distanceString));
}

function GetNextStreetFromInstruction(passedInstr)
{
	var name, splitInstruction;
	if(passedInstr.includes("onto"))
	{
		splitInstruction = passedInstr.split("onto");
		name = splitInstruction[1].trim();
		return name;
	}
	return "??? road";
}

function ShortenCommonTerms(passedMessage)
{
	var fixed;
	fixed = passedMessage.replace(/street/ig,"St");
	fixed = fixed.replace(/road/ig,"Rd");
	fixed = fixed.replace(/drive/ig,"Dr");
	fixed = fixed.replace(/avenue/ig,"Ave");
	fixed = fixed.replace(/place/ig, "Pl");
	
	fixed = fixed.replace(/northeast/ig,"NE");
	fixed = fixed.replace(/northwest/ig,"NW");
	fixed = fixed.replace(/southwest/ig,"SW");
	fixed = fixed.replace(/southeast/ig,"SE");
	
	fixed = fixed.replace(/north/ig,"N.");
	fixed = fixed.replace(/south/ig,"S.");
	return fixed;
}

var myMessageListener = Bangle.on("message", (type, message)=>{
  //if (message.handled) return; // another app already handled this message
  // <type> is one of "text", "call", "alarm", "map", or "music"
  // see `messages/lib.js` for possible <message> formats
  // message.t could be "add", "modify" or "remove"
  message.handled = true;
  if(message.src != "maps") return;
  //E.showMessage(`${message.action}\n${message.distance}\n${GetShortStreetName(message.instr)}`, `${message.t} ${type} ${message.title}`);
  UpdateNavVariables(message);
  // You can prevent the default `message` app from loading by setting `message.handled = true`:
  file.write(JSON.stringify(message)+"\n");
  draw();
  //print(message);
});


var lastRoadName = "[waiting for road]";
var lastDistance = "??? mi";
var lastAction = "continue";

function UpdateNavVariables(messageArray)
{
	lastRoadName = GetShortStreetName(messageArray.instr);
	lastDistance = convertDistanceToMiles(messageArray.distance);
	lastAction = messageArray.action;
}

function GetShortStreetName(passedInstr)
{
	var street = GetNextStreetFromInstruction(passedInstr);
	return ShortenCommonTerms(street);
}


function main(){
	//E.showMessage("hello world","hello world");
	g.setColor(0,0,0);
	g.fillRect(0,0,W,H);
	draw();
}

function draw()
{
  buf.setColor(1);
  buf.setFontAlign(0, -1);
  buf.setFont("Vector",L.text.largesize);
  buf.drawString(lastRoadName,0,0);
  
  buf.setColor(1);
  buf.setFontAlign(0, 1);
  buf.setFont("Vector",L.text.largesize);
  buf.drawString(lastDistance,0,0);
  
  buf.setColor(1);
  buf.setFontAlign(0, 0);
  buf.setFont("Vector",L.text.largesize);
  buf.drawString(lastAction,0,0);
  
  flip();
}

g.clear();
main();