// api/updateText.js
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content, changesCount } = await request.json(); // Correct Vercel syntax

    const repoOwner = 'Devanuna';
    const repoName = 'WelcomeVerseTextEditor';
    const filePath = 'Culture.json';
    const branch = 'main';
    const githubApi = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Get current file SHA
    const getRes = await fetch(githubApi, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const getData = await getRes.json();
    if (!getRes.ok) throw new Error(JSON.stringify(getData));
    const sha = getData.sha;

    // Update file
    const commitMessage = changesCount
      ? `Update ${changesCount} translations via WelcomeVerse Editor`
      : 'Update Culture.json via WelcomeVerse Editor';

    const updateRes = await fetch(githubApi, {
      method: 'PUT',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch,
      }),
    });

    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(JSON.stringify(updateData));

    return response.status(200).json({
      message: `Амжилттай шинэчиллээ! ${changesCount || ''} өөрчлөлт`,
      changesApplied: changesCount || 0,
      commitSha: updateData.commit.sha,
    });
  } catch (error) {
    console.error('Function error:', error);
    return response.status(500).json({ message: error.message });
  }
}

// Configure for Vercel runtime
export const config = {
  api: {
    bodyParser: false, // Manual JSON parsing
  },
};