第１１回
================

.. code-block:: python

    import skimage.io as io
    # 一般的に必要なライブラリのインポート
    import numpy as np
    import random
    from matplotlib import pyplot as plt

    # TensorFlow と tf.keras のインポート
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, Activation, BatchNormalization
    from tensorflow.keras.wrappers.scikit_learn import KerasClassifier
    from tensorflow.keras.utils import to_categorical

    from sklearn.model_selection import train_test_split
    from sklearn.model_selection import cross_validate
    from sklearn.metrics import make_scorer

    import warnings
    warnings.simplefilter('ignore')

    random.seed(1) # 乱数の初期化

    Nlive = 150
    Ndead = 150

    # 前半のNlive 個に生細胞を後半のNdead 個に死細胞を格納．よって y_allは前半のNlive個が１、後半のNdead 個が0.
    y_all = np.ones((Nlive+Ndead,))
    y_all[Ndead: ] = np.zeros((Nlive,))
    y_all = to_categorical(y_all.astype('int32'), 2) # ラベルを one-hot coding に変換

    X_all = []
    # live データの読み込み
    for n in range(Nlive):
    path = './dataset_cls/live/{:03d}.tif'.format(n+1)
    image = io.imread(path)
    # 画像を[0,1]に規格化
    max_int = image.max()
    min_int = image.min()
    image = (image.astype(np.float32) - min_int) / (max_int - min_int)
    # 画像を確率的に回転，反転
    image = np.rot90(image, random.randint(0, 3))
    if random.randint(0, 1):
        image = np.fliplr(image)
    X_all.append(image)

    # dead データの読み込み
    for n in range(Ndead):
        path = './dataset_cls/dead/{:03d}.tif'.format(n+1)
        image = io.imread(path)
        # 画像を[0,1]に規格化
        max_int = image.max()
        min_int = image.min()
        image = (image.astype(np.float32) - min_int) / (max_int - min_int)
        # 画像を確率的に回転，反転
        image = np.rot90(image, random.randint(0, 3))
        if random.randint(0, 1):
            image = np.fliplr(image)
        X_all.append(image)

    # X_all をリストからnumpy.array の配列に変換
    X_all = np.array(X_all).reshape((Nlive+Ndead, 128, 128, 1))

    # クラス数、画像の大きさ、形式を設定（グレースケール画像なので in_shape では最後に１色を表す1 を代入）
    num_classes = 2
    im_rows = 128
    im_cols = 128

    def create_model_conv4():
        # 深層畳み込みネットを設計する部分
        model = Sequential()    # 多層ネットでモデル化することを宣言

        # 畳み込み層の設計
        ## 畳み込み第１層
        model.add(Conv2D(32, (5, 5), padding='same', input_shape=(im_rows, im_cols, 1))) # チャネル数: 32　畳み込みの範囲：5x5
                                                    # 端のゼロ埋め（padding）：前の層と同じニューロン数となるようにゼロ埋め．im_row x im_col x 1 の画像を入力
        model.add(Activation('relu')) # 活性化関数をReLu 関数とする
        model.add(MaxPooling2D(pool_size=(2,2))) # 2 x 2 の領域の最大値でプーリングする．次の層の各チャネルのニューロン数は1/2 x 1/2 = 1/4になる．

        ## 畳み込み第2層
        model.add(Conv2D(64, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第3層
        model.add(Conv2D(128, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第４層
        model.add(Conv2D(256, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 出力層
        model.add(Flatten()) # １次元に平坦化
        model.add(Dense(num_classes)) # 全結合でつなぐ
        model.add(Activation('softmax')) # 最終出力はソフトマックス関数

        # 損失関数，最適化アルゴリズムなどの設定 + モデルのコンパイルを行う
        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model

    def create_model_conv3():
        model = Sequential()

        ## 畳み込み第１層
        model.add(Conv2D(32, (5, 5), padding='same', input_shape=(im_rows, im_cols, 1)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第2層
        model.add(Conv2D(64, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第3層
        model.add(Conv2D(128, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 出力層
        model.add(Flatten())
        model.add(Dense(num_classes))
        model.add(Activation('softmax'))

        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model

    def create_model_conv2():
        model = Sequential()

        ## 畳み込み第１層
        model.add(Conv2D(32, (5, 5), padding='same', input_shape=(im_rows, im_cols, 1)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第2層
        model.add(Conv2D(64, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 出力層
        model.add(Flatten()) # １次元に平坦化
        model.add(Dense(num_classes)) # 全結合でつなぐ
        model.add(Activation('softmax')) # 最終出力はソフトマックス関数

        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model

    def create_model_conv1():
        model = Sequential()

        ## 畳み込み第１層
        model.add(Conv2D(32, (5, 5), padding='same', input_shape=(im_rows, im_cols, 1)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 出力層
        model.add(Flatten()) # １次元に平坦化
        model.add(Dense(num_classes)) # 全結合でつなぐ
        model.add(Activation('softmax')) # 最終出力はソフトマックス関数

        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model


    # 正答率を評価する関数
    def accuracy_score(y_true, y_pred):
        accuracy = np.array(np.argmax(y_true, axis = -1)  == y_pred).mean()
        return accuracy

    valid_crs_entropy = [[0]*10 for i in range(4)]
    valid_acc = [[0]*10 for i in range(4)]
    test_acc = [[0]*10 for i in range(4)]


    # 学習時に必要なエポック数，ミニバッチサイズ等のパラメータを指定して深層ネットのインスタンスを生成
    # 関数の呼び出しでループ的にインスタンス生成できないのが痛いが。
    model_1 = KerasClassifier(build_fn = create_model_conv1, epochs=50, batch_size=50, verbose=0)
    model_2 = KerasClassifier(build_fn = create_model_conv2, epochs=50, batch_size=50, verbose=0)
    model_3 = KerasClassifier(build_fn = create_model_conv3, epochs=50, batch_size=50, verbose=0)
    model_4 = KerasClassifier(build_fn = create_model_conv4, epochs=50, batch_size=50, verbose=0)

    models = [model_1, model_2, model_3, model_4]

    for k in range(10):
      print('{}回目の実験スタート'.format(k+1))

      # 訓練用データとテスト用データに分割する
      # データを訓練用データとテスト用データに8:2 でランダムに分割する
      X_train, X_test, y_train, y_test = train_test_split(X_all, y_all, test_size = 0.2)

      for i, model in enumerate(models):
        # 学習の記録
        res = model.fit(X_train, y_train)
        # 負の交差エントロピーと分類正答率をスコアとする
        score_funcs = {
          'neg_cross_entropy': 'neg_log_loss',
          'accuracy': make_scorer(accuracy_score),  # make_scorer() でラップする
        }
        # 5-fold 交差検証
        results = cross_validate(
            model, X_train, y_train,
            cv = 5,
            scoring = score_funcs,
            return_train_score = True,
        )

        valid_crs_entropy[i][k] = -np.average(results['test_neg_cross_entropy'])
        valid_acc[i][k] = np.average(results['test_accuracy'])
        test_acc[i][k] = (np.argmax(y_test, axis = -1) == model.predict(X_test)).mean()

    for i in range(4):
      print("""
      {}層のCNNの結果
      検証データに対する交差エントロピー: {} ± {}
      検証データに対する分類正答率      : {} ± {}
      テストデータに対する分類正答率    : {} ± {}
      """.format(
            i+1,
            -np.average(valid_crs_entropy[i]),
            np.var(valid_crs_entropy[i]),
            np.average(valid_acc[i]),
            np.var(valid_acc[i]),
            np.average(test_acc[i]),
            np.var(test_acc[i]),
        ))


    def create_model():
        # 深層畳み込みネットを設計する部分
        model = Sequential()    # 多層ネットでモデル化することを宣言

        # 畳み込み層の設計
        ## 畳み込み第１層
        model.add(Conv2D(64, (5, 5), padding='same', input_shape=(im_rows, im_cols, 1))) # チャネル数: 32　畳み込みの範囲：5x5
        # 端のゼロ埋め（padding）：前の層と同じニューロン数となるようにゼロ埋め．im_row x im_col x 1 の画像を入力
        model.add(Activation('relu')) # 活性化関数をReLu 関数とする
        model.add(MaxPooling2D(pool_size=(2,2))) # 2 x 2 の領域の最大値でプーリングする．次の層の各チャネルのニューロン数は1/2 x 1/2 = 1/4になる．

        ## 畳み込み第2層
        model.add(Conv2D(128, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第3層
        model.add(Conv2D(256, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 畳み込み第４層
        model.add(Conv2D(512, (5, 5)))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2)))

        ## 出力層
        model.add(Flatten()) # １次元に平坦化
        model.add(Dense(num_classes)) # 全結合でつなぐ
        model.add(Activation('softmax')) # 最終出力はソフトマックス関数

        # 損失関数，最適化アルゴリズムなどの設定 + モデルのコンパイルを行う
        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model


    def accuracy_score(y_true, y_pred):
        accuracy = np.array(np.argmax(y_true, axis = -1)  == y_pred).mean()
        return accuracy


    valid_crs_entropy_imp = [0]*10
    valid_acc_imp = [0]*10
    test_acc_imp = [0]*10


    # 学習時に必要なエポック数，ミニバッチサイズ等のパラメータを指定して深層ネットのインスタンスを生成
    # 関数の呼び出しでループ的にインスタンス生成できないのが痛いが。
    model = KerasClassifier(build_fn = create_model, epochs=50, batch_size=50, verbose=0)

    for k in range(10):
      print('{}回目の実験スタート'.format(k+1))
      # 訓練用データとテスト用データに分割する
      # データを訓練用データとテスト用データに8:2 でランダムに分割する
      X_train, X_test, y_train, y_test = train_test_split(X_all, y_all, test_size = 0.2)

      # 学習の記録
      res = model.fit(X_train, y_train)
      # 負の交差エントロピーと分類正答率をスコアとする
      score_funcs = {
        'neg_cross_entropy': 'neg_log_loss',
        'accuracy': make_scorer(accuracy_score),  # make_scorer() でラップする
      }
      # 5-fold 交差検証
      results = cross_validate(
         model, X_train, y_train,
         cv = 5,
         scoring = score_funcs,
         return_train_score = True,
      )

      valid_crs_entropy_imp[k] = -np.average(results['test_neg_cross_entropy'])
      valid_acc_imp[k] = np.average(results['test_accuracy'])
      test_acc_imp[k] = (np.argmax(y_test, axis = -1) == model.predict(X_test)).mean()


    print("""
      改良型４層のCNNの結果
      検証データに対する交差エントロピー: {} ± {}
      検証データに対する分類正答率      : {} ± {}
      テストデータに対する分類正答率    : {} ± {}
      """.format(
            -np.average(valid_crs_entropy_imp),
            np.var(valid_crs_entropy_imp),
            np.average(valid_acc_imp),
            np.var(valid_acc_imp),
            np.average(test_acc_imp),
            np.var(test_acc_imp),
    ))


    import pandas as pd
    import matplotlib.pyplot as plt

    df = pd.read_csv('12862_2015_454_MOESM1_ESM.csv')
    rand_sample = df.sample(2).reset_index()
    print(rand_sample)

    samples = [rand_sample.loc[0], rand_sample.loc[1]]
    series = ['A', 'B', 'C', 'D', 'E', 'F']
    time = ['Parent', '384', '744', '1224', '1824', '2496']


    for sample in samples:
      key = ['time(h)', 'A series', 'B series', 'C series', 'D series', 'E series', 'F series']
      value = [['0', '384', '744', '1224', '1824', '2496']]
      for keiretu in series:
        ex_levels = []
        for zikoku in time:
          label = keiretu + zikoku
          if 'Parent' in label:
            ex_level = sample['Parent']
          else:
            ex_level = sample[label]
          ex_levels.append(ex_level)
        value.append(ex_levels)

      plt_df = pd.DataFrame(dict(zip(key, value)))
      print(plt_df)
      ax = plt_df.plot(
          title = "expression level of {} (index is {})".format(
              sample['Genename'],
              sample['index'],
          ),
          x = "time(h)",

      )
