module.exports = function (params) {
const config = require("../config.json");

var classe = params.args[0]




var verif =  config.role.some( element => element.emoji === classe)

if (verif) {

var result = config.role.filter( role => role.emoji === classe); 

var classe_list = params.msg.guild.roles.get(result[0].id).members.map(m=>m.user.id);


var rand = Math.random();

var total_eleve = classe_list.length;

var randindex = Math.floor(rand * total_eleve);

var random_eleve = classe_list[randindex];
random_eleve = '<@' + random_eleve + '>';

console.log(classe_list);

var phrase = ['Tiens Tiens Tiens ! Il semblerait que' + random_eleve + 'soit choisi !',
            'Coup dur pour... ' + random_eleve,
            'Pas de chance, ma carte piège a choisis ...' + random_eleve,
            random_eleve + ', si tu vas pas au tableau, tu payes un coup à ta classe. A toi de voir...',
            'Victoria t\'a choisi ! ' + random_eleve + '\n' + 'https://media.giphy.com/media/l378mDtKVeGqxHibm/giphy.gif',
            'Boule noir pour ' + random_eleve + ' !\n'  + 'https://thumbs.gfycat.com/LinedOrganicDowitcher-size_restricted.gif',
            'Oh... '+ random_eleve + '\n https://media2.giphy.com/media/8vIFoKU8s4m4CBqCao/giphy.gif' 
]

var rand2 = Math.random();

var total_phrase = phrase.length;

var randindex = Math.floor(rand2 * total_phrase);



params.msg.channel.send(phrase[randindex]);
}
else {

    params.msg.channel.send('Erreur : Classe incorrect');

}


}