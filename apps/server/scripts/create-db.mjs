import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const targetUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(targetUrl.pathname.slice(1));

if (!databaseName) {
    console.error("DATABASE_URL must include a database name");
    process.exit(1);
}

const maintenanceUrl = new URL(targetUrl);
maintenanceUrl.pathname = "/postgres";

const quoteIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;

const client = new Client({
    connectionString: maintenanceUrl.toString(),
});

try {
    await client.connect();
    await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    console.log(`Database "${databaseName}" created`);
} catch (error) {
    if (error?.code === "42P04") {
        console.log(`Database "${databaseName}" already exists`);
        process.exit(0);
    }

    console.error(error);
    process.exit(1);
} finally {
    await client.end().catch(() => undefined);
}
