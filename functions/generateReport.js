const functions = require("firebase-functions");
const admin = require("firebase-admin");
const PDFDocument = require("pdfkit");

admin.initializeApp();
const db = admin.firestore();

exports.generateWeeklyReport = functions.pubsub
  .schedule("every sunday 23:00")
  .timeZone("Europe/Berlin")
  .onRun(async () => {
    const employeesSnap = await db.collection("employees").get();

    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);
      // TODO: upload to storage or email to HR
    });

    doc.fontSize(16).text("Weekly Stress Report", { align: "center" });
    employeesSnap.forEach((emp) => {
      const d = emp.data();
      doc.fontSize(12).text(`${emp.id}: Stress ${d.stressCheckIns?.[0]?.score ?? "N/A"}`);
    });
    doc.end();

    return null;
  });
