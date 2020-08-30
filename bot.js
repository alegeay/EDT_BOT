const http = require("http");
const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require("./token.json");
const botSettings = require("./Params.json");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const fs = require('fs');


/**
 * commands
 */
const today = require("./cmd/today.js");
const next = require("./cmd/next.js");
const edt = require("./cmd/edt.js");
const compare = require("./cmd/compare.js");
const help = require("./cmd/help.js");
const agenda = require("./cmd/agenda.js");
const role = require("./cmd/role.js");
const classe = require("./cmd/classe.js");
const random = require("./cmd/random.js");
const club = require("./cmd/club.js");
const admin = require("./cmd/admin.js");
const cours = require("./cmd/cours.js");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// On recupère les events
client.on('raw', event => {
            // On récupère les evenements réactions
            if (event.t == "MESSAGE_REACTION_ADD") {

                // On lis le fichier config 
                fs.readFile('./config.json', 'utf8', (err, jsonString) => {

                // on push le json dans la variable config
                  var config = JSON.parse(jsonString);

                  // Si erreur de lecture on return une erreur
                        if (err) {
                            console.log("File read failed:", err)
                            return
                        }

                        // On verifie que la réaction ne viens pas du bot lui meme lors de l'initialisation
                        if (event.d.user_id !== config.botid) {

                            // On check si le l'id du message réagi et celui présent dans config
                            if (event.d.message_id === config.idmsg) {
                                // On verifie si l'emoji correspond bien à la liste d'emoji dédié à l'attribution des roles
                                var result = config.role.some(element => element.emoji === event.d.emoji.name)

                                // Si l'emoji correspond à la liste alors on récupère l'user et l'emoji selectionné
                                if (result) {

                                  var result2;
                                  var verif = false;
                                  const server = client.guilds.cache.get(config.id_server);
                                  var member = server.members.cache.get(event.d.user_id)
                                 
                                  // On verifie que l'user ne possède pas déjà un role de classe
                                    config.role.forEach(element => {
                                        result2 = member.roles.cache.some(role => role.id === element.id)
                                        // Si result devient 1 fois à true on change la variable de vérification à true (role déjà attribué)
                                        if(result2 == true) {verif = true}
                                    })

                                        // Le role est déjà attribué
                                            if (verif) {
                                                console.log('role existant')
                                            }

                                        // Si le role n'est pas attribué à l'utilisateur on en profite pour lui ajouter son role de classe + la promo
                                            if (!verif) {
                                                var roleattr = config.role.filter(role => role.emoji === event.d.emoji.name);
                                                member.roles.add(roleattr[0].id)
                                                if (roleattr[0].group) {
                                                    member.roles.add(roleattr[0].group)
                                                }
                                                console.log('Ajout du role')
                                            }
                                }
                            }
                        } 
                        else {
                            fs.readFile('./club.json', 'utf8', (err, jsonString) => {

                                if (err) {
                                    console.log("File read failed:", err)
                                    return
                                }

                                // On récupère le fichier club.json
                                var club_config = JSON.parse(jsonString);
                                var club_match = club_config.club.filter(element => element.message === event.d.message_id);

                                // On verifie si le message correspond aux message assigné au club
                                if (club_match) {
                                    const server = client.guilds.cache.get(config.id_server);
                                    var member = server.members.cache.get(event.d.user_id);
                                    // Si le membre existe on lui attribue le role
                                    if (member) {
                                        member.roles.add(club_match[0].role);
                                    }
                                }
                            })
                        }
                    
                      }
                )}

                else if (event.t == "MESSAGE_REACTION_REMOVE" && event.d.user_id !== config.botid) {
                    // On recupere le fichier club.json
                    fs.readFile('./club.json', 'utf8', (err, jsonString) => {

                        if (err) {
                            console.log("File read failed:", err)
                            return
                        }
                        // On recupere le JSON
                        var club_config = JSON.parse(jsonString);
                        // On recupere le message de reaction pour le grade et on check si il correspond dans le fichier
                        var club_match = club_config.club.filter(element => element.message === event.d.message_id);

                        // On verifie si il y'a bien le message et si le 
                        if (club_match[0] && club_match[0].user !== event.d.user_id) {
 
                            const server = client.guilds.cache.get(config.id_server);
                            var member = server.members.cache.get(event.d.user_id);
                            member.roles.remove(club_match[0].role);                             

                        }
                    })

                }


            });

        client.on('message', msg => {

            if (msg.content.startsWith(botSettings.prefix)) {

                const args = msg.content.slice(botSettings.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                var params = {
                    Discord: Discord,
                    msg: msg,
                    JSDOM: JSDOM,
                    args: args,
                    http: http,
                    command: command,
                    botSettings: botSettings,
                    client: client,
                    fs: fs,
                }

                if (botSettings.todayAliases.includes(command)) today(params);
                else
                if (botSettings.nextAliases.includes(command)) next(params);
                else
                if (botSettings.edtAliases.includes(command)) edt(params);
                else
                if (botSettings.compareAliases.includes(command)) compare(params);
                else
                if (botSettings.helpAliases.includes(command)) help(params);
                else
                if (botSettings.agendaAliases.includes(command)) agenda(params);
                else
                if (botSettings.classe.includes(command)) classe(params);
                else
                if (botSettings.random.includes(command)) random(params);
                else
                if (botSettings.club.includes(command)) club(params);
                else
                if(botSettings.admin.includes(command)) admin(params);
                else 
                if(botSettings.cours.includes(command)) cours(params);
            }

        });

        client.login(secret.token);