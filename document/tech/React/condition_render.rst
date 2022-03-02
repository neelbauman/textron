条件付きレンダー
==================================

Reactでは、それぞれに必要な振る舞いをカプセル化した独立なコンポーネントを作成し、組み合わせることができる。そして、アプリケーションの状態に応じてその一部分だけを描画することができる。

| 以下の２つのコンポーネントを考える。

.. code-block:: js

    function UserGreeting(props) {
        return (
            <h1>Welcome back!</h1>
        );
    }

    function GuestGreeting(props) {
        return <h1>Please sign up.</h1>
    }

ユーザがログインしているかどうかによって、これらのコンポーネントの一方だけを表示するような動作をするコンポーネントが作れれば、データとコンポーネント構造を分離した形で書けるのでいい。このようなGreetingコンポーネントを作成する。

.. code-block:: js

    function Greeting(props) {
        const isLoggedIn = props.isLoggedIn;
        if (isLoggedIn) {
            return <UserGreeting/>;
        }
        return <GuestGreeting/>;
    }

    ReactDOM.render(
        <Greeting isLogggedIn={false}/>,
        document.getElementById('root');
    )

このようなGreetingコンポーネントは、props経由で（つまりコールされるときに渡される引数によって）render()時に情報を受け取るだけで、 **内部的に条件分岐をして** 、 **勝手に判断してレンダーするコンポーネントを勝手に決めてくれる** 。このような動作が、カプセル化のよい見本である。


要素変数
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
要素を保持しておくために変数を使うことができる。これは、出力の他の部分を変えずに、render()評価時に動的にコンポーネントの一部を変更してレンダーしたいときに役立つ。

| ログアウトとログインポタンを表す２つの新しいコンポーネントを考える。

.. code-block:: js

    function LoginButton(props) {
        return (
            <button onClick={props.onClick}>
                Login
            </button>
        );
    }

    function LogoutButton(props) {
        return (
            <button onClick={props.onClick}>
                Logout
            </button>
        );
    }

これをもとに、LoginControlというステート付きコンポーネンを作成する。LoginControlコンポーネントは、このコンポーネントの現在のstateによって<LoginButton/>、もしくは<LogoutButton/>の一方をレンダーする。

.. code-block:: js

    class LoginControl extends React.Component {
        constructor(props) {
            super(props);
            this.handleLoginClick = this.handleLoginClick.bind(this);
            this.handleLogoutClick = this.handleLogoutClick.bind(this);
            this.state = {isLoggedIn: false};
        }

        handleLoginClick() {
            this.setState({isLoggedIn: true});
        }

        handleLogoutClick() {
            this.setState({isLoggedIn: false});
        }

        render() {
            const isLoggedIn = this.state.isLoggedIn;
            let button;
            if (isLoggedIn) {
                button = <LogoutButton onClick={this.handleLogoutClick}/>;
            } else {
                button = <LoginButton onClick={this.handleLoginClick}/>;
            }
            return (
                <div>
                    <Greeting isLoggedIn={isLoggedIn}/>
                    {button}
                </div>
            );
        }
    }

    ReactDOM.render(
        <LoginControl/>,
        document.getElementById('root')
    );

インライン条件分岐
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* 論理&&演算子によるインラインif

中括弧でJSXにjsの式を埋め込むことができるという仕様を活かして、条件に応じて要素を含めたり非表示にしたりすることができる。

.. code-block:: js

    class Mailbox extends React.Component {
        constructor(props) {
            super(props);
            this.unreadMessages = props.unreadMessages;
        }

        render() {
            return (
                <div>
                    <h1>Hello!</h1>
                    {this.unreadMessages.length > 0 &&
                        <h2>
                            You have {this.unreadMessages.length} unread messages.
                        </h2>
                    }
                </div>
            );
        }
    }

    const messages = ['React', 'Re: React', 'Re:Re: React'];
    ReactDOM.render(
        <Mailbox undreadMessages={messages}/>,
        document.getElementById('root')
    );

これの動作は、bashのインライン条件分岐と似ている。つまるところ、最初に書かれた式から評価され、それがtrueであれば次の式の評価に移り、最後に評価されたものがその式の最終的な評価値となり、またfalseが出た時点で条件式全体の評価が打ち止めとなり、それ以降の式の評価は行われないのである。途中の式が **falsy** な値を返した場合、&&のあとの要素の評価はスキップされるが、falsyな値そのものは条件式全体の評価値として帰ってくるということに注意されたし。

| 以下の例では、<div>0</div>がレンダーメソッドから返される。

.. code-block:: js

    render() {
        const count = 0;
        return (
            <div>
                { count && <h1>Messages: {count}</h1>}
            </div>
        );
    }

* 条件演算子によるインラインIf-Else

条件的に要素をレンダーするもう一つの方法は、JavaScriptのcondition ? true : false条件演算子を利用することである。

以下の例では条件演算子を用いて、条件に応じてテキストの小さなブロックをレンダーする。

.. code-block:: js

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
            <div>
            The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
            </div>
        );
    }

より大きな式を用いてこの条件演算を利用することもできるが、しかし読みづらく成ってしまうことは否めない。したがって、コードの規模と可読性を考慮して適切なスタイルを選択することが重要である。　**条件が複雑になりすぎたら、コンポーネントの抽出を試みるべきタイミングであるかもしれない** ということに留意すべし。

* コンポーネントのレンダーを防ぐ

稀なケースであるが（？）、他のコンポーネントによって既にレンダーされているにも関わらずコンポーネントが自身の判断により自分のことをユーザーから隠したいということが在るかもしれない。その場合はレンダー出力の代わりににnullを返すようにすればよい。

| 次の例では、<WarningBanner/>バナーはwarnと呼ばれるプロパティの値に応じてレンダーされる。そのプロパティ値がfalseなら、コンポーネントがレンダーされることはない。

.. code-block:: js

    function WarningBanner(props) {
        if (!props.warn) {
            return null;
        }

        return (
            <div className="warnign">
            Warning!
            </div>
        );
    }

    class Page extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showWarning: true
            }
            this.handleToggleClick = this.handleToggleClick.bind(this);
        }

        handleToggleClick() {
            this.setState(state => ({
                showWarning: !state.showWarning
            }));
        }

        render() {
            return (
                <div>
                    <WarningBanner warn={this.state.showWarning} />
                    <button onClick={this.handleToggleClick}>
                    {this.state.showWarning ? 'Hide' : 'Show'}
                    </button>
                </div>
            );
        }
    }

    ReactDOM.render(
        <Page/>,
        document.getElementById('root')
    );
