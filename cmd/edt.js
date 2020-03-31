module.exports = function(params) {

    var who = (params.args[0].includes(".") ? params.args[0] : params.args[1]);
    var sDate = (!params.args[0].includes(".") ? params.args[0] : params.args[1]);

    let time = "8:00";

    params.http.get(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=h&tel=${who}&date=${sDate}%20${time}`, res => {

        let rawData = '';
        res.on("data", chunk => rawData += chunk);
        res.on("end", () => {

            var document = new params.JSDOM(rawData);
            var sortedData = [];
            var embededMsg = new params.Discord.RichEmbed();
            
            document.window.document.querySelectorAll(".Ligne").forEach(elem => {

                // if (sortedData.length % 2 == 0 && sortedData.length != 0) embededMsg.addBlankField(false);
                if (sortedData.length != 0) embededMsg.addBlankField(sortedData.length % 2 === 0 ? false : true);

                let mat = {
                    debut: elem.querySelector(".Debut").innerHTML,
                    salle: elem.querySelector(".Salle").innerHTML,
                    fin: elem.querySelector(".Fin").innerHTML,
                    matiere: elem.querySelector(".Matiere").innerHTML,
                    prof: elem.querySelector(".Prof").innerHTML
                }

                sortedData.push(mat);

                embededMsg.addField(mat.matiere, "debut : " + mat.debut + " - " + "fin : " + mat.fin + "\n" + "salle : " + mat.salle + "\n" + "prof : " + mat.prof, true);

            });

            console.log(sortedData);

            embededMsg.title = "Emploi du temps";
            embededMsg.color = 0xadbcdf;
            params.msg.channel.send(embededMsg);

        });

    })

}