import { User } from 'firebase/auth'

export interface IUser extends Pick<User, 'email' | 'photoURL' | 'uid'> {}
