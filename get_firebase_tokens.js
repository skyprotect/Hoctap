const FIREBASE_RTDB_URL = "https://binhminhchamhoc-default-rtdb.firebaseio.com/";

async function getTokens() {
  const res = await fetch(`${FIREBASE_RTDB_URL}tablet_tokens.json`);
  const tokens = await res.json();
  console.log("Tokens from Firebase RTDB:", JSON.stringify(tokens, null, 2));
}

getTokens();
