/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "jsonc-parser"], function (require, exports, json) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TOKEN_COMMENT_LINE = exports.TOKEN_COMMENT_BLOCK = exports.TOKEN_PROPERTY_NAME = exports.TOKEN_VALUE_NUMBER = exports.TOKEN_VALUE_STRING = exports.TOKEN_VALUE_NULL = exports.TOKEN_VALUE_BOOLEAN = exports.TOKEN_DELIM_COMMA = exports.TOKEN_DELIM_COLON = exports.TOKEN_DELIM_ARRAY = exports.TOKEN_DELIM_OBJECT = exports.createTokenizationSupport = void 0;
    function createTokenizationSupport(supportComments) {
        return {
            getInitialState: () => new JSONState(null, null, false, null),
            tokenize: (line, state) => tokenize(supportComments, line, state)
        };
    }
    exports.createTokenizationSupport = createTokenizationSupport;
    exports.TOKEN_DELIM_OBJECT = 'delimiter.bracket.json';
    exports.TOKEN_DELIM_ARRAY = 'delimiter.array.json';
    exports.TOKEN_DELIM_COLON = 'delimiter.colon.json';
    exports.TOKEN_DELIM_COMMA = 'delimiter.comma.json';
    exports.TOKEN_VALUE_BOOLEAN = 'keyword.json';
    exports.TOKEN_VALUE_NULL = 'keyword.json';
    exports.TOKEN_VALUE_STRING = 'string.value.json';
    exports.TOKEN_VALUE_NUMBER = 'number.json';
    exports.TOKEN_PROPERTY_NAME = 'string.key.json';
    exports.TOKEN_COMMENT_BLOCK = 'comment.block.json';
    exports.TOKEN_COMMENT_LINE = 'comment.line.json';
    class ParentsStack {
        constructor(parent, type) {
            this.parent = parent;
            this.type = type;
        }
        static pop(parents) {
            if (parents) {
                return parents.parent;
            }
            return null;
        }
        static push(parents, type) {
            return new ParentsStack(parents, type);
        }
        static equals(a, b) {
            if (!a && !b) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            while (a && b) {
                if (a === b) {
                    return true;
                }
                if (a.type !== b.type) {
                    return false;
                }
                a = a.parent;
                b = b.parent;
            }
            return true;
        }
    }
    class JSONState {
        constructor(state, scanError, lastWasColon, parents) {
            this._state = state;
            this.scanError = scanError;
            this.lastWasColon = lastWasColon;
            this.parents = parents;
        }
        clone() {
            return new JSONState(this._state, this.scanError, this.lastWasColon, this.parents);
        }
        equals(other) {
            if (other === this) {
                return true;
            }
            if (!other || !(other instanceof JSONState)) {
                return false;
            }
            return (this.scanError === other.scanError &&
                this.lastWasColon === other.lastWasColon &&
                ParentsStack.equals(this.parents, other.parents));
        }
        getStateData() {
            return this._state;
        }
        setStateData(state) {
            this._state = state;
        }
    }
    function tokenize(comments, line, state, offsetDelta = 0) {
        // handle multiline strings and block comments
        let numberOfInsertedCharacters = 0;
        let adjustOffset = false;
        switch (state.scanError) {
            case 2 /* ScanError.UnexpectedEndOfString */:
                line = '"' + line;
                numberOfInsertedCharacters = 1;
                break;
            case 1 /* ScanError.UnexpectedEndOfComment */:
                line = '/*' + line;
                numberOfInsertedCharacters = 2;
                break;
        }
        const scanner = json.createScanner(line);
        let lastWasColon = state.lastWasColon;
        let parents = state.parents;
        const ret = {
            tokens: [],
            endState: state.clone()
        };
        while (true) {
            let offset = offsetDelta + scanner.getPosition();
            let type = '';
            const kind = scanner.scan();
            if (kind === 17 /* SyntaxKind.EOF */) {
                break;
            }
            // Check that the scanner has advanced
            if (offset === offsetDelta + scanner.getPosition()) {
                throw new Error('Scanner did not advance, next 3 characters are: ' + line.substr(scanner.getPosition(), 3));
            }
            // In case we inserted /* or " character, we need to
            // adjust the offset of all tokens (except the first)
            if (adjustOffset) {
                offset -= numberOfInsertedCharacters;
            }
            adjustOffset = numberOfInsertedCharacters > 0;
            // brackets and type
            switch (kind) {
                case 1 /* SyntaxKind.OpenBraceToken */:
                    parents = ParentsStack.push(parents, 0 /* JSONParent.Object */);
                    type = exports.TOKEN_DELIM_OBJECT;
                    lastWasColon = false;
                    break;
                case 2 /* SyntaxKind.CloseBraceToken */:
                    parents = ParentsStack.pop(parents);
                    type = exports.TOKEN_DELIM_OBJECT;
                    lastWasColon = false;
                    break;
                case 3 /* SyntaxKind.OpenBracketToken */:
                    parents = ParentsStack.push(parents, 1 /* JSONParent.Array */);
                    type = exports.TOKEN_DELIM_ARRAY;
                    lastWasColon = false;
                    break;
                case 4 /* SyntaxKind.CloseBracketToken */:
                    parents = ParentsStack.pop(parents);
                    type = exports.TOKEN_DELIM_ARRAY;
                    lastWasColon = false;
                    break;
                case 6 /* SyntaxKind.ColonToken */:
                    type = exports.TOKEN_DELIM_COLON;
                    lastWasColon = true;
                    break;
                case 5 /* SyntaxKind.CommaToken */:
                    type = exports.TOKEN_DELIM_COMMA;
                    lastWasColon = false;
                    break;
                case 8 /* SyntaxKind.TrueKeyword */:
                case 9 /* SyntaxKind.FalseKeyword */:
                    type = exports.TOKEN_VALUE_BOOLEAN;
                    lastWasColon = false;
                    break;
                case 7 /* SyntaxKind.NullKeyword */:
                    type = exports.TOKEN_VALUE_NULL;
                    lastWasColon = false;
                    break;
                case 10 /* SyntaxKind.StringLiteral */:
                    const currentParent = parents ? parents.type : 0 /* JSONParent.Object */;
                    const inArray = currentParent === 1 /* JSONParent.Array */;
                    type = lastWasColon || inArray ? exports.TOKEN_VALUE_STRING : exports.TOKEN_PROPERTY_NAME;
                    lastWasColon = false;
                    break;
                case 11 /* SyntaxKind.NumericLiteral */:
                    type = exports.TOKEN_VALUE_NUMBER;
                    lastWasColon = false;
                    break;
            }
            // comments, iff enabled
            if (comments) {
                switch (kind) {
                    case 12 /* SyntaxKind.LineCommentTrivia */:
                        type = exports.TOKEN_COMMENT_LINE;
                        break;
                    case 13 /* SyntaxKind.BlockCommentTrivia */:
                        type = exports.TOKEN_COMMENT_BLOCK;
                        break;
                }
            }
            ret.endState = new JSONState(state.getStateData(), scanner.getTokenError(), lastWasColon, parents);
            ret.tokens.push({
                startIndex: offset,
                scopes: type
            });
        }
        return ret;
    }
});
//# sourceMappingURL=tokenization.js.map