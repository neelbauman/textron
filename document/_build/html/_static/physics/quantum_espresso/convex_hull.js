var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PressureInputForm = function (_React$Component) {
  _inherits(PressureInputForm, _React$Component);

  function PressureInputForm() {
    _classCallCheck(this, PressureInputForm);

    return _possibleConstructorReturn(this, (PressureInputForm.__proto__ || Object.getPrototypeOf(PressureInputForm)).apply(this, arguments));
  }

  _createClass(PressureInputForm, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        null,
        React.createElement("input", { type: "text" }),
        React.createElement("input", { type: "submit", value: "\u5B9F\u884C" })
      );
    }
  }]);

  return PressureInputForm;
}(React.Component);

ReactDOM.render(React.createElement(PressureInputForm, null), document.getElementById('input'));

function tick() {
  var element = React.createElement(
    "div",
    { id: "timer" },
    React.createElement(
      "h3",
      null,
      "It is ",
      new Date().toLocaleTimeString(),
      "."
    )
  );
  ReactDOM.render(element, document.getElementById('timer'));
}

setInterval(tick, 1000);