var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors');
var document = require('fs')
    .readFileSync(__dirname + '/html_regex.mock.html', 'utf8');
var $ = cheerio.load(document);
var HTMLStringParser = require(__dirname + '/../htmlstringparser.class.js');

var test1 = document.substr(39, 12);
var test2 = document.substr(84, 100);
var test3 = document.substr(224, 1405);
var test4 = document.substr(1666, 104);
var test5 = document.substr(1808, 4);
describe('HTML regex', function() {
    it('Should retrieve all tags, open and close.', () => {
        expect(HTMLStringParser.getElements(test1).length).toBe(2);
        expect(HTMLStringParser.getElementNames(test1).length).toBe(2);
        expect(HTMLStringParser.getElements(test2).length).toBe(12);
        expect(HTMLStringParser.getElements(test3).length).toBe(18);
        expect(HTMLStringParser.getElements(test4).length).toBe(12);
        expect(HTMLStringParser.getElements(test5).length).toBe(0);
    });
    it('Should retrieve all tags, open an close, using filters.', () => {

    });
    it('Should retrieve only closing tags.', () => {
        expect(HTMLStringParser.getClosedElements(test1).length).toBe(1);
        expect(HTMLStringParser.getClosedElements(test2).length).toBe(6);
        expect(HTMLStringParser.getClosedElements(test3).length).toBe(3); 
        expect(HTMLStringParser.getClosedElements(test4).length).toBe(6);
        expect(HTMLStringParser.getClosedElements(test5).length).toBe(0);
    });
    it('Should retrieve only closing tags, using filters.', () => {

    });
    it('Should retrieve only open tags.', () => {
        expect(HTMLStringParser.getOpenElements(test1).length).toBe(1);
        expect(HTMLStringParser.getOpenElements(test2).length).toBe(6);
        expect(HTMLStringParser.getOpenElements(test3).length).toBe(15); 
        expect(HTMLStringParser.getOpenElements(test4).length).toBe(6);
        expect(HTMLStringParser.getOpenElements(test5).length).toBe(0);
    });
    it('Should retrieve all open tags and their offsets.', () => {

    });
});