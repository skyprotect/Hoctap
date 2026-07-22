const FIREBASE_RTDB_URL = "https://binhminhchamhoc-default-rtdb.firebaseio.com/";

async function verifyAll() {
  const tokenRes = await fetch(`${FIREBASE_RTDB_URL}tablet_tokens/293003.json`);
  const tokenData = await tokenRes.json();
  console.log("Token Data 293003:", tokenData);

  const historyRes = await fetch(`${FIREBASE_RTDB_URL}card_exchange_history/std_tyc0gfnkz.json`);
  const historyData = await historyRes.json();
  console.log("Card Exchange History for std_tyc0gfnkz:", historyData);

  const leaderboardRes = await fetch(`${FIREBASE_RTDB_URL}leaderboard/std_tyc0gfnkz.json`);
  const leaderboardData = await leaderboardRes.json();
  console.log("Leaderboard Data for std_tyc0gfnkz:", leaderboardData);
}

verifyAll();
