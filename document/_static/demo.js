var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reactの基本的な概念構成の例
function formatName(user) {
  if (user) {
    return user.lastName + ' ' + user.firstName;
  }
  return 'Stranger';
}

var user = {
  firstName: '裕一郎',
  lastName: '野口'
};

var element = React.createElement(
  'h1',
  null,
  '\u3053\u3093\u306B\u3061\u306F, ',
  formatName(user),
  '\u3055\u3093\uFF01'
);

// 初めてのクラスコンポーネント定義

var Welcome = function (_React$Component) {
  _inherits(Welcome, _React$Component);

  function Welcome() {
    _classCallCheck(this, Welcome);

    return _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).apply(this, arguments));
  }

  _createClass(Welcome, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'h1',
        null,
        'Hello, ',
        this.props.name
      );
    }
  }]);

  return Welcome;
}(React.Component);

// 複合コンポーネント


var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(Welcome, { name: '\u88D5\u4E00\u90CE' }),
        element
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('hello'));

// clockのカプセル化の実習

var Clock = function (_React$Component3) {
  _inherits(Clock, _React$Component3);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this3 = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));
    // Clockインスタンス作成時に起動する処理を記述する
    // クラスのコンポーネントは常にpropsを引数として親クラスのコンストラクタを呼び出す必要がある。これで再帰的に上位クラスのインスタンスとしての機能を引き継ぐ


    _this3.state = { date: new Date() };
    return _this3;
  }

  // クラスのライフサイクルメソッドを記述する


  _createClass(Clock, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      this.timerID = setInterval(function () {
        return _this4.tick();
      }, 1000);
      // setIntervalは、副作用を持つブラウザ組み込み関数である。
      // それは関数としてはタイマーIDを返す関数である。
      // そのコールバックが副作用として発生するが、しかるにそれが本命であったりするのがコールバックの難しいところである。
      // タイマーIDをインスタンス自身のプロパティとして格納したこと。
      // これがカプセル化の肝だったりする。
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.timerID);
    }
  }, {
    key: 'tick',
    value: function tick() {
      this.setState({
        date: new Date()
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Hello, world!'
        ),
        React.createElement(
          'h2',
          null,
          'it is ',
          this.state.date.toLocaleTimeString(),
          '.'
        )
      );
    }
  }]);

  return Clock;
}(React.Component);

ReactDOM.render(React.createElement(Clock, null), document.getElementById('clock'));