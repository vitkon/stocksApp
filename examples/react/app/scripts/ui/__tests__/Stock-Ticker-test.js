/** @jsx React.DOM */

jest.dontMock('../StockTicker');

describe('StockTicker', function () {
    var StockTicker = require('../StockTicker');
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var ticker = null;

    beforeEach(function () {
        ticker = TestUtils.renderIntoDocument(<StockTicker symbol="AAPL"/>);
    });

    it('has all the required methods', function () {
        expect(ticker.getQuote).toBeDefined();
        expect(ticker.state.quote).toBeDefined();
    });

});

