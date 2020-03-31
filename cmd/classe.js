module.exports = function (params) {

    var who = (params.args[0].includes(".") ? params.args[0] : params.args[1]);
    var tDate = ['09/02/2019', '09/16/2019', '09/23/2019', '09/30/2019', '10/07/2019']
    let i = 0;
  
    makeSynchronousRequest();
    function getPromise() {
       
            sDate = tDate[i]
            
        return new Promise((resolve, reject) => {
            params.http.get(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUDSEM&serverid=C&Tel=${who}&date=${sDate}%208:00`, (response) => {
                let chunks_of_data = [];

                response.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });

                response.on('end', () => {
                    let response_body = Buffer.concat(chunks_of_data);
                    resolve(response_body.toString());
                });

                response.on('error', (error) => {
                    reject(error);
                });
            });
        });
    
}
   
    async function makeSynchronousRequest(request) {
        for (i = 0; i < 5; i++) {
        try {
            let http_promise = getPromise();
            let response_body = await http_promise;

            var document = new params.JSDOM(response_body);

            var element = document.window.document.querySelector(".TCProf");
            if (element != null) {
                var classe = element.innerHTML;
                classe = classe.split('<br>');
                classe = classe[2];
                i = 4;
                params.msg.channel.send("Classe de " + who + " : ***" + classe + "*** ");
            } else if (i >= 4) {
                params.msg.channel.send("Impossible d'évaluer votre classe, merci de réessayer dans quelques jours.");
            }

         
            
        } catch (error) {
          
            console.log(error);
        }
    }
    }
}