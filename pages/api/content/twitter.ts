import type { NextApiRequest, NextApiResponse } from 'next';

import Axios from 'axios';

const client = Axios.create({
  baseURL: 'https://api.twitter.com',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
  }
});

type Data = {
  id: string;
  text: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const tweetId = req.query.id || '841418541026877441';

  const response = await client({
    url: `/1.1/statuses/show.json`,
    method: 'GET',
    params: {
      id: tweetId,
      include_entities: true,
      tweet_mode: 'extended'
    }
  });

  res.status(200).json(response.data);
};
