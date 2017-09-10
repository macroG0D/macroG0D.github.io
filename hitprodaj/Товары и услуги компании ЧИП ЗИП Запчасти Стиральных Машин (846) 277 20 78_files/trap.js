(function ($) {
    var c = Math.random();
    if ('cookie' in $) {
        $.cookie('trust', c, {expires : 1});
    }
})(jQuery);