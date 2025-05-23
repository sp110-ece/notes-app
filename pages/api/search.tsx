import type { NextApiRequest, NextApiResponse } from "next";
import keyword_extractor from "keyword-extractor";


interface searchResults {
    title: string;
    url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({error: 'text is required'})
    }

    const BRAVE_API_TOKEN = process.env.BRAVE_API_TOKEN

    if (!BRAVE_API_TOKEN) {
        return res.status(500).json({error: 'invalid credentials'})
    }

    const extraction = keyword_extractor.extract(text, {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false
    });

    const pre_query = extraction.join(' ')
    const clean_query = pre_query.replace(/[^\x00-\x7F]/g, '');
    const query = clean_query.substring(0, 300);
    

    try {
        // console.log(encodeURIComponent(query));
        const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Subscription-Token': BRAVE_API_TOKEN
            }
        })
        // console.log(response);

        const data = await response.json();
        // console.log(data);

        const results: searchResults[] = data.web?.results || [];
        const top5 = results.slice(0, 7).map((item: searchResults) => ({
            title: item.title,
            url: item.url

        }))
        // console.log(top5)
        return res.status(200).json(top5);
    }
    catch {
        return res.status(502).json({error: 'api request failed'});
    }
    
}