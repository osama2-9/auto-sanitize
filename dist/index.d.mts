import { Request, Response, NextFunction } from 'express';

interface SanitizeOptions {
    trimStrings?: boolean;
    removeHTML?: boolean;
    escapeQuotes?: boolean;
    removeEmojis?: boolean;
    removeUnicodeControl?: boolean;
    blockScriptKeywords?: boolean;
    blockedPatterns?: RegExp[];
    lowercaseEmails?: boolean;
    normalizeFields?: string[];
    sanitizeOnlyFields?: string[];
    ignoreFields?: string[];
    allowedChars?: RegExp;
    unicodeNormalizeForm?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
    maxStringLength?: number;
    allowEmptyStrings?: boolean;
    stripSQLMeta?: boolean;
    sanitizeArrays?: boolean;
    collapseWhitespace?: boolean;
}

declare function autoSanitize(userConfig?: SanitizeOptions): (req: Request, res: Response, next: NextFunction) => void;

export { autoSanitize };
