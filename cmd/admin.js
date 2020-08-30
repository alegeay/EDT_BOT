module.exports = function(params) {

    const config = require('../config.json');
    var server = params.msg.guild;


    var admin_action = params.args[0];

    if(admin_action == 'reset') {

       server.members.cache.forEach(membre => {

            const classe = config.role.filter((elem) => membre._roles.find((membre_role) => elem.id === membre_role));
            
           if(classe[0] !== undefined) {
          
             membre.roles.remove(classe[0].id).catch(console.log("error"));
             membre.roles.remove(classe[0].group).catch(console.log("error"));

           }
               

        });

    }
    
}