import {Timestamp} from "firebase-admin/firestore"
import {PlatformEnum} from "../enums/Platform"
type FcmToken = {
    platform: PlatformEnum
    token: string
    userId: string
    createdAt: Timestamp
    updatedAt: Timestamp
}

export default FcmToken
