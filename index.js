const { Client, Collection } = require("discord.js");
const config = require("./config.json")
const Alexa_Welcomer = new Client();
const fs = require("fs");
Alexa_Welcomer.commands = new Collection();
const db = require("quick.db");
var jimp = require('jimp');

//Alexa Hax
fs.readdir("./commands/", (err, files) => {
  
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    console.log(`Bot by Alexa Hax!`);
    Alexa_Welcomer.commands.set(props.help.name, props);
  });
});

//Alexa Hax
Alexa_Welcomer.on("ready", () => {
  console.log(Alexa_Welcomer.user.username + " is online.")
  console.log(`Bot by Alexa Hax!`);
});

Alexa_Welcomer.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  let content = message.content.split(" ");
  let command = content[0];
  let args = content.slice(1);
  let prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;

  let commandfile = Alexa_Welcomer.commands.get(command.slice(prefix.length));
  if (commandfile) commandfile.run(Alexa_Welcomer, message, args);
})
Alexa_Welcomer.on('guildMemberAdd', async member => {

  let wChan = db.fetch(`${member.guild.id}`)

  if (wChan == null) return;

  if (!wChan) return;

  let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  let font64 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE)
  let bfont64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK)
  let mask = await jimp.read('https://i.imgur.com/552kzaW.png')
  let welcome = await jimp.read('http://rovettidesign.com/wp-content/uploads/2011/07/clouds2.jpg')

  jimp.read(member.user.displayAvatarURL).then(avatar => {
    avatar.resize(200, 200)
    mask.resize(200, 200)
    avatar.mask(mask)
    welcome.resize(1000, 300)

    welcome.print(font64, 265, 55, `Welcome ${member.user.username}`)
    welcome.print(bfont64, 265, 125, `To ${member.guild.name}`)
    welcome.print(font64, 265, 195, `There are now ${member.guild.memberCount} users`)
    welcome.composite(avatar, 40, 55).write('Welcome2.png')
    try {
      member.guild.channels.get(wChan).send(``, { files: ["Welcome2.png"] })
    } catch (e) {
      console.log(e);
    }
  })
})

//Alexa Hax
Alexa_Welcomer.login(config.token)