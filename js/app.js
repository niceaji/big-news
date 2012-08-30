$(function() {


    var cp = $.cookie('cp') || 'all',
        BV = new $.BigVideo(),
        newsList = {},
        apiUrl = 'http://media.daum.net/api/service/tv/'+ ((cp==="all") ? 'category/all' : cp ) +'.jsonp?countPerPage=100&callback=?',
        vodUrl = 'http://rt.flvs.daum.net:8080/RTES/Redirect?vid=',
        $listbox = $('#listbox');

console.log(apiUrl)

    function random (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function getVid(videoUrl){
        return videoUrl.replace("http://flvs.daum.net/flvPlayer.swf?vid=","");
    }
    function showBigNews(vid){
        var length=newsList.length,
            news ='';

        if(vid){

            for(var i=0; i<length; i++){

                if(vid === getVid(newsList[i].videoUrl) ){
                    news = newsList[i];
                    break;
                }
            }
        }
        else {
            news = newsList[random(0, length)];
            vid = getVid(news.videoUrl);
        }


        BV.show(vodUrl+vid);
        // console.log(news)
        $('#title').html(news.title + ' <small>'+ news.cpKorName  +' '+ news.regDate +' '+  news.regTime + '</small>');
    }
    function buildList(){
        var length = newsList.length,
            i=0,
            news='';

        for(i=0; i<length; i++){
            news = newsList[i],
            news.vid = getVid(news.videoUrl);

            $("#news-template").tmpl(news).appendTo($listbox);
        }

        $listbox.find(".box").click(function(){

            var vid = $(this).attr('vid');
            showBigNews(vid);
        });


        // $listbox.imagesLoaded(function(){

        //     $listbox.masonry({
        //       itemSelector: '.box'
        //     }); 
        // });
    }

    function loadData(){
        $.getJSON(apiUrl,function(data){

            newsList = data.tv.newsList.data;
            showBigNews();
            buildList();
        });
    }


    BV.init();
    loadData();

    $('#cp-selector ').val(cp);

    //tooltip
    // $('.btnbox a').tooltip({placement:'botton'});

    //list modal
    // $('#listbox').modal('hide');


    //event
    $('#btn-random').click(function(){
        showBigNews();
    });

    $('#btn-list').click(function(){
        $listbox.fadeIn();
    });

    $listbox.click(function(){
        $listbox.hide();
    });

    $('#btn-configsave').click(function(){

        $.cookie('cp',  $('#cp-selector ').val());
        location.reload();
        // $('#configbox').modal('hide');
    });
});





/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin v1.2
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ? JSON.parse(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key, options) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };

})(jQuery, document);