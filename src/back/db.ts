
import * as admin from "firebase-admin";

import * as serviceAccount from "../../key.json"


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-dwf-m6-d2160-default-rtdb.firebaseio.com"
});

const dataBase = admin.firestore();
const rtdb = admin.database();
dataBase.settings({ ignoreUndefinedProperties: true })
export {dataBase, rtdb}