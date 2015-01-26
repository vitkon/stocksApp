/** @jsx React.DOM */
(function () {
    'use strict';

    var React = require('react');

    var StockTicker = React.createClass({
        getInitialState: function() {
            return {
                quote: {
                    Name: '',
                    LastTradePriceOnly: '0.00',
                    Change: '0.00',
                    ChangeinPercent: '0.00'
                },
                direction: ''
            };
        },

        getDefaultProps: function () {
            return {
                symbol: '',
                refresh: 5000
            };
        },

        getQuote: function () {
            var script = document.createElement('script'),
                self = this,
                cbName= 'fn' + Date.now() + Math.floor(Math.random() * 100);

            script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + self.props.symbol + '%22)%0A%09%09&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=' + cbName;
            document.body.appendChild(script);

            window[cbName] = function (response) {
                console.log(response, 'tick', cbName);
                var direction = (response.query.results.quote.Change[0] == '+') ? 'up' : 'down';
                self.setState({
                    quote: response.query.results.quote,
                    direction: direction
                });
                delete window[cbName];
            };

        },

        componentDidMount: function () {
            var interval;
            this.getQuote();
            interval = setInterval(this.getQuote, this.props.refresh);
        },

        render: function() {
            return (
                <div className="ticker">
                    <div className="ticker__symbol">{this.props.symbol}</div>
                    <div className="ticker__company">{this.state.quote.Name}</div>
                    <div className="ticker__price">{this.state.quote.LastTradePriceOnly}</div>
                    <div className="ticker__change">
                        Prev close:
                        <div className={'ticker__change-value ticker__change-value--' + this.state.direction}>{this.state.quote.Change + ' (' + this.state.quote.ChangeinPercent + ')'}</div>
                    </div>
                </div>
            );
        }
    });


    module.exports = StockTicker;
}());