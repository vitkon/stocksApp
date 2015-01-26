/** @jsx React.DOM */
(function() {
    'use strict';
    var React = window.React = require('react'),
        StockTicker = require("./ui/StockTicker"),
        mountNode = document.getElementById("app");


    var StocksApp = React.createClass({
        // getInitialState: function() {
        //     return {
        //         items: [],
        //         text: ''
        //     };
        // },
        // onChange: function(e) {
        //     this.setState({
        //         text: e.target.value
        //     });
        // },
        // handleSubmit: function(e) {
        //     e.preventDefault();
        //     var nextItems = this.state.items.concat([this.state.text]);
        //     var nextText = '';
        //     this.setState({
        //         items: nextItems,
        //         text: nextText
        //     });
        // },
        render: function() {
            return (
                <div>
                    <h3>Stocks app</h3>
                    <StockTicker symbol="AAPL" />
                    <StockTicker symbol="GOOG" />
                </div>
            );
        }
    });


    React.render(<StocksApp /> , mountNode);
}());