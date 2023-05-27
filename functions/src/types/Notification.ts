import {Timestamp} from "firebase-admin/firestore"
import {FlutterNavigatorEnum} from "../enums/FlutterNavigator"
import {NotificationActionEnum} from "../enums/NotificationAction"

type Notification = {
    uuid: string
    title: string
    body: string
    action: NotificationActionEnum
    type: string
    navigator: FlutterNavigatorEnum
    senderId: string
    userId: string
    petId: string
    reatAt: Timestamp | null
    createdAt: Timestamp
    updatedAt: Timestamp
}
/**
 * Convert Notification to push notification data.
 *
 * @param {Notification} notification
 *
 * @return { object }
 */
function pushNotificationData(notification: Notification): {[key: string]: string} {
  return {
    uuid: notification.uuid,
    title: notification.title,
    body: notification.body,
    action: notification.action.toString(),
    navigator: notification.navigator.toString(),
    senderId: notification.senderId,
    type: notification.type,
    petId: notification.petId,
    reatAt: notification.reatAt ? (new Date(notification.reatAt.seconds * 1000)).toISOString() : "",
    createdAt: (new Date(notification.createdAt.seconds * 1000)).toISOString(),
    updatedAt: (new Date(notification.updatedAt.seconds * 1000)).toISOString(),
  }
}

export {pushNotificationData}
export default Notification
