import { NextResponse } from 'next/server';
import { getVisitorSessions } from '@/shared/utils/getVisitorSessions';
import {
  handleError,
  post,
  toJSON,
  verifyResponse,
} from '@/shared/utils/request';

const API_URL = 'https://candidate.hubteam.com/candidateTest/v3';

export const config = {
  api: {
    bodyParser: true,
  },
};

const fetchEvents = async () => {
  try {
    const response = await fetch(
      `${API_URL}/problem/dataset?userKey=${process.env.HUBSPOT_API_KEY}`,
    )
      .then(verifyResponse)
      .then(toJSON)
      .catch(handleError);

    return response.events;
  } catch (error) {
    console.error(error);
  }
};

export async function GET() {
  const events = await fetchEvents();
  const visitorSessions = getVisitorSessions(events);

  try {
    const response = await post(
      `${API_URL}/problem/result?userKey=${process.env.HUBSPOT_API_KEY}`,
      {
        body: JSON.stringify(visitorSessions),
      },
    );

    if (response.status === 200) {
      return NextResponse.json(visitorSessions);
    }
  } catch (error) {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
