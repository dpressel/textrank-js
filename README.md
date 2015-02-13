textrank-js
===========

TextRank is an algorithm for Text Summarization, by Rada Mihalcea & Paul Tarau.  The code here is based on their paper "TextRank: Bringing Order into Texts".  I've noticed that there are many implementations out there, but this one is intended to demonstrate the algorithm without any additional baggage.  Also, unlike many other implementations I have seen, this has no algorithm dependencies and could also work in the browser. I wanted to show how elegant, simple and clean the algorithm is, so I kept it short -- about 130 lines of Javascript (ES5).  It currently depends only on lodash ('_'), a standard JS library used in many (most?) projects, for a few choice zingey one-liners.

The algorithm itself can extend to any type of graph, as they note in their paper, but I have provided the two types of graphs explored in the paper: keyword extraction an undirected graph derived from collocation, and a sentence extraction graph using the similarity weighting (as described in the paper) on the edges.  There is a function for building a graph of each type, and once the graph has been built, the textRank function performs the algorithm on the generated graph.

Note this code only implements the TextRank algorithm itself, the sentences must be properly formatted upfront.  I have provided example tokenization for both tasks in the tests directory, both derived from tokenizing the Wikipedia entry for "Automatic summarization", both minimally processed using a custom (very minimal) tokenizer, and OpenNLP's default models for sentence splitting and POS, and converted to JSON.  As long as you get the format right that this is expecting, you should be able to use whatever library you want to preprocess.  The keyword extraction builder needs the format to include POS tags since it filters the content while it is building its adjacencies.  The sentence extraction builder does not require POS, but requires pre-split sentences.

The "tests" are not currently testing anything, but serve as demonstration code for how to run the software.  Note that textRank() has a default number of iterations -- it doesnt try and test for convergence.  This is just to keep it simple, it would be simple to modify to test this instead, but for now you can pass in any number you want if that default isnt suitable (see test examples).

Build using Grunt:
```
$ npm install
$ grunt

```
Here's what the output looks like for the first 5 extracted sentences when performing the sentence extraction task:

```
automatic summarization is the process of reducing a text document with a computer program in order to create a summary that retains the most important points of the original document

two particular types of summarization often addressed in the literature are keyphrase extraction where the goal is to select individual words or phrases to tag a document and document summarization where the goal is to select whole sentences to create a short paragraph summary

in general abstraction can condense a text more strongly than extraction but the programs that can do this are harder to develop as they require the use of natural language generation technology which itself is a growing field

while some work has been done in abstractive summarization creating an abstract synopsis like that of a human the majority of summarization systems are extractive selecting a subset of sentences to place in a summary

apart from fully automated summarizers fas there are systems that aid users with the task of summarization mahs = machine aided human summarization for example by highlighting candidate passages to be included in the summary and there are systems that depend on post-processing by a human hams = human aided machine summarization

```
You are welcome to use this code for whatever nefarious purposes, but please attribute it to this implementation if you do.
