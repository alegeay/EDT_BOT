  module.exports = function (params) {
  
  const embededMsg = new params.Discord.MessageEmbed()
    .setTitle("Aide sur l'utilisation du bot")
    .setColor("0xadbcdf")
    .addField("Emploi du temps du jour","?today prenom.nom")
    .addField("Emploi du temps en fonction de la date","?edt prenom.nom mm/jj/aaaa")
    .addField("Emploi du temps du prochain jour de la semaine","?next mardi prenom.nom")
    .addField("Date de disponibilité entre 2 ou plusieurs personnes","?compare prenom.nom1 prenom.nom2 [..] mm/jj/aaaa ")
    .addField("Classe d'une personne","?classe prenom.nom")
    .addField("Choix random d'une personne de la classe","?random b1c1..b3c3..i1c1")
    .addField("Création d'un club (maximum 3 par personnes)","?club create nomduclub")
    .addField("Delete du club (commande dans le channel associé)","?club delete")
    .addField("Création d'un channel pour une classe/promo (Necessite d'etre prof ou délégué(e)","?cours create nomcours @classe/promo")
    .addField("Delete du club (commande dans le channel associé)","?club delete");
params.msg.channel.send(embededMsg)

  }