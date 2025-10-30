import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // GitHub username - environment variable'dan veya default olarak 'aydemir-ali' alıyoruz
    const githubUsername = process.env.GITHUB_USERNAME || 'aydemir-ali';
    
    // GitHub API'den repository'leri çekiyoruz
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Sadece public repo'ları ve fork olmayanları filtrele
    const filteredRepos = repos
      .filter((repo: any) => repo.private === false && !repo.fork)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        created_at: repo.created_at,
      }));

    return NextResponse.json({ repos: filteredRepos });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

