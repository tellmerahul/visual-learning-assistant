const { analyzeImage } = require('./lib/geminiServer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, subjectMode = 'auto', learnerContext = '' } = req.body || {};
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ error: 'imageData is required' });
    }

    const analysis = await analyzeImage(imageData, subjectMode, learnerContext);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('analyze error', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
};