const mysql = require('mysql2/promise');  // note o /promise aqui

const connection = mysql.createPool({      // use createPool para melhor performance
    host: 'auth-db891.hstgr.io',
    user: 'u684558480_pantanalDev',
    password: 'pantanalDev2025',
    database: 'u684558480_pantanalDev'
});

module.exports = connection;
