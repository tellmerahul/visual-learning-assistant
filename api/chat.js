const { followUpChat } = require('./lib/geminiServer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, messages = [], question, subjectMode = 'auto', learnerContext = '' } = req.body || {};
    if (!imageData || !question) {
      return res.status(400).json({ error: 'imageData and question are required' });
    }

    const text = await followUpChat(imageData, messages, question, subjectMode, learnerContext);
    return res.status(200).json({ text });
  } catch (error) {
    console.error('chat error', error);
    return res.status(500).json({ error: error.message || 'Chat failed' });
  }
};