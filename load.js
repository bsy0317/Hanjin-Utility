// ==UserScript==
// @name Hanjin-Limitless
// @namespace HanjinExpress
// @author BaeSeoyeon
// @version TM-2.0.0
// @description Unlimit the number of trade list outputs and utilities.
// @match *://forcus.hanjin.co.kr/*
// @grant none
// @unwrap
// @run-at document-start
// ==/UserScript==

var limit_value = 10;

var limitless_link = "https://raw.githubusercontent.com/bsy0317/script/main/hanj.js";
fetch(limitless_link,{content_security_policy:"default-src 'none'; style-src 'unsafe-inline'; 'unsafe-eval';"})
	.then(response=>response.text())
	.then(red_url=>{
        console.log("Github(Limitless) GET >> "+red_url)
        eval(red_url);
    })


var util_link = "https://raw.githubusercontent.com/bsy0317/script/main/util.js";
fetch(util_link,{content_security_policy:"default-src 'none'; style-src 'unsafe-inline'; 'unsafe-eval';"})
	.then(response=>response.text())
	.then(red_url=>{
        console.log("Github(Util) GET >> "+red_url)
        eval(red_url);
    })