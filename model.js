'use strict'

var util = {};
const _ = require('lodash');
const path = require('path');

util.TreeNode = function(object) {
	this.type = object.type;
	this.name = object.name || [];
	this.ws = object.whitespace || [];
	this.ex = object.extension || [];
	this.depth = object.depth || 0;
	this.rel = new Map();
	if (this.ex.length != 0) {
		this.filename = `${this.name.join("")}.${this.ex.join("")}`
	} else {
		this.filename = `${this.name.join("")}`
	}
};

util.Tree = function() {
	var arr = [];

	this.getPath = function() {
		var path = [];
		_.each(arr, function(node) {
			path.push(node.filepath);
		});
		return path;
	};

	this.getArray = function(){
		return arr;
	};

	this.add = function(args) {
		_.each(args, function(object) {
			let node = new util.TreeNode(object);
			arr.push(node);
		});
		this.scan();
	};

	this.path = function() {
		_.map(arr, function(node) {
			if (node.rel.get('parent')) {
				//node.filepath = self.checkParents(node);
			} else {
				node.filepath = `${node.filename}`;
			}
		});
	};

	this.scan = function() {
		//TODO リファクタリング
		for (var i = 0; i < arr.length; i++) {
			for (var j = 1; j < arr.length; j++) {
				if (arr.length == i + j) break;
				if (arr[i].depth < arr[i + j].depth) {
					arr[i + j].rel.set("parent", arr[i]);
					break;
				} else if (arr[i].depth == arr[i + j].depth) {
					arr[i + j].rel.set("parent", arr[i].rel.get("parent"));
					break;
				} else if (arr[i].depth > arr[i + j].depth && arr[i].depth != arr[i - 1].depth) {
					arr[i].rel.set("parent", arr[i - 1]);
				} else {//arr[i].depth > arr[i+j].depth
					arr[i].rel.set("parent", arr[i - 1].rel.get("parent"));
					break;
				}
			}
		}
		this.path();
	};
};

module.exports = util;
