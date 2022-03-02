リストとkey
=====================================

まずはJsのリストの変換の方法についての復習
---------------------------------------------------------
| 以下のコードではmap()関数を用いてnumbersという配列を受け取って中身の値を２倍にしている。map()関数は非破壊的な関数だから、新しいnumbersとは異なる新しい配列を返すのだが、それを変数doubledに格納してログ出力する。

.. code-block:: js

    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map((number) => number*2);
    console.log(doubled);

Reactでは配列を要素のリストに変換することが、上のようなjsの配列の基本的な操作とほぼ同様のものである。

複数のコンポーネントをレンダーする
----------------------------------------------------
ここでも重要なことは、JavaScriptの中にJSXはBabel拡張で組み込まれ、逆にJavaScriptは、JSXの中にブレースのなかに組み込まれるということである。

| 以下では、JavaScriptのmap()関数を利用して、numbersというjsの配列に対して反復処理をするのだが、配列のそれぞれの要素に対して<li>要素を返している。最後に、結果として得られる新しい配列をlistItemsに格納している。それを<ul>要素に挟んでレンダーしている。

.. code-block:: js

    const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((number) => <li>{number}</li>);

    ReactDOM.render(
        <ul>{listItems}</ul>,
        document.getElementById('root')
    );

基本的なリストコンポーネント
---------------------------------------------------
通常リストは、何らかのコンポーネントの内部でレンダーしたいと思うことがある。愚直は次のようなコードを書けばよいのではないのかと思うだろう。

.. code-block:: js

    function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
            <li>{number} </li>
        );
        return (
            <ul>{listItems}</ul>
        );
    }

    const numbers = [1, 2, 3, 4, 5];
    ReactDOM.render(
        <NumberList numbers={numbers}/>,
        document.getElementById('root')
    );

ところが、このコードを実行すると「リスト項目にはkeyを与えるべきだ」という趣旨の警告を受け取るだろう。"key"とは、特別な文字列の属性であり、要素のリストを作成する際に含めておく必要があるものである。なぜkeyが重要なのだろうか、それは次の節で説明される。

| いまはとりあえず、numbers.map()内のリスト項目にkeyを割り当て、keyが見つからないという問題を修正する。

.. code-block:: js

    function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
            <li key={number.toString()}>
            {number}
            </li>
        );
        return (
            <ul>{listItems}</li>
        );
     }

     const numbers = [1, 2, 3, 4, 5];
     ReactDOM.render(
         <NumberList numbers={numbers}/>,
         document.getElementById('root')
     );

key
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Keyは、どの要素が変更、追加もしくは削除されたのかをReactが識別するのに役だつ。配列内の項目に安定した識別性を与えるため、それぞれの項目にKeyをあたえるべきである。

.. code-block:: js

    const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((number) =>
        <li key={number.toString()}>
        {number}
        </li>
    );

兄弟間で（つまりは同じリストの要素同士で）その項目を一意に特定できるような文字列をkeyとして選ぶのが最良の方法である。多くの場合、それはデータ内にあるidになるようなことが典型的であろう。

.. code-block:: js

    const todoItems = todos.map((todo) =>
        <li key={todo.id}>
        {todo.text}
        </li>
    );

レンダーされる要素に安定したIDがない場合、最終手段として項目のインデックスを使うことができる。ただしそれは意味が重複してしまうのであまりよろしくない。

keyのあるコンポーネントの抽出
------------------------------------------------
keyが意味を持つのは、それを取り囲んでいる配列の側の文脈においてである。

| 例えば、ListItemコンポーネントを抽出する際には、keyはListItem自体の<li>要素に書くのではなく、配列内の<ListItem/>要素に残しておくべきなのである。次にあるのは、まず第一に不適切なkeyの使用方法である。その次の例は、正しいkeyの使用法である。

.. code-block:: js

    function ListItem(props) {
        const value = props.value;
        return (
            <li key={value.toString()}>
            {value}
            </li>
        );
     }

     function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
            <ListItem value={number}/>
        );
        return (
            <ul>
            {listItems}
            </ul>
        );
     }

     const numbers = [1, 2, 3, 4, 5];
     ReactDOM.render(
        <NumberList numbers={numbers}/>,
        document.getElementById('root')
    );

.. code-block:: js

        function ListItem(props) {
            return <li>{props.value}</li>;
        }

        function NumberList(props) {
            const numbers = props.numbers;
            const listItems = numbers.map((number) =>
                <ListItem key={number.toString()} value={number}/>
            );
            return (
                <ul>
                    {listItems}
                </ul>
            );
        }

        const numbers = [1, 2, 3, 4, 5];
        ReactDOM.render(
            <NumberList numbers={numbers}/>,
            document.getElementById('root')
        );

この例を見ても分かるように、配列の要素がkeyを持っていることが重要なのであり、個々の<li>要素がkey属性を持っているかどうかは重要ではない。それもこれも、Reactがコンポーネントの配列を管理するためのkeyだからである。


keyは兄弟要素の中で一意であればよい
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
当然の事のようだが、グローバルに一意である必要はない


map()をJSXに埋め込む
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
これまでの例では、コンポーネントの配列を格納するためのlistItems変数を別途宣言して、それをJSXに含めていたが、当然ブレースはあらゆるjsの式をJSXの中に含めることを可能にするので、変数を経由せずともJSXのなかに直接map()関数の式を書き込むこともできる。コードをスリムにすることができるが、一方でネストが深くなったりする場合は可読性を損なう。可読性のために変数を抽出する価値が在るかどうか決めるのはプログラマの責任である。map()の中身がネストされすぎている場合などは、コンポーネントに抽出する良いタイミングかもしれない、ということに留意されたし。
