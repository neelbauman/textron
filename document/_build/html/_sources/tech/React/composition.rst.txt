コンポジション vs 継承
===========================================

Reactは強力なコンポジションモデルを備えており、コンポーネント間のコードの再利用には継承よりもコンポジションを推奨している。

Containment（子要素の出力）
--------------------------------------------
コンポーネントの中には、事前にはその子要素を知らず、他のコンポーネントとともにレンダーされるときに動的に中身を決定したいようなコンポーネントもあるときがある。それはフレーム的な役割を果たすコンポーネントではよく使われるコンセプトである。

| このようなコンポーネントでは、childrenという特別なpropsを使い、JSXのネストによって他のコンポーネントから渡された任意の子要素を出力することができる。

.. code-block:: jsx

    function FancyBorder(props) {
        return (
            <div className={'FancyBorder FancyBorder-' + props.color}>
                {props.children}
            </div>
        );
    }
    // このコンポーネントは子コンポーネントになる。

これにより他のコンポーネントからJSXをネストすることで任意の子要素を渡すことができる。

.. code-block:: jsx

    function WelcomeDialog() {
        return (
            <FancyBorder color="blue">
                <h1 className="Dialog-title">
                    Welcome
                </h1>
                <p className="Dialog-message">
                    Thank you for visiting our spacecraft!
                </p>
            </FancyBorder>
        );
    }
    // これはFancyBorderの親コンポーネント。ところでこれは独自のHTML要素を持たないので、HTMLの階層構造に寄与するのはこれの子要素。

<FancyBorder>JSXタグの内側のあらゆる要素は、FancyBorderにchildrenというpropsとして渡される。FancyBorderは<div>の内側に{props.children}をレンダーするので、渡された要素が出力される。

あまり一般的ではないが、複数の箇所に子要素を追加したいケースも考えられる。そのようなケースでは以下のようにchildrenのpropsの代わりに独自のpropsを作成して渡すこともできる。

.. code-block:: jsx

    function SplitPane(props) {
        return (
            <div className="SplitPane">
                <div className="SplitPane-left">
                    {props.left}
                </div>
                <div className="SplitPane-right">
                    {props.right}
                    </div>
                </div>
            </div>
        );
    }

    function App() {
        return (
            <SplitPane
                left={
                    <Contacts />
                }
                right={
                    <Chat />
                } />
        );
    }
    // Appが親、SplitPaneが子。基本的には子要素がHTMLをもって前面に出つつ、propsからデータをもらってHTMLをレンダリングする。
    // したがってこれは、親要素に値を渡して”値を含ませる”ことができる。

<Constacts />や<Chat />のようなReactの要素はただのオブジェクトなので、他のあらゆるデータと同様にpropsとして渡すことができる。したがって、このように、親から専門の値を渡すことで子にContainmentさせたりSpecializationさせたりして、一般的な性能を持つ親からより固有性を高めたコンポーネントを子コンポーネントとして作成することができる。

特化したコンポーネント（Specialization)
-------------------------------------------------------------
コンポーネントを他のコンポーネントの”特別なケース”として考えることがある。例えばWelcomeDialogはDialogの特別なケースと言える。

Reactではこれもコンポジションで実現できる。汎用的なコンポーネントにpropsを渡して設定することで、より特化したコンポーネントを作成することができる。

.. code-block:: jsx

    function Dialog(props) {
        return (
            <FancyBorder color="blue">
                <h1 className="Dialog-title">
                    {props.title}
                </h1>
                <p className="Dialog-message">
                    {props.message}
                </p>
            </FancyBorder>
        );
    }

    function WelcomeDialog() {
        return (
            <Dialog
                title="Welcome"
                message="Thank you for visiting our spacecraft!"/>
        );
    }

コンポジションはクラスとして定義されたコンポーネントでも同じように動作する。

.. code-block:: jsx

    // 汎用的なコンポーネント。子要素として、コンポジションによってデータフローの文脈に応じて専門化されて階層構造の上位に来る。
    // コンポーネントの専門性とは、データのことである。そしてデータはReactコンポーネントの階層構造を単方向データフローに沿って流れていく。したがって、専門的なデータを保有し、それの発生源となるコンポーネントが専門的なコンポーネントと呼ばれるべきで、その専門性に応じた名前を付けられるべきである。
    // したがってコンポーネントというのはデータフローによって特徴づけられるべきである。単方向データフローというものがあって、またHTMLの階層構造というものがあって、それら２つを統合するReactコンポーネントの階層構造は、renderの親子関係によって順序付けられる。子コンポーネントは親コンポーネントよりも専門的である。なぜならデータフローがそうだから。
    // ただし、それはコンポジションにおいては成り立たない。コンポジションとは、専門的な親の上の子である。

    function Dialog(props) {
        return (
            <FancyBorder color="blue">
                <h1 className="Dialog-title">
                    {props.title}
                </h1>
                <p className="Dialog-message">
                    {props.message}
                </p>
                {props.children}

            </FancyBorder>
        );
    }

    class SingUpDialog extends React.Component {
        constructor(props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.handleSignUp = this.handleSignUp.bind(this);
            this.state = {login: ''};
        }

        render() {
            return (
                <Dialog title="Mars Exploration Program"
                message="How should we refer to you?">
            )
        }

        handleChange(e) {
            this.setState({login: e.target.value});
        }

        handleSignUp() {
            alert('Welcome aboard, ${this.state.login}!');
        }
    }

継承はどうなの？
-------------------------------------------
コンポーネントのプロトタイプ継承による階層構造が推奨されるケースは、たとえばFacebookで用いられている何千というコンポーネントでは全く見つかっていない。

| propsとコンポジションにより、コンポーネントの見た目とふるまいを明示的かつ安全にカスタマイズするのに十分な柔軟性が得られるはずである。コンポーネントはどのようなpropsでも受け付けることができ、それはプリミティブ値でも、React要素でも、あるいは関数であってもよい、ということに留意すべし。

| コンポーネント間で非UI機能を再利用したい場合は、それを別のJavaScriptモジュールに抽出することを推奨する。コンポーネントはその関数やオブジェクト、クラスなどを継承することなく、それをインポートすることで使用することができるだろう。



- スーツに合う腕時計
- 盤面が大きすぎず
- バンドも太すぎない
- かっこいい感じではない
- ベルトは革でないほうがいい
- 普段遣いに合わせられればいい。
- さりげない感じ
