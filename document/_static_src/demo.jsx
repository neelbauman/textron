// Reactの基本的な概念構成の例
function formatName(user) {
  if (user) {
    return user.lastName+ ' ' + user.firstName;
  }
  return 'Stranger'
}

const user = {
  firstName: '裕一郎',
  lastName: '野口',
}

const element = (
  <h1>
    こんにちは, {formatName(user)}さん！
  </h1>
)

// 初めてのクラスコンポーネント定義
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}

// 複合コンポーネント
class App extends React.Component {
  render () {
    return (
      <div>
        <Welcome name="裕一郎"/>
        {element}
      </div>
    )
  };
}

ReactDOM.render(
  <App />,
  document.getElementById('hello')
)


// clockのカプセル化の実習
class Clock extends React.Component {
  constructor(props) {
    // Clockインスタンス作成時に起動する処理を記述する
    // クラスのコンポーネントは常にpropsを引数として親クラスのコンストラクタを呼び出す必要がある。これで再帰的に上位クラスのインスタンスとしての機能を引き継ぐ
    super(props);
    this.state = {date: new Date()};
  }

  // クラスのライフサイクルメソッドを記述する
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    // setIntervalは、副作用を持つブラウザ組み込み関数である。
    // それは関数としてはタイマーIDを返す関数である。
    // そのコールバックが副作用として発生するが、しかるにそれが本命であったりするのがコールバックの難しいところである。
    // タイマーIDをインスタンス自身のプロパティとして格納したこと。
    // これがカプセル化の肝だったりする。
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>it is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}


ReactDOM.render(
  <Clock></Clock>,
  document.getElementById('clock')
)
