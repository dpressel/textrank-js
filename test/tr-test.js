var assert = require('assert');
var should = require('should');
var expect = require('chai').expect;
var tr = require('../index');
var LONG_KEY_EX = require('./Automatic_Summarization-tokens.json');
var LONG_SENT_EX = require('./Automatic_Summarization-sents.json');
var fs = require('fs');

// TODO: right now just example code, no real unit tests!
describe('textrank', function () {
    describe('keyword extraction', function () {

        it('should compute top keywords', function () {
            // First convert to a keyword graph as described in the paper
            var graph = tr.keyExGraph(LONG_KEY_EX);
            // Now run text rank on the graph
            var ws = tr.textRank(graph);
            // Get the top N keywords
            ws = ws.slice(0, Math.min(ws.length, 10));
            console.log('Top rated hits!');
            ws.forEach(function (item) {
                console.log(item.name + ' --> ' + item.score);
            });
        });
    });
    describe('sentence extraction', function () {

        it('should compute top sentences', function () {
            // First convert to a sentence graph as described in the paper
            var graph = tr.sentExGraph(LONG_SENT_EX);
            // Now run 40 iterations of the algorithm
            var ws = tr.textRank(graph, 40);
            // Get the top N sentence
            ws = ws.slice(0, Math.min(ws.length, 10));
            // Reorder the top N sentences by article order
            ws.sort(function(a, b) { return a.vertex - b.vertex });
            console.log('Top rated hits!\n');
            ws.forEach(function (item) {
                console.log(item.name.join(' ') + '\n');
            });
        });
    });

});
