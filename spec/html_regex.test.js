var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors');
var document = require('fs')
    .readFileSync(__dirname + '/html_regex.mock.html', 'utf8');
var $ = cheerio.load(document);
var HTMLParser = require(__dirname + '/../htmlparser.class.js');

var test1 = document.substr(39, 12);
var test2 = document.substr(84, 100);
var test3 = document.substr(224, 1405);
var test4 = document.substr(1666, 104);
describe('HTML regex', function() {
    it('Should retrieve all tags, open and close.', () => {
        expect(HTMLParser.getElements(test1).length).toBe(2);
        expect(HTMLParser.getElementNames(test1).length).toBe(2);
        expect(HTMLParser.getElements(test2).length).toBe(12);
        expect(HTMLParser.getElements(test3).length).toBe(18);
        expect(HTMLParser.getElements(test4).length).toBe(12);
    });
    it('Should retrieve all tags, open an close, using filters.', () => {

    });
    it('Should retrieve only closing tags.', () => {
        expect(HTMLParser.getClosedElements(test1).length).toBe(1);
        expect(HTMLParser.getClosedElements(test2).length).toBe(6);
        expect(HTMLParser.getClosedElements(test3).length).toBe(3); 
        expect(HTMLParser.getClosedElements(test4).length).toBe(6);
    });
    it('Should retrieve only closing tags, using filters.', () => {

    });
    it('Should retrieve only open tags.', () => {
        expect(HTMLParser.getOpenElements(test1).length).toBe(1);
        expect(HTMLParser.getOpenElements(test2).length).toBe(6);
        expect(HTMLParser.getOpenElements(test3).length).toBe(15); 
        expect(HTMLParser.getOpenElements(test4).length).toBe(6);
    });
    it('Should retrieve all open tags and their offsets.', () => {

    });
});