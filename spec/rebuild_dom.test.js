var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors');
var document = require('fs')
    .readFileSync(__dirname + '/rebuild_dom.mock.html', 'utf8');
var $ = cheerio.load(document);
var rebuildNode = require(__dirname + '/../htmlparser.class.js').rebuildNode;

describe('Rebuild DOM function', () => {
    it('Should build a path on the DOM with no children.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 72))
            .text()).toBe('Hello World!');
    });
    it('Should ignore previous sibling tags.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 177))
            .text()).toBe('Hello USA!');
    });
    it('Should cull previous sibling tags with children.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 249))
            .text()).toBe('Hello Brazil!');
    });
    it('Should ignore tags that are self closing and HTML comments.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 387))
            .text()).toBe('Hello Russia!');
    });
    it('Should not care if element path has children.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 578))
            .text().trim()).toBe('Hello UK!');
    });
    it('Should be capable of selecting inside an element\'s ' + 
        'properties.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 751))
            .text().trim()).toBe('link');
    });
    it('Should properly read the nth-child case.', () => {
        expect(cheerioAdv.find($, rebuildNode(document, 826))
            .text().trim()).toBe('2');
    });
    it('Should return when a document has no nodes.', () => {
        expect(cheerioAdv.find(cheerio.load('<div>text</div>'), 
            rebuildNode('text', 0))
            .text().trim()).toBe('text');
    });
});