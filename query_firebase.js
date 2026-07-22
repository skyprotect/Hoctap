const FIREBASE_RTDB_URL = "https://binhminhchamhoc-default-rtdb.firebaseio.com/";

async function checkFirebase() {
  console.log("=== CHECKING FIREBASE RTDB FOR TOKEN 293003 ===");
  
  // 1. Check specific token 293003
  try {
    const res1 = await fetch(`${FIREBASE_RTDB_URL}tablet_tokens/293003.json`);
    const data1 = await res1.json();
    console.log("tablet_tokens/293003.json result:", data1);
  } catch (e) {
    console.error("Err 1:", e.message);
  }

  // 2. Fetch all tablet_tokens
  try {
    const res2 = await fetch(`${FIREBASE_RTDB_URL}tablet_tokens.json`);
    const data2 = await res2.json();
    console.log("\nAll tablet_tokens from Firebase RTDB:");
    console.log(JSON.stringify(data2, null, 2));
  } catch (e) {
    console.error("Err 2:", e.message);
  }

  // 3. Fetch card_exchange_history
  try {
    const res3 = await fetch(`${FIREBASE_RTDB_URL}card_exchange_history.json`);
    const data3 = await res3.json();
    console.log("\ncard_exchange_history from Firebase RTDB:");
    console.log(JSON.stringify(data3, null, 2));
  } catch (e) {
    console.error("Err 3:", e.message);
  }

  // 4. Fetch leaderboard / student info
  try {
    const res4 = await fetch(`${FIREBASE_RTDB_URL}leaderboard.json`);
    const data4 = await res4.json();
    console.log("\nleaderboard from Firebase RTDB:");
    console.log(JSON.stringify(data4, null, 2));
  } catch (e) {
    console.error("Err 4:", e.message);
  }
}

checkFirebase();
