// Run this script in Node.js to check API token and response for profile and chats
// For Node.js v18+ (including v22), fetch is global:
// No import needed; use fetch directly.

const API_BASE_URL = process.env.API_BASE_URL || 'https://dragonai-backend.up.railway.app';
const TOKEN = process.env.TEST_JWT_TOKEN || '';

async function checkProfile() {
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json().catch(() => ({}));
  console.log('Profile response:', res.status, data);
}

async function checkChats() {
  const res = await fetch(`${API_BASE_URL}/api/chats`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json().catch(() => ({}));
  console.log('Chats response:', res.status, data);
}

(async () => {
  if (!TOKEN) {
    console.error('Set TEST_JWT_TOKEN env variable to a valid JWT token.');
    return;
  }
  await checkProfile();
  await checkChats();
})();
