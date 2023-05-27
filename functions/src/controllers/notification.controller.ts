import {Timestamp} from "firebase-admin/firestore"
import * as functions from "firebase-functions"
import {admin, db} from "../config/firebase"
import {FlutterNavigatorEnum} from "../enums/FlutterNavigator"
import {GradeEnum} from "../enums/Grade"
import {NotificationActionEnum} from "../enums/NotificationAction"
import {PetTemperatureStatusEnum} from "../enums/PetTemperatureStatus"
import {TableName} from "../enums/TableName"
import FcmToken from "../types/FcmToken"
import Notification, {pushNotificationData} from "../types/Notification"
import Pet from "../types/Pet"
import PetActivity, {getAlertMessage} from "../types/PetActivity"
import User from "../types/User"
import UserPartnerCompanion from "../types/UserPartnerCompanion"
import crypto = require("crypto")

// Hook Pet Activity create > send Notification to Firestore to User and Companian relate this Pet
export const petActiveOnCreate = (async (
    snap: functions.firestore.QueryDocumentSnapshot,
    context: functions.EventContext<{docId: string}>
) => {
  functions.logger.info(TableName.PetActivities)
  // Get an object representing the document
  const newPetActivity = snap.data() as PetActivity

  // Get Pet temperature result
  const resultTemperature: string = newPetActivity.resultTemperatureStatus
  const petId: string = newPetActivity.petid

  // Check Pet temperature for send Alert to User
  // 1 status - just send once per date
  let isAlert = false
  if (
    resultTemperature != PetTemperatureStatusEnum.Normal &&
    (await db.checkPetActiveSameStatusToday(newPetActivity)).empty
  ) {
    isAlert = true
  }

  const userId: string = newPetActivity.userid
  functions.logger.info(TableName.PetActivities, {isAlert, userId})
  if (isAlert && userId) {
    const userIds: string[] = [userId]
    // Get User of this pet
    const uQuerySnapshot = await db.user(userId).get()
    if (uQuerySnapshot.empty) return

    const user: User = uQuerySnapshot.docs[0].data()

    if (user.grade == GradeEnum.Partner) {
      // Get Companion user of this User
      const upcQuerySnapshot = await db.userPartnerCompanionsApproved(userId).get()
      upcQuerySnapshot.forEach((upcSnapshot) => {
        const uPC: UserPartnerCompanion = upcSnapshot.data()
        userIds.push(uPC.companionId)
      })
    }
    functions.logger.info(TableName.PetActivities, {userIds})

    // Get Pet info
    const petDoc = await db.pet(petId).get()

    if (petDoc.exists) {
      const pet: Pet = petDoc.data()!
      functions.logger.info(TableName.PetActivities, {pet})

      // Add a Notification in Firebase
      const bodyMsg = getAlertMessage(pet.petname, newPetActivity)

      const notification: Notification = {
        uuid: "",
        userId: "",
        petId: pet.petid,
        title: "경보",
        body: bodyMsg,
        action: NotificationActionEnum.PetAlert,
        navigator: FlutterNavigatorEnum.Home,
        senderId: "system",
        type: "체계",
        reatAt: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
      }
      userIds.forEach((id) => {
        db.addNotification({...notification, uuid: crypto.randomUUID(), userId: id})
      })
    }
  }
})

// Hook Notification Create > send Push notification to this User
export const notificationOnCreate = (async (
    snap: functions.firestore.QueryDocumentSnapshot,
    context: functions.EventContext<{docId: string}>
) => {
  const newNotification = snap.data() as Notification

  // Get  FCM tokens of this User and Companion User
  const querySnapshot = await db.fcmTokens(newNotification.userId).get()

  const tokens: string[] = []
  querySnapshot.forEach((fcmTokenSnapshot) => {
    const fcmToken: FcmToken = fcmTokenSnapshot.data()
    tokens.push(fcmToken.token)
  })

  // Send push notification
  if (tokens.length > 0) {
    functions.logger.info(TableName.Notifications, {tokens})
    await admin.messaging().sendMulticast({
      tokens: tokens,
      data: pushNotificationData(newNotification),
      notification: {
        title: newNotification.title,
        body: newNotification.body,
      },
      // Set Android priority to "high"
      android: {
        priority: "high",
      },
      // Add APNS (Apple) config
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          "apns-priority": "10",
        },
      },
    }).catch((error)=>functions.logger.error(TableName.Notifications, {error}))
  }
})
