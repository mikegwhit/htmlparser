/**
 * @class HTMLParser is a static container for parsing HTML documents.  Use
 * tested regex to get HTML elements via a string.  Turn HTML into JSON.
 */
class HTMLParser {
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
        for (let element of HTMLParser.getElements(html)) {
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
     * For some HTML String, rebuilds the 
     * @param {String} htmlString The HTML document from which to build the path.
     * @param {Number} offset The offset from which to get the path.
     * @return {String} A path string.
     */
    static rebuildNode(htmlString, offset) {
        let substr = htmlString.substr(0, offset);
        let precedingElements = HTMLParser.getElements(substr);
        if (precedingElements.length > 0) {
            precedingElements = precedingElements.reverse();
        } else {
            precedingElements = [];
        }
        let closedElements = HTMLParser.getClosedElements(substr);
        if (closedElements.length > 0) {
            closedElements = closedElements.reverse();
        } else {
            closedElements = [];
        }
        
        // used in determining the nth number element
        let idx = {};
        // used in culling operations
        let closedStack = [];
        // used in determining the idx state of the closed element
        let currentClosedElement = 0;
        // the path array, rebuilt before returning
        let path = [];
        // the current element, just the name
        let element;
        // is the element tag closing
        let isClosing = false;
        // the number of closed elements between additions
        let closingElements = 0;
        for (let i = 0; i < precedingElements.length; i++) {
            element = HTMLParser.getElementNames(precedingElements[i])[0];
            isClosing = HTMLParser.getClosedElements(precedingElements[i])
                .length > 0;
            if (element == '!--' || 
                element == '!DOCTYPE') {
                // get those DOCTYPE's!
                continue;
            } else if (element == 'br' || 
                element == 'img' || 
                element == 'link' || 
                element == 'input' || 
                element == 'meta') {
                // get those self closers!  if we don't get them, this breaks everything!
                continue;
            } else if (precedingElements[i] == closedElements[currentClosedElement]) {
                // begin skip!  not part of our path
                currentClosedElement++; // bump!
                closedStack.push(element);
                closingElements++; // no longer adding for the moment
                continue;
            } else if (!isClosing && 
                element == closedStack[closedStack.length - 1]) {
                closedStack.pop();
                if (!idx[element]) {
                    idx[element] = 1;
                }
                if (closingElements == 1) {
                    idx[element]++; // adding to our idx of our next add
                }   
                closingElements--;
                continue;
            } else if (closingElements > 0) {
                continue;
            } else {
                // add to our path
                let identifier = '';
                if (closingElements > 0) {
                    console.warn('Currently closing elements, shouldn\'t be adding?');
                }
                try {
                    identifier = '';
                    precedingElements[i].classList.forEach((className) => {
                        identifier += '.' + className;
                    });
                } catch(e) {}
                if (!idx[element]) {
                    idx[element] = 1;
                }
                if (path.length > 0 &&
                    idx[path[path.length - 1].element]) {
                    path[path.length - 1].idx = 
                        idx[path[path.length - 1].element];
                }
                path.push({
                    element: element,
                    idx: 1,
                    identifier: identifier
                });
                idx = {};
            }
        }

        if (path.length == 0) {
            return '*';
        }
        
        return path.reverse().reduce((str, cur, idx) => {
            if (idx > 0) {
                str += '>';
            }
            if (cur.idx > 1) {
                str += cur.element + ':nth-of-type(' + cur.idx + ')';
            } else {
                str += cur.element + ':nth-of-type(1)';
            }
            return str;
        }, '');
    }
}

if (typeof module != 'undefined' && module.exports) {
    module.exports = HTMLParser;
}