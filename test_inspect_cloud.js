const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-service-account.json');

let privateKey = serviceAccount.private_key;
if (privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

const app = initializeApp({
  credential: cert({
    ...serviceAccount,
    private_key: privateKey
  }),
  databaseURL: "https://binhminhchamhoc-default-rtdb.firebaseio.com"
});

const db = getFirestore(app);

async function inspect() {
  console.log("=== FIRESTORE STUDENTS ===");
  const students = await db.collection('students').get();
  console.log("Total students docs count:", students.size);
  students.forEach(doc => {
    console.log(`Doc ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });

  console.log("\n=== FIRESTORE SETTINGS ===");
  const settings = await db.collection('settings').get();
  console.log("Total settings docs count:", settings.size);
  settings.forEach(doc => {
    console.log(`Doc ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });

  process.exit(0);
}

inspect().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
