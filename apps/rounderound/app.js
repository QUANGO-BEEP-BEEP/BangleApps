
var file = require("Storage").open("gpspoilog.md","a");

var myMessageListener = Bangle.on("message", (type, message)=>{
  //if (message.handled) return; // another app already handled this message
  // <type> is one of "text", "call", "alarm", "map", or "music"
  // see `messages/lib.js` for possible <message> formats
  // message.t could be "add", "modify" or "remove"
  message.handled = true;
  if(message.src != "maps") return;
  E.showMessage(`${message.action}\n${message.distance}\n${GetShortStreetName(message.instr)}`, `${message.t} ${type} ${message.title}`);
  // You can prevent the default `message` app from loading by setting `message.handled = true`:
  file.write(JSON.stringify(message)+"\n");
  //print(message);
});

function GetNextStreetFromInstruction(passedInstr)
{
	var name, splitInstruction;
	if(passedInstr.includes("onto"))
	{
		splitInstruction = passedInstr.split("onto");
		name = splitInstruction[1].trim();
		return name;
	}
	return "??";
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

function GetShortStreetName(passedInstr)
{
	var street = GetNextStreetFromInstruction(passedInstr);
	return ShortenCommonTerms(street);
}

function main(){
	E.showMessage("hello world","hello world");
}

main();