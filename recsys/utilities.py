
import os
import pandas as pd

def generate_yelp_name(name: str) -> str:
    """utility function to generate filename of yelp dataset."""
    return "yelp_academic_dataset_" + name + ".json"

def str_to_list(s: str, sep: str) -> list:
    """
    given some string separated by some character,
    generate a list version of those values.
    """
    return list(s.split(sep))

def list_to_str(l: list, sep: str) -> str:
    """
    given a list, and an arbitrary separator character,
    create a string based on those values.
    """
    return sep.join(l)

def pd_attribute_unique(df: pd.DataFrame, attr: str) -> list:
    """utility function to find the number of unique
    values in a column of a dataframe.
    df[attr] must be a string with some valid separator.
    """
    x = list(df[attr].str.split(', '))
    #x = str_to_list(df[attr].str, ', ')
    out = []
    for categories in x:
        for category in categories:
            if category not in out:
                out.append(category)
    return out

def out_write_category(df: pd.DataFrame, attr: str, filename: str = 'categories.txt'):
    """writes a file containing a newline-separated string based
    on the data of a DataFrame column."""
    with open(os.path.join(os.getcwd(), 'data', filename), 'w') as f:
        f.write('\n'.join(pd_attribute_unique(df, attr)))
        #f.write(str_to_list(pd_attribute_unique(df,attr), '\n'))


def json_query_id(id, name) -> list:
    """utility to query a json file by id.
    used for large json files that python is unable to read by block,
    as this method reads by stream (line by line) instead.
    """
    ret_dat = []
    with open(os.path.join(os.getcwd(), 'data', generate_yelp_name('review')), 'r') as f:
        for line in f:
            if f'"{name}":"{id}"' in line:
                ret_dat.append(line)
    return ret_dat
