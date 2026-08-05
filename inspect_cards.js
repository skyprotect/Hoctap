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
  })
});

const db = getFirestore(app);

async function inspectStudents() {
    const studentIds = ['std_htsj4gbmo', 'std_tyc0gfnkz'];
    for (const id of studentIds) {
        const doc = await db.collection('students').doc(id).get();
        if (!doc.exists) {
            console.log(`❌ Học sinh ${id} không tồn tại trên Firestore.`);
            continue;
        }
        const data = doc.data();
        let state = {};
        try { state = JSON.parse(data.state_json); } catch(e){}
        console.log(`=== HỌC SINH: ${data.name} (${id}) ===`);
        console.log("goldBadges (Huy hiệu Toán mạ vàng):", state.goldBadges || []);
        console.log("goldSkills (Thẻ Tiếng Anh mạ vàng):", state.goldSkills || []);
        console.log("redeemedSkills (Thẻ Tiếng Anh đã quy đổi):", state.redeemedSkills || []);
        console.log("redeemedHistory (Lịch sử quy đổi):", state.redeemedHistory || []);
        console.log("------------------------------------------\n");
    }
}

inspectStudents().catch(console.error);
