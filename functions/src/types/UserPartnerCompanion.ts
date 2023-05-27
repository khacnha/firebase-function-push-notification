import {PartnerAgreeStatusEnum} from "../enums/PartnerAgreeStatus"

type UserPartnerCompanion = {
    agree: PartnerAgreeStatusEnum
    companionAvatar: string | null
    companionEmail: string
    companionId: string
    companionName: string
    createDate: string
    docId: string | null
    prompartnerAvatar: string | null
    partnerEmail: string
    partnerId: string
    partnerName: string
}

export default UserPartnerCompanion
