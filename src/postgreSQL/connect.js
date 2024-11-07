import pg from "pg";

export async function connectPostgresql(credentials) {
    const client = new pg.Client({
        host     : credentials.host,
        database : credentials.database,
        user     : credentials.user,
        password : credentials.password,
        port     : credentials.port,
    });

    await client.connect();
    return client;
}

