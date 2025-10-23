var logToFile = false;
var file;
if(logToFile == true) {file = require("Storage").open("gpspoilog.md","a");}

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
    largesize: 32,
    smallsize: 20,
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
      largesize: 32,
      smallsize: 20,
      waypointy: 20,
    },
  };
}

var carIsRHD = false;

function switchInstructionImage(lastAction) //stolen from messages
{
	var img;
	switch (lastAction) {
	case "continue": img = "EBgBAIABwAPgD/Af+D/8f/773/PPY8cDwAPAA8ADwAPAA8AAAAPAA8ADwAAAA8ADwAPA";break;
	case "left": img = "GhcBAYAAAPAAAHwAAD4AAB8AAA+AAAf//8P///x///+PAAPx4AA8fAAHD4ABwfAAcDwAHAIABwAAAcAAAHAAABwAAAcAAAHAAABwAAAc";break;
  case "right": img = "GhcBAABgAAA8AAAPgAAB8AAAPgAAB8D///j///9///+/AAPPAAHjgAD44AB8OAA+DgAPA4ABAOAAADgAAA4AAAOAAADgAAA4AAAOAAAA";break;
  case "left_slight": img = "ERgB//B/+D/8H4AP4Af4A74Bz4Dj4HD4OD4cD4AD4ADwADwADgAHgAPAAOAAcAA4ABwADgAH";break;
  case "right_slight": img = "ERgBB/+D/8H/4APwA/gD/APuA+cD44Phw+Dj4HPgAeAB4ADgAPAAeAA4ABwADgAHAAOAAcAA";break;
  case "left_sharp": img = "GBaBAAAA+AAB/AAH/gAPjgAeBwA8BwB4B+DwB+HgB+PAB+eAB+8AB+4AB/wAB/gAB//gB//gB//gBwAABwAABwAABwAABw=="; break;
  case "right_sharp": img = "GBaBAB8AAD+AAH/gAHHwAOB4AOA8AOAeAOAPB+AHh+ADx+AB5+AA9+AAd+AAP+AAH+AH/+AH/+AH/+AAAOAAAOAAAOAAAA==";break;
  case "keep_left": img = "ERmBAACAAOAB+AD+AP+B/+H3+PO+8c8w4wBwADgAHgAPAAfAAfAAfAAfAAeAAeAAcAA8AA4ABwADgA==";break;
  case "keep_right": img = "ERmBAACAAOAA/AD+AP+A//D/fPueeceY4YBwADgAPAAeAB8AHwAfAB8ADwAPAAcAB4ADgAHAAOAAAA==";break;
  case "uturn_left": img = "GRiBAAAH4AAP/AAP/wAPj8APAfAPAHgHgB4DgA8BwAOA4AHAcADsOMB/HPA7zvgd9/gOf/gHH/gDh/gBwfgA4DgAcBgAOAAAHAAADgAABw==";break;
  case "uturn_right": img = "GRiBAAPwAAf+AAf/gAfj4AfAeAPAHgPADwHgA4DgAcBwAOA4AHAcBjhuB5x/A+57gP99wD/84A/8cAP8OAD8HAA4DgAMBwAAA4AAAcAAAA==";break;
  case "finish": img = "HhsBAcAAAD/AAAH/wAAPB4AAeA4AAcAcAAYIcAA4cMAA48MAA4cMAAYAcAAcAcAAcA4AAOA4AAOBxjwHBzjwHjj/4Dnn/4B3P/4B+Pj4A8fj8Acfj8AI//8AA//+AA/j+AB/j+AB/j/A";break;
  case "roundabout_left": img = carIsRHD ? "HBaCAAADwAAAAAAAD/AAAVUAAD/wABVVUAD/wABVVVQD/wAAVABUD/wAAVAAFT/////wABX/////8AAF//////AABT/////wABUP/AAD/AAVA/8AA/8AVAD/wAD//VQAP/AAP/1QAA/wAA/9AAADwAAD/AAAAAAAA/wAAAAAAAP8AAAAAAAD/AAAAAAAA/wAAAAAAAP8AAAAAAAD/AA=" : "HRYCAAPAAAAAAAAD/AAD//AAA/8AD///AAP/AA////AD/wAD/wP/A/8AA/wAP8P/////AAP//////8AA///////AAD/P////8AAP8P/AABUAD/AP/AAFUA/8AP/AAFX//AAP/AAFf/wAAP8AAB/8AAAPAAAD8AAAAAAAAPwAAAAAAAA/AAAAAAAAD8AAAAAAAAPwAAAAAAAA/AAAAAAAAD8AAA==";break;
  case "roundabout_right": img = carIsRHD ? "HRaCAAAAAAAA8AAAP/8AAP8AAD///AA/8AA////AA/8AP/A/8AA/8A/wAP8AA/8P8AA/////8/wAD///////AAD//////8AAP////8P8ABUAAP/A/8AVQAD/wA//1UAA/8AA//VAAP/AAA/9AAA/wAAAPwAAA8AAAA/AAAAAAAAD8AAAAAAAAPwAAAAAAAA/AAAAAAAAD8AAAAAAAAPwAAAAAAA=" : "HBYCAAAAAAPAAABVQAAP8AAFVVQAD/wAFVVVAAP/ABUAFQAA/8BUAAVAAD/wVAAP/////FAAD/////9QAA//////VAAP/////FQAP8AAP/AVAP/AAP/AFX//AAP/AAV//AAP/AAAf/AAD/AAAD/AAAPAAAA/wAAAAAAAP8AAAAAAAD/AAAAAAAA/wAAAAAAAP8AAAAAAAD/AAAAAAA==";break;
  case "roundabout_straight": img = carIsRHD ? "EBuCAAADwAAAD/AAAD/8AAD//wAD///AD///8D/P8/z/D/D//A/wPzAP8AwA//UAA//1QA//9VA/8AFUP8AAVD8AAFQ/AABUPwAAVD8AAFQ/wABUP/ABVA//9VAD//VAAP/1AAAP8AAAD/AAAA/wAA==" : "EBsCAAPAAAAP8AAAP/wAAP//AAP//8AP///wP8/z/P8P8P/8D/A/MA/wDABf/wABX//ABV//8BVAD/wVAAP8FQAA/BUAAPwVAAD8FQAA/BUAA/wVQA/8BV//8AFf/8AAX/8AAA/wAAAP8AAAD/AA";break;
  case "roundabout_uturn": img = carIsRHD ? "ICCBAAAAAAAAAAAAAAAAAAAP4AAAH/AAAD/4AAB4fAAA8DwAAPAcAADgHgAA4B4AAPAcAADwPAAAeHwAADz4AAAc8AAABPAAAADwAAAY8YAAPPPAAD73gAAf/4AAD/8AABf8AAAb+AAAHfAAABzwAAAcYAAAAAAAAAAAAAAAAAAAAAAA" : "ICABAAAAAAAAAAAAAAAAAAfwAAAP+AAAH/wAAD4eAAA8DwAAOA8AAHgHAAB4BwAAOA8AADwPAAA+HgAAHzwAAA84AAAPIAAADwAAAY8YAAPPPAAB73wAAf/4AAD/8AAAP+gAAB/YAAAPuAAADzgAAAY4AAAAAAAAAAAAAAAAAAAAAAA=";break;
  }
  return img;
}

var halfW = W/2.0;
var halfH = H/2.0;

var pal_bw = new Uint16Array([0x0000,0xffff,0xf800,0x0000],0,4); // black, white, red, black
var pal_wb = new Uint16Array([0xffff,0x0000,0xf800,0x0000],0,4); // white, black, red, black
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
		return loc.distance(meters,places).replace(unit_text,"\n"+unit_text);
	}
	else
	{
		//less than 1 mi/km; gotta roll our own formatting for decimal mi/km instead of ft/m
		var string = meters/unit_threshold;
		string = string.toFixed(2);
		string = string + "\n" + unit_text;
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
	if(passedInstr.includes("onto")) //of the type: [in about], turn X onto...
	{
		splitInstruction = passedInstr.split("onto");
		name = splitInstruction[1].trim();
		return name;
	}
	else if(passedInstr.includes("on")) //of the type: turn X on ... [rare but seems to happen with 'bear left' types
	{
		splitInstruction = passedInstr.split("on");
		name = splitInstruction[1].trim();
		return name;
	}
	else if(passedInstr.includes("Continue for")) //of the type: Continue for about 2 miles to  Metzerott Road
	{
		splitInstruction = passedInstr.split("to");
		name = splitInstruction[1].trim();
		return name;
	}
	else if(passedInstr.includes("trip is about")) //of the type: The trip is about 2 miles time is  5 minutes. 
	{
		return "!IGNORE!";
	}		
	return "[Unk Road]";
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
  if(logToFile == true) {file.write(JSON.stringify(message)+"\n");}
  draw();
  //print(message);
});


var lastRoadName = "[Unk Road]";
var lastDistance = "???\nmi";
var lastDistanceRaw = 0.0;
var lastAction = "continue";

function UpdateNavVariables(messageArray)
{
	var tmp = GetShortStreetName(messageArray.instr);
	
	if(tmp != "!IGNORE!")
	{
		lastRoadName = tmp;
	}
	lastDistance = convertDistanceToMiles(messageArray.distance);
	lastAction = messageArray.action;
	
	lastDistanceRaw = convertStringMeterToNumerical(messageArray.distance);
}

function GetShortStreetName(passedInstr)
{
	var street = GetNextStreetFromInstruction(passedInstr);
	if(street == "!IGNORE!") 
	{return street;}
	
	return ShortenCommonTerms(street);
}


function main(){
	//E.showMessage("hello world","hello world");
	g.setColor(0,0,0);
	g.fillRect(0,0,W,H);
	draw();
}

function clearAndFill()
{
	g.clear();
	g.setColor(0,0,0);
	g.fillRect(0,0,W,H);
}

var topStringPos = 2;//L.text.largesize - 2;
var bottomStringPos = H - topStringPos - 2;
var arrowL = 32;

var arrowBuf = Graphics.createArrayBuffer(W,H,1,{msb:true});

function draw()
{
  clearAndFill();
 
  var actionImg = switchInstructionImage(lastAction);
  //arrowBuf.setColor(1);
  arrowBuf.drawImage(atob(actionImg),halfW-arrowL,halfH+16,{scale:4,rotate:0}); //all this is so I don't have to re-encode the images as white-on-black
  
  g.drawImage({width:W, height:H, bpp:1, buffer:arrowBuf.buffer,transparent:0,palette:pal_bw},0,0);
  arrowBuf.clear();
  
    g.setColor(-1);
  g.setFontAlign(0, -1);
  g.setFont("Vector",L.text.smallsize);
  g.drawString(
	g.wrapString(lastRoadName,W).join("\n")
	,halfW,topStringPos);
  
  if(lastDistanceRaw < unit_threshold/2){g.setColor(0xffc0);}
  else{g.setColor(-1);}
  g.setFontAlign(-1, 0);
  g.setFont("Vector",L.text.largesize);
  g.drawString(lastDistance,W-64,halfH);
  
  //g.setColor(-1);
  //g.setFontAlign(0, 0);
  //g.setFont("Vector",L.text.largesize);
  //g.drawString(lastAction,halfW,halfH);
  //g.drawImage({width:16, height: 24, bpp:1,buffer:E.toArrayBuffer(atob(img)),transparent:0,palette:pal_bw},halfW,halfH,{scale:4,rotate:0});	
  
  //flip();
}

g.clear();
main();