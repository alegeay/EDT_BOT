module.exports = function (params) {
    
      console.log("role");
  
      params.msg.channel.send("🤖***ROLE 🤖\n\n ***B1 Classe 1 : <:b1c1:605417879969464330>\n\nB1 Classe 2 : <:b1c2:605417890975449128>\n\nB2 Classe 1 : <:b2c1:605417916313108481>\n\nB2 Classe 2 : <:b2c2:605417929286221834>\n\nB3 Classe 1 : <:b3c1:605417942947069988>\n\nB3 Classe 2 : <:b3c2:605417959908704277>\n\nB3 Classe Réseau : <:b3c3:624701063173242880>\n\nI1 Classe 1 : <:i1c1:624701087471108156>\n\nI1 Classe 2 : <:i1c2:625313541687345173>\n\nI1 Classe Réseau : <:i1c3:624701127153287208>\n\nI2 Classe 1 : <:i2c1:624701142156443677>\n\nI2 Classe 2 : <:i2c2:750066961651859526>\n\nAncien EPSI : 👴 \n\n *** Merci d'indiquer votre classe/promo à l'aide des emojis, une fois un grade sélectionné, il ne vous sera pas possible de revenir en arrière ! ***")
      .then(async function (message) {

       params.fs.readFile('config.json', 'utf8', (err, jsonString) => {
          if (err) {
              console.log("File read failed:", err)
              return
          }
         var config = JSON.parse(jsonString)
         config.idmsg = message.id
         try {
          params.fs.writeFileSync('config.json',JSON.stringify(config));
        } catch (err) {
          console.error(err)
        }
      })
      
     await    message.react(":b1c1:605417879969464330")
     await    message.react(":b1c2:605417890975449128")
     await    message.react(":b2c1:605417916313108481")
     await    message.react(":b2c2:605417929286221834")
     await    message.react(":b3c1:605417942947069988")
     await    message.react(":b3c2:605417959908704277")
     await    message.react(":b3c3:624701063173242880")
     await    message.react(":i1c1:624701087471108156")
     await    message.react(":i1c2:625313541687345173")
     await    message.react(":i1c3:624701127153287208")
     await    message.react(":i2c1:624701142156443677")
     await    message.react(":i2c2:750066961651859526")
     await    message.react("👴")
      }).catch((error) => console.error(error));
    }