import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username') || 'vraj826';
    const endpoint = request.nextUrl.searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
    }

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Add GitHub token if available for higher rate limits
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const urls: { [key: string]: string } = {
      user: `https://api.github.com/users/${username}`,
      prs: `https://api.github.com/search/issues?q=author:${username}+type:pr`,
      issues: `https://api.github.com/search/issues?q=author:${username}+type:issue`,
      orgs: `https://api.github.com/users/${username}/orgs`,
      events: `https://api.github.com/users/${username}/events`,
    };

    const url = urls[endpoint];
    if (!url) {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
