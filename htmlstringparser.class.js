/**
 * @class HTMLStringParser is a static container for parsing HTML documents.  Use
 * tested regex to get HTML elements via a string.  Turn HTML into JSON.
 */
class HTMLStringParser {
    /**
     * @param {HTMLELement|String} html The HTML to be parsed.
     */
    constructor(html) {
        this.html = html;
    }

    /** 
     * Gets all the closed elements from an HTML string.
     * @param {String} html An HTML string.
     */
    static getClosedElements(html) {
        return html.match(/\<\s?([/][^>\n<]+?)\>/g) || [];
    }

    /**
     * Gets all open and closing elements from an HTML string.
     * @param {String} html An HTML string.
     * @return {Array} An array of elements in the HTML string.
     */
    static getElements(html) {
        return html.match(/\<([^>\n<]*[a-zA-Z0-9_\-])\>?/g) || [];
    }

    /**
     * Gets all open and closing elements from an HTML string.
     * @param {String} html An HTML string.
     * @return {Array} An array of elements in the HTML string.
     */
    static getElementNames(html) {
        let elements = [];
        for (let element of HTMLStringParser.getElements(html)) {
            elements.push(element.match(/^\<\s*\/*\s*([^\s>]+)\>*?/)[1]);
        }
        return elements;
    }
 
    /**
     * Gets all the open elements from an HTML string.
     * @param {String} html An HTML string.
     */
    static getOpenElements(html) {
        return html.match(/\<[^\n\/]*[^\/\s][^\n\/]*([^>\n<]+)\/?\s*\>/g) || [];
    }

    /**
     * Gets all the closed elements from an HTML string.
     * @param {String} html An HTML string.
     */
    static getSelfClosingElements(html) {
        return html.match(/\<\s?([/].+?)\>/g) || [];
    }

    /**
     * @see HTMLStringParser.getElementNames
     * @returns {Boolean} True if the element name is a comment.
     */
    static isComment(element) {
        return element == '!--';
    }

    /**
     * @see HTMLStringParser.getElementNames
     * @returns {Boolean} True if the element name is a self-closer.
     */
    static isSelfClosing(element) {
        return element == 'br' || 
               element == 'img' || 
               element == 'link' || 
               element == 'input' || 
               element == 'meta';
    }

    /**
     * @see HTMLStringParser.getElementNames
     * @returns {Boolean} True if the element name is a DOCTYPE or other.
     */
    static isSpecial(element) {
        return element == '!DOCTYPE';
    }

    /**
     * Given a set of tokens, generates an nth-child HTML selector.
     */
    static path(tokens) {
        if (tokens.length == 0) {
            return '*';
            // throw new Error('HTMLStringParser.path No path found!');
        }
        
        return tokens.reverse().reduce((str, cur, idx) => {
            if (idx > 0) {
                str += '>';
            }
            if (cur.index > 1) {
                str += cur.name + ':nth-of-type(' + cur.index + ')';
            } else {
                str += cur.name + ':nth-of-type(1)';
            }
            return str;
        }, '');
    }
    
    /**
     * For some HTML String and an offset, rebuilds the path and returns a 
     * CSS selector.
     * @param {String} htmlString The HTML document from which to build the 
     * path.
     * @param {Number} offset The offset from which to get the path.
     * @return {String} An :nth-child CSS selector.
     */
    static selector(html, offset) {
        let tokens = HTMLStringParser.tokenize(html.substr(0, offset));
        // The path array, rebuilt before returning.
        let pathTokens = [];
        // The current element object.
        let element;
        // The next element to be stored.
        let nextElement = null;
        // The next token, used for culling irrelevant trees.
        let nextToken = -1;
        for (let token in tokens) {
            element = tokens[token];
            if (element.ignore) {
                continue;
            } else if (element.isClosed || nextToken >= 0) {
                let idx;
                let stack = [];
                stack.push(element.name);
                if (nextToken == -1) {
                    tokens.slice(parseInt(token) + 1).find((element, index) => {
                        if (element.isClosed) {
                            stack.push(element.name);
                        }
                        if (!element.isClosed && nextElement && element.name == 
                            nextElement.name && stack.length == 1) {
                            // Bump index for nth-child selector.
                            nextElement.index++;
                        }
                        if (!element.isClosed && 
                            element.name == stack[stack.length - 1]) {
                            stack.pop();
                        }
                        idx = index;
                        return stack.length == 0;
                    });
                    
                    nextToken = parseInt(token) + 1 + idx;
                }
                
                if (token == nextToken) {
                    nextToken = -1; // Terminate.
                }
                continue;
            } else {
                if (nextElement != null) {
                    // Add to path.
                    pathTokens.push(nextElement);
                    nextElement = null;
                }
                nextElement = element;
                // Add index for nth-child selector.
                nextElement.index = 1;
            }
        }
        
        return HTMLStringParser.path(pathTokens);
    }

    /**
     * Tokenizes an HTML String into its partials.
     * @param {String} html The HTML string to tokenize.
     */
    static tokenize(html) {
        const tokens = [];
        let elements = HTMLStringParser.getElements(html);
        if (elements.length > 0) {
            elements = elements.reverse();
        } else {
            elements = [];
        }
        let closedElements = HTMLStringParser.getClosedElements(html);
        if (closedElements.length > 0) {
            closedElements = closedElements.reverse();
        } else {
            closedElements = [];
        }

        return elements.map((element) => {
            const obj = {};
            obj.isClosed = HTMLStringParser.getClosedElements(element).length > 0;
            obj.name = HTMLStringParser.getElementNames(element)[0];
            obj.element = element;
            
            obj.ignore = HTMLStringParser.isComment(obj.name) ||
                HTMLStringParser.isSpecial(obj.name) ||
                HTMLStringParser.isSelfClosing(obj.name);
            return obj;
        });
    }
}

if (typeof module != 'undefined' && module.exports) {
    module.exports = HTMLStringParser;
}