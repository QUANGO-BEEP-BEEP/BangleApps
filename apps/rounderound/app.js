/*var messageListener = Bangle.on("message", (type, message)=>{
  //if (message.handled) return; // another app already handled this message
  // <type> is one of "text", "call", "alarm", "map", or "music"
  // see `messages/lib.js` for possible <message> formats
  // message.t could be "add", "modify" or "remove"
  E.showMessage(`${message.title}\n${message.body}`, `${message.t} ${type} message`);
  // You can prevent the default `message` app from loading by setting `message.handled = true`:
  message.handled = true;
});*/

function main()
{
	E.showMessage("My\nSimple\nApp","penis LOL");
}

main();