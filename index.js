'use strict';
if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    var _ = require('lodash');
}
function textRank(V, niter, dampening) {

    var d = dampening || 0.85;
    var K = niter || 200;
    var denom = [];
    var ws = [];

    function sum(edges) {
        var acc = 0.0;
        edges.forEach(function (edge) {
            acc += edge.weight
        });
        return acc;
    }

    function accum(i) {
        var sum = 0.0;
        V[i].in.forEach(function (v_j) {
            var j = v_j.index;
            var v_ji = _.find(V[j].out, function (x) {
                return x.index == i;
            });
            sum += (v_ji ? (v_ji.weight / denom[j] * ws[j].score) : 0.);
        });
        return sum;
    }

    V.forEach(function (v_j, j) {
        denom[j] = sum(v_j.out);
        ws[j] = {name: v_j.name, vertex: j, score: Math.random()};
    });
    for (var k = 0; k < K; ++k) {
        for (var i = 0; i < V.length; ++i) {
            var acc = accum(i);
            ws[i].score = (1 - d) + d * acc;
        }
    }
    ws.sort(function (x, y) {
        return (y.score - x.score)
    });
    return ws;
}

function sentExGraph(sentences) {
    function sim(s1, s2) {
        return _.intersection(s1, s2).length / (Math.log(s1.length) + Math.log(s2.length));
    }

    var V = [];
    for (var i = 0; i < sentences.length; ++i) {
        for (var j = i + 1; j < sentences.length; ++j) {
            var score = sim(sentences[i], sentences[j]);
            V[i] = V[i] || {name: sentences[i], out: [], in: []};
            V[j] = V[j] || {name: sentences[j], out: [], in: []};
            // Symmetric
            V[i].out.push({index: j, weight: score});
            V[i].in.push({index: j, weight: score});
            V[j].in.push({index: i, weight: score});
            V[j].out.push({index: i, weight: score});
        }
    }
    return V;
}

function keyExGraph(text, win) {

    var V = [];
    var edges = {};
    var sz = text.length;
    var winSz = win || 2;
    var halfN = winSz / 2.;
    var term2idx = {};
    var n = 1;

    function addIfNotPresent(term) {
        if (!term2idx[term]) {
            term2idx[term] = n++;
        }
        return term2idx[term] - 1;
    }

    for (var i = 0; i < sz; ++i) {
        var token = text[i];
        if (!token.pos.match(/^[NJ]/) && token.pos !== 'ADJ' && token.pos !== 'CD') {
            continue;
        }
        var minWin = Math.max(0, i - halfN);
        var maxWin = Math.min(sz, i + halfN);
        for (var j = minWin; j < maxWin; ++j) {
            if (i == j) {
                continue;
            }
            var other = text[j];
            if (!other.pos.match(/^[NJ]/) && other.pos !== 'ADJ' && other.pos !== 'CD') {
                continue;
            }
            var edge = [token.term, other.term];
            edge.sort();
            edge = edge.join("____");
            edges[edge] = 1;
        }
    }
    
    for (var e in edges) {
        var thisFirst = e.split("____");
        i = addIfNotPresent(thisFirst[0]);
        j = addIfNotPresent(thisFirst[1]);
        V[i] = V[i] || {me: i, name: thisFirst[0], out: [], in: []};
        V[j] = V[j] || {me: j, name: thisFirst[1], out: [], in: []};
        V[i].out.push({index: j, weight: 1});
        V[i].in.push({index: j, weight: 1});
        V[j].out.push({index: i, weight: 1});
        V[j].in.push({index: i, weight: 1});
    }

    return V;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports.textRank = textRank;
    module.exports.keyExGraph = keyExGraph;
    module.exports.sentExGraph = sentExGraph;
}
