$(window).bind('touchend', function (e) {
    console.log(e);
    e.preventDefault();
    // Add your code here. 
    $(e.target).click();
    // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
});

//(function($) {
//  var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
//  $.fn.nodoubletapzoom = function() {
//    if (IS_IOS)
//      $(this).bind('touchstart', function preventZoom(e) {
//        var t2 = e.timeStamp
//          , t1 = $(this).data('lastTouch') || t2
//          , dt = t2 - t1
//          , fingers = e.originalEvent.touches.length;
//        $(this).data('lastTouch', t2);
//        if (!dt || dt > 500 || fingers > 1) return; // not double-tap
//
//        e.preventDefault(); // double tap - prevent the zoom
//        // also synthesize click events we just swallowed up
//        $(this).trigger('click').trigger('click');
//      });
//  };
//})(jQuery);

//(function ($) {
//    var count = 0;
//    $.fn.nodoubletapzoom = function () {
//        $(this).bind('touchstart', function preventZoom(e) {
//            var t2 = e.timeStamp;
//            var t1 = $(this).data('lastTouch') || t2;
//            var dt = t2 - t1;
//            var fingers = e.originalEvent.touches.length;
//            $(this).data('lastTouch', t2);
//            if (!dt || dt > 500 || fingers > 1) {
//                return; // not double-tap
//            }
//            e.preventDefault(); // double tap - prevent the zoom
//            // also synthesize click events we just swallowed up
//            $(e.target).trigger('click');
//        });
//    };
//})(jQuery);
//
//$(document).on('pageinit', "#status_page", function () {
//    $("body").nodoubletapzoom();
//});