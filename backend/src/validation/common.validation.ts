import { UsersFilterDTO } from "../dtos/users.dto";
import clientsRepository from "../repositories/clients.repository";
import { Users } from "../repositories/interfaces/users.entity.interface";
import usersRepository from "../repositories/users.repository";
import { CommonExceptionMessage } from "../utils/enums/common-exception-messages.enum";
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum";
import { MalformedApiKeyException } from "../utils/exceptions/auth.exception";

/**
 * @description validating version regarding guidelines of Semantic Versioning 2.0.0
 * @param {string} context Version with acceptable structure see SemVer Specification 9
 */
export function validateVersionStructure(context: string): boolean {
    // 1. Check if context is pre-release version.
    const isPreRelease = context.includes('-');
    const delimiter = {
        main: isPreRelease 
            ? context.substring(0, context.indexOf('-')).split('.').length - 1
            : context.split('.').length - 1,
        preRelease: isPreRelease ? context.substring(context.indexOf('-')).split('.').length - 1 : 0
    };
    const version = {
        main: isPreRelease ? context.substring(0, context.indexOf('-')) : context,
        preRelease: isPreRelease ? context.substring(context.indexOf('-') + 1) : ''
    };

    // 2. Check main version to be numbers only [0-9].
    validateVersionByRegex(version.main, delimiter.main, /^[0-9]*$/g);
    if(!isPreRelease) {
        return true;
    }

    // 3. Check pre-release part to be valid numbers and/or characters [0-9A-Za-z].
    validateVersionByRegex(version.preRelease, delimiter.preRelease, /^[0-9a-zA-Z]*$/g);

    return true;
}

function validateVersionByRegex(context: string, delimiters: number, regex: any) {
    let searchPos: number = 0;
    let searchEnd: number = 0;
    for(let i = 0; i <= delimiters; i++) {
        if(i === delimiters) {
            searchEnd = context.length;
        } else {
            searchEnd = context.indexOf('.', searchPos);
        }
        const searchVal = context.substring(searchPos, searchEnd);
        if(!searchVal.match(regex) || searchVal.length === 0 || searchVal === '') {
            throw new Error('support-invalid-version');
        }
        searchPos = searchEnd + 1;
    }
}

export function validateEnum(value: unknown, enumObj: any, enumName: string): boolean {
    const enumValues = Object.values(enumObj);
    if(!enumValues.includes(value)) {
        throw new Error(`support-invalid-entry#${enumName}`);
    }
    return true;
}

export function validateApiKey(key: string): boolean {
    const API_KEY_REGEX = /^[0-9a-zA-Z]{42}$/;
    if(!API_KEY_REGEX.test(key)) {
        throw new MalformedApiKeyException();
    }
    return true;
}

export function validateEmail(email: string): boolean {
    // Rules based on: https://mailcon.com/email-address-formatting/ [17.11.2025, 14:00]
    if((email.split('@').length - 1) !== 1) {
        throw new Error('support-invalid-length#email<@>$1')
    }
    const posATsign: number = email.indexOf('@');

    validateEmailLength(email, posATsign);
    validateEmailSyntax(email, posATsign);
    validateEmailPolicies(email);

    return true;
}

export function validateEmailLength(email: string, posATsign: number): boolean {
    // Length ruleset
    // Minimum: username (1 char) + "@" + mail server (1 char) + "." + domain (2 char)
    // Maximum: username (64 char) + "@" + mail server & "." & domain (255 char)

    if(email.length < 6) {
        throw new Error('support-invalid-min#email?6');
    } else if(email.length > 320) {
        throw new Error('support-invalid-max#email!320');
    }

    const username = email.substring(0, posATsign);
    if(username.length < 1 || username.length > 64) {
        throw new Error('support-invalid-length#email-username');
    }

    const domain = email.substring(posATsign+1);
    if(domain.length < 4 || domain.length > 255) {
        throw new Error('support-invalid-length#email-domain');
    }

    const topLevelDomain = domain.substring(domain.indexOf('.')+1);
    if(topLevelDomain.length < 2) {
        throw new Error('support-invalid-length#email-topleveldomain?2');
    }

    return true;
}

export function validateEmailSyntax(email: string, posATsign: number): boolean {
    // No hyphens allowed directly before or after "@".
    if(email[posATsign-1] === '-' || email[posATsign+1] === '-') {
        throw new Error('support-invalid-email#hyphen<@>');
    }

    if(!(/^[0-9a-zA-Z_\-+.,$#!]*$/).test(email.substring(0, posATsign))) {
        throw new Error('support-invalid-email#regex-username');
    }

    // Mail server part must be min 1 char of [0-9a-zA-Z].
    if(!(/^[0-9a-zA-Z]*$/).test(email[posATsign+1])) {
        throw new Error('support-invalid-email#mailserver');
    }

    const domainPart = email.substring(posATsign+1);
    if(!(/^[0-9a-zA-Z.]*$/).test(domainPart) || !domainPart.includes('.')) {
        throw new Error('support-invalid-email#regex-domain');
    }

    return true;
}

export function validateEmailPolicies(email: string): boolean {
    const forbiddenKeywords = ['localhost', 'noreply', 'no-reply', ' '];
    forbiddenKeywords.forEach((keyword) => {
        if(email.includes(keyword)) {
            throw new Error(`support-invalid-email#keyword:${keyword === ' ' ? 'emptyspaces' : keyword}`);
        }
    })

    return true;
}

export async function validateEmailUniqueness(email: string): Promise<boolean> {
    const dto: UsersFilterDTO = { email: email };
    const result = await usersRepository.findByFilter(dto);
    const isUnique = result && (result as Users[]).length > 0 ? false : true;
    if(!isUnique) {
        throw new Error('support-nonunique-email');
    }
    return true;
}

export async function validateClientUniqueness(name: string): Promise<boolean> {
    const result = await clientsRepository.findStatusByName(name); // Returns all necessary data - no need for new fn.
    const isUnique = !result ? true : false;
    if(!isUnique) {
        throw new Error('support-nonunique-client');
    }
    return true;
}

export function validateRequestRouteParam(arg: string | null | undefined): boolean {
    if(arg === null || arg === undefined || arg === ' ' || arg[0] === ':') {
        throw new Error(CommonExceptionMessage.REQUIRED);
    }
    return true;
}

export function validateTimestamp(timestamp: string): boolean {
    const dateResult = new Date(timestamp);
    if(dateResult.toString() === 'Invalid Date') {
        throw new Error('support-invalid-entry#timestamp');
    }
    return true;
}

/**
 * @description Check type, length, content and order of timestamp array (from...to).
 */
export function validateTimestampFilter(timestamps: any): boolean {
    const errorMsg = 'support-invalid-entry#timestamps';
    if(!Array.isArray(timestamps) || (timestamps as string[]).length !== 2) {
        throw new Error(errorMsg);
    }
    (timestamps as string[]).forEach((timestamp) => validateTimestamp(timestamp));

    // Order must be: ["older", "younger"].
    if(new Date(timestamps[0]) > new Date(timestamps[1])) {
        throw new Error(errorMsg);
    }
    return true;
}

/**
 * @description Test-specific validation to control if a tested exception requires specific message input (enum, ...).
 */
export function validateTestErrorMsg(exception: string, message: string): boolean {
    const exceptionMessageRules = [
        { exception: 'MaintenanceException', apply: (val: any) => validateEnum(val, MaintenanceMode, 'maintenanceMode')}
    ];

    const _ = exceptionMessageRules.find(rule => rule.exception === exception)?.apply(message);
    return true;
}