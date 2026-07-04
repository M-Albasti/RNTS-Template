import type {LoginResponseDto} from '@api/server/auth.dto';
import type {LoginTypes} from '@Types/loginTypes';
import type {User} from '@Types/userTypes';

export const mapLoginResponseToUser = (
  dto: LoginResponseDto,
  loginType: LoginTypes,
): User => ({
  uid: String(dto.id),
  email: dto.email,
  displayName: dto.name,
  photoURL: null,
  phoneNumber: null,
  emailVerified: true,
  providerId: 'api',
  providerData: [],
  isAnonymous: false,
  creationTime: new Date().toISOString(),
  lastSignInTime: new Date().toISOString(),
  loginType,
});
