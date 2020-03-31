module.exports = function (params) {
   
    params.mariadb.createConnection({ // Open a new connection                                                                                                                                           
        user: 'root',
        host: '127.0.0.1',
        port: 3306,
        password : '210370Al*'
    })
        .then(conn => {
            conn.query('SELECT ') // Execute a query                                                                                                                                
                .then(result => { // Print the results                                                                                                                                            
                    for (row of result) {
                        console.log(row)
                    }
                })
                .then(conn.destroy()) // Close the connection                                                                                                                                     
        })

  }