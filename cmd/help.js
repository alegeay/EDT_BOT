  module.exports = function (params) {
  
  var embededMsg = new params.Discord.RichEmbed();
			embededMsg.title = "Commande Help";
            embededMsg.color = 0xadbcdf;
			embededMsg.addField("Emploi du temps du jour","?today prenom.nom");
			embededMsg.addField("Emploi du temps en fonction de la date","?edt prenom.nom mm/jj/aaaa");
			embededMsg.addField("Emploi du temps du prochain jour de la semaine","?next mardi prenom.nom");
            embededMsg.addField("Date de disponibilité entre 2 ou plusieurs personnes","?compare prenom.nom1 prenom.nom2 [..] mm/jj/aaaa ");
            embededMsg.addField("Classe d'une personne","?classe prenom.nom");
            embededMsg.addField("Choix random d'une personne de la classe","?random b1c1..b3c3..i1c1");
            params.msg.channel.send(embededMsg);
			
  }