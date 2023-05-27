import * as functions from "firebase-functions"
import {admin, firestore} from "../config/firebase"
import {GradeEnum} from "../enums/Grade"
import {PartnerAgreeStatusEnum} from "../enums/PartnerAgreeStatus"
import {PetTemperatureStatusEnum} from "../enums/PetTemperatureStatus"
import {PlatformEnum} from "../enums/Platform"
import {TableName} from "../enums/TableName"


export const initSampleData = (async (request: functions.Request, response: functions.Response) => {
  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    firestore.collection(TableName.Users).add({
      grade: GradeEnum.Partner,
      userId: "1",
    })
    firestore.collection(TableName.Users).add({
      grade: GradeEnum.Companion,
      userId: "2",
    })

    firestore.collection(TableName.UserPartnerCompanions).add({
      agree: PartnerAgreeStatusEnum.Approved,
      companionAvatar: "",
      companionEmail: "",
      companionId: "2",
      companionName: "",
      createDate: "",
      docId: null,
      prompartnerAvatar: "",
      partnerEmail: "",
      partnerId: "1",
      partnerName: "",
    })
    firestore.collection(TableName.Pets).doc("20").set({
      device_id: "",
      device_id_ios: "",
      devicemacaddr: "",
      docid: "",
      email: "",
      isactive: true,
      pet_breed_value: "",
      petbirth: "",
      petbreed: "",
      petgender: "",
      petgrade: "",
      petheight: "",
      petid: "20",
      petimage: "",
      petkinds: "",
      petname: "Millo",
      petregistration: "",
      petweight: "",
      userid: "1",
      username: "",
    })

    firestore.collection(TableName.FcmTokens).add({
      platform: PlatformEnum.Android,
      token: "token1",
      userId: "1",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    firestore.collection(TableName.FcmTokens).add({
      platform: PlatformEnum.Android,
      token: "token2 1",
      userId: "2",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    firestore.collection(TableName.FcmTokens).add({
      platform: PlatformEnum.iOS,
      token: "token2 2",
      userId: "2",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    response.send("Demo data!")
  } else {
    response.send("Not support!")
  }
})


export const createPetActiveSampleData = (async (request: functions.Request, response: functions.Response) => {
  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    await firestore.collection(TableName.PetActivities).add({
      resultTemperatureStatus: PetTemperatureStatusEnum.FeverRisk,
      userid: "1",
      device_id: "",
      devicemacaddr: "",
      email: "",
      petactvalue: "",
      petbattery: "",
      petcaltemperature: "",
      petgps: "",
      petid: "20",
      petmesstemp: "",
      petoutsidetemp: "",
      registerdate: admin.firestore.FieldValue.serverTimestamp(),
      reserv1: "",
      reserv2: "",
      reserv3: "",
    })
    response.send("Create Pet Active sample data!")
  } else {
    response.send("Not support!")
  }
})
