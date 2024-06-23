import tensorflow as tf
import numpy as np
import os


def make_model():
    neural_n = tf.keras.models.Sequential()
    neural_n.add(tf.keras.layers.Dense(32,activation="relu",input_shape=(4,),use_bias=False))
    neural_n.add(tf.keras.layers.Dense(16,activation="relu"))
    neural_n.add(tf.keras.layers.Dense(8,activation="relu"))
    neural_n.add(tf.keras.layers.Dropout(0.1))
    neural_n.add(tf.keras.layers.Dense(1,activation="sigmoid"))

    return neural_n