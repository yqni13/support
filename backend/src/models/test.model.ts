import { TestErrorDTO } from "../dtos/test.dto";
import { ExceedMaxEndpointException, InvalidEndpointException, UnexpectedApiResponseException, UnimplementedException } from "../utils/exceptions/api.exception";
import { AuthenticationEmailException, AuthenticationStandardException, AuthSecretNotFoundException, BlockedUsersException, InvalidApiKeyException, InvalidCredentialsException, InvalidTokenException, InvalidUsersException, JWTExpirationException, MalformedApiKeyException, MissingApiKeyException, PermissionException, TokenMissingException } from "../utils/exceptions/auth.exception";
import { InternalServerException, InvalidSourceException, MaintenanceException, RequestExceedMaxException, UnexpectedException } from "../utils/exceptions/common.exception";
import { DBConnectionException, DBEmptyException, DBQueryErrorException } from "../utils/exceptions/db.exception";
import { InvalidFilesException, InvalidPropertiesException } from "../utils/exceptions/validation.exception";

class TestModel {
    private substitutionMsg = 'YOU_FORGOT_THE_REQUIRED_ERROR_MSG';

    throwExceptionOnTestPurpose(dto: TestErrorDTO) {
        switch(dto.error) {
            // AuthException
            case('AuthenticationStandardException'):
                throw new AuthenticationStandardException(dto.errorMsg ?? this.substitutionMsg);
            case('AuthenticationEmailException'):
                throw new AuthenticationEmailException(dto.errorMsg ?? this.substitutionMsg);
            case('JWTExpirationException'):
                throw new JWTExpirationException();
            case('TokenMissingException'):
                throw new TokenMissingException();
            case('InvalidCredentialsException'):
                throw new InvalidCredentialsException(dto.errorMsg ?? this.substitutionMsg);
            case('InvalidTokenException'):
                throw new InvalidTokenException(dto.errorMsg ?? this.substitutionMsg);
            case('MissingApiKeyException'):
                throw new MissingApiKeyException();
            case('InvalidApiKeyException'):
                throw new InvalidApiKeyException();
            case('MalformedApiKeyException'):
                throw new MalformedApiKeyException();
            case('AuthSecretNotFoundException'):
                throw new AuthSecretNotFoundException(dto.errorMsg ?? this.substitutionMsg);
            case('InvalidUsersException'):
                throw new InvalidUsersException();
            case('BlockedUsersException'):
                throw new BlockedUsersException();
            case('PermissionException'):
                throw new PermissionException(dto.errorMsg ?? this.substitutionMsg);
            // CommonException
            case('InternalServerException'):
                throw new InternalServerException();
            case('RequestExceedMaxException'):
                throw new RequestExceedMaxException();
            case('InvalidSourceException'):
                throw new InvalidSourceException();
            case('UnexpectedException'):
                throw new UnexpectedException(dto.errorMsg ?? this.substitutionMsg);
            case('MaintenanceException'):
                throw new MaintenanceException(dto.errorMsg ?? this.substitutionMsg);
            // DBConnectionException
            case('DBConnectionException'):
                throw new DBConnectionException();
            case('DBEmptyException'):
                throw new DBEmptyException();
            case('DBQueryErrorException'):
                throw new DBQueryErrorException();
            // ValidationException
            case('InvalidPropertiesException'): {
                const customError = [
                    {
                        type: 'field',
                        value: dto.errorMsg === 'support-arg-required' ? '' : 'test-value',
                        msg: dto.errorMsg ?? this.substitutionMsg,
                        path: 'test',
                        location: 'body'
                    }
                ];
                throw new InvalidPropertiesException('support-invalid-properties', { data: customError });
            }
            case('InvalidFilesException'):
                throw new InvalidFilesException(dto.errorMsg ?? this.substitutionMsg);
            // ApiException
            case('InvalidEndpointException'):
                throw new InvalidEndpointException(dto.errorMsg ?? this.substitutionMsg);
            case('UnimplementedException'):
                throw new UnimplementedException();
            case('ExceedMaxEndpointException'):
                throw new ExceedMaxEndpointException(dto.errorMsg ?? this.substitutionMsg, new Date().toISOString());
            case('UnexpectedApiResponseException'): 
                throw new UnexpectedApiResponseException();
            default:
                throw new UnexpectedApiResponseException('EXCEPTION-NOT-FOUND');
        }
    }
}

export default new TestModel();