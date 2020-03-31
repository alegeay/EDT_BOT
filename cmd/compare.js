class scanP {

    constructor(params) {

        this.studentList = [];
        this.day;
        this.params = params;
        this.dispo = [];

        params.args.forEach(arg => {
            if (arg.includes(".")) this.studentList.push({
                tag: arg,
                planning: []
            });
            else this.day = arg;
        });

    }

    loadPlannings() {
        
        let time = "8:00";
        let loadedPlanning = 0;
        let day = this.day;
        let nbStudent = this.studentList.length;
        let http = this.params.http;
        let JSDOM = this.params.JSDOM;

        this.studentList.forEach(student => {

            http.get(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=h&tel=${student.tag}&date=${day}%20${time}`, res => {

                let rawData = '';
                res.on("data", chunk => rawData += chunk);
                res.on("end", () => {

                    var document = new JSDOM(rawData);
                    var sortedData = [];

                    document.window.document.querySelectorAll(".Ligne").forEach(elem => {

                        student.planning.push({
                            debut: parseFloat(elem.querySelector(".Debut").innerHTML.replace(":30", ".5")),
                            fin: parseFloat(elem.querySelector(".Fin").innerHTML.replace(":30", ".5"))
                        });

                    });

                    loadedPlanning++;

                    if (loadedPlanning === nbStudent) {
                        this.scanDispo();
                    }

                });

            })

        })

    }

    scanDispo() {

        // console.log(this.studentList);

        var onDispo = false;
        var tempTime;

        for(var time = 8; time < 19; time += 0.5) {

            let nbStudentDispo = this.studentList.length;

            this.studentList.forEach(student => {

                student.planning.forEach(classTime => {

                    if (time >= classTime.debut && time < classTime.fin) {

                        nbStudentDispo--;

                    }

                })

            })

            // console.log(time)
            // console.log(nbStudentDispo);
            // console.log(onDispo);
            // console.log("=========");

            if (nbStudentDispo === this.studentList.length) {

                if (!onDispo) {

                    tempTime = time;
                    onDispo = !onDispo;

                }

            } else {

                if (onDispo) {
                
                    onDispo = !onDispo;
                    this.dispo.push({
                        debut: tempTime,
                        fin: time
                    })
                
                }

            }

        }

        if (onDispo) {
                
            onDispo = !onDispo;
            this.dispo.push({
                debut: tempTime,
                fin: time
            })
        
        }

        this.showDispos();

    }

    showDispos() {

        var embededMsg = new this.params.Discord.RichEmbed();
        var nbDispo = 0;

        this.dispo.forEach(dispo => {

            if (nbDispo != 0) embededMsg.addBlankField(nbDispo % 2 === 0 ? false : true);

            nbDispo++;

            embededMsg.addField("Dispo " + nbDispo, "debut : " + dispo.debut + " - " + "fin : " + dispo.fin, true);

        })

        embededMsg.title = "Disponibilitée(s)";
        embededMsg.color = 0xadbcdf;
        this.params.msg.channel.send(embededMsg);

    }

}

module.exports = function (params) {

    var scan = new scanP(params);

    scan.loadPlannings();

}