import { ClientsStatusResponseDTO } from "../dtos/clients.dto";
import { UsersFilterDTO } from "../dtos/users.dto";
import clientsRepository from "../repositories/clients.repository";
import { Users } from "../repositories/interfaces/users.entity.interface";
import usersRepository from "../repositories/users.repository";
import { MalformedApiKeyException } from "./exceptions/auth.exception";
import * as Utils from "./common.utils";

export function validateVersionStructure(version: string, numOfDelimiter: number): boolean {
    // 1. Check if version has all necessary delimiters.
    const hasValidDelimiter: boolean = (version.split('.').length - 1) === numOfDelimiter;
    if(!hasValidDelimiter) {
        throw new Error('support-invalid-version');
    }

    // 2. Check if values are numbers (named/combined versions are not supported).
    let searchPos: number = 0;
    let searchEnd: number = 0;
    for(let i = 0; i <= numOfDelimiter; i++) {
        if(i === numOfDelimiter) {
            searchEnd = version.length;
        } else {
            searchEnd = version.indexOf('.', searchPos);
        }
        const searchVal = version.substring(searchPos, searchEnd);
        if(!searchVal.match(/^[0-9]*$/g)) {
            throw new Error('support-invalid-version');
        }
        searchPos = searchEnd + 1;
    }

    return true;
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
    const result = await clientsRepository.findStatusByName(name);
    const isUnique = !Utils.isEmptyObj(result) || Utils.isIRepoError(result) ? false : true;
    if(!isUnique) {
        throw new Error('support-nonunique-client');
    }
    return true;
}