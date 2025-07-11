import fetch from 'node-fetch'; // ✅ Needed for Node < 18
import Scrape from '../models/ScrapeModel.js';

export const createScrape = async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    const prompt = `
You are an expert data-extraction assistant.
== Input ==
${input}

== Instructions (return MARKDOWN) ==
1. If input is a URL, describe the page (title, author, date).
2. Extract key data / facts.
3. Explain what the data means in plain English.
4. Use headings, bullet lists, and code blocks when helpful.
`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1, // ✅ Use the first available key
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Gemini Error]', data);
      return res.status(500).json({
        error: data.error?.message || 'Failed to generate content from Gemini'
      });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No result returned.';
    if (!result || result === 'No result returned.') {
      return res.status(400).json({ error: 'Gemini did not return a valid result.' });
    }

    const [introBlock, ...analysisBlocks] = result.split('###');
    const intro = introBlock.trim();
    const analysis = analysisBlocks.join('###').trim();

    const scrape = await Scrape.create({
      userId: req.user.id,
      source: input,
      result, // ✅ required field
      intro,
      analysis,
    });


    res.status(201).json(scrape);
  } catch (err) {
    next(err);
  }
};

export const getOwnScrapes = async (req, res, next) => {
  try {
    const scrapes = await Scrape.find({ userId: req.user.id }).sort("-createdAt");
    res.json(scrapes);
  } catch (err) {
    next(err);
  }
};

export const getAllScrapes = async (_req, res, next) => {
  try {
    const scrapes = await Scrape.find({}).populate("userId", "username role email"); // ✅ Matches schema
    res.json(scrapes);
  } catch (err) {
    next(err);
  }
};
