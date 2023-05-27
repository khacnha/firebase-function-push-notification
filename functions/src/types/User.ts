import {GradeEnum} from "../enums/Grade"
import {PlatformEnum} from "../enums/Platform"

type User = {
    avatar: string | null
    birthday: PlatformEnum | null
    docID: string
    email: string
    gender: string
    grade: GradeEnum
    phoneNumber: string
    promotion: boolean
    userId: string
    username: string
}

export default User
