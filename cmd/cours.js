module.exports = function(params) {

    var cours_action = params.args[0];
    var cours_name = params.args[1];
    cours_name = "📝├" + cours_name;

    var classe_promo = params.args[2];
    if(params.args[2]) {
      classe_promo = classe_promo.slice(3,21);
    }

    var server = params.msg.guild;
    var membre = server.members.cache.get(params.msg.author.id);
    const config = require('../config.json');

    var check_role = config.role.filter((elem) => membre._roles.find((membre_role) => elem.id === membre_role));
    var check_delegue = membre._roles.filter(role => role === "363052387922870272");
    var check_prof = membre._roles.filter(role => role === "385693079002415106");

    params.fs.readFile('cours.json', 'utf8', (err, jsonString) => {

      if (err) {
          console.log("File read failed:", err)
          return
      }

        // On récupere le JSON
        var cours = JSON.parse(jsonString)

         // Array pour insérer le json et le traiter
         var data = [];
         data.push(cours);
 

      if(cours_action === 'create') {
  
        if((check_role[0] && check_delegue[0]) || check_prof[0]) {


        if((check_prof[0] || classe_promo === check_role[0].group) ) {
  
          server.channels.create(cours_name, {
            type: 'text',
            permissionOverwrites: [{
                    id: params.msg.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: classe_promo,
                    allow: ['VIEW_CHANNEL'],
                }
            ],
        }).then(async channel => {

          var categorie = config.role.filter((elem) => (elem.id === classe_promo || elem.group === classe_promo))

          channel.setParent(categorie[0].id_cours);

                          // On push le nouveau club dans l'array qui sera ensuite write en JSON dans le fichier
                        cours["cours_list"].push({
                            channel: channel.id
                        })

                        try {
                          params.fs.writeFileSync('cours.json', JSON.stringify(cours));
                      } catch (err) {
                          console.error(err)
                      }

        })
          params.msg.channel.send("Channel pour la promo créé !");
        }
  
  
        else if((classe_promo === check_role[0].id)) {
  
  
          server.channels.create(cours_name, {
            type: 'text',
            permissionOverwrites: [{
                    id: params.msg.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: check_role[0].id,
                    allow: ['VIEW_CHANNEL'],
                }
            ],
        }).then(async channel => {

          var categorie = config.role.filter((elem) => (elem.id === classe_promo || elem.group === classe_promo))

          channel.setParent(categorie[0].id_cours);

            // On push le nouveau club dans l'array qui sera ensuite write en JSON dans le fichier
            cours["cours_list"].push({
              channel: channel.id
          })

          try {
            params.fs.writeFileSync('cours.json', JSON.stringify(cours));
        } catch (err) {
            console.error(err)
        }

        })
          params.msg.channel.send("Channel pour la classe créé !");
        }
  
        else {
          params.msg.channel.send("Vous n'etes pas délégué de cette promo !");
        }
  
      }
    }
  
  
      else if(cours_action === 'delete') {
  
        console.log("coucou")

        if(check_delegue[0] || check_prof[0]) {
          
          var check_delete = cours.cours_list.filter(cours => cours.channel === params.msg.channel.id)
          console.log(check_delete)
          if(check_delete[0]) {
          
            params.msg.channel.delete();
            cours.cours_list.splice(cours.cours_list.findIndex(cours => cours.channel == params.msg.channel.id), 1);

                 // On write la modification
                 try {
                  params.fs.writeFileSync('cours.json', JSON.stringify(cours));
              } catch (err) {
                  console.error(err)
              }

          }

          else {   
            params.msg.channel.send("Vous ne pouvez pas delete ce channel");
          }

        }

        else {  
          params.msg.channel.send("Vous ne pouvez pas delete ce channel");
        }
  
  
  
  
  
      }
  



     


    })



   




  


}