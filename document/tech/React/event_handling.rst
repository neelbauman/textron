イベント処理
================================

基本的に、Reactでのイベント処理は、標準のDOMにおけるイベント処理とよく似ている。つまるところ、イベントリスナにイベントを登録し、イベントハンドラを渡しておくということである。

| 例えば以下のHTML：

.. code-block:: html

    <button onclick="activateLasers()">
        Activate Lasers
    </button>

は、button要素にイベントリスナonclickを登録し、それに対してイベントハンドラactivateLasers()を渡しているが、これと同じ挙動は、Reactでは少し異なるように記述される。

.. code-block:: js

    <button onClick={activateLasers}>
        Activate Lasers
    </button>

両者の明確な違いは、

1. イベントリスナがキャメルケース
2. イベントハンドラが、文字列ではなく、関数オブジェクト

という点である。

| 別の違いとして、Reactでは　`false` を返してもデフォルトの動作を抑止することが出来ない。したがってイベントハンドラのなかで明示的に `preventDefault` を呼び出す必要が在る。例えばプレーンなHTMLでは、「フォームをサブミットする」というform要素のデフォルト動作を抑止するため、 **次のように書くことができる**

.. code-block:: html

    <form onsubmit="console.log('You Clicked Submit.'); return false">
     <button type="submit">Submit</button>
    </form>

イベントハンドラにJsのコードを文字列として直接書き込んでいる。これをevalして実行するわけだが、これはXSSなどの事故のもとになるのではないか？これをReactコンポーネントとしては次のように書くことになる。

.. code-block:: js

    function Form() {
        function handleSubmit(e) {
            e.preventDefault();
            console.log('You Clicked Submit.');
        }

        return (
            <form onsubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>
        );
    }

しばしばjavascriptの動作の不可解さがやり玉に挙げられるが、javascriptのことをよく理解すれば、そんな批判が全く的外れなことであるということがわかる。javascriptはデフォルトの動作として非同期プロセスを取り入れた先駆けの言語であり、それを実装するにあたって全く自然な発想にもとづいた仕様であることが、その挙動をしっかりと見つめれば分かるはずである。

.. code-block:: js

    class Toggle extends React.Component {
        constructor(props) {
            super(props);
            this.state = {isToggleOn: true};
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
            this.setState(prevState => ({
                isToggleOn: !prevState.isToggleOn
            }));
        }

        render() {
            return (
                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'ON' : 'OFF'}
                </button>
            );
        }
    }

    ReactDOM.render(
        <Toggle />,
        document.getElementById('root')
    );

constructor()のなかで**メソッドとして定義されたイベントハンドラ**をbind()することなく**イベントリスナたる非同期関数**に**コールバックとして渡してしまう**と、ハンドラがコールされたとき、ハンドラの中のthis参照がundefined参照エラーを引き起こしてしまう。
| javascriptの作られた意味や歴史を理解するとそのような挙動をを示すことは自然なことで、この挙動に文句をつける人は、 **関数コールと関数オブジェクト参照** の区別がついていない人である。
|
| この問題が、次のような記述によって解決されるということは多分に示唆的である。

.. code-block:: js

    class LoggingButton extends React.Component {
        handleClick() {
            console.log('this is:', this);
        }

        render() {
            return (
                <button onClick={() => this.handleClick()}>
                Click me
                </button>
            );
        }
    }


イベントハンドラに引数を渡す
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. code-block:: js

    <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>

    <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>

上の２行は等価であり、上ではアロー関数が、下ではFunction.prototype.bindが使用されている。（インスタンスのプロパティとプロトタイプをしっかり区別して理解すること）
