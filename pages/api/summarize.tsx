import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({error: 'text is required'})
    }

    const HF_API_TOKEN = process.env.HF_API_TOKEN

    if (!HF_API_TOKEN) {
        return res.status(500).json({error: 'invalid credentials'})
    }

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                inputs:text, 
                parameters: {
                    min_length: 10,
                    early_stopping: true
                }
            }),

        })
        if (!response.ok) {
            const error = await response.json();
            return res.status(500).json({error: error.error || 'api request failed'});
        }

        const data = await response.json();
        return res.status(200).json({summary: data[0].summary_text});

        
    }
    catch {
        return res.status(500).json({error: 'Something went wrong' });
    }
}