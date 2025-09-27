export function validateVersionStructure(version: string, numOfDelimiter: number): boolean {
    // 1. Check if version is a string and has all necessary delimiters.
    const hasValidDelimiter: boolean = (version.match(/./g) || []).length === numOfDelimiter;
    if(typeof version !== 'string' || !hasValidDelimiter) {
        throw new Error('backend-invalid-version');
    }

    // 2. Check if values are numbers (alpha & beta versions are not supported).
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
            throw new Error('backend-invalid-version');
        }
        searchPos = searchEnd + 1;
    }

    return true;
}