import { db } from "@/lib/db/drizzle";
import { personalInfo } from "@/lib/db/schema";
import { HomeClient } from "@/components/home/HomeClient";

/**
 * Home Page - Server Component
 * Fetches personal info from database on the server
 * Dynamic to ensure fresh data on each request
 */
export const dynamic = "force-dynamic";
export const revalidate = 0; // No cache, always fetch fresh data

export default async function Home() {
  let name: string | undefined;

  try {
    const info = await db.select().from(personalInfo).limit(1);
    if (info.length > 0 && info[0].name) {
      name = info[0].name;
    }
  } catch (error) {
    console.error("Error fetching personal info:", error);
    // Continue with undefined name, fallback will be used in client
  }

  return <HomeClient name={name} />;
}
