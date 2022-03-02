matplotlib
=======================
matplotlibの使い方や各種仕様についてのノート。APIのリストや機能についてのメモ、設定の仕方、コードの例や、プロセス通信による結果の出力などを利用するために、出力形式のストリームや保存や、pythonオブジェクトから通信可能形式への変換などについて記述する。


使い方
-------------------



仕様
-------------------

出力形式
^^^^^^^^^^^^^^^^^^^

plot.scatter()
"""""""""""""""""""
.. code-block:: python

    from matplotlib import plot as plt

    plt.scatter()
    # <matplotlib.collections.PathCollection at 0x7eb9f70a5d30>
