var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NameForm = function (_React$Component) {
  _inherits(NameForm, _React$Component);

  function NameForm(props) {
    _classCallCheck(this, NameForm);

    var _this = _possibleConstructorReturn(this, (NameForm.__proto__ || Object.getPrototypeOf(NameForm)).call(this, props));

    _this.state = { value: '' };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(NameForm, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ value: event.target.value });
      // eventで取り込まれたデータやその変更を必ずReactコンポーネントのstateに保持することで、プログラム上で扱いやすくなる。
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'label',
          null,
          'Name:',
          React.createElement('input', { type: 'text', onChange: this.handleChange, value: this.state.value })
        ),
        React.createElement('input', { type: 'submit', value: 'Submit' })
      );
    }
  }]);

  return NameForm;
}(React.Component);

var EssayForm = function (_React$Component2) {
  _inherits(EssayForm, _React$Component2);

  function EssayForm(props) {
    _classCallCheck(this, EssayForm);

    var _this2 = _possibleConstructorReturn(this, (EssayForm.__proto__ || Object.getPrototypeOf(EssayForm)).call(this, props));

    _this2.state = {
      value: 'Please write and essay about your favorite DOM element.'
    };

    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
    return _this2;
  }

  _createClass(EssayForm, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ value: event.target.value });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      alert('An essay was submitted: ' + this.state.value);
      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'label',
          null,
          'Essay:',
          React.createElement('textarea', { value: this.state.value, onChange: this.handleChange })
        ),
        React.createElement('input', { type: 'submit', value: 'Submit' })
      );
    }
  }]);

  return EssayForm;
}(React.Component);

var FlavorForm = function (_React$Component3) {
  _inherits(FlavorForm, _React$Component3);

  function FlavorForm(props) {
    _classCallCheck(this, FlavorForm);

    var _this3 = _possibleConstructorReturn(this, (FlavorForm.__proto__ || Object.getPrototypeOf(FlavorForm)).call(this, props));

    _this3.state = { value: 'coconut' };
    // thisはオブジェクトを参照する。
    // 問題はそのオブジェクトが何になるかという話。
    // constructorのthisはオブジェクトにbindされている。
    // （というか多分、constructorはnewからコールされる）
    // したがってまずはプロパティ参照。
    // 次の深さで、プロトタイプ参照。
    // したがって、プロトタイプ参照でバインドしたメソッドをオプジェクトのプロパティに入れて、スコープを上書きする。
    _this3.handleChange = _this3.handleChange.bind(_this3);
    _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
    return _this3;
  }

  _createClass(FlavorForm, [{
    key: 'handleChange',
    value: function handleChange(event) {
      // メソッドというのは、単なるプロトタイプ作成のシュガーシンタックスである。
      // JavaScriptの本質は、スコープ、プリミティブ型、オブジェクト、コーラブルなオブジェクトとしての関数、そしてそれらのプロトタイピングで尽きている。
      // したがってメソッドというのは、プロトタイプのメンバーとして関数を付け加える、ということを意味するだけである。
      // したがってメソッドは、普通の関数と同じ。コールスタックに積まれた時にどこからコールされたのかによってthisの中身が動的に決まる。したがって、メソッド定義時のthisは関数定義時のthisと同様に素直にundefinedである。
      this.setState({ value: event.target.value });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      alert('Your favorite flavor is: ' + this.state.value);
      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      // render()は、ReactDOM.render()の中でコールされるので、（おそらく）constructorにおけるthisと同じ理由でバインドされている。Reactのコンポーネントで、コード上でコールされるのはconstructorとrenderであると考えてよいのではないか。
      return (
        // このhandelSubmitは参照でイベントリスナに渡されているだけで、コールされているわけではない。したがってこれは、プロトタイプに定義されている関数の参照渡しであり、これがコールされるのはthisの上ではなく、コールスタックがきれいに成ったあとの、this参照とは遠く切り離されたコンテキストにおいてである。したがってthis.handleSubmitの中のthisはundefinedのままコールされることになる。
        // これがデフォルトの挙動。
        // ところが、constructorにおいてプロパティで上書きしたから、この参照はundefinedのプロトタイプ参照ではなく、bindされたプロパティ参照となる。これにより、参照のみでthisがbindされることになり、我々の望む挙動が得られる。
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'label',
            null,
            'Pick your favorite flavor:',
            React.createElement(
              'select',
              { value: this.state.value, onChange: this.handleChange },
              React.createElement(
                'option',
                { value: 'grapefruit' },
                'Grapefruit'
              ),
              React.createElement(
                'option',
                { value: 'lime' },
                'Lime'
              ),
              React.createElement(
                'option',
                { value: 'coconut' },
                'Coconut'
              ),
              React.createElement(
                'option',
                { value: 'mango' },
                'Mango'
              )
            )
          ),
          React.createElement('input', { type: 'submit', value: 'submit' })
        )
      );
    }
  }]);

  return FlavorForm;
}(React.Component);

var Page = function (_React$Component4) {
  _inherits(Page, _React$Component4);

  function Page(props) {
    _classCallCheck(this, Page);

    return _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, props));
  }

  _createClass(Page, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        'input type="text"\u8981\u7D20\u306E\u4F8B\uFF1A',
        React.createElement(
          'p',
          null,
          React.createElement(NameForm, null)
        ),
        'textarea\u8981\u7D20\u306E\u4F8B\uFF1A',
        React.createElement(
          'p',
          null,
          React.createElement(EssayForm, null)
        ),
        'select\u8981\u7D20\u306E\u4F8B\uFF1A',
        React.createElement(
          'p',
          null,
          React.createElement(FlavorForm, null)
        )
      );
    }
  }]);

  return Page;
}(React.Component);

ReactDOM.render(React.createElement(Page, null), document.getElementById('root'));