/**
 * Project storage utility
 * Handles reading and writing project data to file-based storage
 * Can be replaced with a database implementation later
 */

import { promises as fs } from 'fs';
import { join } from 'path';

// Note: File system operations work in Next.js API routes
// but may need different handling in serverless environments

export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage?: string;
  language: string;
  stars: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  // Admin fields
  is_visible: boolean;
  order_index: number;
  github_id: number; // GitHub repository ID
  last_synced_at?: number; // timestamp
}

const DATA_DIR = join(process.cwd(), 'data');
const PROJECTS_FILE = join(DATA_DIR, 'projects.json');
const CACHE_METADATA_FILE = join(DATA_DIR, 'cache.json');

/**
 * Ensures data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Reads projects from storage
 */
export async function readProjects(): Promise<Project[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

/**
 * Writes projects to storage
 */
export async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

/**
 * Gets cache metadata
 */
export async function getCacheMetadata(): Promise<{
  lastSync: number;
  duration: number;
} | null> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CACHE_METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Saves cache metadata
 */
export async function saveCacheMetadata(
  lastSync: number,
  duration: number = 15
): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    CACHE_METADATA_FILE,
    JSON.stringify({ lastSync, duration }, null, 2),
    'utf-8'
  );
}
