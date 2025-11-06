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