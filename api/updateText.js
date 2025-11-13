export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content, changesCount } = await req.json();  // Parse body
    const repoOwner = 'Devanuna';
    const repoName = 'WelcomeVerseTextEditor';
    const filePath = 'Culture.json';
    const branch = 'main';
    const githubApi = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Step 1: Get the file's current SHA
    const getRes = await fetch(githubApi, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const getData = await getRes.json();
    if (!getRes.ok) throw new Error(JSON.stringify(getData));
    const sha = getData.sha;

    // Step 2: Update file on GitHub
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

    res.status(200).json({
      message: `Амжилттай шинэчиллээ! ${changesCount || ''} өөрчлөлт`,
      changesApplied: changesCount || 0,
      commitSha: updateData.commit.sha
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};