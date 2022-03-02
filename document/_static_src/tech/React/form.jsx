class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // eventで取り込まれたデータやその変更を必ずReactコンポーネントのstateに保持することで、プログラム上で扱いやすくなる。
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" onChange={this.handleChange} value={this.state.value} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write and essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};
    // thisはオブジェクトを参照する。
    // 問題はそのオブジェクトが何になるかという話。
    // constructorのthisはオブジェクトにbindされている。
    // （というか多分、constructorはnewからコールされる）
    // したがってまずはプロパティ参照。
    // 次の深さで、プロトタイプ参照。
    // したがって、プロトタイプ参照でバインドしたメソッドをオプジェクトのプロパティに入れて、スコープを上書きする。
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // メソッドというのは、単なるプロトタイプ作成のシュガーシンタックスである。
    // JavaScriptの本質は、スコープ、プリミティブ型、オブジェクト、コーラブルなオブジェクトとしての関数、そしてそれらのプロトタイピングで尽きている。
    // したがってメソッドというのは、プロトタイプのメンバーとして関数を付け加える、ということを意味するだけである。
    // したがってメソッドは、普通の関数と同じ。コールスタックに積まれた時にどこからコールされたのかによってthisの中身が動的に決まる。したがって、メソッド定義時のthisは関数定義時のthisと同様に素直にundefinedである。
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    // render()は、ReactDOM.render()の中でコールされるので、（おそらく）constructorにおけるthisと同じ理由でバインドされている。Reactのコンポーネントで、コード上でコールされるのはconstructorとrenderであると考えてよいのではないか。
    return (
      // このhandelSubmitは参照でイベントリスナに渡されているだけで、コールされているわけではない。したがってこれは、プロトタイプに定義されている関数の参照渡しであり、これがコールされるのはthisの上ではなく、コールスタックがきれいに成ったあとの、this参照とは遠く切り離されたコンテキストにおいてである。したがってthis.handleSubmitの中のthisはundefinedのままコールされることになる。
      // これがデフォルトの挙動。
      // ところが、constructorにおいてプロパティで上書きしたから、この参照はundefinedのプロトタイプ参照ではなく、bindされたプロパティ参照となる。これにより、参照のみでthisがbindされることになり、我々の望む挙動が得られる。
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="submit"></input>
      </form>
    )
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      input type="text"要素の例：
      <p><NameForm /></p>
      textarea要素の例：
      <p><EssayForm /></p>
      select要素の例：
      <p><FlavorForm /></p>
    </div>
  )};
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
