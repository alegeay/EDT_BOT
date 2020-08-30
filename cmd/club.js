module.exports = function(params) {

    const config = require('../config.json');

    // Lecture du fichier Club.json qui contient les données relative aux clubs
    params.fs.readFile('club.json', 'utf8', (err, jsonString) => {

        if (err) {
            console.log("File read failed:", err)
            return
        }

        // Argument Create ou Delete
        var club_action = params.args[0];

        // Name lors de la création
        var club_name = params.args[1];

        // On récupere le JSON
        var club_group = JSON.parse(jsonString)

        // On recuper l'objet Server
        var server = params.msg.guild;

        // Array pour insérer le json et le traiter
        var data = [];
        data.push(club_group);

        // Si la fonction club est create

        if (club_action == 'create') {

            check_number =  club_group.club.filter(club => club.user === params.msg.author.id);

            if(check_number.length < 3) {

            // On créer le channel avec les permission de bases (Interdit pour everyone + Droit propriétaire individuel)
            server.channels.create(club_name, {
                type: 'text',
                permissionOverwrites: [{
                        id: params.msg.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: params.msg.author.id,
                        allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
                    }
                ],
            }).then(async channel => {

                // Ajout dans la categorie Club
                channel.setParent(config.clubid);

                // On créer le role qui portera le nom du club
                const {
                    id: club_role
                } = await server.roles.create({
                    data: {
                        name: club_name,
                        color: 0x00E676
                    }
                })

                // On ajoutera le role dans les permissions d'accès aux channels 
                channel.updateOverwrite(club_role, {
                    VIEW_CHANNEL: true
                });

                // message de chat
                const embededMsg = new params.Discord.MessageEmbed().setTitle('Nouveau Club !').setColor("0x0099ff").setDescription("Vous pouvez joindre le nouveau club **" + club_name + "**!")
                var chan_role = params.client.channels.cache.get(config.id_chan_grade);
                let msg_grade = await chan_role.send(embededMsg).then(msg => msg.react("✅"));

                // On push le nouveau club dans l'array qui sera ensuite write en JSON dans le fichier
                club_group["club"].push({
                    channel: channel.id,
                    user: params.msg.author.id,
                    role: club_role,
                    message: msg_grade.message.id
                })

                // On ajoute automatiquement le propriétaire du channel dans les roles 
                var member = server.members.cache.get(params.msg.author.id);
                member.roles.add(club_role);

                try {
                    params.fs.writeFileSync('club.json', JSON.stringify(club_group));
                } catch (err) {
                    console.error(err)
                }

            });
        }

        else {
            params.msg.channel.send("Vous avez plus que 3 clubs ! Veuillez en supprimer avec la commande ?club delete dans votre club");
        }
    }

        if (club_action == 'delete') {

            // On check si l'id du salon correspond au salon ou l'user est proprietaire
            var check_perm = club_group.club.filter(club => club.channel === params.msg.channel.id);

            // Check si le channel ou le message de delete envoyé correspond à un club
            if (check_perm[0] == undefined) {

                params.msg.channel.send("Ce channel n'est pas un club");
            } else {
                if (params.msg.author.id == check_perm[0].user) {
                    // Delete channel
                    params.msg.channel.delete();

                    // Delete du role
                    server.roles.fetch(check_perm[0].role).then(role => role.delete())

                    // Delete du message dans #grade
                    params.client.channels.fetch(config.id_chan_grade).then(channel => channel.messages.fetch(check_perm[0].message).then(message => message.delete()))

                    // Delete du club dans le JSON
                    club_group.club.splice(club_group.club.findIndex(club => club.channel == params.msg.channel.id), 1);

                    // On write la modification
                    try {
                        params.fs.writeFileSync('club.json', JSON.stringify(club_group));
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    params.msg.channel.send("Vous n'etes pas proprietaire du channel");
                }
            }
        }
    });
}