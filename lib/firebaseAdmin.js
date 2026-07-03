import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_SAM_PRJ_ID,
      clientEmail: process.env.FB_SAM_CLT_EMAIL,
      privateKey: process.env.FB_SAM_PVT_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default admin;
