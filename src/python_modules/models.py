import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Sequential
import numpy as np
import os
from cara import cara
import sklearn
import xgboost
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
import pickle
import os

def load_models():
    path_check = os.path.join("/home/angelo/test/src/python_modules/m_checkpoints/")
    ckname = ['knn2.pkl', 'clf_gini.pkl', 'LR.pkl', 'clf_en.pkl']

    with open(
        path_check+ckname[0],"rb") as f1,open(
        path_check+ckname[1],"rb") as f2,open(
        path_check+ckname[2],"rb") as f3,open(
        path_check+ckname[3],"rb") as f4:
        
        knn2 = pickle.load(f1)
        clf_gini = pickle.load(f2)
        LR = pickle.load(f3)
        clf_en = pickle.load(f4)
    return clf_en,clf_gini,knn2,LR


def load_xgb():
    path_check = "~/test/src/python_modules/m_checkpoints/xgb.model"

    xgb = xgboost.Booster()
    xgb.load_model(path_check)
    return xgb

def make_model():
    neural_n = Sequential()
    neural_n.add(Dense(32,activation="relu",input_shape=(20,),use_bias=False))
    neural_n.add(Dense(16,activation="relu"))
    neural_n.add(Dense(8,activation="relu"))
    neural_n.add(Dropout(0.1))
    neural_n.add(Dense(1,activation="sigmoid"))

    return neural_n

nominal_columns = ['Dep. Name', 'Dep. Class', 'Position Name', 'Position ID',
                   'Employee Type', 'Nacionality', 'Status', 'Turn Code',
                   'Gender', 'Plant', 'Type', 'Category', 'Function',
                   'Area', 'Business Unit', 'Manager', 'GM', 'Director',
                   'VP', 'BP']


def get_values(data):
    converted_data = []
    for i,nc in enumerate(nominal_columns):
        converted_data.append(cara[i][data[i]])
    return np.array(converted_data).reshape(1,-1)