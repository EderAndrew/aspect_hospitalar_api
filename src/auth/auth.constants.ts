import { UserRole } from 'src/users/enums/user-role.enum';

export const REQUEST_TOKEN_PAYLOAD_KEY = 'tokenPayload';

export const ADMIN_ONLY = [UserRole.ADMIN];

export const STAFF = [UserRole.ADMIN, UserRole.ATTENDANT];

export const CLINICAL = [UserRole.DOCTOR, UserRole.ADMIN];

export const PATIENT = [UserRole.PATIENT];
