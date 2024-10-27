import os
import pandas as pd
import re
import utilities as ut

from transformers import BartTokenizer, BartForConditionalGeneration
bart_model_name = 'facebook/bart-large-cnn'
tokenizer = BartTokenizer.from_pretrained(bart_model_name)
model = BartForConditionalGeneration.from_pretrained(bart_model_name)

from flask import Flask, request
app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run() -> int:
    # input file must exist to run
    assert os.path.isfile('input.txt')
    assert os.path.isdir('data')

    user = request.json

    #with open('input.txt', "r") as file:
    #    lines = file.readlines()
    #    user['count'] = int(lines[0].strip())
    #    user['state'] = lines[1].strip()
    #    user['prefs'] = [pref.strip() for pref in lines[2].split(',')]

        #exit(1)

    print("[*] validated user input")
    #print(user.values())
    #user_state = 'CA'
    #user_prefs = ['Vegan']

    #import the dataset
    business_data = pd.read_json(os.path.join(os.getcwd(), 'data', ut.generate_yelp_name('business')), lines=True)
    df = pd.DataFrame.from_dict(business_data)

    print("[*] validated business dataset")

    #df = df.loc[df['state'] == user_state]
    df = df.loc[df['state'] == user['state']]

    # filter by food related locations
    df = df.loc[df['categories'].str.contains("food|restaurant", na=False, flags=re.IGNORECASE, regex=True)]

    # filter categories by the user's food preference
    # this should be received from stdin or file
    #user_prefs = "|".join(user_prefs)
    df = df.loc[df['categories'].str.contains('|'.join(user['prefs']), na=False, flags=re.IGNORECASE, regex=True)]
    #df.head()

    # get the unique values of categories across current df
    # and write it to a file
    # used for chatbot tech
    ut.out_write_category(df, 'categories')

    # drop the unused columns
    keep_cols = ['business_id','name','latitude','longitude','categories','stars', 'review_count']
    df = df[keep_cols]

    print("[*] filtered dataset")

    #print(df.head())

    # create a new rating column based on the baye's prob of stars and review count.
    def set_bayes(R, W):
        def bayesian_probability(rating, review_count):
            return (W*R + review_count * rating) / (W + review_count)
        return bayesian_probability

    bayes_prob = set_bayes(2, 3)

    df['new_rating'] = df.apply(lambda row: bayes_prob(row['stars'], row['review_count']), axis=1)
    df = df.sort_values('new_rating', ascending=False)

    print("[*] created new ratings")
    print(df.head())

    # writes a json file of the lat and lon values
    #df.to_json('latlon.json',orient="records", lines=True)

    # get list of top 10 business ids
    business_ids = df.head(user['count'])['business_id'].tolist()

    # writes a json file of the relevant reviews based on the top businesses.
    lst = {}
    once_passed = False
    def json_outquery(dat,wt):
        """writes a json file given dat and wt as read type.
        wt should only be either 'w' or 'a', or the function will likely
        throw an error.
        """
        with open(os.path.join(os.getcwd(), 'data', 'last_query.json'), wt) as f:
            f.write(''.join(dat))
    for i in business_ids:
        lst[i] = ut.json_query_id(i, 'business_id')
        if not once_passed:
            json_outquery(lst[i],'w')
            once_passed = True
            continue
        json_outquery(lst[i],'a')


    print("[*] wrote to 'last_query.json'")
    # read the newly created json file
    gen_df = pd.read_json(os.path.join(os.getcwd(), 'data', 'last_query.json'), lines=True)
    #gen_df.head()

    # generate a summary of all reviews rela#ted to each business.
    # will take a while the more top ids are queried.

    from transformers import BartTokenizer, BartForConditionalGeneration

    tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')
    def gen_summary(text):
        inp = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(inp, min_length=50, max_length=150, length_penalty=2.0, num_beams=2, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary

    # generate final dataframe
    #final_df = df.head(user['count']).copy()
    summaries = []
    for i in business_ids:
        all_reviews = '\n'.join(gen_df.loc[gen_df['business_id'] == i]['text'].tolist())
        summaries.append(gen_summary(all_reviews))
    df = df.head(user['count'])
    df['summary'] = summaries


    print("[*] generated summaries")

    # write processed data to json
    df.to_json(os.path.join(os.getcwd(), 'data', 'processed.json'), orient="records", lines=True)
    #final_df.head()

    print("[*] wrote to 'processed.json'")
    return 0

if __name__ == "__main__":
    app.run(debug=True)
