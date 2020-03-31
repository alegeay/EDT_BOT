module.exports = function(params) {
    const fs = require('fs');
    const readline = require('readline');
    const {
        google
    } = require('googleapis');

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token2.json';

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), shit);

    });

    const classes = {
        B2C1 : "0hupcedcngt0j5jr0dlg9dbe9c@group.calendar.google.com",
        B2C2 : "7uld3lhejmcpiu1vh119uv9qik@group.calendar.google.com",
        B3C1 : "iuanse6embhestjbehgmjgpae8@group.calendar.google.com",
        B3C2 : "dg55bdo5usuf3d4ecdpiu6287s@group.calendar.google.com"
    };

    const eleves = {
        B2C1 : "romain.boudot",
        B2C2 : "alexis.legeay",
        B3C1 : "benjamin.benito",
        B3C2 : "pierre.negre"
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
            RemoveEventList(oAuth2Client, classes[params.args[0]]);
            GetEventBeecome(oAuth2Client, classes[params.args[0]],eleves[params.args[0]]);

        });
    }

    function shit(auth){
        console.log("Shit");
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    function GetEventBeecome(auth, idagenda, eleve) {
      // RemoveEventList(auth);
        const date = new Date();
        // let sDate = [date.getMonth() + 1, date.getDate(), date.getFullYear()].map(x => (x < 10 ? "0" : "") + x).join("/");
        let time = "8:00";
        var tab_jour = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
        var num_jour = new Array(6, 0, 1, 2, 3, 4, 5);
        let jour = tab_jour[date.getDay()];

        let lundi_sem = new Date();

        if (jour != undefined) {
            date.setDate(date.getDate() - num_jour[date.getDay()]);
            // date.setDate(date.getDate() - 20);
            lundi_sem = date;  
        } else {
            // date.setDate(date.getDate() - 20);
            lundi_sem = date;
            // console.log("Nous sommes déjà Lundi");
        }

        for (let x = 0; x <= 30; x++) {
            let jour_en_cour = new Date(lundi_sem);

            jour_en_cour.setDate(jour_en_cour.getDate() + x);
            let sDate = [jour_en_cour.getMonth() + 1, jour_en_cour.getDate(), jour_en_cour.getFullYear()].map(x => (x < 10 ? "0" : "") + x).join("/");

            params.http.get(`http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=h&tel=${eleve}&date=${sDate}%20${time}`, res => {

                let rawData = '';
                res.on("data", chunk => rawData += chunk);
                res.on("end", () => {

                    var document = new params.JSDOM(rawData);
                    var sortedData = [];
                    var embededMsg = new params.Discord.RichEmbed();
                    let mat = {};

                    document.window.document.querySelectorAll(".Ligne").forEach(elem => {

                        if (sortedData.length != 0) embededMsg.addBlankField(sortedData.length % 2 === 0 ? false : true);

                        let DateCalendar = [jour_en_cour.getFullYear(), jour_en_cour.getMonth() + 1, jour_en_cour.getDate()].map(x => (x < 10 ? "0" : "") + x).join("-");
                        DateCalendar = DateCalendar.split("T")[0];
                        DateCalendar = DateCalendar.replace('/', ('-'));
                        mat = {
                            date: DateCalendar,
                            debut: elem.querySelector(".Debut").innerHTML,
                            salle: elem.querySelector(".Salle").innerHTML,
                            fin: elem.querySelector(".Fin").innerHTML,
                            matiere: elem.querySelector(".Matiere").innerHTML,
                            prof: elem.querySelector(".Prof").innerHTML
                        }

                        sortedData.push(mat);
                        CreateEvent(auth, mat, idagenda);

                    });
                });
            });
        }
        console.log("Fin de l'ajout des cours au calendrier"); 
    };


    function CreateEvent(auth, mat, idagenda) {

        var event = {
            'summary': mat.matiere,
            'location': mat.salle,
            'description': mat.prof,
            'start': {
                'dateTime': `${mat.date}T${mat.debut}:00+02:00`,
                'timeZone': 'Europe/Paris',
            },
            'end': {
                'dateTime': `${mat.date}T${mat.fin}:00+02:00`,
                'timeZone': 'Europe/Paris',
            },
        };

        // console.log(event.start.dateTime);

        const calendar = google.calendar({
            version: 'v3',
            auth
        });
        calendar.events.insert({
            auth: auth,
            calendarId: idagenda,
            resource: event,
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created');
        })
    };


    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listEvents(auth) {
        const calendar = google.calendar({
            version: 'v3',
            auth
        });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            const events = res.data.items;
            var embededMsg = new params.Discord.RichEmbed();
            embededMsg.title = "Evenement à venir";
            embededMsg.color = 0xadbcdf;

            if (events.length) {

                console.log('Upcoming 10 events:');
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;

                    embededMsg.addField(`${start} - ${event.summary}`);
                    // console.log(`${start} - ${event.summary}`);

                });

            } else {
                console.log('No upcoming events found.');
            }
            params.msg.channel.send(embededMsg);
        });

    };

    function RemoveEventList(auth, idagenda) {

        const id = idagenda;
        let searchRange = {};


        const calendar = google.calendar({
            version: 'v3',
            auth
        });

        searchRange = {
            startDate: '2019-05-20T17:00:00+02:00',
            endDate: '2019-06-15T17:00:00+02:00'
        }

        calendar.events.list({
            calendarId: idagenda,
            timeMin: searchRange.startDate,
            timeMax: searchRange.endDate,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            const events = res.data.items;

            if (events.length) {
                
                events.map((event, i) => {
                    console.log(id);
                    console.log(event.id);
                    calendar.events.delete({
                            auth: auth,
                            calendarId: id,
                            eventId: event.id,
                        })
                        .then(results => {
                            console.log('delete Event:' + JSON.stringify(results));
                        }).catch(err => {
                            console.log('Error deleteEvent:' + JSON.stringify(err.message));
                        });




                });

            }
        })
    }

}