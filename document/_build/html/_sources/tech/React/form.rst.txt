フォーム
=====================================

HTMLのフォーム要素は当然のこととして内部に何らかの状態を持っているので、フォーム要素はReactにおいて他のDOM要素とは少し異なる振る舞いをする。例えば、次のプレーンHTMLによるフォームは、一つの名前を受け付ける。

.. code-block:: html

    <form>
        <label>
            Name:
            <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit"/>
    </form>

このフォームは、ユーザーがフォームを送信した際に新しいページに移動する、というい、HTMLフォームとしてのデフォルトの動作をする。Reactでこの振る舞いが必要なら、そのままでそのような動作をする。しかし大抵のケースでは、フォームに入力されたデータに手を入れることなく送信してページ遷移するということはほとんどなく、むしろ、フォームの送信に応答してユーザがフォームに入力したデータにアクセスするようなJsの関数が存在する。

| このような挙動をReactにおいて実現するためには、"制御されたコンポーネント"（controlled component）と呼ばれるテクニックを使うことである。

制御されたコンポーネント
---------------------------------------
HTMLでは<input>、<textarea>、そして<select>のようなフォーム要素は通常、自身である状態を保持しており、ユーザの入力に基づいてそれを更新する。Reactでは、コンポーネントが保持している変更されうる状態は通常はコンポーネントのstateプロパティに保持され、setState()関数のみがそれを変更する窓口である。

| Reactのstateを”信頼できる唯一の情報源”とすることで、上述の２つの状態（HTMLフォームが原理的に持つ状態と、Reactのstateにより保持される状態）を結合させることができる。そうすることで、フォームをレンダーしているReactコンポーネントが、後続するユーザ入力でフォームで起きることも制御できるようになる。このような方法でReactによって値が制御される入力フォーム要素は、「制御されたフォームコンポーネント」と呼ばれる。

| たとえば、前述のフォームの例において、フォーム送信時に名前をログに残すようにしたい場合、フォームを制御されたコンポーネントとして書くことができる：

.. code-block:: jsx

    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: ''};

            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
            this.setState({value: event.target.value});
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
                        <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }

フォーム要素のvalue属性が設定されているので、表示される値は常にthis.state.valueとなり、Reactのstateが信頼できる情報源となる。handleChangeはキーストロークごとに実行されてReactのstateを更新するので、表示される値はユーザがタイプするたびに更新される。

| 制御されたコンポーネントを使うと、ユーザ入力の値は常にReactのstateによって制御されるようになる。これによりタイプするコード量は少し増えるが、その値を他のUI要素に渡したり、他のイベントハンドラからリセットしたりできるようになる。


textaretaタグ
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
HTMLでは、<textarea>要素はテキストを子要素として定義する！

.. code-block:: html

    <textareta>
        Hello there, this is some text in a text areta
    </textarea>

Reactでは、<textarea>は変わりにvalue属性を使用する。こうすることで、<textarea>を使用するフォームは単一行の入力フォーム<input type="text"/>と非常に似た書き方ができるようになる。


.. code-block:: js

    class EssayForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: 'Please write an essay about your favorite DOM element'
            };

            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
            this.setState({value: event.target.value});
        }

        handleSubmit(event) {
            alert('An essay  was submitted: ' + this.state.value);
            event.preventDefault();
        }

        // なぜrendr()メソッド中でのthis参照は、bindせずともerrorにならないのかといえば、Reactが、JSXとクラスをきっちり結びつけて、constructorと同じ振る舞いになるようにスコープを制御してくれているからである。
        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Essay:
                        <textarea value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }

this.state.valueがコンストラクタで初期化されているので、テキストエリアには初めからテキストが入っていることに注意されたし。


selectタグ
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
HTMLでは、<select>は、<option>要素を子要素としてドロップダウンリストを作成する。たとえば次のHTMLは、味についてのドロップダウンリストを作成している。

.. code-block:: html

    <select>
        <option value="grapefruit">Grapefruit</option>
        <option value="lime">Lime</option>
        <option selected value="coconut">Coconut</option>
        <option value="mango">Mango</option>
    </select>

selected属性があるためCoconutオプションが最初に選択されている。このselected属性の代わりに、Reactでは、value属性を親のselectタグで使用する。一箇所で更新すればよいだけなので、制御されたコンポーネントを使う場合には便利である。たとえば：

.. code-block:: js

    class FlavorForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: 'coconut'};

            this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleChange(event) {
            this.setState({value: event.target.value});
        }

        handleSubmit(event) {
            alert('Your favorite flavor is: ' + this.state.value);
            event.preventDefault();
        }

        render() {
            return (
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
                    <input type="submit" value="Submit"/>
                </form>
            );
        }
    }

この記法によって、全体的に<input type="text">, <textarea>, <select>が非常に似た記述と動作をするようになる。これらは全て、 **制御されたコンポーネントを実装するときに使うことができるvalue属性を受け取る。**

.. note::

	value属性に配列を渡すことで、selectタグ内の複数のオプションを選択することができる。

    .. code-block:: js

        <select multiple={true} value={['B', 'C']}>

file inputタグ
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
HTMLでは、<input type="file">によってユーザにデバイス内の一つ以上のファイルを選ばせてそれをサーバにアップロードしたりFileAPIをつかってJavaScriptで操作したりすることができる。

.. code-block:: html

    <input type="file"/>

この値は読み取り専用なので、これは非制御コンポーネントとなる。（非制御コンポーネントについては後述）


複数の入力の処理
---------------------------------------
複数の制御されたinput要素を処理する必要が在る場合、それぞれの入力要素にname属性を追加すれば、ハンドラ関数にevent.target.nameに基づいて処理を選択させるようにできる。
singlettriplet
abrakatabra
たとえば：

.. code-block:: js 

    class Reservation extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isGoign: true,
                numberOfGuests: 2
            };

            this.handeInputChange = this.handleInputChange.bind(this);
        }

        handleInputChange(event) {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({
                [name]: value
            });
        }

        render() {
            return (
                <form>
                    <label>
                        Is going:
                        <input
                            name="isGoing"
                            type="checkbox"
                            checkd={this.state.isGoing}
                            onChange={this.handleInputChange}/>
                            </label>
                        <br/>
                    <label>
                        Number of Guests:
                        <input
                            name="numberOfGuests"
                            type="number"
                            value={this.state.numbereOfGuests}
                            onChange={this.handleInputChange}/>
                        </label>
                    </form>
            );
        }
    }

制御された入力におけるnull値
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
制御されたコンポーネントで、valueプロパティに値を指定することで、変更させたくない場合にユーザが値を変更できないようになる。もしも、valueを指定したのに入力フィールドが依然として変更可能であるという場合は、valueをundefinedもしくはnullに設定してしまったのかもしれない。

.. code-block:: js

    ReactDOM.render(<input value="hi"/>, mountNode);

    setTimeout(function() {
        ReactDOM.render(<input value={null}/>, mountNode);
    }, 1000);


制御されたコンポーネントの代替手段
---------------------------------------------
制御されたコンポーネントは、あらゆる種類のデータの変更に対してイベントハンドラを書き、あらゆる入力状態をReactコンポーネントに通してやる必要があるため、時としてうんざりすることも在る。このことは、既存のコードベースをReactに変換する場合や、Reactアプリケーションをnon-Reactのライブラリと統合する場合に特に問題化する。これらの状況においては、入力フォームを実装するための代替手段であるところの非制御コンポーネントを検討して見る価値が在る。

本格的なソリューション
----------------------------------------------
入力値のバリデーション、訪問済みのフィールドの追跡やフォーム送信を含む完全なソリューションがほしい場合は、Formikが人気のある選択肢の一つである。

| しかしながらこれは制御されたコンポーネントやstateの管理と同じ原理で作成されているので、これらの基礎をしっかりと理解しておく必要が在る。


コードの実装例
--------------------------------------
.. raw:: html

    <div id="root"></div>

.. raw:: html

    <script type="text/javascript" async src="../../_static/tech/React/form.js"></script>
