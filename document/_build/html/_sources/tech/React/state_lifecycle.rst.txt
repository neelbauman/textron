ComponentのStateとライフサイクル
===============================================

動作の適切なコンポーネント化についてのまとめ

`stateとライフサイクル <https://ja.reactjs.org/docs/state-and-lifecycle.html>`_

1. <Clock/>がReactDOM.render()に渡されると、ReactはClockコンポーネントのインスタンスを作成し、続いてそのインスタンスからコンストラクタを呼び出す。するとインスタンスの初期化処理がなされる。

2. ReactはClockコンポーネントのrender()メソッドを呼び出す。するとReactは仮想ReactDOMを作成し、現在のDOMと比較してレンダー出力を差分更新する。

3. Clockの出力がDOMに挿入される（即ちマウントされる）と、Reactはライフサイクルメソッドの一つであるところのcomponentDidMount()を呼び出す。

4. componentDidMountのなかでtick()メソッドを呼び出すためのタイマーを設定するようにブラウザに要求する。

5. するとブラウザが毎秒ごとに、Clockインスタンスのtick()メソッドを呼び出すようになり、したがって毎秒setState()を、呼び出しの現在時刻を含んだオブジェクトを引数として呼び出すことで、UIの更新をスケジュールする。

6. Reactは、stateが更新されたということを知るので、render()メソッドを再度コールし、更新されたstateに基づいて仮想DOMを生成、現在のDOMと差分更新する。また、ClockコンポーネントがDOMから削除されることがあれば、ReactによりcomponentWillUnmount()メソッドが呼び出され、ブラウザに指定されたIDのタイマーを停止、削除するように求める。

以上のような一連の流れをしっかりと把握して、厳密な意味でのカプセル化をなさなければならない。抽象的な振る舞いをしっかりと定めた上で、それを実装するということ。それが設計である。

stateを正しく使用する
-----------------------------------------
setState()とstateプロパティの仕様について初学者が抑えておくべき３つの事項について記述する

stateを直接更新、変更しないこと。
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
例えばsetIntervalでstate更新のためのメソッドを呼び出すためのタイマーをセットしたとして、そのメソッドの中に以下のようなコードを書いたのではコンポーネントの再レンダリングはされない。

.. code-block:: javascript

    this.state.comment = 'Hello';

そうではなく、Reactにstateの更新が行われたことを通知するという *副作用をもたせる* ためには、setState()メソッドを使わなければならない。

.. code-block:: javascript

    this.setState({comment: 'Hello'});

this.stateの更新はこのようにして行われるが、this.stateの初期化はconstructer()メソッドの中でthis.stateに対する直接代入により行われ、またthis.stateに対する直接代入が行われて良いのはconstructer()メソッドの中のみである。

stateの更新は非同期に行われる可能性が在る。
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Reactはパフォーマンスのために、複数のsetState()呼び出しを一度の更新にまとめて処理することがある。

this.propsとthis.stateは非同期に更新される。したがって次のstateを決める際に、this.propsの値に依存するべきではない。

つまりはたとえば、次のようなコードの場合、propsの値がsetState()の呼び出し時に一意に決まっておらず、意図しない動作になることがある：

.. code-block:: javascript

    this.setState({
        counter: this.state.counter + this.props.increment,
    })

これは、setState()の動作順序やタイミングが確定的ではないというところに起因している。したがってsetState()に"渡すもの"として、直接stateやpropsを渡すのではなく、処理だけ渡しておくことにする。すると、setState()呼び出し時、Reactが、直前のstateを第一引数、最新のpropsを第二引数としてその関数をコールしてくれる。

.. code-block:: javascript

    this.setState((state, props) => ({
        counter: state.counter + props.increment
    }));

または、

.. code-block:: javascript

    this.setState(function (state, props) {
        return {
            counter: state.counter + props.increment
        }
    });


stateの更新はマージされる
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
setState()を呼び出した場合、Reactは与えられたオブジェクトを現在のstateにマージする。つまり、stateのプロパティが複数存在するとき、それらのプロパティは完全に独立に扱うことが出来、それらに対する独立な変更が最終的にstateのプロパティに対する変更としてマージされる。


データは下方向に伝わる
--------------------------------------------

Reactというのは、かなり厳密なオブジェクト指向的なカプセル的コーディングを要求する。するとその流儀としては、それが赤の他人であれ親コンポーネントであれ子コンポーネントであれ、特定のあるコンポーネントがstate fullかstate lessかを知ることはできないし、特定のコンポーネントが関数型コンポーネントかクラス型コンポーネントかを気にするべきではない。


| これが、stateはローカルのものである、ないしはカプセル化されていると言われる所以である。stateは完全に、そのコンポーネントの外部からは見えないものであり、そのstateを所有してセットするコンポーネント自身以外からはそのstateにアクセスすることすら出来ない。そのように、フレームワークのシステムのレベルで固くカプセル化されていることが、Reactの強靭な拡張性の基礎に成っている。


| コンポーネントは、その子コンポーネントにpropsとして自身のstateを渡しても構わないが、それを受け取る子コンポーネントは、それが親のstateなのか、どこの馬の骨ともしれない値なのか、それともプログラマが見苦しくもハードコードしてしまった値なのかを知る由もない。

.. code-block:: javascript

    <FormattedDate date={this.state.date}/>

FormattedDateコンポーネントは、props経由でdateなる値を受け取るが、それがClockのstateからきたのか、Clockのpropsからきたのか、あるいは手書きされたものなのかはわからない。

.. code-block:: javascript

    function FormattedDate(props) {
        return <h2>It is {props.date.toLocaleTimeStringe()}.</h2>;
    }

このようなデータフローは、一般的には **トップダウン** もしくは　**単一方向** のデータフローと呼ばれる。いかなるstateも必ず特定のコンポーネントが所有し、stateから生ずる全てのデータまたはUIは、DOMツリーでそれらの下流にいるコンポーネントにのみ影響する。

|
| Reactアプリケーションでは、コンポーネントがステートフルかステートレスかは、コンポーネントにおける内部実装の詳細（ **implementation detail** ）とみなされ、それは時間とともに変化しうるものである。ステートレスなコンポーネントをステートフルなコンポーネントの中で使うことが可能であり、その逆もまた同様である。これが、コンポーネントの疎結合性により達成されうるほとんど最大のメリットではないかと思う。
