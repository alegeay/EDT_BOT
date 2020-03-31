const http = require("http");
const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require("./token.json");
const botSettings = require("./Params.json");
const config = require("./config.json");
const jsdom = require("jsdom");
const mariadb = require('mariadb')
const { JSDOM } = jsdom;
const fs = require('fs');


/**
 * commands
 */
const today   = require("./cmd/today.js");
const next    = require("./cmd/next.js");
const edt     = require("./cmd/edt.js");
const compare = require("./cmd/compare.js");
const help 	  = require("./cmd/help.js");
const agenda  = require("./cmd/agenda.js");
const role    = require("./cmd/role.js");
const classe    = require("./cmd/classe.js");
const random = require("./cmd/random.js");
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('raw', event => {
  
  if (event.t == "MESSAGE_REACTION_ADD") {
    if (event.d.message_id === config.idmsg) {
      if (event.d.user_id !== config.botid) {
         
        var result =  config.role.some( element => element.emoji === event.d.emoji.name)
       
            if (result) {
            
             client.fetchUser(event.d.user_id)
             .then((User) => {
              var verif = false
              const server = client.guilds.get(config.id_server);
              var member = server.member(User)
             
              config.role.forEach(element => {
                var result2 = member.roles.some(role => role.id === element.id)

                if (result2 === true) { verif = true}

              });
                
                console.log(verif)

                if(verif) {
                  console.log('role existant')
                }
              
                if(!verif) {
                  var roleattr = config.role.filter( role => role.emoji === event.d.emoji.name); 
                  member.addRole(roleattr[0].id)
                  if(roleattr[0].group) {
                    member.addRole(roleattr[0].group)
                  } 
                  console.log('CORRESP')
                }           
              //member.addRole('603918994495373313').catch(console.error);
               console.log(" USER ID :" + event.d.user_id );
             })

            }
      }
    }
  }
});

client.on('message', msg => {

  if (msg.content.startsWith(botSettings.prefix)) {

    const args = msg.content.slice(botSettings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    var params = {
      Discord : Discord,
      msg     : msg,
      JSDOM   : JSDOM,
      args    : args,
      http    : http,
      command : command,
      botSettings : botSettings,
      client : client,
      fs : fs,
      mariadb : mariadb
    }

    if (botSettings.todayAliases.includes(command))   today(params);    else 
    if (botSettings.nextAliases.includes(command))    next(params);     else
    if (botSettings.edtAliases.includes(command))     edt(params);      else
    if (botSettings.compareAliases.includes(command)) compare(params);	else
    if (botSettings.helpAliases.includes(command)) 	  help(params);     else
    if (botSettings.agendaAliases.includes(command))  agenda(params);   else
    if (botSettings.roleAliases.includes(command) && msg.author.id === "323180418742616064")  role(params);       else
    if (botSettings.classe.includes(command))  classe(params); else
    if (botSettings.random.includes(command))  random(params)
  }

});





client.login(secret.token);

