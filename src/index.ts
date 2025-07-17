import { Request, Response, NextFunction } from 'express';
import { cleanObject } from './utils';
import { SanitizeOptions } from './types';

const defaultConfig: Required<SanitizeOptions> = {
    trimStrings: true,
    removeHTML: true,
    lowercaseEmails: true,
    escapeQuotes: true,
    stripSQLMeta: true,
    blockScriptKeywords: true,
    sanitizeArrays: true,
    allowEmptyStrings: false,
    maxStringLength: 500,
    normalizeFields: [],
    ignoreFields: [],
    removeEmojis: false,
    removeUnicodeControl: false,
    unicodeNormalizeForm: 'NFC',
    blockedPatterns: [],
    allowedChars: /./,
    sanitizeOnlyFields: [],
    collapseWhitespace: false,
};

export function autoSanitize(userConfig?: SanitizeOptions) {
    const config = { ...defaultConfig, ...userConfig };

    return function (req: Request, res: Response, next: NextFunction) {
        (['body', 'query', 'params'] as const).forEach((key) => {
            const original = (req as any)[key];
            if (original) {
                const cleaned = cleanObject(original, config);

                if (Array.isArray(original)) {

                    original.length = 0;
                    original.push(...(cleaned as any));
                } else if (typeof original === 'object') {
                    Object.assign(original, cleaned);
                }
            }
        });

        next();
    };
}
