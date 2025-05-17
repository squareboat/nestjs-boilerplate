module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            port: 3307,
            host: 'localhost',
            user: 'root',
            password: 'Admin@123',
            database: 'nestjs_boilerplate',
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
}; 