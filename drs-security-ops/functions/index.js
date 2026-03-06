const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.exportAttendanceToSheets = functions.firestore
  .document('attendance/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    console.log('Forward attendance to Apps Script endpoint', data);
  });

exports.dailySummary = functions.pubsub.schedule('0 19 * * *').onRun(async () => {
  console.log('Generate daily summary report.');
});
