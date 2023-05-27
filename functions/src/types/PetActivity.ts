import {Timestamp} from "firebase-admin/firestore"
import {PetTemperatureStatusEnum} from "../enums/PetTemperatureStatus"

/**
 * Get Alert message by pet temperature.
 *
 * @param {string} petName Pet name
 * @param {PetActivity} petActivity Pet activity
 * @return {string}
 */
function getAlertMessage(petName: string, petActivity: PetActivity): string {
  switch (petActivity.resultTemperatureStatus) {
    case PetTemperatureStatusEnum.FeverRisk: {
      return `🥵 ${petName}'s temperature seems a quite high, so it's better to check it and go to the hospital! 🥵`
    }
    case PetTemperatureStatusEnum.High: {
      return `😥 ${petName}'s temperature seems a bit high. If you are by my side, please check😥`
    }
    case PetTemperatureStatusEnum.Low: {
      return `😵 ${petName}'s temperature seems a bit low. If you are by my side, please check 😵`
    }
    case PetTemperatureStatusEnum.Hypothermia: {
      return `🤒 ${petName} seems to have a fairly low temperature, so you should check it out and go to the hospital! 🤒`
    }
    default: {
      return ""
    }
  }
}
type PetActivity = {
    resultTemperatureStatus: PetTemperatureStatusEnum
    userid: string
    device_id: string
    devicemacaddr: string
    email: string
    petactvalue: string
    petbattery: string
    petcaltemperature: string
    petgps: string
    petid: string
    petmesstemp: string
    petoutsidetemp: string
    registerdate: Timestamp
    reserv1: string
    reserv2: string
    reserv3: string
}

export {getAlertMessage}
export default PetActivity
