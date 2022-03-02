JavaScriptのthisについて
===========================================

JavaScriptのthisキーワードの挙動は、他の言語にくらべてやや複雑なものが在る。それを`MDNの公式ドキュメント <http://link>`_に沿ってまとめる。

解説
---------------------------

グローバルコンテキスト
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
グローパルコンテキスト（全ての関数の外側）で参照されるthisは、グローバルオブジェクトを参照する。これは、strictモードかnon-striceモードかによらない。

.. code-block:: js

    console.log(this === window); // true

    a = 27;
    console.log(window.a); // 27

    this.b = "MDN";
    console.log(window.b); // "MDN"
    console.log(b); //"MDN"


.. note::

	コードが実行されている現在のコンテキストに関係なく、グローバルのglobalThisプロパティを参照していつでもグローバルオブジェクトを取得できる。

関数コンテキスト
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
関数内でのthisの値は、関数の呼び出され方によって異なる。

1. not-strictモードの場合。

not-stcirtの場合、関数中のthisは基底でグローバルオブジェクトになる。

.. code-block:: js

    function f1() {
        return this;
    }

    // ブラウザ上では
    f1() === window; // true
    // Node上では
    f1() === global; // true


2. striceモードの場合。

ただしstrictモードでは、実行コンテキストに入るとき（つまりはコールスタックに積まれるとき）にthis値が設定されていないと、undefinedになる。

.. code-block:: js

    function f2() {
        'use strict';
        return this;
    }

    f2() === undefined; // true

.. note::

	striceモードの例において、thisがundefinedとなるのは、f2()が関数として呼び出されており、オブジェクトのメソッドやプロパティとして呼び出されていないためである。


クラスコンテキスト
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
**クラスは関数の機能** であるため、クラスと関数の中におけるthisの動作は似ている。が、いくつかの点において相違が在る。

1. 基本クラスの場合

クラスのコンストラクタ内ではthisは通常のオブジェクトである。クラス内の全ての非静的メソッドは、thisのプロトタイプに追加される。クラスコンテキストの、コンストラクタの中でのthisは、基本クラスの場合であればデフォルトでオブジェクトにバインドされており、またそのthisはプロパティと非静的メソッドをプロトタイプに持つことになる。

.. code-block:: js

    class Example {
        constructor() {
            const proto = Object.getPrototypeOf(this);
            console.log(Object.getOwnPropertyNames(proto));
        }
        first() {}
        second() {}
        static third() {}
    }

    new Example(); // ['constructor', 'first', 'second']

.. note::

	静的メソッドはthisのプロパティには含まれない。つまりthisからは参照できない。

2. 派生クラスの場合

基本クラスのコンストラクタとは異なり、派生クラスのコンストラクタには、初期のthisバインディングが **ない** 。super()を呼び出すとコンストラクタ内にthisバインディングが作成され、基本的に次のコードを評価する効果が在る。
このときのBaseは派生クラスである。

.. code-block:: js

    this = new Base();

.. warning::

	super()を呼び出す前にコンストラクタの中でthisを参照するとエラーが発生する。

super()を呼び出すことなく派生クラスのオブジェクトをnewできる、つまりはreturnできるのは、そのクラスが何らかのオブジェクトをreturnするコンストラクタを持っている場合か、あるいはコンストラクタの記述がまったくないときである。

.. code-block:: js

    class Base {}
    class Good extends Base {}
    class AlsoGood extends Base {
        constructor() {
            return {
                a: 5
            };
        }
    }
    class Bad extends Base {
        constructor() {}
    }

    new Good();
    new AlsoGood();
    new Bad(); //参照エラー

関数コンテキスト内のthis
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
以下に例を上げる

.. code-block:: js

    var obj = {a: 'Custom'};

    var a = 'Global';

    function whatsThis() {
        return this.a;
    }

    whatsThis(); // これはnot-strictなので'Global'を返す
    whatsThis.call(obj); // this値がobjに設定されるので'Custom'
    whatsThis.apply(obj); // this値がobjに設定されるので'Custom'

bind() メソッド
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Function.prototype.bindを呼び出せば、その関数のthisを永続的に引数のオブジェクトに固定した新しいそっくりさん関数を返す。

.. code-block:: js

    function f() {
        return this.a;
    }

    var g = f.bind({a: 'azerty'});
    console.log(g()); // azerty

    var h = g.bind({a: 'yoo'});
    console.log(h()); // azerty

アロー関数
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
アロー関数では、 thisはそれを囲むレキシカルコンテキストのthisの値が設定される。するともちろん、グローバルコードではグローバルオブジェクトが設定されることになる。

.. code-block:: js

    // グローバルオブジェクト
    var globalObject = this;
    var foo = (() => this);
    console.log(foo() === globalObject); //true

    // オブジェクトのメソッドとして呼び出してみる
    var obj = {func: foo};
    console.log(obj.func() === globalObject); // true
    // callを使用してthisの値の設定を試みる
    console.log(foo.call(obj) === globalObject); // true
    // bindを使用してthisの設定を試みる
    foo = foo.bind(obj);
    console.log(foo() === globalObject); // true

この例では、最初にアロー関数による関数式であるfooが評価された時点でのコンテキストでのthis（この例ではglobalObject）が、なにがあっても保持されていることが分かる。同様のことが、他の関数内で生成したアロー関数にも適用される。

.. code-block:: js

    var obj = {
        bar: function() {
            var x = (() => this);
            return x;
        }
    }

    var fn = obj.bar();

    console.log(fn() === obj); // true

    var fn2 = obj.bar;

    console.log(fn2()() == window); //true

上記の例では、アロー関数式が評価された時点でのthis値がアロー関数内でのthisに保持されていることがわかる。レキシカルスコープとは、定義や式の評価の時点での値が利用されるスコープのことをいうと考えたほうがいい。


クラスの中のthis
---------------------------------------
通常の関数と同様に、メソッド内のthisの値はどのように呼び出されるかによって異なる。クラス内のthisが常にクラスのインスタンスを参照するようにこの動作をオーバーライドしておくと便利な場合も在る。

.. code-block:: js

    class Car {
        constructor() {
            this.sayBye = this.sayBye.bind(this);
        }

        sayHi() {
            console.log('Hello from ${this.name}');
        }

        sayBye() {
            console.log('Bye from ${this.name}');
        }

        get name() {
            return 'Ferrari';
        }
    }

    class Bird {
        get name() {
            return 'Tweety';
        }
    }

    const car = new Car();
    const bird = new Bird();

    // メソッド中のthisは、オブジェクトからのコールであればきちんと動作する。
    car.sayHi(); // Hello from Ferrari
    bird.sayHi = car.sayHi;
    bird.sayHi(); // Hello from Tweety

    // バインドされたメソッドの場合、thisは呼び出し元に依存しない
    bird.sayBye = car.sayBye;
    bird.sayBye(); // Bye from Ferarri
