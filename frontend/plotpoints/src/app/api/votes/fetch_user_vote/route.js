export async function POST(req) {
  const { voteId, jwt } = await req.json();

  if (!voteId || !jwt) {
    return new Response(JSON.stringify({ error: 'voteId and jwt required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const backendUrl = `http://${process.env.API_URL}/get_user_vote/${encodeURIComponent(voteId)}`;

  const resp = await fetch(backendUrl, {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({ jwt_token: jwt }),
  });

  const payload = await resp.json().catch(() => null);

  if (!resp.ok) {
    return new Response(JSON.stringify({ error: payload?.detail || 'Failed to fetch user vote' }), {
      status: resp.status || 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}