
import { db } from "../lib/db/drizzle";
import { settings } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
    console.log("🛠️  Admin Setup Utility\n");

    try {
        const password = await askQuestion("Enter new Admin Password: ");
        if (!password) {
            console.error("Password cannot be empty.");
            process.exit(1);
        }

        const githubUser = await askQuestion("Enter GitHub Username: ");
        if (!githubUser) {
            console.error("GitHub Username cannot be empty.");
            process.exit(1);
        }

        console.log("\nSaving settings to database...");

        // Update or Insert Password
        await db
            .insert(settings)
            .values({ key: "admin_password", value: password })
            .onConflictDoUpdate({
                target: settings.key,
                set: { value: password, updatedAt: new Date() },
            });

        // Update or Insert GitHub Username
        await db
            .insert(settings)
            .values({ key: "github_username", value: githubUser })
            .onConflictDoUpdate({
                target: settings.key,
                set: { value: githubUser, updatedAt: new Date() },
            });

        console.log("✅ Admin configuration saved successfully!");
    } catch (error) {
        console.error("❌ Error saving settings:", error);
    } finally {
        rl.close();
        process.exit(0);
    }
}

main();
