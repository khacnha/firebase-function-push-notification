import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import {PartnerAgreeStatusEnum} from "../enums/PartnerAgreeStatus"
import {TableName} from "../enums/TableName"
import FcmToken from "../types/FcmToken"
import Notification from "../types/Notification"
import Pet from "../types/Pet"
import PetActivity from "../types/PetActivity"
import User from "../types/User"
import UserPartnerCompanion from "../types/UserPartnerCompanion"

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  databaseURL: "https://demo-project.firebaseio.com",
})
const firestore = admin.firestore()

// This helper function pipes your types through a firestore converter
const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
})


// This helper function exposes a 'typed' version of firestore().collection(collectionPath)
// Pass it a collectionPath string as the path to the collection in firestore
// Pass it a type argument representing the 'type' (schema) of the docs in the collection
const dataPoint = <T>(collectionPath: string) => firestore.collection(collectionPath).withConverter(converter<T>())

// Construct a database helper object
const db = {
  user: (userId: string) => dataPoint<User>(TableName.Users).where("userId", "==", userId).limit(1),
  userPartnerCompanionsApproved: (partnerId: string) => dataPoint<UserPartnerCompanion>(TableName.UserPartnerCompanions)
      .where("partnerId", "==", partnerId).where("agree", "==", PartnerAgreeStatusEnum.Approved),
  pet: (petId: string) => dataPoint<Pet>(TableName.Pets).doc(petId),
  fcmTokens: (userId: string) => dataPoint<FcmToken>(TableName.FcmTokens).where("userId", "==", userId),
  addNotification: (data: Notification) => firestore.collection(TableName.Notifications).add(data),
  checkPetActiveSameStatusToday: async (newPetActivity: PetActivity) => {
    // today with 00:00:00
    const today = admin.firestore.Timestamp.now().toDate()
    today.setHours(0, 0, 0, 0)
    const todayServer = admin.firestore.Timestamp.fromDate(today)

    // Find previous Other PetActivity with same Today, ResultTemperatureStatus and PetId
    return await firestore.collection(TableName.PetActivities)
        .where("petid", "==", newPetActivity.petid)
        .where("resultTemperatureStatus", "==", newPetActivity.resultTemperatureStatus)
        .where("registerdate", "<", newPetActivity.registerdate)
        .where("registerdate", ">=", todayServer)
        .limit(1).get()
  },
}

// export your helper
export {admin, firestore, db}
