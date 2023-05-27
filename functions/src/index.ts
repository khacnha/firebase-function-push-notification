import * as functions from "firebase-functions"
import {TableName} from "./enums/TableName"
import * as dataController from "./controllers/data.controller"
import * as notificationController from "./controllers/notification.controller"

// ping
export const helloWorld = functions.https.onRequest((request: functions.Request, response: functions.Response) => {
  functions.logger.info("Hello World!", {structuredData: false})
  response.send("Hello from PeachApp Firebase!")
})

// Example data
export const createPetActiveSampleData = functions.https.onRequest(
    (request, response) => dataController.createPetActiveSampleData(request, response))

export const initSampleData = functions.https.onRequest(
    (request, response) => dataController.initSampleData(request, response))

// Hook PetActive OnCreate
export const onPetActivityCreate = functions.firestore
    .document(`${TableName.PetActivities}/{docId}`)
    .onCreate(async (snap, context) => await notificationController.petActiveOnCreate(snap, context))

// Hook Notification OnCreate
export const onNotificationCreate = functions.firestore
    .document(`${TableName.Notifications}/{docId}`)
    .onCreate(async (snap, context) => await notificationController.notificationOnCreate(snap, context))
