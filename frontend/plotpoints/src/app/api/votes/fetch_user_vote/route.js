export async function GET(req) {
  const { voteId, jwt } = await req.json();

  if (!voteId || !jwt) {
    return new Response(JSON.stringify({ error: 'voteId and jwt required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const backendUrl = `http://${process.env.API_URL}/get_user_vote/${encodeURIComponent(voteId)}?jwt=${encodeURIComponent(jwt)}`;

  const resp = await fetch(backendUrl, {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    },
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