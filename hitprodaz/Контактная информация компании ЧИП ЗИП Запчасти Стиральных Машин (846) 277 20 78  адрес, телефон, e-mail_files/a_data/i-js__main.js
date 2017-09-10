var hostname = window.location.hostname;

var SITE = 'zakupka.com';
var CURRENCY = 'грн';
var OURS_SITES = 'zakupka.com|satom.ru|tomas.by|tomas.kz';
var COLLAPSE_WIDTH = 760;
var zkTrackServicesConstants = zkTrackServicesConstants || {ga : {}, ym : {serviceObject : []}};

var portals = ['zakupka', 'satom', 'tomasby', 'tomaskz'];
for (var n = 1; n <= 10; n++) {
    for (var i in portals) {
        var r = new RegExp(portals[i] + '\.p' + n, 'i');
        if ((r).test(hostname)) {
            SITE = portals[i] + '.p' + n;
        }
    }
}

if ((/tomas\.by/i).test(hostname)) {
    SITE = 'tomas.by';
} else if ((/tomas\.kz/i).test(hostname)) {
    SITE = 'tomas.kz';
} else if ((/satom.ru/i).test(hostname)) {
    SITE = 'satom.ru';
} else if ((/stroyspravka\.com/i).test(hostname)) {
    SITE = 'stroyspravka.com';
} else if (m = hostname.match(/tomaskz\.t\d/i)) {
    SITE = m[0];
} else if (m = hostname.match(/tomasby\.t\d/i)) {
    SITE = m[0];
} else if (m = hostname.match(/satom\.t\d/i)) {
    SITE = m[0];
} else if (m = hostname.match(/zakupka\.t\d/i)) {
    SITE = m[0];
} else if (m = hostname.match(/zakupka\.p\d/i)) {
    SITE = m[0];
}

if (typeof(SITE_PHP) != 'undefined' && SITE_PHP != '') {
    SITE = SITE_PHP;
}

if ((/satom/i).test(SITE)) {
    CURRENCY = 'руб';
}
if ((/tomas\.?by/i).test(SITE)) {
    CURRENCY = 'руб';
}
if ((/tomas\.?kz/i).test(SITE)) {
    CURRENCY = 'тг';
}

$(function () {
    if (!$('.b-image-tracker').length) {
        var downloadImage = new Image();
        downloadImage.src = '//' + SITE + "/track-image/";
    }
});

/**
 * Глобальный объект для задания пользовательских данных
 * @type {{}}
 */
var env = {
    data        : {},
    /**
     * Строит по пути дерево объектов в env.data, с сохранением существующих свойств внутри каждой ветви
     *
     * env.data.a = { x:1, y:{} , z: 3};
     * env.data.a.y = {a:1, b:2};
     * env.checkPath('a.y.f'); Сохранит все существующие и добавит  env.data.a.y.f = {}
     * env.checkPath('a.y.f', 5); ===== env.data.a.y.f = 5
     *
     * Если по пути существует значение - не применяем второй параметр
     *
     * @param path
     * @param val
     */
    checkPath   : function (path, val) {
        if (typeof (val) == 'undefined') {
            val = {};
        }
        if (typeof (path) == 'string' && path != '') {
            var paths = path.split('.');
            env._addToItem(env.data, paths, val);
            return true;
        }
        return false;
    },
    _addToItem  : function (obj, paths, val) {
        var itemP = paths[0];
        obj[itemP] = obj[itemP] || {};
        paths.shift();
        if (paths.length > 0) {
            return env._addToItem(obj[itemP], paths, val);
        }
        if (typeof (obj[itemP]) == 'object' && Object.keys(obj[itemP]).length == 0) {
            obj[itemP] = val;
        }

        return obj;
    },
    /**
     * Получение значения по пути
     *  env.getByPath('a.y.f', []);
     *  Вернет пустой массив или значение если присутствует по пути env.data.a.y.f
     *
     * @param path
     * @param defaultVal
     * @returns {*}
     */
    getByPath   : function (path, defaultVal) {
        var paths = path.split(".");
        if (!env.checkPath(path, defaultVal)) {
            return defaultVal;
        }
        return env._getBypaths(env.data, paths, defaultVal);
    },
    _getBypaths : function (obj, paths, defaultVal) {
        var itemP = paths[0];
        paths.shift();
        if (typeof (obj[itemP]) == 'undefined') {
            return defaultVal;
        }
        if (paths.length > 0) {
            return env._getBypaths(obj[itemP], paths, defaultVal);
        }
        return (typeof (obj[itemP]) != 'undefined') ? obj[itemP] : defaultVal;
    },

    /**
     * Задание значения в объекте по пути, если нет данного пути - зоздается.
     * @param path
     * @param data
     * @returns {boolean}
     */
    setDataByPath : function (path, data) {
        if (typeof (path) != 'string' || typeof (data) == 'undefined' || !env.checkPath(path, data)) {
            return false;
        }

        var tempFunct = function (v) {
            return false;
        };
        /**
         * Использовал временую функцию чтобы была возможность записать значение любого типа
         * Eval позволил сократить код.
         */
        eval('tempFunct = function(v){ env.data.' + path + ' = v; return true; }');

        return tempFunct(data);
    }

};

//window.onerror = function (error, file, line) {
//    if (!file) {
//        return true;
//    }
//
//    if (/CSSStyleDeclaration/gi.test(error)) {
//        return true;
//    }
//
//    if (/getComputedStyle/gi.test(error)) {
//        return true;
//    }
//
//    if (/this\.getDoc\(\)/gi.test(error)) {
//        return true;
//    }
//
//    if (/Unexpected token/gi.test(error) && line == 1) {
//        return true;
//    }
//
//    var r = new RegExp('^http:\/\/([\w^\.\d]+\.)?' + SITE + '(.*)?$', 'gi');
//    if (file.match(r)) {
//        var info = {};
//        info.errorMessage = error + ' [' + file + ':' + line + ']';
//        info.location = document.location.href;
//        info.browser = navigator.userAgent;
//        info.os = navigator.platform;
//        info.isCookies = navigator.cookieEnabled;
//        $.post(
//            '/ajax/JSError/',
//            {
//                info : info
//            },
//            function () {
//
//            },
//            'json');
//    }
//}

/********************************************************************************
 *                                Form Validation
 */
var er_b = '<span class="sprite p_error_icon"></span><span class="p_error">';
var er_e = '</span>';

/* Сериализация элементов формы в JSON */
(function ($) {
    $.fn.serializeJSON = function () {
        var json = {};
        jQuery.map($(this).serializeArray(), function (n, i) {
            json[n['name']] = n['value'];
        });
        return json;
    };
})(jQuery);

function highlightErrorField(id, elem) {
    var field = elem ? $(elem) : $('#' + id);

    field.addClass('extpp_error b-form__input_style_error')
        .one('focus', function () {
            $(this).removeClass('extpp_error b-form__input_style_error');
            if (!elem) {
                $('#error_' + id).hide();
            }
        });

    /*Hook open tab is isset error message*/
    var tab = field.parents('.zk-tabs-content-item').attr('tab');
    if (tab !== undefined) {
        $('li[tab="' + tab + '"] a').click();
        window.location.hash = tab;
    }

    $('input[name="' + id + '"]')
        .one('focus', function () {
            $(this).removeClass('extpp_error b-form__input_style_error');
            $('#error_' + id).hide();
        });

    $('#ZKBalloon').fadeOut(300);
}

function wrap_error(text) {
    return er_b + text + er_e;
}
function show_error(selector, msg) {
    $(selector).html(wrap_error(msg)).show(0);
}
function show_error_check_checkbox(selector) {
    show_error(selector, 'Необходимо заполнить поле');
}
function show_error_field_empty(selector) {
    show_error(selector, 'Необходимо ввести значение');
}

/* печатает в блоке однострочное сообщение */
function print_message(text, type, selector) {
    $(selector).html('<span class="message_' + type + '">' + text + '</span>').show();
    return true;
}
function print_big_message(text, type, selector, nostrong) {
    var body = '<strong>' + text + '</strong>';
    if (nostrong) {
        body = text;
    }
    $(selector).html('<div class="big_report_block_' + type + '"><span class="ico"></span>' + body + '</div>').show();
    return true;
}

/* добавляет пробелы рядом со знаками препинания */
function arrange_punctuation_marks(str) {
    return str.replace(
        /[\,\.\:\;\!\?\)]{1}[a-zа-яё]|[a-zа-яё]+[\(]/gi,
        function (args) {
            args = args.replace(/([\,\.\:\;\!\?\)])/gi, '$1 ', args);
            return args.replace(/([\(])/gi, ' $1');
        }
    );
}

/* скролит страницу к родительскому диву поля с ошибкой */
function scroll_to_error(fieldname) {
    if ($("#" + fieldname).parents(".no-scroll").length == 0) {
        if ($('#' + fieldname + ':visible').length == 0 && $("#" + fieldname).parents('.zk-tabs-content-item').length > 0) {
            var tab = $("#" + fieldname).parents('.zk-tabs-content-item:first').attr("tab");
            var tabLink = $('li[tab="' + tab + '"] > a');
            if (tabLink.length > 0) {
                tabLink.click();
            }
        }
        $.scrollTo($("#" + fieldname).parents(".extpp_row"), 800, {
            offset : {
                top : -50
            }
        });
    }
}

/* проверка поля на непустоту */
function check_field_is_empty(fieldname, error, min_length, required, show_error) {
    if (!required && $("#" + fieldname).length == 0) {
        return true;
    }

    var show_error = typeof show_error == 'undefined' ? true : false;

    var fld_value = $.trim($("#" + fieldname).val());
    if (fld_value == '') {
        if (show_error) {
            show_error_field_empty("#error_" + fieldname);
            highlightErrorField(fieldname);
            if (error != 1) {
                scroll_to_error(fieldname);
            }
        }
        return false;
    } else {
        min_length = (typeof min_length == 'undefined') ? 0 : parseInt(min_length);

        if (min_length > 0 && fld_value.length < min_length) {
            $("#error_" + fieldname).html(wrap_error('Минимальная длина текста для поля - ' + min_length)).show();
            highlightErrorField(fieldname);
            if (error != 1) {
                scroll_to_error(fieldname);
            }
            return false;
        } else {
            return true;
        }
    }
}

function check_field_is_required(fieldname, error, min_length) {
    return check_field_is_empty(fieldname, error, min_length, true);
}

/* включает ошибку для поля */
function field_trigger_error(fieldname, error, msg, isFieldInFrame) {
    msg = msg ? msg : 'Неверно заполнено поле';
    $("#error_" + fieldname).html(wrap_error(msg)).show();
    highlightErrorField(fieldname);
    if (error != 1) {
        if (isFieldInFrame) {//для wysiwyg
            fieldname = 'error_' + fieldname;
        }
        scroll_to_error(fieldname);
    }
    return false;
}

/* проверка поля файла на непустоту */
function check_file_is_empty(fieldname, error) {
    if ($.trim($("." + fieldname).val()) == '') {
        $("#error_" + fieldname).html(wrap_error('Необходимо выбрать файл')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

/* проверка select на непустоту */
function check_select_is_empty(fieldname, error) {
    var select_value = $("#" + fieldname + ' :selected').val();
    if (select_value == undefined || select_value == '' || select_value == '0') {
        $("#error_" + fieldname).html(wrap_error('Необходимо выбрать значение')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

/* проверка выбран ли хоть один чекбокс */
function check_checkbox_is_empty(fieldname, error) {
    if ($("#" + fieldname + " li input[type='checkbox']").filter(':checked').size() == 0) {
        $("#error_" + fieldname).html(wrap_error('Необходимо заполнить поле')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

/* проверка выбран ли хоть один радиобаттон */
function check_radio_is_checked(fieldname, error, msg) {
    if ($("input[name='" + fieldname + "']:checked").length == 0) {
        highlightErrorField(fieldname);
        $("#error_" + fieldname).html(wrap_error(msg || 'Необходимо выбрать значение')).show();
        if (error != 1) {
            scroll_to_error("error_" + fieldname);
        }
        return false;
    } else {
        return true;
    }
}

/* проверка отмечена или галочка согласия с политикой конфиденциальности */
function check_privacy_checkbox_is_checked(fieldname, error) {
    return check_radio_is_checked(fieldname, error, 'Необходимо согласиться с условиями');
}

/* проверка поля на переизбыток введенных символов */
function check_field_overflow(fieldname, maxlength, error) {
    var str = $("#" + fieldname).val();
    if (!str) {
        return true;
    }

    if (typeof tinyMCE != 'undefined' && tinyMCE.get(fieldname)) {
        str = $(tinyMCE.get(fieldname).getContent({format : 'raw'})).text();
    }

    var dif = maxlength - str.length;
    if (dif < 0) {
        highlightErrorField(fieldname);
        $("#error_" + fieldname).html(wrap_error('Превышено максимально допустимое количество символов на ' + (dif * -1) + '.')).show();
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

/* текущая проверка полей на переполнение */
function check_field_length(event) {
    var maxlength = event.data.maxlength;
    var fieldname = event.data.fieldname;
    var content = '';
    var dif = maxlength;
    if (typeof tinyMCE != 'undefined' && tinyMCE.get(fieldname) && tinyMCE.get(fieldname).serializer != null) {
        content = $(tinyMCE.get(fieldname).getContent({format : 'raw'})).text();
        dif = dif - content.length;
    } else {
        dif = dif - $('#' + fieldname).val().length;
    }
    if (dif < 0) {
        $("#error_" + fieldname).html(wrap_error('Превышено максимально допустимое количество символов на ' + (dif * -1) + '.')).show();
        highlightErrorField(fieldname);
    } else {
        $(this).removeClass('extpp_error b-form__input_style_error');
        if (typeof tinyMCE != 'undefined' && tinyMCE.get(fieldname) && tinyMCE.get(fieldname).serializer != null) {
            $("#error_" + fieldname).html("<div style='text-align:right;margin-top:5px;'>Символов: " + content.length + "</div>").show();
        } else {
            $("#error_" + fieldname).html("").hide(0);
        }
    }
}

function check_capslock(fieldname, error) {
    var str = $("#" + fieldname).val().replace(/["|'|«|“][^"|'|«|»]*["|'|»|”]/g, '');
    var allowed_length = Math.ceil(str.length / 2);
    var patt = new RegExp("[A-ZА-ЯЁҐЄЇІ]{" + allowed_length + ",}");
    if ((patt).test(str)) {
        $("#error_" + fieldname).html(wrap_error('Пожалуйста, используйте заглавные буквы только для сокращений.')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_mail(mail) {
    mail = $.trim(mail);
    return (/^(([єЄїЇіІґҐёЁа-яА-Яa-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=_-])+\.)*([єЄїЇіІґҐёЁа-яА-Яa-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=_-])+@([єЄїЇіІґҐёЁа-яА-Яa-zA-Z0-9-]+\.)+[єЄїЇіІґҐёЁа-яА-Яa-zA-Z0-9-]+$/i).test(mail);
}

function check_field_mail(fieldname, error) {
    var mail = $("#" + fieldname).val();

    if (check_mail(mail) === false) {
        $("#error_" + fieldname).html(wrap_error('E-mail введен неверно')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_field_pass(fieldname, error) {
    if (!(/^([a-z0-9\!\@\#\$\%\^\&\*\(\)\-\_\+\=\;\:\,\.\/\?\\\|\`\~\[\]\{\}]{3,})$/i).test($("#" + fieldname).val())) {
        $("#error_" + fieldname).html(wrap_error('Только цифры и латинские буквы, без пробелов')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_site(site) {
    return (/^(https?:\/\/)?(([єїіґёа-я0-9a-z_!~*().&=+$%\-]+:)?[0-9a-z_!~*().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([єїіґёа-я0-9a-z_!~*()-]+\.)*([єїіґёа-я0-9a-z][єїіґёа-я0-9a-z-]{0,61})*[єїіґёа-я0-9a-z]\.[єїіґёа-яa-z0-9-]{2,20})(:[0-9]{1,4})?((\/?)|(\/[єїіґёа-я0-9a-z_!~*().;?:@&=+$,%#-]+)+\/?)$/i).test($.trim(site));
}

function check_field_site(fieldname, error) {
    var site = $("#" + fieldname).val();
    if (!check_site(site)) {
        $("#error_" + fieldname).html(wrap_error('Адрес введен неверно')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_is_internal_link(fieldname, error, domain) {
    var link = $("#" + fieldname).val();
    var punycode_domain = domain.replace(/^(https?:\/\/)?([^\/]+)(\/.*)?$/gi, function (m, scheme, domain, url) {
        return (scheme ? scheme : '') + punycode.encode(domain) + (url ? url : '');
    });

    var reg = OURS_SITES + '|' + (domain.length > 0 ? SITE + '|' + domain : SITE  ) + '|' + (punycode_domain.length > 0 ? SITE + '|' + punycode_domain : SITE  );
    var reg_go = '\/go\/zk_go_';
    var issetGo = (new RegExp(reg_go, 'gi')).test(link);
    if (!(new RegExp(reg, 'gi')).test(link) || issetGo) {
        var msg = issetGo ? 'Ссылки с использованием &laquo;/go/&raquo;' : 'Ссылки на внешние ресурсы';
        $("#error_" + fieldname).html(wrap_error(msg + ' не допускаются')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_is_go_link(fieldname, error) {
    var link = $("#" + fieldname).val();
    if ((new RegExp('\/go\/zk_go_', 'gi')).test(link)) {
        $("#error_" + fieldname).html(wrap_error('Ссылки с использованием &laquo;/go/&raquo; не допускаются')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_is_link_in_domain(fieldname, error, domain) {
    var link = $("#" + fieldname).val();
    var punycode_domain = domain.replace(/^(https?:\/\/)?([^\/]+)(\/.*)?$/gi, function (m, scheme, domain, url) {
        return (scheme ? scheme : '') + punycode.encode(domain) + (url ? url : '');
    });

    var reg = OURS_SITES + '|' + (domain.length > 0 ? domain : SITE) + '|' + (punycode_domain.length > 0 ? punycode_domain : SITE);
    if (!( new RegExp(reg, 'gi') ).test(link)) {
        $("#error_" + fieldname).html(wrap_error('Ссылки на внешние ресурсы не допускаются')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_is_link(fieldname, error) {
    var link = $("#" + fieldname).val();
    if (!/^(https?:\/\/)?[a-zа-яёъ0-9_\-]+\..+$/gi.test(link)) {
        $("#error_" + fieldname).html(wrap_error('Введите корректную ссылку.')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_is_http_link(fieldname, error) {
    var link = $("#" + fieldname).val();
    if (!/^https?:\/\/([^@./]+\.)+[^/]+/gi.test(link)) {
        $("#error_" + fieldname).html(wrap_error('Введите корректную ссылку.')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function extract_all_urls(text) {
    var re = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/ig;
    // get all hrefs first
    var matches = $(text).find('[href]');
    var hrefs = [];
    $.each(matches, function (i, el) {
        hrefs.push($(el).attr('href'));
    });
    // append all matched by regexp
    matches = text.match(re);
    if (matches) {
        $.each(matches, function (i, el) {
            hrefs.push(el);
        });
    }
    // reduce the array to contain no dupes via grep/inArray
    return $.grep(hrefs, function (v, k) {
        return $.inArray(v, hrefs) === k;
    });
}

function check_has_external_link(fieldname, error, domain) {
    var punycode_domain = domain.replace(/^(https?:\/\/)?([^\/]+)(\/.*)?$/gi, function (m, scheme, domain, url) {
        return (scheme ? scheme : '') + punycode.encode(domain) + (url ? url : '');
    });
    var text = $("#" + fieldname).val();
    var urls = extract_all_urls(text);
    var reg = new RegExp(OURS_SITES + '|' + (domain.length > 0 ? domain : SITE) + '|' + (punycode_domain.length > 0 ? punycode_domain : SITE), 'i');
    for (var i in urls) {
        var el = urls[i];
        if (!reg.test(el)) {
            $("#error_" + fieldname).html(wrap_error('Ссылки на внешние ресурсы не допускаются')).show();
            highlightErrorField(fieldname);
            if (error != 1) {
                scroll_to_error(fieldname);
            }
            return true;
        }
    }
    return false;
}

function check_field_text(fieldname, text, error) {
    if ($("#" + fieldname).val() == text) {
        highlightErrorField(fieldname);
        $("#error_" + fieldname).html(wrap_error('Необходимо заполнить поле')).show();
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_postcode(fieldname, length, error) {
    var postcode = $("#" + fieldname).val();
    var error = false;
    if (length == 0) {
        if (!(/^\d{2,10}$/).test(postcode)) {
            error = true
        }
    } else {
        var regexp = new RegExp('^\\d{' + length + '}$', 'gi');
        console.log(regexp);
        if (!regexp.test(postcode)) {
            error = true
        }
    }

    if (error) {
        $("#error_" + fieldname).html(wrap_error('Неверно задан почтовый индекс')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_is_correct_date(fieldname, format, error) {
    var dateS = $("#" + fieldname).val();
    if (dateS.match(format) === null) {//неверный формат
        $("#error_" + fieldname).html(wrap_error('Неверно задана дата')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_date_period(startDateFieldName, endDateFieldName, error) {
    var format = /(\d+)\.(\d+).(\d+)/;
    var startDate = Date.parse($('#' + startDateFieldName).val().replace(format, "$2/$1/$3"));
    if (isNaN(startDate)) {
        return field_trigger_error(startDateFieldName, error, 'Неверно задана дата');
    }
    var endDate = Date.parse($('#' + endDateFieldName).val().replace(format, "$2/$1/$3"));
    if (isNaN(endDate)) {
        return field_trigger_error(endDateFieldName, error, 'Неверно задана дата');
    }
    if (endDate < startDate) {
        return field_trigger_error(endDateFieldName, error, 'Дата окончания не должна быть меньше даты начала');
    }
    return true;
}

function check_field_is_number(fieldname, error, positive, message) {
    if ($('#' + fieldname).length == 0) {
        return true;
    }
    var number = $('#' + fieldname).val();
    number = number.replace(/\s/gi, '').replace(/,/gi, '.');
    var pattern = '';
    if (positive) {
        pattern = /^\d+([\.,]\d{1,2})?$/;
    } else {
        pattern = /^-?\d+([\.,]\d{1,2})?$/;
    }
    if (!(pattern).test(number)) {
        message = message || 'Неверно задано значение';
        $("#error_" + fieldname).html(wrap_error(message)).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_is_number_by_selector(selector, error, positive) {
    if ($(selector).length == 0) {
        return true;
    }
    var number = $(selector).val();
    number = number.replace(/\s/gi, '').replace(/,/gi, '.');
    var pattern = '';
    if (positive) {
        pattern = /^\d+([\.,]\d{1,2})?$/;
    } else {
        pattern = /^-?\d+([\.,]\d{1,2})?$/;
    }
    if (!(pattern).test(number)) {
        var id = $(selector + ' + .p_error_block').attr('id');
        $(selector + ' + .p_error_block').html(wrap_error('Неверно задано значение')).show();
        highlightErrorField(id);
        if (error != 1) {
            scroll_to_error(id);
        }
        return false;
    }
    return true;
}

/**
 * Проверка значения поля на число, без вывода ошибки.
 *
 * @param fieldname - ид поля
 * @param positive - только положительные или 0
 * @param onlyMoreNul - только больше нуля
 * @returns {boolean}
 */
function check_field_is_number_no_show(fieldname, positive, onlyMoreNul) {

    positive = (typeof positive != 'undefined') ? positive : 0;
    onlyMoreNul = (typeof onlyMoreNul != 'undefined') ? onlyMoreNul : 0;

    var $field = $('#' + fieldname);
    if ($field.length == 0) {
        return true;
    }
    var number = $field.val();
    number = number.replace(/\s/gi, '').replace(/,/gi, '.');
    var pattern = '';
    if (positive) {
        pattern = /^\d+([\.,]\d{1,})?$/;
    } else {
        pattern = /^-?\d+([\.,]\d{1,})?$/;
    }
    if (!(pattern).test(number)) {
        return false;
    } else if (onlyMoreNul && parseFloat(number) <= 0) {
        return false;
    } else {
        return true;
    }
}

function check_field_is_digit(fieldname, error, required) {
    if (!required && $.trim($("#" + fieldname).val()) == '') {
        return true;
    }
    var number = $('#' + fieldname).val();
    number = number.replace(/\s/gi, '');
    var pattern = /\d$/;
    if (!(pattern).test(number)) {
        $("#error_" + fieldname).html(wrap_error('Неверно задано значение. Допускаются только цифры.')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_is_greater_than(fieldname, error, number2) {
    var number = parseFloat($('#' + fieldname).val().replace(/,/gi, '.'));

    if (number <= number2) {
        $("#error_" + fieldname).html(wrap_error('Значение должно быть больше ' + number2)).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_is_less_or_equal_than(fieldname, error, number2) {
    var number = parseFloat($('#' + fieldname).val().replace(/,/gi, '.'));

    if (number > number2) {
        $("#error_" + fieldname).html(wrap_error('Значение должно быть меньше или равно ' + number2)).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

function check_field_is_correct_phone_note(fieldname, error) {
    var phoneParts = $("#" + fieldname).val().split('-');
    var note = phoneParts[3];

    if (typeof(note) != 'undefined' && !note.search(/^(^[\s|\d|\(|\+|_|)|\[|\]|\}}\{|\.|\\|\/])/)) {
        $("#error_" + fieldname).html(wrap_error('В примечание нельзя добавлять телефон')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }

    return true;
}

function check_field_is_wrong_phone(fieldname, minlen, maxlen, error) {
    var phoneParts = $("#" + fieldname).val().split('-');
    var mainPhone = phoneParts[0] + '' + phoneParts[1];

    if (
        (phoneParts.join('') != '' && (mainPhone.length < minlen || mainPhone.length > maxlen))
        || (phoneParts.join('') != '' && phoneParts[1].length < 4)
        || (phoneParts.join('') != '' && phoneParts[0].length < 2)
    ) {
        $("#error_" + fieldname).html(wrap_error('Неверный формат телефона')).show();
        highlightErrorField(fieldname);

        if (error != 1) {
            scroll_to_error(fieldname);
        }

        return false;
    }

    return true;
}

function check_field_is_wrong_phone4(fieldname, error_field, minlen, maxlen, error) {
    var mainPhone = $("#" + fieldname).val();
    mainPhone = mainPhone.replace(/[^\d]/gi, '');

    if ((mainPhone.length < minlen || mainPhone.length > maxlen) && mainPhone) {
        $("#error_" + error_field).html(wrap_error('Неверный формат телефона')).show();
        highlightErrorField(fieldname);

        if (error != 1) {
            scroll_to_error(fieldname);
        }

        return false;
    }

    return true;
}

function check_field_is_wrong_phone2(fieldname, minlen, maxlen, error) {
    var mainPhone = $("#" + fieldname).val();

    mainPhone = mainPhone.replace(/[^\d]/gi, '');

    if ((mainPhone.length < minlen || mainPhone.length > maxlen) && mainPhone) {
        $("#error_" + fieldname).html(wrap_error('Неверный формат телефона')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }

    return true;
}

function check_field_is_wrong_phone3(fieldname, error_fieldname, minlen, maxlen, error) {
    var mainPhone = $("#" + fieldname).val();

    mainPhone = mainPhone.replace(/[^\d]/gi, '');

    if ((mainPhone.length < minlen || mainPhone.length > maxlen) && mainPhone) {
        $("#error_" + error_fieldname).html(wrap_error('Неверный формат телефона')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }

    return true;
}

function check_phone(event) {
    var maxlen = event.data.maxlength;
    var minlen = event.data.minlength;
    var fieldname = 'tels_num_' + $(event.target).parent('div').attr("id").split('_').pop();

    var phoneParts = $("#" + fieldname).val().split('-');
    var mainPhone = phoneParts[0] + '' + phoneParts[1];
    var note = phoneParts[3];

    if (phoneParts.join('') != '' && (mainPhone.length < minlen || mainPhone.length > maxlen)) {
        $("#error_" + fieldname).html(wrap_error('Неверный формат телефона')).show();
        highlightErrorField(fieldname);
    } else if (!note.search(/^(^[\s|\d|\(|\+|_|)|\[|\]|\}}\{|\.|\\|\/])/)) {
        $("#error_" + fieldname).html(wrap_error('В примечание нельзя добавлять телефон')).show();
        highlightErrorField(fieldname);
    } else {
        $("#error_" + fieldname).html("").hide(0);
    }
}

function check_is_only_digits(fieldname, error) {
    var val = $("#" + fieldname).val();
    if ((/[^0-9]/gi).test(val) && val != '') {
        $("#error_" + fieldname).html(wrap_error('Введите целое положительное число')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_is_lowercase_only(fieldname, error) {
    var val = $("#" + fieldname).val();
    for (var i = 0, len = val.length, count = 0, ch; i < len; ++i) {
        ch = val.charAt(i);
        if (ch >= 'A' && ch <= 'Z') ++count;
    }
    if (count > 0) {
        $("#error_" + fieldname).html(wrap_error('Символа в верхнем регистре не допустимы')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_is_latin_only(fieldname, error) {
    var val = $("#" + fieldname).val();
    if (val.match(/([а-яёА-ЯЁ]+)/)) {
        $("#error_" + fieldname).html(wrap_error('Вводите только латинские буквы')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        return true;
    }
}

function check_is_number(fieldname, error, positive) {
    var val = $("#" + fieldname).val();
    if ((!is_number(val) && !is_float(val)) && val != '') {
        $("#error_" + fieldname).html(wrap_error('Введите число')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    } else {
        if (positive) {
            if (parseFloat(val) < 0) {
                $("#error_" + fieldname).html(wrap_error('Введите число больше нуля.')).show();
                highlightErrorField(fieldname);
                if (error != 1) {
                    scroll_to_error(fieldname);
                }
                return false;
            }
        }
        return true;
    }
}

function ajax_field_check(fieldname, url, error, param) {
    var result = error;
    var data = {};
    data[fieldname] = $("#" + fieldname).val();
    data['param'] = param;
    $.ajax({
        url      : url,
        type     : "POST",
        dataType : "json",
        async    : false,
        data     : data,
        success  : function (data) {
            if (data.type == 'error') {
                $("#error_" + fieldname).html(wrap_error(data.message)).show();
                if (error != 1) {
                    scroll_to_error(fieldname);
                    result = 1;
                }
            }
        }
    });

    return result;
}

function is_float(mixed_var) {
    mixed_var = mixed_var.replace(/,/gi, '.') * 1;
    return +mixed_var === mixed_var && !!(mixed_var % 1);
}

function is_int(mixed_var) {
    mixed_var = mixed_var * 1;
    return typeof mixed_var == 'number' && mixed_var % 1 == 0;
}

function is_number(mixed_var) {
    return (is_int(mixed_var) || is_float(mixed_var)) ? true : false;
}

function formatPrice(event) {
    s = $(this).val();
    for (var i = 0, l = s.length, c, r = '', dot; i < l; ++i)
        if (((c = s.charAt(i)) >= '0' && c <= '9') || (!dot && (c === '.' || c === ',') && (dot = 1))) r += c;
    $(this).val(r);
}

function check_field_phone_number(fieldname, error) {
    var phone_number = $("#" + fieldname).val();

    if (!(/^([0-9]{5,12})$/).test(phone_number)) {
        $("#error_" + fieldname).html(wrap_error('Телефон введен неверно')).show();
        highlightErrorField(fieldname);
        if (error != 1) {
            scroll_to_error(fieldname);
        }
        return false;
    }
    return true;
}

/*								End Form Validation
 *********************************************************************************/

function RemoveChars(string) {
    if (typeof string !== 'undefined') {
        return string.replace(/\D/g, '');
    }
}

/********************************************************************************
 *                                Show-hide
 *
 *    Отображает и скрывает следующий за текущим узлом див
 */
$(".show-hide-next-div").on('click', function () {
    $(this).parents(":first").next("div").toggleClass("hide");
    $(this).trigger('fake_click');
    return false;
});
/*								End Show-hide
 *********************************************************************************/

/********************************************************************************
 *                                Filter Swither
 *
 *    Отображает и скрывает все пункты фильтров
 */
$(".filter_switcher").click(function () {
    var filter = $(this).attr("id");
    $("#other_" + filter).toggleClass("hide");
    if ($("#other_" + filter).is(".hide")) {
        $(this).find(".filter_action").html("Все");
        $(this).find(".filters_plus").css("background-position", "0 -1697px");
    } else {
        $(this).find(".filter_action").html("Свернуть");
        $(this).find(".filters_plus").css("background-position", "0 -1683px");
    }
})
/*								End Filter Swither
 *********************************************************************************/

/********************************************************************************
 *                                Registration Teaser
 *    Cкрывает блок Хотите, чтобы ваши товары ....
 */
$(function () {
    $("#close-registration-teaser").click(function () {
        $('#search-info').remove();
        var expires = new Date();
        expires.setDate(expires.getDate() + 7);
        setCookie('IsSearchInformerDisabled', 1, expires, '/', SITE);
        return false;
    })
})
/*								End Registration Teaser
 *********************************************************************************/

/**
 * Return number of visible slides and their width
 * Try to show as max slides as possible within current block width
 * @param width
 * @param norm_slide_width
 * @param margin
 * @param max_visible
 * @param some_magic
 * @returns {{num: number, width: number}}
 */
function get_slider_params(width, norm_slide_width, margin, max_visible, some_magic) {
    var mc = Math.round(width / (norm_slide_width + margin));
    if (mc > max_visible) mc = max_visible;
    if (width - mc * (norm_slide_width) < 0) {
        if (mc > 1) mc--;
    }
    var slide_width = (mc <= (max_visible - 1)) ? Math.floor(width / mc) : (Math.floor(width / mc) - some_magic);
    return {num : mc, width : slide_width};
}

$(function () {
    window.informers_on_page = [];
    var loading_informers = false;

    function get_informers() {
        // блоки ожидающие загрузки объявлений
        var $informers = $(".informer-block").not(".no-ajax");
        if ($informers.length == 0 || loading_informers) {
            return false;
        }

        var top = $(window).height() + $(window).scrollTop();
        var left = $(window).width() + $(window).scrollLeft();

        // ищем блок который можно загрузить
        var $this = null;
        $informers.each(function (index, el) {
            var $el = $(el);

            if ($this !== null || !($el.offset().top < top && $el.offset().left < left + 300)) {
                return;
            }

            $this = $el;
        });

        if ($this === null) {
            return setTimeout(get_informers, 300);
        }

        loading_informers = true;
        $.ajax({
            url      : "/ajax/Catalog/GetInformers/",
            type     : "post",
            dataType : 'json',
            data     : ({
                width             : $(document).width(),
                search            : $this.data("search"),
                count             : $this.data("count"),
                category          : $this.data("category"),
                type              : $this.data("type"),
                informers_on_page : informers_on_page
            }),
            success  : function (data) {
                if (!data.html) {
                    $this.addClass('hide');
                }
                $this.find(".informer-content").html(data.html);
                $(".informer-block").css({"min-height" : "0"});
                var slider;
                if (data.html) {
                    $this.addClass('open');
                    // check if need slider; slide horizontal informers and choose width/number of visible slides
                    if ($this.hasClass('informer-block__horizontal')) {
                        // check how many informers we have, drop some magic values
                        var max_visible = $this.hasClass('informer-vertical-marker') ? 2 : 4;
                        var magic = 6;
                        if (max_visible > $this.find("li").length) {
                            max_visible = $this.find("li").length;
                            if (1 == max_visible) magic = 0;
                        }
                        var p = get_slider_params($this.width(), 242, 0, max_visible, magic);
                        slider = $this.find(".informer_slider").bxSlider({
                            slideWidth   : p.width,
                            minSlides    : p.num,
                            maxSlides    : 4,
                            slideMargin  : 9,
                            moveSlides   : 0,
                            pager        : false,
                            autoControls : true,
                            infiniteLoop : false
                        });
                        $(window).on('resize orientationchange', function (e) {
                            var p = get_slider_params($this.width(), 242, 0, 4, 6);
                            slider.reloadSlider({
                                slideWidth   : p.width,
                                minSlides    : p.num,
                                maxSlides    : 4,
                                slideMargin  : 9,
                                moveSlides   : 0,
                                pager        : false,
                                autoControls : true,
                                infiniteLoop : false
                            });
                        });
                    } else {
                        // vertical informers can convert to horizontal and vica versa
                        var p = get_slider_params($this.width(), 200, 0, 2, 0);
                        var num = 1 == $this.find("li").length ? 1 : 2;
                        slider = $this.find(".informer_slider").bxSlider({
                            mode         : 'vertical',
                            slideWidth   : p.width,
                            minSlides    : num,
                            maxSlides    : 2,
                            slideMargin  : 20,
                            moveSlides   : 0,
                            pager        : false,
                            autoControls : true,
                            infiniteLoop : false
                        });
                    }
                    var _timeout;
                    // listen to custom event rebuid-informers triggered by move_catalog_sidebar
                    $this.on('rebuild-informers', function (event, mode) {
                        var rebuild = function () {
                            // check how many informers we have, drop some magic values
                            //var max_visible = $this.hasClass('informer-vertical-marker') ? 2 : 4;
                            var p;
                            if (mode == "horizontal") {
                                p = get_slider_params($this.width(), 242, 0, 2, 6);
                                p.maxSlides = 2;
                                p.slideMargin = 9;
                                p.mode = "horizontal";
                            } else {
                                p = get_slider_params($this.width(), 200, 0, 2, 0);
                                p.num = 1 == $this.find("li").length ? 1 : 2;
                                p.maxSlides = 2;
                                p.slideMargin = 20;
                                p.mode = "vertical";
                            }
                            slider = $this.find(".informer_slider").bxSlider({
                                mode         : p.mode,
                                slideWidth   : p.width,
                                minSlides    : p.num,
                                maxSlides    : p.maxSlides,
                                slideMargin  : p.slideMargin,
                                moveSlides   : 0,
                                pager        : false,
                                autoControls : true,
                                infiniteLoop : false
                            });
                        };
                        slider.destroySlider();
                        var ul = $this.find(".informer_slider").clone();
                        $this.find(".informer-content").empty().append(ul);
                        // run later, otherwise height can be wrong :(
                        if (_timeout) {
                            clearTimeout(_timeout);
                        }
                        _timeout = setTimeout(rebuild, 100);
                    });
                }
                // bx-loading оставался после success
                $this.find('.bx-loading').remove();
                informers_on_page = informers_on_page.concat(data.ids);
                $this.addClass('no-ajax');
                loading_informers = false;
                setTimeout(get_informers, 300);
                attach_balloon();

                //fix min-height for informers in sidebar
                var $sideBarInformer = $('.sidebar .informer-block');
                $sideBarInformer.css({
                    minHeight : $sideBarInformer.find('.bx-viewport').height()
                });
            }
        });
    }

    get_informers();
});

// раскрывашка для информеров
$(function () {
    var EXPAND_SIZE = 290;
    $(document).on("hover", ".informer-block-expandable li .informer-container", function (e) {
        var $el = $(e.currentTarget), $bx = $el.parents(".bx-viewport:first");
        if ("mouseenter" == e.type) {
            if (!$bx.data("origin_height")) {
                $bx.data("origin_height", $bx.height());
                // для всех элементов храним top/height (для вертикальных height разный может быть; top для absolute)
                $bx.find("li").each(function () {
                    $(this).data("top", $(this).get(0).offsetTop);
                    $(this).find(".informer-container").data("origin_height", $(this).height());
                });
                // для вертикальных ставим position:absolute и top при инциализации
                if ($bx.parents(".informer-block__vertical").length) {
                    $bx.find("li").each(function () {
                        var $this = $(this);
                        var t = $this.data("top"), h = $this.find(".informer-container").data("origin_height");
                        if (!isNaN(t)) {
                            $this.css({
                                position : "absolute",
                                top      : t,
                                height   : h
                            });
                        }
                    });
                }
            }
            // смотрим сколько открывать
            var hh = $el.find(".informer-hint").show().outerHeight(true);
            if (isNaN(hh)) {
                hh = 40;
            } else {
                hh -= 25;
            }
            hh += $el.find(".informer-title").outerHeight(true) > 30 ? 20 : 0;
            $el.height(EXPAND_SIZE + hh).children("a").height(EXPAND_SIZE + hh);
            $el.parent().css("z-index", 100).css("overflow", "visible");
            $bx.height($bx.data("origin_height") + hh + 2).css("z-index", 100);
        } else {
            var h = $bx.data("origin_height"), h2 = $el.data("origin_height");
            $el.height(h2).children("a").height(h2);
            $el.parent().css("z-index", 0).css("overflow", "hidden");
            $bx.height(h).css("z-index", 0);
            $el.find(".informer-hint").hide();
        }
    });
});

/********************************************************************************
 *                                Action Teaser
 * Cкрывает блок Получайте гарантированные призы ....
 */
$(function () {
    $("#close-action-teaser").click(function () {
        $(this).parent().remove();
        var expires = new Date();
        expires.setDate(expires.getDate() + 30);
        setCookie('ActionTeaserDisabled', 1, expires, '/', SITE);
        return false;
    });
});
/*								End Action Teaser
 *********************************************************************************/

$("#city").click(function () {
    if ($('#cities').is(':hidden'))
        $("#cities").slideDown("fast");
    else
        $("#cities").slideUp("fast");
    return false;
});

/*notes, expo_admin, contacts*/
function showhide(id1) {
    if (id1 == "first") {
        $("#second").hide();
        $("#first").show();
        $("#firstlinks").attr("class", "active");
        $("#secondlinks").attr("class", "inactive");
    }
    if (id1 == "second") {
        $("#first").hide();
        $("#second").show();
        $("#firstlinks").attr("class", "inactive");
        $("#secondlinks").attr("class", "active");
    }
}

/**/

$("#other_nadcats").click(function () {
    if ($("#nadcats").is(":hidden")) {
        $("#nadcats").slideDown("fast");
    } else {
        $("#nadcats").slideUp("fast");
    }
    return false;
});

$("#show-hide").click(function () {
    if ($('#show-hide_block').is(":hidden")) {
        $("#show-hide_block").slideDown("fast");
    } else {
        $("#show-hide_block").slideUp("fast");
    }
    return false;
});

/* проверки и отправка формы комметария */
$('#comments_button').click(function () {
    var error = 0;
    $(".p_error_block").html("").hide();

    if (!check_field_is_empty('author', error)) error = 1;
    if (!check_field_is_empty('authors_mail', error) || !check_field_mail('authors_mail', error)) error = 1;
    if (!check_field_is_empty('text', error)) error = 1;
    if (!check_field_overflow('text', 1200, error)) error = 1;

    if (error == 1) {
        return false;
    } else {
        $.ajax({
            url      : "/ajax/comments/",
            type     : "POST",
            data     : ( $("#comment-form").serializeJSON() ),
            dataType : "JSON",
            success  : function (data) {
                if (data) {
                    var arr = data.message.split("|");
                    $("#comments_report").html(arr[1]).show();
                    if (arr[0] != 1) {
                        var count = data.count;
                        $("#comments_count").html(count);
                        $("#comments_text_count").html(count + ' ' + declension('ответ|ответа|ответов', count));
                        var date = new Date();
                        var cur_date = date.getDate() + '.' + ((date.getMonth().length > 1 ? date.getMonth() : '0' + date.getMonth())) + '.' + date.getFullYear();
                        var comment = '<div class="comment"><strong class="sprite">' + $("#author").val() + '</strong><span>' + cur_date + '</span><p>- ' + nl2br($("#text").val()) + '</p></div>';
                        $("#commentes_title").after(comment);
                        $("#other_nadcats_p").remove();
                        $(".comments_form").remove();
                        $("#no_comments").remove();

                        $('#testimonials_tabs ul').prepend(data.item);
                        $('#testimonials_tabs #comment').remove();
                    }
                }
            }
        });
    }

    return false;
});

/**
 * Возвращает скланиение слова
 *
 * @param words
 * @param num
 * @returns {*}
 */
function declension(words, num) {
    var cases = [2, 0, 1, 1, 1, 2];
    var titles = words.split('|');
    return titles[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[Math.min(num % 10, 5)]];
}

/**/

/********************************************************************************
 *                                Show full seller info(goods and pp)
 */
$(function () {
    $(document).on('click', '.all-contacts', function (e) {
        $(this).find('.phone_end').remove();
        $(this).find('.show_phone').css('opacity', 0).css('cursor', 'default');
        $(this).find('.show_phone_link').css('cursor', 'default');
        $(this).find('.phone_begin').addClass('dashed').css('z-index', 1);
        var $tbl = $(this).find('.all-contacts-table');
        $tbl.removeClass("short");
        // adjust phones positions for phones with no labels
        $tbl.find("tr").find("td:first").css("min-width", "40px");
        var $phone = $(this).find('.phone_begin');
        var left = 0, top = 25;
        var w = $tbl.outerWidth(), h = $tbl.outerHeight();
        var width, offset = $phone.offset().left;
        // get offset from container and container width
        if ($(this).parents(".ui-dialog").length) {
            width = $(this).parents(".ui-dialog").width();
            offset = offset - $(this).parents(".ui-dialog").offset().left;
        } else {
            width = $("#middle").width();
        }
        // move phone block to left if it don`t fit at right
        if ((offset + w) >= width) {
            left = $phone.position().left - w + $phone.width();
            // sometimes long contact blocks don`t fit left too, hide contact labels
            if (left < 0 && offset < (w - $phone.width())) {
                $tbl.addClass("short");
                left = 0;
            }
        }
        // FIXME vertical positioning works only for dialog
        if ($(this).parents(".ui-dialog").length) {
            var height = $(this).parents(".ui-dialog").height();
            if (($phone.offset().top - $(window).scrollTop() + h + 10) >= height) {
                top = $phone.position().top - h;
            }
        }

        // mobile fix
        var $windowWidth = $(window).width();

        if ($windowWidth <= 480) {
            // fix alignment table on mobile devises
            var mobileFixOffset = ( $('.show_phone').width() / 2 );

            /*iphone 5 fix*/
            if ($windowWidth <= 320) {
                mobileFixOffset = 0;
            }
            left = -offset + mobileFixOffset;
        }

        $(this).find('.all-contacts-table').css('left', left + 'px');
        $(this).find('.all-contacts-table').css('top', top + 'px');
        $(this).find('.all-contacts-table').show();

        if ($(this).find('#contact-status') && $(this).find('#show_all_phones')) {
            if (!$(this).hasClass('.phone_end')) {
                var idName = $(this).attr('id');
                if (idName != 'show_all_phones') {
                    $('#show_all_phones').find('.show_phone').css('opacity', 0).css('cursor', 'default');
                    $('#show_all_phones').find('.show_phone_link').css('cursor', 'default');
                    $('#show_all_phones').find('.phone_begin').addClass('dashed').css('z-index', 1);
                    $('#show_all_phones').removeClass('track-event');
                }
                if (idName != 'contact-status') {
                    $('#contact-status').find('.show_phone').css('opacity', 0).css('cursor', 'default');
                    $('#contact-status').find('.show_phone_link').css('cursor', 'default');
                    $('#contact-status').find('.phone_begin').addClass('dashed').css('z-index', 1);
                    $('#contact-status').removeClass('track-event');
                }
            }
        }
        $(this).off('click');

        if ($(this).parents(".b-product_gallery__img").length > 0) {
            $(this).find('.phone_begin').addClass('dashed').css({'position' : 'inherit', 'display' : 'inline'});
        }

        e.stopPropagation();
    });

    $(document).on('mouseleave', '.one_pp_wrap, .pp-header-info, .sidebar-company-info', function () {
        $(this).find('.all-contacts-table').hide();
    });

    $(document).on('click', function (event) {
        if (!$(event.target).hasClass('all-contacts')) {
            $('.all-contacts-table').hide();
        }
    });
})

/*								Show full seller info(goods and pp)
 *********************************************************************************/

/********************************************************************************
 *                                Pics zoom(goods)
 */
var isIn = false; //  глобальные переменные
var newSrc = ''; //
var sWidth = 0;
var sHeight = 0;
var iWidth = 0;
var iHeight = 0;
var currTimeout;
var oldSrc;
var presense;

$(".zoom-image").hover(
    function () {
        if (isIn) {
            window.clearTimeout(currTimeout);
        }

        if ($(this).hasClass("no-image")) {
            return;
        }

        isIn = true;
        var name = $(this).attr('id');

        newSrc = $(this).attr('path');

        obj = $(this).find("img:first");

        currTimeout = window.setTimeout(function () {

            if (!isIn)
                return;

            // obj.parent().eq(0).css('padding', '10px');
            obj.closest("div.pp_pic").css('z-index', '5');
            obj.closest("div.pp_pic").css('position', 'absolute');

            obj.attr("sWidth", obj.width());
            obj.attr("sHeight", obj.height());

            obj.attr("src", newSrc);
            obj.stop().animate({
                    width  : obj.attr("big_width"),
                    height : obj.attr("big_height")
                },
                500);
        }, 500);
    },
    function () {
        isIn = false;
        if ($(this).hasClass("no-image")) {
            return;
        }

        window.clearTimeout(currTimeout);

        $(this).find("span:first").remove();

        var obj = $(this).find("img:first");
        //  obj.parent().eq(0).css("padding", 0);
        obj.stop().animate({
                width  : obj.attr("sWidth"),
                height : obj.attr("sHeight")
            },
            500,
            function () {
                obj.closest("div.pp_pic").css('z-index', '1');
                obj.closest("div.pp_pic").css('position', 'releative');
            });
    });

/*								End Pics zoom(goods)
 *********************************************************************************/

/********************************************************************************
 *                                MAIN SEARCH
 */
function submit_search_form() {
    var q = $.trim($("#search_input").val());
    var search_scope = $("#search_scope").val() == 'goods' ? 't' : $("#search_scope").val();
    if (window.redirect) {
        return false;
    }

    if (q.length > 0 && search_scope != 'tenders') {
        $.ajax({
            url      : '/ajax/categories/check-exact/',
            data     : {
                name : q
            },
            type     : 'POST',
            dataType : 'JSON',
            success  : function (data) {
                var http = ($("#search_in_area").length > 0 && $("#search_in_area").prop("checked") == true) ? '' : '//' + SITE;
                var href = '';
                if ('id' in data && search_scope !== 'f') {
                    href = http + "/" + data.act + "/" + data['en'] + "-" + data['id'] + "/?sc";
                } else {
                    href = http + "/" + search_scope + "/search/" + encodeURIComponent(q.replace(/\//gi, ' ')) + "/" + region_first_url;
                    href += (region_first_url ? "&" : "?");
                    if ($("#search_in_current_rubric").is(":checked")) {
                        href += 'category=' + $("#search_in_current_rubric").val();
                    } else {
                        href += 'bs';
                        if (window.location.pathname == '/') {
                            href += '&sa';
                        }
                    }
                }
                if ($("#search_category_referer").length > 0) {
                    href += '&catref=' + $("#search_category_referer").val();
                }
                if ($('#main_search_form input[name="special"]').length > 0) {
                    href += '&special=1';
                }
                window.location = href;
            }
        });
    }
    return false;
}

// События для активизации поиска
$("#main_search_sbmt").click(submit_search_form);
$("#search_input").bind("keydown", function (event) {
    var e = event || window.event;
    if (e.keyCode == 13) {
        if ($("#search_scope").val() == 'f') {
            setTimeout(submit_search_form, 100);
        } else {
            submit_search_form();
        }
        return false;
    }
});
/*								End Main Search
 *********************************************************************************/

/********************************************************************************
 *                                COOKIES
 */
function setCookie(name, value, expires, path, domain, secure) {
    if (!name || !value) return false;
    var str = name + '=' + encodeURIComponent(value);

    if (expires) str += '; expires=' + expires.toGMTString();
    if (path) str += '; path=' + path;
    if (domain) str += '; domain=' + domain;
    if (secure) str += '; secure';

    document.cookie = str;
    return true;
}

function getCookie(name) {
    var pattern = "(?:; )?" + name + "=([^;]*);?";
    var regexp = new RegExp(pattern);

    if (regexp.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
    }

    return false;
}

/*								End COOKIES
 *********************************************************************************/

/********************************************************************************
 *                                Modal Windows
 */
// close modal window
function closeIt() {
    $("#mask").css("display", "none");
    $("#dialog").css("display", "none");
    return false;
}

// make modal window(journal order)
$(document).ready(function () {
    $('a[name=modal]').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        $('#mask').css({
            'width'  : maskWidth,
            'height' : maskHeight
        });
        $('#mask').show(1);
        $('#mask').fadeTo(1, 0.8);
        var winH = $(window).height();
        var winW = $(window).width();
        var windowTop = $(window).scrollTop();
        $(id).css('top', winH / 2 - $(id).height() / 2 + windowTop);
        $(id).css('left', winW / 2 - $(id).width() / 2);
        $(id).show(1);
        return false;
    });

    $('.window .close').click(function (e) {
        e.preventDefault();
        $('#mask, .window').hide();
    });

    $('#k').click(function () {
        $(this).hide();
        $('.window').hide();
    });
});

// reklama
$('.page').click(function (e) {
    e.preventDefault();
    var id = $(this).attr('href');
    var page = $(this).attr('id');
    if (page == 6) {
        $(id).css("width", "825px");
    } else {
        $(id).css("width", "420px");
    }
    $("#block_img").attr("src", "/pics/page" + page + "b.jpg?new");
    var text = $(this).prev().html();
    $("#block-text").html(text);
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    $('#mask').css({
        'width'  : maskWidth,
        'height' : maskHeight
    });
    $('#mask').show(1);
    $('#mask').fadeTo(10, 0.8);
    var winH = $(window).height();
    var winW = $(window).width();
    var windowTop = $(window).scrollTop();
    $(id).css('top', (winH / 2 - $(id).height() / 2) + windowTop);
    $(id).css('left', winW / 2 - $(id).width() / 2);
    $(id).show(1);
});
/*								End Modal Windows
 *********************************************************************************/

$(function () {
    $(document).on("click", ".show_next_tag_and_remove", function () {
        $(this).next().show();
        $(this).remove();
        return false;
    });
});

/********************************************************************************
 *                                jQuery.ScrollTo
 */
(function (define) {
    'use strict';

    define(['jquery'], function ($) {
        var $scrollTo = $.scrollTo = function (target, duration, settings) {
            return $(window).scrollTo(target, duration, settings);
        };

        $scrollTo.defaults = {
            axis     : 'xy',
            duration : 0,
            limit    : true
        };

        // Returns the element that needs to be animated to scroll the window.
        // Kept for backwards compatibility (specially for localScroll & serialScroll)
        $scrollTo.window = function () {
            return $(window)._scrollable();
        };

        // Hack, hack, hack :)
        // Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
        $.fn._scrollable = function () {
            return this.map(function () {
                var elem = this,
                    isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) !== -1;

                if (!isWin) {
                    return elem;
                }

                var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;

                return /webkit/i.test(navigator.userAgent) || doc.compatMode === 'BackCompat' ?
                    doc.body :
                    doc.documentElement;
            });
        };

        $.fn.scrollTo = function (target, duration, settings) {
            if (typeof duration === 'object') {
                settings = duration;
                duration = 0;
            }
            if (typeof settings === 'function') {
                settings = {onAfter : settings};
            }
            if (target === 'max') {
                target = 9e9;
            }

            settings = $.extend({}, $scrollTo.defaults, settings);
            // Speed is still recognized for backwards compatibility
            duration = duration || settings.duration;
            // Make sure the settings are given right
            settings.queue = settings.queue && settings.axis.length > 1;

            if (settings.queue) {
                // Let's keep the overall duration
                duration /= 2;
            }
            settings.offset = both(settings.offset);
            settings.over = both(settings.over);

            return this._scrollable().each(function () {
                // Null target yields nothing, just like jQuery does
                if (target === null) return;

                var elem = this,
                    $elem = $(elem),
                    targ = target, toff, attr = {},
                    win = $elem.is('html,body');

                switch (typeof targ) {
                    // A number will pass the regex
                    case 'number':
                    case 'string':
                        if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                            targ = both(targ);
                            // We are done
                            break;
                        }
                        // Relative/Absolute selector, no break!
                        targ = win ? $(targ) : $(targ, this);
                        if (!targ.length) return;
                    /* falls through */
                    case 'object':
                        // DOMElement / jQuery
                        if (targ.is || targ.style) {
                            // Get the real position of the target
                            toff = (targ = $(targ)).offset();
                        }
                }

                var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

                $.each(settings.axis.split(''), function (i, axis) {
                    var Pos = axis === 'x' ? 'Left' : 'Top',
                        pos = Pos.toLowerCase(),
                        key = 'scroll' + Pos,
                        old = elem[key],
                        max = $scrollTo.max(elem, axis);

                    if (toff) {// jQuery / DOMElement
                        attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);

                        // If it's a dom element, reduce the margin
                        if (settings.margin) {
                            attr[key] -= parseInt(targ.css('margin' + Pos), 10) || 0;
                            attr[key] -= parseInt(targ.css('border' + Pos + 'Width'), 10) || 0;
                        }

                        attr[key] += offset[pos] || 0;

                        if (settings.over[pos]) {
                            // Scroll to a fraction of its width/height
                            attr[key] += targ[axis === 'x' ? 'width' : 'height']() * settings.over[pos];
                        }
                    } else {
                        var val = targ[pos];
                        // Handle percentage values
                        attr[key] = val && val.slice && val.slice(-1) === '%' ?
                            parseFloat(val) / 100 * max
                            : val;
                    }

                    // Number or 'number'
                    if (settings.limit && /^\d+$/.test(attr[key])) {
                        // Check the limits
                        attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
                    }

                    // Queueing axes
                    if (!i && settings.queue) {
                        // Don't waste time animating, if there's no need.
                        if (old !== attr[key]) {
                            // Intermediate animation
                            animate(settings.onAfterFirst);
                        }
                        // Don't animate this axis again in the next iteration.
                        delete attr[key];
                    }
                });

                animate(settings.onAfter);

                function animate(callback) {
                    $elem.animate(attr, duration, settings.easing, callback && function () {
                            callback.call(this, targ, settings);
                        });
                }
            }).end();
        };

        // Max scrolling position, works on quirks mode
        // It only fails (not too badly) on IE, quirks mode.
        $scrollTo.max = function (elem, axis) {
            var Dim = axis === 'x' ? 'Width' : 'Height',
                scroll = 'scroll' + Dim;

            if (!$(elem).is('html,body'))
                return elem[scroll] - $(elem)[Dim.toLowerCase()]();

            var size = 'client' + Dim,
                html = elem.ownerDocument.documentElement,
                body = elem.ownerDocument.body;

            return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
        };

        function both(val) {
            return $.isFunction(val) || $.isPlainObject(val) ? val : {top : val, left : val};
        }

        // AMD requirement
        return $scrollTo;
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    'use strict';
    if (typeof module !== 'undefined' && module.exports) {
        // Node
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}));
/*								End jQuery.ScrollTo
 *********************************************************************************/

function onlyDigit(input) {
    var value = input.value;
    var re = /а|б|в|г|д|е|ё|ж|з|и|й|к|л|м|н|о|п|р|с|т|у|ф|х|ц|ч|ш|щ|ъ|ы|ь|э|ю|я|А|Б|В|Г|Д|Е|Ё|Ж|З|И|Й|К|Л|М|Н|О|П|Р|С|Т|У|Ф|Х|Ц|Ч|Ш|Щ|Ъ|Ы|Ь|Э|Ю|Я|q|w|e|r|t|y|u|i|o|p|l|k|j|h|g|f|d|s|a|z|x|c|v|b|n|m| |,|\.|~|!|@|#|\$|%|\^|\&|\*|\(|\)|\-|\_|\=|\+|\?|`|\[|\]|\{|\}|\<|\>|\"|/gi;
    if (re.test(value)) {
        value = value.replace(re, '');
        input.value = value;
    }
}

function price(input) {
    var value = input.value;
    var re = /а|б|в|г|д|е|ё|ж|з|и|й|к|л|м|н|о|п|р|с|т|у|ф|х|ц|ч|ш|щ|ъ|ы|ь|э|ю|я|А|Б|В|Г|Д|Е|Ё|Ж|З|И|Й|К|Л|М|Н|О|П|Р|С|Т|У|Ф|Х|Ц|Ч|Ш|Щ|Ъ|Ы|Ь|Э|Ю|Я|q|w|e|r|t|y|u|i|o|p|l|k|j|h|g|f|d|s|a|z|x|c|v|b|n|m| |~|!|@|#|\$|%|\^|\&|\*|\(|\)\_|\=|\+|\?|`|\[|\]|\{|\}|\<|\>|\"|\/|/gi;
    if (re.test(value)) {
        value = value.replace(re, '');
        input.value = value;
    }
}

function check() {
    var author = $('#author');
    var text = $('#text');
    var submit = $('#comment');
    submit.disabled = !(author.value != '' && text.value != '')
}

// --- Если в хедере предупреждение на две строки, то приподнимать ---
if ($('.cabinet-header-bottom-panel .cabinet-error-message').height() > '30') {
    $('.cabinet-header-bottom-panel .cabinet-error-message').css('margin-top', '-4px')
}

// --- стилизация и обработка input/file ---
function initFileUploads() {
    var fakeFileUpload = $('<div class="fakefile"><input type="text" class="cabinet-text-input cabinet-text-input-240 fake-file-input" style="margin-right:5px"><a class="btn-b" style=""><span><span>Обзор</span></span></a><div class="clear"></div></div>');
    $('input[type="file"]:not(.not-fake)').each(function () {
        if ($(this).data('fake')) {
            return '';
        }
        var fake = fakeFileUpload.clone();
        $(this).after(fake);
        $(this).width(fake.width());
        $(this).height(fake.height());
        $(this).css('z-index', parseInt(fake.css('z-index')) + 1);
        $(this).parent().css("position", "relative");
        $(this).data('fake', fake);

        $(this).on('change', function () {
            $(this).data('fake').find('input[type="text"]').val($(this).val());
            $('#show-input-file').parent('div').hide();

        });
    });
}

initFileUploads();

/* popup help windows */
$(".call_help_window").click(function () {
    $(".wrap_help_window").hide();
    var id = $(this).attr("name");
    $("#" + id).show();
    return false;
});

$(".hclose").click(function () {
    $(this).parent().parent().hide();
    return false;
});

$(document).click(function (event) {
    if ($(event.target).closest(".wrap_help_window").length === 0) {
        $(".wrap_help_window").hide();
    }
});
/**/

$(function () {
    // скрываю после загрузки скрытые блоки
    $("#new_goods, #new_firms, #tags_cloud").toggleClass('hide');

    // переключалка тегов в сайдбаре
    $("#tags").click(function () {
        $("#tags_cloud").toggleClass('hide');
        return false;
    })
});

$(document).ready(function () {
    $('.b-related-items__item-price').each(function () {
        if (($(this).text().length > 13) && $(this).has('span')) {
            $(this).css('font-size', '13px');
        }
    })
});

/**/

function getNameBrouser() {
    var ua = navigator.userAgent.toLowerCase();

    // Определим Google Chrome
    if (ua.indexOf('chrome') > -1)
        return "chrome";

    // Internet Explorer
    if (ua.indexOf("msie") != -1 && ua.indexOf("opera") == -1 && ua.indexOf("webtv") == -1)
        return "msie"

    // Opera
    if (ua.indexOf("opera") != -1)
        return "opera"

    // Gecko = Mozilla + Firefox + Netscape
    if (ua.indexOf("gecko") != -1)
        return "gecko";

    // Safari, используется в MAC OS
    if (ua.indexOf("safari") != -1)
        return "safari";

    // Konqueror, используется в UNIX-системах
    if (ua.indexOf("konqueror") != -1)
        return "konqueror";

    return "unknown";
}

function strtr(str, from, to) {
    /*
     * Example 1: strtr('hi all, I said hello', {'hi':'hello', 'hello':'hi'}); //hello all, I said hi
     * Example 2: strtr('abcdcdb', 'ab', 'AB')); //ABcdcdB
     */
    if (typeof from === 'object') {
        var cmpStr = '';
        for (var j = 0; j < str.length; j++) {
            cmpStr += '0';
        }
        var offset = 0;
        var find = -1;
        var addStr = '';
        for (fr in from) {
            offset = 0;
            while ((find = str.indexOf(fr, offset)) != -1) {
                if (parseInt(cmpStr.substr(find, fr.length)) != 0) {
                    offset = find + 1;
                    continue;
                }
                for (var k = 0; k < from[fr].length; k++) {
                    addStr += '1';
                }
                cmpStr = cmpStr.substr(0, find) + addStr + cmpStr.substr(find + fr.length, cmpStr.length - (find + fr.length));
                str = str.substr(0, find) + from[fr] + str.substr(find + fr.length, str.length - (find + fr.length));
                offset = find + from[fr].length + 1;
                addStr = '';
            }
        }
        return str;
    }

    for (var i = 0; i < from.length; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    return str;
}

function preg_replace_callback(pattern, callback, subject, limit) {
    // Perform a regular expression search and replace using a callback
    //
    // discuss at: http://geekfg.net/
    // +   original by: Francois-Guillaume Ribreau (http://fgribreau)
    // *     example 1: preg_replace_callback("/(\\@[^\\s,\\.]*)/ig",function(matches){return matches[0].toLowerCase();},'#FollowFriday @FGRibreau @GeekFG',1);
    // *     returns 1: "#FollowFriday @fgribreau @GeekFG"
    // *     example 2: preg_replace_callback("/(\\@[^\\s,\\.]*)/ig",function(matches){return matches[0].toLowerCase();},'#FollowFriday @FGRibreau @GeekFG');
    // *     returns 2: "#FollowFriday @fgribreau @geekfg"

    limit = !limit ? -1 : limit;

    var _flag = pattern.substr(pattern.lastIndexOf(pattern[0]) + 1),
        _pattern = pattern.substr(1, pattern.lastIndexOf(pattern[0]) - 1),
        reg = new RegExp(_pattern, _flag),
        rs = null,
        res = [],
        x = 0,
        ret = subject;

    if (limit === -1) {
        var tmp = [];

        do {
            tmp = reg.exec(subject);
            if (tmp !== null) {
                res.push(tmp);
            }
        } while (tmp !== null && _flag.indexOf('g') !== -1)
    } else {
        res.push(reg.exec(subject));
    }

    for (x = res.length - 1; x > -1; x--) {//explore match
        ret = ret.replace(res[x][0], callback(res[x]));
    }
    return ret;
}

$(function () {
    $('ul.fe-tabs').delegate('li > a', 'click', ShowFETab);
    //var location = document.location.href;
    //location += (location.search(/\?/) == -1) ? '?twit' : '&twit';
    //$('.twitter', '#social-buttons').attr('href', location);

    $("div.ui-widget-overlay").live('click', function () {
        $('.ui-dialog:visible').each(function () {
            $(this).children('div.ui-dialog-content').dialog('close');
        });
    });

    if ($('.ui-radio').buttonset) {
        $('.ui-radio').buttonset();
    }

    $('#open-form-login').click(function (e) {
        $(this).hide();
        $(this).parent().hide();
        $("#form-login").show();
        e.preventDefault();
    });
});

function ShowFETab(el) {
    var menu = $(el).parent("ul.fe-tabs");

    menu.children("li").removeClass("selected");
    $(el).parent("li").addClass('selected');
}

/**
 * Аналог PHP formatQuantity(functions.php)
 */
function formatQuantity(value, partsDelimiter) {
    if (!partsDelimiter) {
        partsDelimiter = ',';
    }
    var parts = parseFloat(value).toFixed(2).split('.');
    var integralPart = parts[0];
    var fractionalPart = parts.length > 1 ? parts[1] : '';
    fractionalPart = fractionalPart.replace(/00$/, '');
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(integralPart)) {
        integralPart = integralPart.replace(rgx, '$1' + ' ' + '$2');
    }
    return (fractionalPart ? integralPart + partsDelimiter + fractionalPart : integralPart);
}

function moveCursor2End(id) {
    var obj = document.getElementById(id);
    if (!obj) {
        return;
    }
    if (obj.tagName === 'INPUT' && obj.type === 'text') {
        if (obj.createTextRange) {
            var r = obj.createTextRange();
            r.collapse(false);
            r.select();
        } else {
            var end = obj.value.length;
            obj.setSelectionRange(end, end);
            obj.focus();
        }
    }
}

(function ($) {
    //обработчик календарей datepicker'ов
    $('.zk-datepicker-trigger').live('click', function () {
        $(this).prev().focus();
    });
})(jQuery);

$(function () {
    $(document)
        .on('mouseup', '.select-all', function (e) {
            var self = $(this);
            if (!self.hasClass("selected-text")) {
                self.addClass("selected-text");
                $(this).select();
            }
        })
        .on('focusout', '.select-all', function (e) {
            e.preventDefault();

            var self = $(this);
            if (self.hasClass("selected-text")) {
                self.removeClass("selected-text");
            }
        });
});

function htmlspecialchars(text) {
    var chars = Array("&", "<", ">", '"', "'");
    var replacements = Array("&amp;", "&lt;", "&gt;", "&quot;", "'");
    for (var i = 0; i < chars.length; i++) {
        var re = new RegExp(chars[i], "gi");
        if (re.test(text)) {
            text = text.replace(re, replacements[i]);
        }
    }
    return text;
}
/**
 * Удаляем кавычки для валидного alt или title в шаблонах
 *
 */
function charsReplace(text) {
    return htmlspecialchars(text.replace('"', "").replace("'", ""));
}

function trackVisit(company, type) {
    company = parseInt(company);
    if (company > 0) {
        //if (type != 'finish-order') {
        //trackVisit(company, 'finish-order');
        type = 'goals/' + type;
        //}

        $(document.body).append($('<iframe src="//' + SITE + '/' + type + '/' + company + '/" class="trackFrame"></iframe>').css({
            height   : 0,
            width    : 0,
            opacity  : 0,
            position : 'absolute'
        }));
        window.setTimeout(function () {
            $('.trackFrame').remove();
        }, 100000);
    }
}

function trackMarketGidPreOrder() {
    var MGDate = new Date();
    $(document.body).append('<iframe src ="https://marketgid.com/resiver.html#label2'
        + MGDate.getYear() + MGDate.getMonth()
        + MGDate.getDate() + MGDate.getHours()
        + '" width="0%" height="0" sty'
        + 'le = "position:absolute;left:'
        + '-1000px" ></iframe>');
}

function trackMarketGidOrder() {
    var MGDate = new Date();
    $(document.body).append('<iframe src ="https://marketgid.com/resiver.html#label3'
        + MGDate.getYear() + MGDate.getMonth()
        + MGDate.getDate() + MGDate.getHours()
        + '" width="0%" height="0" sty'
        + 'le = "position:absolute;left:'
        + '-1000px" ></iframe>');
}

function checkLazyLoadEditor() {
    var top = $(window).height() + $(window).scrollTop();
    $('.tinyMCE-LazyLoad:visible,.tinyMCE-LazyLoad-full:visible').each(function () {
        if ($(this).offset().top < top + 50) {
            var type = 'typical'; // by default
            if ($(this).hasClass('tinyMCE-LazyLoad-full')) {
                type = 'full';
            } else if ($(this).hasClass('tinyMCE-LazyLoad-mini')) {
                type = 'mini';
            } else if ($(this).hasClass('tinyMCE-LazyLoad-mail')) {
                type = 'mail';
            } else if ($(this).hasClass('tinyMCE-LazyLoad-rubrics')) {
                type = 'rubrics';
            }

            $(this).removeClass('tinyMCE-LazyLoad')
                .removeClass('tinyMCE-LazyLoad-full')
                .removeClass('tinyMCE-LazyLoad-mini')
                .removeClass('tinyMCE-LazyLoad-mail')
                .removeClass('tinyMCE-LazyLoad-rubrics');
            if (tinyMCE && tinyMCE.get($(this).attr('id'))) {
                tinyMCE.get($(this).attr('id')).destroy();
            }
            addEditor($(this), type, $(this).height());
        }
    });
}

/**
 * Удаление ссылок /go/zk_go_*
 *
 * @param {tinymce.Editor} editor
 * @param {string} text
 * @param {HTMLElement} body
 */
function removeDeniedContent(editor, text, body) {
    if (text) {
        var links = body.querySelectorAll('a[href]');
        var hasBadLinks = false;
        Array.prototype.forEach.call(links, function (link) {
            var href = link.getAttribute('href');
            if (/.*\/go\/zk_go_.*/i.test(href)) {
                hasBadLinks = true;

                var span = document.createElement('span');
                span.innerHTML = link.innerHTML;

                link.parentElement.replaceChild(span, link);
            }
        });

        if (hasBadLinks) {
            setTimeout(function () {
                $(document).cabinetReport({
                    type     : 'error',
                    message  : 'Запрещается использование ссылок вида /go/zk_go_*',
                    autoHide : 3000
                });
            }, 500);

            editor.setContent(body.outerHTML);
        }
    }
}

function addEditor(el, type, height, additional_buttons) {
    if (typeof height == 'undefined') {
        height = 'auto';
    }
    if (typeof additional_buttons == 'undefined') {
        additional_buttons = [];
    }
    el = $(el);
    if (!tinyMCE) {
        return false;
    }

    if (!type) {
        type = 'typical';
    }
    var fn = function () {
        $(el).click();
    };

    var config = {
        selector                      : "textarea#" + $(el).attr('id'),
        theme                         : "modern",
        setup                         : function (ed) {
            ed.on('PastePlainTextToggle', function (e) {
                $.cookie(
                    'paste_as_text',
                    e.state ? 1 : 0,
                    {
                        expires : 7,
                        path    : '/'
                    }
                );
            });

            ed.on('init', function () {
                removeDeniedContent(ed, ed.getContent(), ed.getDoc().documentElement);
            });
        },
        inline_styles                 : true,
        relative_urls                 : false,
        convert_urls                  : false,
        remove_script_host            : false,
        height                        : height,
        language                      : 'ru',
        object_resizing               : true,
        max_indent_value              : 90,
        release                       : window.release,
        style_formats                 : [
            {
                title : 'Заголовки', items : [
                {title : 'Обычный', block : 'p'},
                // {title : 'Заголовок h1', block : 'h1'},
                {title : 'Заголовок h2', block : 'h2'},
                {title : 'Заголовок h3', block : 'h3'},
                {title : 'Заголовок h4', block : 'h4'},
                {title : 'Заголовок h5', block : 'h5'},
                {title : 'Заголовок h6', block : 'h6'}
            ]
            },
            {
                title : 'Размер шрифта', items : [
                {title : '8pt', inline : 'span', styles : {'font-size' : '8px', 'line-height' : '14px'}},
                {title : '10pt', inline : 'span', styles : {'font-size' : '10px', 'line-height' : '14px'}},
                {title : '12pt', inline : 'span', styles : {'font-size' : '12px', 'line-height' : '18px'}},
                {title : '14pt', inline : 'span', styles : {'font-size' : '14px', 'line-height' : '20px'}},
                {title : '18pt', inline : 'span', styles : {'font-size' : '18px', 'line-height' : '24px'}},
                {title : '24pt', inline : 'span', styles : {'font-size' : '24px', 'line-height' : '30px'}},
                {title : '36pt', inline : 'span', styles : {'font-size' : '36px', 'line-height' : '42px'}}
            ]
            }
        ],
        additional_buttons            : [],
        init_instance_callback        : function (inst) {
            inst.on('keydown paste', fn);
            inst.on('input change', function () {
                $('#' + el.attr('id')).val(inst.getContent()).change();
            });

            inst.on('PostProcess', function (e) {
                removeDeniedContent(inst, e.content, e.node);
            });
        },
        contextmenu                   : "copy paste | link zkimage video google-form | hr charmap | cell row column deletetable",
        content_css                   : ["/inc/css/tinymce.css", "/inc/css/font-awesome/css/font-awesome.min.css"],
        noneditable_noneditable_class : 'fa',
        extended_valid_elements       : 'span[*]',
        table_toolbar                 : "zktablesettings zktablerowsettings zktablecolumnsettings zktablecellsettings | zktablemoverowdown zktablemoverowup zktablemovecolumnleft zktablemovecolumnright | zktableaddcellleft zktableaddcellright zktableremovecell | zktablemergerightcell zktablemergebottomcell | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tabledelete",
    };

    var useH1 = !!el.data('tinymce-config-use-h1');
    if (useH1) {
        config.style_formats[0].items.splice(1, 0, {
            title : 'Заголовок h1',
            block : 'h1'
        });
    }

    // если есть этот класс, то скрываем table toolbar
    if (el.hasClass('disable-table_toolbar')) {
        config.table_toolbar = false;
    }

    var paste_as_text_cookie = $.cookie("paste_as_text");
    var types = {
        full    : {
            toolbar       : "undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link unlink zkimage video google_form table | print fullscreen | forecolor backcolor fontsizeselect emoticons | code",
            plugins       : "advlist link autolink lists charmap print preview hr anchor pagebreak spellchecker paste searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table contextmenu directionality emoticons template textcolor video zkimage google_form noneditable zk_notification zk_templates zk_table_constructor zk_extended_tables zk_table_actions fontawesome zk_background_image",
            paste_as_text : paste_as_text_cookie == 1,

            statusbar : false
        },
        typical : {
            toolbar             : "undo redo | styleselect | bold italic underline | link unlink | zkimage video google_form table | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | forecolor | fontawesome | zk_notification zk_templates zk_background_image",
            plugins             : "advlist lists link paste autolink searchreplace charmap fullscreen hr insertdatetime nonbreaking table contextmenu textcolor video zkimage google_form noneditable zk_notification zk_templates zk_table_constructor zk_extended_tables zk_table_actions fontawesome zk_background_image",
            menubar             : "edit insert format table",
            paste_as_text       : paste_as_text_cookie == 1,
            statusbar           : false,
            paste_webkit_styles : 'all'
        },
        mini    : {
            toolbar             : "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link unlink | hr",
            plugins             : "link autolink searchreplace insertdatetime contextmenu paste hr",
            menubar             : false,
            statusbar           : false,
            paste_as_text       : false,
            paste_webkit_styles : 'all'
        },
        mail    : {
            toolbar       : "undo redo | styleselect | bold italic underline strikethrough | link unlink | hr | zkimage table | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | forecolor backcolor ",
            plugins       : "link autolink searchreplace insertdatetime contextmenu paste hr zkimage textcolor charmap nonbreaking table zk_table_constructor zk_table_actions zk_extended_tables ",
            menubar       : "edit insert format table",
            statusbar     : false,
            paste_as_text : false,

            plugins_settings    : {
                zk_table_constructor : {
                    disable_wrapper       : true,
                    disable_middle_column : true
                }
            },
            paste_webkit_styles : 'all'
        },
        rubrics : {
            toolbar       : "formatselect | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link unlink | hr | zkimage | bullist numlist", /* fontselect fontsizeselect */
            plugins       : "link autolink searchreplace insertdatetime contextmenu paste hr zkimage lists ",
            menubar       : false,
            statusbar     : false,
            paste_as_text : true,
        }
    };

    if (window.is_src_editor == 1) {
        types.typical.plugins += ' code';
        types.mini.plugins += ' code';
        types.mail.plugins += ' code';
        types.typical.toolbar += ' | code';
        types.mini.toolbar += ' | code';
        types.mail.toolbar += ' | code';
    }

    /**
     * Добавление кнопок и плагинов к используемому типу
     */
    if (additional_buttons.length) {
        /**
         * Кнопки для которых необходимо подключать плагины
         * 'названиеКнопки': 'названиеПлагина'
         * @type {}
         */
        var buttons_reqire_plugin = {
            zkimage : 'zkimage'
        };
        types[type].toolbar += ' | ';
        $.each(additional_buttons, function (k, v) {
            if (!(types[type].toolbar.indexOf(v) + 1)) {
                types[type].toolbar += ' ' + v + ' ';
            }

            if (!(types[type].plugins.indexOf(v) + 1)) {
                if (typeof (buttons_reqire_plugin[v]) != 'undefined') {
                    types[type].plugins += (' ' + v);
                }
            }
        });
    }

    // if (type === 'full') {
    //     type = 'typical';
    // }

    config = $.extend(config, types[type]);
    tinyMCE.init(config);
    var onLoadMce = function () {
        setTimeout(function () {
            if (!$('.mce-tinymce').length) {
                onLoadMce();
            } else {
                $('.mce-tinymce iframe').contents().click(function () {
                    $(this).find('.mce-content-body').focus();
                });
            }
        }, 100);
    };
    onLoadMce();
    //insertEditorHelper(el);
}

$(function () {
    window.setInterval(checkLazyLoadEditor, 500);
});

/**
 * Добавление информ окна после редактора
 *
 * @param element - селектор элемента
 */

function insertEditorHelper(element) {
    var editorHelper = '<div class="cabinet-alert cabinet-alert-red" style="overflow-x: auto; margin-top: 2em"><span class="cabinet-alert-icon"></span><p>Для копирования текста с других источников рекомендуем использовать комбинации клавиш (Ctrl-C, Ctrl-V, Ctrl-X или Cmd в Mac OS).</p><p><strong>Важно!</strong> Скопированные изображения не будут сохранены. Добавляйте изображения при помощи функции Добавить/изменить изображение в панели инструментов текстового редактора.</p></div>';
    var $errorBlock = $(element).next();

    if ($errorBlock.hasClass('p_error_block')) {
        $(editorHelper).insertAfter($errorBlock);
    } else {
        $(editorHelper).insertAfter($(element));
    }
}

String.prototype.chunk = function (n) {
    if (typeof n == 'undefined') n = 2;
    //n = Math.min(65000, n);
    return this.match(RegExp('.{1,' + n + '}', 'g'));
};

function addIndicator(obj, addClass) {
    var id = 'ajax_' + Math.round(Math.random() * 100000);
    $(obj).addClass('b-ajax-indicator-wrap');
    addClass = typeof(addClass) == 'undefined' ? '' : addClass;
    //var objWidth = $(obj).outerWidth();
    //var objHeight = $(obj).outerHeight();

    $(obj).append('<div class="b-ajax-indicator" style="width: 100%; height: 100%" id="' + id + '"><img src="/pics/ajax_indicator.gif" class="b-ajax-indicator__img ' + addClass + '" width="16" height="16"/></div>');
    return id;
}

function removeIndicator(id) {
    $('#' + id).remove();
}

function nl2br(str) {
    return str.replace(/([^>])\n/g, '$1<br/>');
}

function clone(o) {
    if (!o || "object" !== typeof o) {
        return o;
    }
    var c = "function" === typeof o.pop ? [] : {};
    var p, v;
    for (p in o) {
        if (o.hasOwnProperty(p)) {
            v = o[p];
            if (v && "object" === typeof v) {
                c[p] = clone(v);
            }
            else c[p] = v;
        }
    }
    return c;
}

$(".contact_firm").live('click', function () {
    if ($(this).attr('href') !== undefined && $(this).attr('href') != '#') {
        //document.location.href = $(this).attr('href');
        return true;
    }
    addCodesDropdown();

    $.ajax({
        url      : "/ajax/ContactNow/Handle/html",
        type     : 'post',
        dataType : "html",
        data     : ({
            id   : $(this).attr("data-name"),
            ref  : $(this).attr("data-alt"),
            type : $(this).attr("data-type") == 'product' ? 'product' : 'firm'
        }),
        success  : function (data) {
            if ($('#contact-now-dialog').length == 0) {
                $('body').append('<div id="contact-now-dialog" title="Связаться с компанией" class="adaptive-dialog"></div>');
            }
            $("#contact-now-dialog").html(data).dialog({
                modal     : true,
                height    : 'auto',
                maxHeight : 'inherit',
                width     : '750px'
            }).dialog("open");
        }
    });
    return false;
});

function check_date(d, m, y) {
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}

function check_birthday(d, m, y) {
    return m > 0 && m < 13 && y > 1900 && y < (new Date().getFullYear() - 10) && d > 0 && d <= (new Date(y, m, 0)).getDate();
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp */) {
        "use strict";

        if (this == null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ltrim = function () {
    return this.replace(/^\s+/, '');
};

String.prototype.rtrim = function () {
    return this.replace(/\s+$/, '');
};

String.prototype.fulltrim = function () {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
};

window.array_unique = function (target) {
    var u = {}, a = [];
    for (var i = 0, l = target.length; i < l; ++i) {
        if (u.hasOwnProperty(target[i])) {
            continue;
        }
        a.push(target[i]);
        u[target[i]] = 1;
    }
    return a;
};

function sc_checkField(value, type, minL, maxL) {
    var regExp;
    switch (type) {
        case 'quantity':
            regExp = /^[\d]+([\.,]{1}[\d]{1,3})?$/;
            if (!regExp.test(value)) return 'Введите корректное число.';
            if (parseFloat(value) < minL) return 'Минимальный объем заказа ' + minL;
            if (parseFloat(value) > maxL) return 'Максимальный объем заказа ' + maxL;
            return '';
            break;
        case 'email':
            regExp = /^[\d\wа-яА-Я\._-]+@[\w\._а-яА-Я-]+(\.[\wа-яА-Я-]{2,6})$/;
            if (regExp.test(value)) return '';
            else return 'Введите корректный email';
            break;
        case 'postcode':
            regExp = new RegExp('^[0-9]{' + minL + ',' + maxL + '}$');
            if (regExp.test(value)) return '';
            else return 'Почтовый индекс должен содержать от ' + minL + ' до ' + maxL + ' цифр';
            break;
        case 'telephone':
        //формат для номера не определен(на проме к номеру тел. могут
        //добавлтся примечания), поэтому проверяем его как строку

        //regExp= new RegExp('^[0-9]{'+minL+','+maxL+'}$');
        //regExp=/^(\+3)?\s?(\(?[\d]{3}\)?)\s?[\d]{7}$/;
        //if(regExp.test(value)) return '';
        //else return 'Введите корректный номер телефона';
        //break;
        case 'string':
        default:
            if (value.length >= minL && value.length <= maxL) return '';
            else return 'Данное поле должно содержать от ' + minL + ' до ' + maxL + ' символов. Вы использовали ' + value.length;
            break;
    }
}

function translitIt(str) {
    var source = str.toLowerCase();
    var dictionary = {
        "–" : "-", " " : "-", "а" : "a", "б" : "b", "в" : "v",
        "г" : "g", "д" : "d", "е" : "e", "ё" : "e", "ж" : "zh",
        "з" : "z", "и" : "i", "й" : "y", "к" : "k", "л" : "l",
        "м" : "m", "н" : "n", "о" : "o", "п" : "p", "р" : "r",
        "с" : "s", "т" : "t", "у" : "u", "ф" : "f", "х" : "h",
        "ц" : "c", "ч" : "ch", "ш" : "sh", "щ" : "shch", "ъ" : "",
        "ы" : "y", "ь" : "", "э" : "e", "ю" : "yu", "я" : "ya",
        "," : "", "№" : "n", "є" : "e", "ї" : "i", "і" : "i", "ґ" : "g", '%' : ''
    };

    return source.replace(/[\s\S]/g, function (x) {
        if (dictionary.hasOwnProperty(x)) {
            return dictionary[x];
        }
        return x;
    });
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k).toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec).replace(/(\.00)/gi, '');
}

(function ($) {
    $(document).on('blur', '#ofNumber, #fbNumber, #ocNumber', function () {
        var phone = $(this).val();
        var pos = phone.indexOf('0');

        if (pos == 0) {
            $(this).val(phone.substring(1));
        }
    });
})(jQuery);

$(document).on('click', '.scroll_to', function () {
    var $element = $($(this).data("selector"));

    if ($element.length > 0) {
        $.scrollTo($element, 500);
    }
    return true;
});

(function () {
    var is_more = false;

    $.fn.sexproduct = function () {
        $('body').append(
            '<div id="sex-product" title="Просмотра товаров рубрики Интимные товары">\
                <h3>Для просмотра интимных товаров, подтвердите, что вам больше 18 лет.</h3>\
            </div>'
        );

        $('#sex-product').dialog({
            minWidth      : 800,
            height        : 'auto',
            resizable     : false,
            modal         : true,
            dialogClass   : 'sex-products',
            closeOnEscape : false,
            create        : function () {
                $(this).closest(".ui-dialog")
                    .find(".ui-dialog-buttonset .ui-button") // the first button
                    .attr("class", "btn-b").removeClass('ui-state-focus');
            },
            beforeClose   : function (event, ui) {
                if (!is_more) {
                    document.location.href = "/";
                }
            },
            buttons       : [
                {
                    text  : "Да, мне больше 18 лет",
                    click : function () {
                        is_more = true;
                        document.cookie = "_sp=true; path=/; domain=." + document.domain;
                        $(this).dialog("close");
                    }
                },
                {
                    text  : "Нет, мне меньше 18 лет",
                    click : function () {
                        document.location.href = "/";
                    }
                }
            ]
        });

        return this;
    }
})();

/**
 * Константы для вызова действий для служб трэкинга активности пользователей (Google Analitics, Yandex Metrics)
 * @type {}
 */

var zkTrackConstants = {
    // Кнопка купить из каталога и карточки товара на минисайте
    putInBasket : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Order',
            eventAction   : 'ga-put-in-basket'
        },
        ym : ['ym-put-in-basket']
    },

    //Кнопка "Оформить заказ" в корзине на минисайте
    shopcartOrderGoal : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Order',
            eventAction   : 'ga-shopcart-order-goal'
        },
        ym : ['ym-shopcart-order-goal']
    },

    // Кнопка Продолжить покупки в корзине на минисайте
    shopcartPreorderGoal : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Order',
            eventAction   : 'ga-shopcart-preorder-goal'
        },
        ym : ['ym-shopcart-preorder-goal']
    },

    // Кнопки Перезвонить мне / Заказать обратный звонок на минисайте
    oneclickPreactionGoal : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Contact',
            eventAction   : 'ga-oneclick-preaction-goal'
        },
        ym : ['ym-oneclick-preaction-goal']
    },

    // Кнопка "Отправить" в форме отправки тел для заказа обратного звонка на минисайте
    oneclickGoal : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Contact',
            eventAction   : 'ga-oneclick-goal'
        },
        ym : ['ym-oneclick-goal']
    },

    // Кнопки Написать нам на минисайте
    messageSentGoal : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Contact',
            eventAction   : 'ga-message-sent-goal'
        },
        ym : ['ym-message-sent-goal']
    },

    // Кнопки Написать нам на минисайте
    messageSentForm : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Contact',
            eventAction   : 'ga-message-sent-form'
        },
        ym : ['ym-message-sent-form']
    },

    //
    shopcartOrderAddMore : {
        ga : {
            method        : 'send',
            hitType       : 'event',
            eventCategory : 'Order',
            eventAction   : 'ga-shopcart-order-AddMore'
        },
        ym : ['ym-shopcart-order-AddMore']
    },

    //Попытка регистрации - клик по кнопке
    tryRegistrationCustomer : {
        ym : ['reguser']
    },

    // Регистрация покупателя - успех
    registrationCustomer : {
        ym : ['reguser_steptwo']
    },

    // Попытка регистрации компании - клик по кнопке
    tryRegistrationFirm : {
        ym : ['regfirm']
    },

    firm_try : {
        ym : ['regfirm']
    },

    // Регистрация компании - успех
    registrationFirm : {
        ym : ['regfirm_steptwo']
    },

    // Просмотр телефона
    phoneShowProductPage : {
        ym : ['phone_show']
    },

    // Просмотр телефона
    callMeProductPage : {
        ym : ['call_me']
    },

    // Заказ товара со страницы товара
    orderProductProductPage : {
        ym : ['order_product']
    },

    // Кнопка купить на страницах портала
    preOrderProductPortal : {
        ym : ['pre_order_product_portal']
    },

    // Кнопка "отправить заказ" на страницах портала
    orderEndProductPortal : {
        ym : ['order_end_product_portal']
    },

    // Кнопка Все рубрики на главной
    allCategory : {
        ym : ['all_category']
    }
};

/**
 * Трекалка целей для яндекс метрики
 *
 * @param string tEvents - коды событий для я-метрики
 * @param [] y - объекты счетчика я-метрики
 */

function trackTargetYM(tEvents, counters) {
    if (counters.length == 0) return;

    tEvents.forEach(function (te) {
        counters.forEach(function (y) {
                if (typeof(te) === 'string' && typeof(y) === 'object') {
                    if (window.ZK_TRACK_DEBUG_MODE != undefined && window.ZK_TRACK_DEBUG_MODE) console.log('YM TRACK CODE - ' + te);
                    y.reachGoal(te);
                }
            }
        );
    });
}

/**
 * Трекалка целей для Google Analytics
 *
 * @param {} trackData - дата о событии ga
 * @param function функция трэка для Google Analytics
 */

function trackTatgetGA(trackData, g) {
    if (((typeof(g) === 'function') || (typeof(g) === 'object')) && typeof(trackData) === 'object') {
        var trackers = g.getAll();
        if (trackers.length == 0) return;

        if (trackData.method == 'send') {
            trackers.forEach(function (tracker) {
                if (window.ZK_TRACK_DEBUG_MODE != undefined && window.ZK_TRACK_DEBUG_MODE) console.log('GA TRACK CODE - ' + trackData.eventAction);

                tracker.send(
                    trackData.hitType,
                    trackData.eventCategory,
                    trackData.eventAction
                );
            });
        }
    }
}

/**
 * Трекалка целей для Google Analytics
 *
 * @param string trackData - название события
 */

function trackTargetAll(target) {
    if (target != undefined) {
        var targets = target.split(',');
        targets.forEach(function (tItem) {
            var itemData = zkTrackConstants[tItem.trim()];
            if (itemData !== undefined) {
                Object.keys(zkTrackServicesConstants).forEach(function (tService) {
                    if (itemData[tService] != undefined) {
                        zkTrackServicesConstants[tService].serviceTrackFunction(
                            itemData[tService],
                            zkTrackServicesConstants[tService].serviceObject
                        );
                    }
                });
            }
        });
    }
}

/**
 * Регистрация сервисного объекта Google Аналитики
 */

$(document).on('load_ga', function () {
    zkTrackServicesConstants.ga.serviceObject = ga;
});

$(document).ready(function () {
    /**
     * Константы c именами методов сервисов метрики
     * (ga - Google Analytics, ym - Yandex Metrics)
     * @type []
     */

    zkTrackServicesConstants.ga.serviceTrackFunction = trackTatgetGA;
    zkTrackServicesConstants.ym.serviceTrackFunction = trackTargetYM;

    /**
     * Универсальная трекалка целей для всех зарегистрированныз служб трэкинга активности посетителя
     * вешает clickListener на класс zk-track-target, берет данные из атрибута data-zk-track-target
     */

    $(document).on('click', '.zk-track-target', function () {
        var target = $(this).data('track-target');
        trackTargetAll(target);
    });
});

function trackRegistration(g, y, type) {

    if (typeof(type) == 'undefined') {
        type = 'firm';
    }

    if (type == 'firm') {
        if (typeof (g) == 'string') {
            var nameT = 'newTracker_trackRegistration_' + new Date().getTime();
            ga('create', g, 'auto', nameT);
            ga(nameT + '.send', 'pageview', '/registration_end_button_virtual');
        }

        /**
         * fix -  на тесте не определен объект метрики(так задано в условии) и кидает ошибку
         */
        if (typeof (window.yaMetrika) == 'object') {
            y.hit('/registration_end_button_virtual', 'Кнопка "Зарегистрироваться"');
            trackTargetAll('registrationFirm');
        }
    } else if (type == 'firm_try') {
        if (typeof (window.yaMetrika) == 'object') {
            trackTargetAll('tryRegistrationFirm');
        }
    } else if (type == 'user') {
        if (typeof (window.yaMetrika) == 'object') {
            trackTargetAll('registrationCustomer');
        }
    } else if (type == 'user_try') {
        if (typeof (window.yaMetrika) == 'object') {
            trackTargetAll('tryRegistrationCustomer');
        }
    }
}

/**
 * @todo - после проверки удалить все места использования ga.js
 */
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

/**
 * Регистрация объекта гугл аналитик юниверсал - перенесена в единую точку для всего сайта
 */
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga(function () {
    //Для отслеживания готовности ГА
    $(document).trigger('load_ga');
});

$(function () {
    $(document).on("click", ".track-event", function () {

        var category = $(this).data('category');
        var action = $(this).data('action');
        var label = $(this).data('label');

        var ua = $(this).data('ua');
        if (ua != undefined) {
            /**
             * Если у компании подключен га отправлять и туда
             */
            ga('create', ua, 'auto', 'company');
            ga('company.send', 'event', category, action, label);
        }
        /**
         * и на аккаунт из каталога
         */
        ga('create', $(this).data('siteua'), 'auto', 'siteTracker_track_event');
        ga('siteTracker_track_event.send', 'event', category, action, label);
        $(this).removeClass("track-event");
    });

    $(document).on("click", ".seolink-labeled", function () {
        if (typeof(yaMetrika) == 'object' && typeof(yaMetrika.reachGoal) == 'function') {
            yaMetrika.reachGoal('seometka');
        }
    });

});

/**
 * Округляет цену товара
 *
 * @param price
 * @returns float
 */
function roundPrice(price) {
    if (price > 100) {
        price = price < 1000 ? (parseFloat(price)).toFixed(1) : (parseFloat(price)).toFixed(0);
    }
    return price;
}

$(function () {

    // Показать все метки
    $('.b-seolinks #seo-link-see-more').on('click', function (e) {
        var $el = $(this);
        var data = $el.data();
        var openened = $el.hasClass('opened');
        if (!openened) {
            $.ajax({
                url      : "/ajax/Categories/GetMoreSeoLinks/",
                type     : "post",
                dataType : "JSON",
                data     : ({
                    'cat'     : data.cat,
                    'id'      : data.id,
                    'area_id' : data.areaid
                }),
                success  : function (data) {
                    $($('#tmpl-seolink').tmpl(data)).insertBefore($el.closest('li'));
                }
            });
            $(this).addClass('opened').text('Скрыть');
        } else {
            $('.link-appended').remove();
            $(this).removeClass('opened').text('Показать все');
        }
        e.preventDefault();
    });

    $(document).on('click', '.b-click2call__button', function () {
        if ('sipClient' in window && !window.sipClient.closed) {
            window.sipClient.focus();
        } else {
            var cid = $(this).data('cid');
            var page = $(this).data('page');
            var recipients = $(this).data('recipients');
            var width = 490;
            var height = 150 + recipients.length * 100;
            var top = (window.screen.availHeight - height - 20) / 2;
            var left = (window.screen.availWidth - width) / 2;

            var address = '//' + SITE + '/click2call/?page=' + page + '&width=' + width + '&height=' + height + '&recipients=' + Base64.encode(JSON.stringify(recipients)) + '&cid=' + Base64.encode(cid);
            var params = 'top=' + top + ',left=' + left + ',directories=no,fullscreen=no,location=no,resizable=1,menubar=no,scrollbars=no,status=no,titlebar=no,width=' + width + ',height=' + height + ',scroll=0,menu=0';

            window.sipClient = window.open(address, 'sipClient', params);
        }

        return false;
    });
});

$(function () {
    $(".catalog_stars_desc, .b-tariff:not(.minisite)").attr("title", "Подробнее о рейтинге");
    $(document).on("click", ".catalog_stars_desc, .b-tariff", function () {
        var $this = $(this);
        // Передаем language сайта компании, для перевода.
        var siteLanguage,
            tariffDialogTitle = "Подробнее о рейтинге";
        if ($this.hasClass('b-tariff')) {
            siteLanguage = $this.data('language');
            tariffDialogTitle = $this.prop('title');
        }

        if ($('#catalog_stars_desc_dialog').length == 0) {
            $.ajax({
                url      : '/ajax/Catalog/CatalogStarsDesc/html/',
                type     : "post",
                dataType : "html",
                async    : false,
                data     : { lang : siteLanguage },
                success  : function (data) {

                    // для минисайтов отображаем новое модальное окно
                    if (typeof window.environment === 'string' && window.environment == 'MINISITE') {
                        $('body').append('<div data-title="' + tariffDialogTitle + '" class="site-rating">' +  data + '</div>');
                        $('.site-rating').zkModal();
                    }
                    else {
                        $('body').append('<div id="catalog_stars_desc_dialog" title="' + tariffDialogTitle + '" class="adaptive-dialog"></div>');
                        $("#catalog_stars_desc_dialog").html(data).dialog({
                            modal  : true,
                            height : 650,
                            width  : '750px'
                        });
                    }
                }
            });
        }
        else {
            $("#catalog_stars_desc_dialog").dialog("open");
        }

        return false;
    });
});

if (!Object.keys) {
    Object.keys = function (o) {
        if (o !== Object(o))
            throw new TypeError('Object.keys called on a non-object');
        var k = [], p;
        for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
        return k;
    };
}

$(function () {
    $(document).on('focusin', function (e) {
        if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
        }
    });
});

$(function () {

    $(document).on("click", ".add-simple-comment", function () {
        if ($("#simple-comment-form-dialog").length == 0) {
            $("body").append('<div title="Добавление комментария" id="simple-comment-form-dialog" class="adaptive-dialog"></div>');
            $("#simple-comment-form-dialog").dialog({
                width    : 660,
                height   : 500,
                modal    : true,
                autoOpen : false
            });
        }

        $.ajax({
            url      : "/ajax/SimpleComments/GetCommentForm/html/",
            type     : "post",
            dataType : "html",
            data     : ({
                idcompany : $(this).data("idcompany"),
                item_id   : $(this).data("itemid"),
                type      : $(this).data("type")
            }),
            success  : function (data) {
                $("#simple-comment-form-dialog").html(data).dialog("open");
            }
        });
        return false;
    });
});

var touchmove_handler = function (e) {
    if (!$('.scrollable').has($(e.target)).length) {
        e.preventDefault();
    }
};

function control_scroll(el, enabled) {
    var mobile = false;
    if (enabled) {
        $('body,html').removeClass('stop-scrolling');
        $(el).removeClass("scrollable");
        if (mobile) {
            document.removeEventListener('touchmove', touchmove_handler, true);
        }
    } else {
        $('body,html').addClass('stop-scrolling');
        $(el).addClass("scrollable");
        if (mobile) {
            document.addEventListener('touchmove', touchmove_handler, true);
        }
    }
}

// listen to dialogopen event and resize to fit screen
$(function () {
    var last_open = null;

    var fixed_height_dialogs = function (d, in_h) {
        var h = in_h;
        // for narrow screens wholescreen height can be too much
        if ('waitlist_dialog' == d.attr("id")) {
            h = 520;
        } else if ('oneclick-dialog' == d.attr("id")) {
            h = $(window).width() <= 320 ? 365 : 340;
        } else if ('wishlist_dialog' == d.attr("id")) {
            h = 420;
        } else if ('contact-now-dialog' == d.attr("id")) {
            h = 620;
        } else if ('worktime-dialog' == d.attr("id")) {
            h = 500;
        }
        if ($(window).height() < h) {
            h = $(window).height() - 10;
        }
        return h;
    };

    var adaptive_dialog = function (d) {
        if (undefined == d.data("origin_width")) {
            d.data("origin_width", parseInt(d.dialog("option", "width"), 10));
            d.data("origin_height", d.dialog("option", "height"));
            d.data("origin_pos", d.dialog("option", "position"));
        }
        var ow = d.data("origin_width"), oh = d.data("origin_height"), h = d.data("origin_height"), w;
        var pos = null;
        if ($(window).width() <= ow) {
            w = $(window).width() - 15;
            if (oh != 'auto' && $(window).height() < parseInt(h, 10)) {
                h = $(window).height() - 10;
            } else {
                h = $(window).height() - 10;
                // for narrow screens wholescreen height can be too much
                h = fixed_height_dialogs(d, h);
            }
            pos = {my : "center", at : "center", of : window};
        } else {
            w = ow;
            if ($(window).height() < 480) {
                h = $(window).height() - 10;
            }
            // if scroll will be disabled, limit auto height; otherwise dialog content will grow and scroll don`t work
            if ($(window).width() <= 1024) {
                h = $(window).height() - 20;
                pos = {my : "center", at : "center", of : window};
                // for narrow screens wholescreen height can be too much
                h = fixed_height_dialogs(d, h);
            } else {
                pos = d.data("origin_pos");
            }
        }
        d.dialog("option", {
            width  : w,
            height : h
        });
        if (pos) {
            d.dialog("option", {
                position : pos
            });
        }
        last_open = d;
        // disable scroll except dialog scroll for small screens
        if ($(window).width() <= 1024) {
            $('body').addClass('stop-scrolling');
        } else {
            $('body').removeClass('stop-scrolling');
        }
    };
    $(document).on("dialogopen", ".adaptive-dialog", function (event, ui) {
        var d = $(event.target);
        setTimeout(function () {
            adaptive_dialog(d);
        }, 10);

        if (historyBack) {
            d.historyBackHelper = new HistoryBackDialogCloseHelper({
                close : function (e) {
                    d.dialog('close');
                }
            });
            setTimeout(function () {
                d.historyBackHelper.replaceHistoryStart();
            }, 0);
        }
    }).on("dialogclose", function (event, ui) {
        // enable scroll
        $('body').removeClass('stop-scrolling');
        if (last_open && historyBack && last_open.hasOwnProperty('historyBackHelper')) {
            last_open.historyBackHelper.replaceHistoryEnd();
        }
    });
    $(window).on('resize orientationchange', function () {
        if (last_open && last_open.dialog("isOpen")) {
            adaptive_dialog(last_open);
        }
    });

    var historyBack = typeof history.pushState !== 'undefined' && typeof history.state !== "unknown" && history.state !== 'undefined' && $(window).width() < COLLAPSE_WIDTH;
});

$(function () {
    /**
     * Side adaptive menu
     * @param selector          Adaptive menu button selector
     */
    function adaptive_menu(selector) {
        var overlay;
        var container;
        var touchSupport = 'ontouchstart' in document.documentElement;
        var isOpening = false;

        var close = function (el) {
            overlay.off();
            if (!$(selector + ".adaptive-active").length) return;
            $(".adaptive-active").removeClass("adaptive-active");
            var w = container.width();
            container.animate({left : "-=" + w}, 250, function () {
                container.hide();
                overlay.hide();
            });
            control_scroll(container, true);
        };
        var open = function (el) {
            isOpening = true;
            $(el).addClass("adaptive-active");
            overlay.css({
                width  : $(document).width(),
                height : $(document).height(),
                top    : 0,
                left   : 0
            })
                .show(0)
                .animate({
                    opacity : "0.2"
                }, 50);
            var w = container.width();
            container.css({
                top : 0, left : -w
            }).show(0);
            // adjust separators width by adding class to container
            if (container.get(0).scrollHeight > $(window).height()) {
                container.addClass("has-scroll");
            } else {
                container.removeClass("has-scroll");
            }
            container.animate({left : "+=" + w}, 250, function () {
                control_scroll(container, false);
                overlay.on("click", overlay_close_handler);
                isOpening = false;
            });
        };
        var overlay_close_handler = function (event) {
            // close all menus if clicked outside menu
            event.preventDefault();
            event.stopPropagation();
            if (isOpening) return;
            close();
        };

        // listen to events and open/close menus
        $(document).on("click tap", selector, function (event) {
            if ($('#getMainMenu').hasClass('b-get-main-menu__link_opened')) {
                return;
            }
            // prevent click after tap on >IE10
            if (isOpening) return;
            event.stopPropagation();
            event.preventDefault();
            var $this = $(event.currentTarget);
            open($this);
        });

        var init = function () {
            if (!overlay) {
                overlay = $("<div class='side-menu-overlay'></div>").hide();
                $(document.body).append(overlay);
                container = $("<div class='side-menu-container'></div>").hide();
                $(document.body).append(container);
                // compose menu from main menu, user links and page menu
                container.append($(".main-menu").clone());
                var menu = container.find("ul").removeClass("main-menu").addClass("side-menu");
                if ($(".adaptive-menu-content").length) {
                    menu.append('<li class="separator"></li>');
                    menu.append($(".adaptive-menu-content li").clone().removeClass("cabinet-left-menu-item cabinet-left-menu-item-selected"));
                }
                menu.append('<li class="separator"></li>');
                var user_menu = $(".enter-links li").clone();
                user_menu.first().addClass("main-menu-user1");
                user_menu.last().addClass("main-menu-user2");
                menu.append(user_menu);
                // trigger event to allow menu changes
                $(document).trigger("post-compose-menu", container, menu);

                // close of swipeleft
                container.on('swipeleft', function (event) {
                    close();
                });
                $(window).on("resize orientationchange", function () {
                    if (overlay.is(":visible")) {
                        overlay.css({
                            width  : $(document).width(),
                            height : $(document).height()
                        })
                    }
                });
            }
        };

        init();
    }

    adaptive_menu('.adaptive-menu-button');
});

/**
 * Закрывает диалог по кнопке back
 * @param options
 * @constructor
 */
var HistoryBackDialogCloseHelper = function (options) {
    var self = this;
    var defaults = {
        close : function () {
            self.replaceHistoryEnd();
        }
    };

    this.config = $.extend(defaults, options);

    this.replaceHistoryStart = function () {
        self.partial_href = location.pathname + location.search;
        self.href = location.href;
        self.stopped = false;
        history.replaceState({replacer : 1}, document.title, self.partial_href + "#!/dialog-open");
        history.pushState({replaced : 1}, document.title, self.href);
        window.addEventListener("popstate", self.popstateHistory, false);
    };
    this.replaceHistoryEnd = function () {
        if (self.stopped) return;
        if (history.state && history.state.hasOwnProperty('replaced')) {
            // looks like dialog closed explicit, need to cleanup history
            history.back();
        }
    };
    this.popstateHistory = function (e) {
        self.stopped = true;
        window.removeEventListener("popstate", self.popstateHistory, false);
        if (location.hash === "#!/dialog-open") {
            history.replaceState(null, document.title, self.href);
            self.config.close();
        }
    };
};

(function () {
    $(function () {
        var $select = $('.cabinet-select[name="show_variants"]');
        var $checkboxWrapper = $('.indexing_variants-wrapper');

        $select.on('change', function () {
            $checkboxWrapper
                [!parseInt($(this).val()) ? 'addClass' : 'removeClass']('hidden');
        });
        if (typeof DEMO_DESIGN_IDCOMPANY != 'undefined') {
            if (DEMO_DESIGN_IDCOMPANY == IDCOMPANY) {
                var attachDemo = function () {
                    $('a').each(function () {
                        if (!/\?design_editor/.test($(this).attr('href'))) {
                            if (!/\?/.test($(this).attr('href'))) {
                                $(this).attr('href', $(this).attr('href') + '?' + DEMO_DESIGN_QUERY)
                            } else {
                                $(this).attr('href', $(this).attr('href') + '&' + DEMO_DESIGN_QUERY);
                            }
                        }
                    });
                }
                $(document).ajaxSuccess(function () {
                    attachDemo();
                });
                attachDemo();
            }
        }
    });
})();

/**
 * Проверяет находится ли элемент в зоне видимости экрана
 *
 * @param element
 * @param fullyInView Флаг для проверки полностью ли элемент в зоне видимости (для небольших по размеру элементов)
 *
 * @return {boolean}
 */
function isElementInView(element, fullyInView) {
    if ($(element).length == 0) return;

    var pageTop = $(window).scrollTop();
    var pageBottom = pageTop + $(window).height();
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).height();

    if (fullyInView === true) {
        return ((pageTop < elementTop) && (pageBottom > elementBottom));
    } else {
        return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
    }
}

/**
 * Вызывает колбек, когда элемент попадает в зону видимости экрана
 *
 * @param {string} element
 * @param {callback} callback
 */
function onElementInView(element, callback) {
    var interval;

    if ($(element).length == 0) return;

    interval = setInterval(function () {
        if (isElementInView(element)) {
            clearInterval(interval);
            callback && callback();
        }
    }, 300);
}

/**
 * Загружает данные по последним просмотренным товарам и передает их в колбэк
 *
 * @param {object} params
 * @param {callback} onSuccess
 *
 * @return promise
 */
function loadRecentlyViewedGoods(params, onSuccess) {
    return $.ajax({
        type     : "POST",
        url      : "/ajax/goods-recently-viewed/",
        data     : params,
        dataType : "JSON",
        success  : function (response) {
            if (response && response !== null) {
                onSuccess && onSuccess(response);
            }
        },
    });
}

/**
 * Отложенная загрузка данных по последним просмотренным товарам
 *
 * @param {string} selector
 * @param {callback} onSuccess
 */
function lazyLoadRecentlyViewedGoods(selector, onSuccess) {
    onElementInView(selector, function () {
        loadRecentlyViewedGoods($(selector).data(), onSuccess)
    });
}

/**
 * Движок html-шаблонов, заменяет вхождение плєйсхолдеров <%this.member_name%> в html-код возвращает валидный html (string)
 * Данные из объекта options подставляются по ключу.
 * Пример использования: tpl/recently_viewed_products_block.php:99
 *
 *
 * @param {string} html - шаблон, содержащий плэйсхолдеры
 * @param {object} options - объект, который содержит ключ-значение
 */
function TemplateEngine(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n',
        cursor = 0, match;
    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

//###//
function show_form_errors(errors, context) {
    var first_error = null;
    for (var fieldname in errors) {
        if (!first_error) first_error = fieldname;
        show_error(context.find('#error_' + fieldname), errors[fieldname]);
    }
    scroll_to_error(first_error);
}

// функция обработки клика по ссылке "Политика конфиденциальности"
$('.privacy-policy-link').live('click', function (e) {
    e.preventDefault();
    if (!$('#privacyPolicyDialog').length) {
        var url = $(this).attr('href');

        $.ajax({
            url         : "/controller/urlloader.php?g=" + url + "&isa=1",
            method      : 'GET',
            crossDomain : true,
            dataType    : 'HTML',
            success     : function (data) {
                $(document.body).append('<div id="privacyPolicyDialog" title="Политика конфиденциальности" class="adaptive-dialog">' + data + '</div>');
                $('#privacyPolicyDialog').dialog({
                    autoOpen    : true,
                    width       : 900,
                    height      : 800,
                    modal       : true,
                    open        : function () {
                        window.cartDialogLock = true;
                        var dialogZIndex = $('#privacyPolicyDialog').parent().css('z-index');
                        $('.ui-widget-overlay').each(function () {
                            var $element = $(this);
                            if ((parseInt($element.css('z-index')) + 1) == dialogZIndex) {
                                $element.off('click touchstart touchend touchmove touchcancel');
                                $element.on('click touchend', function (event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    $('#privacyPolicyDialog').dialog('close');
                                    return false;
                                });

                                $element.on('touchstart touchmove touchcancel', function (event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                });
                            }
                        });
                    },
                    beforeClose : function (event, ui) {
                        setTimeout(function () {
                            window.cartDialogLock = false;
                        }, 500);
                    },
                    close       : function () {
                        $('#privacyPolicyDialog').dialog("destroy").remove();
                    }
                });
            }
        });
    }
    else {
        $('#privacyPolicyDialog').dialog('open');
    }
});

function escapeHtml(text) {
    var map = {
        '&' : '&amp;',
        '<' : '&lt;',
        '>' : '&gt;',
        '"' : '&quot;',
        "'" : '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

/**
 * Проверка ZK-6353 Выводить атрибуты в 2 колонки или нет с доп условиями
 * @param attributes
 * @returns {boolean}
 */
function checkColumnAttributesLayout(attributes) {
    // установлен флаг
    if (attributes.multi_column_catalog === 1) {
        return true;
    }

    return checkAttributes(attributes.values);
}

/**
 * check attribute name length
 * @param attributeName
 * @returns {boolean}
 */
function checkAttrLength(attributeName) {
    var maxAttrNameLength = 12;

    return (typeof attributeName === 'string' && attributeName.length > maxAttrNameLength);
}

/**
 * check attributes count
 * @param attributes
 * @returns {boolean} length of attributes > 6
 */
function checkAttributesCount(attributes) {
    var maxAttrCountInColumn = 6;
    // console.log(attributes);
    // console.log(attributes.length);

    return attributes.length >= maxAttrCountInColumn;
}

/**
 * check attributes count and attributes has name length > 12
 * @param attributes
 * @returns {boolean}
 */
function checkAttributes(attributes) {
    if (checkAttributesCount(attributes)) {
        for (var i = 0; i < attributes.length; i++) {
            if (checkAttrLength(attributes[i].value)) {
                return false;
            }
        }
    }

    return checkAttributesCount(attributes);
}
/**
 * Копирует текст в буфер обмена
 *
 * @param string text
 */
function copyToClipboard(text) {
    var fakeElem = document.createElement('textarea');
    // Prevent zooming on iOS
    fakeElem.style.fontSize = '12pt';
    // Reset box model
    fakeElem.style.border = '0';
    fakeElem.style.padding = '0';
    fakeElem.style.margin = '0';
    // Move element out of screen horizontally
    fakeElem.style.position = 'absolute';
    fakeElem.style['left'] = '-9999px';
    // Move element to the same position vertically
    var yPosition = window.pageYOffset || document.documentElement.scrollTop;
    fakeElem.style.top = yPosition + 'px';
    fakeElem.setAttribute('readonly', '');
    fakeElem.value = text;

    document.body.appendChild(fakeElem);
    fakeElem.setSelectionRange(0, fakeElem.value.length);
    fakeElem.focus();
    document.execCommand('copy');
    fakeElem.blur();

    window.getSelection().removeAllRanges();
    document.body.removeChild(fakeElem);
}

function escapeQuotes(text) {
    return text.replace(/["]/g, '&quot;').replace(/[']/g, '&#039;');
}

function escapeUrl(text) {
    return escapeQuotes(text.replace(/[&]/g, '&amp;'));
}

/**
 * Декодирует html сущности
 *
 * @param {string} html
 * @returns {string}
 */
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Удаляет html теги
 *
 * @param {string} html
 * @returns {string}
 */
function stripTags(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

/**
 * Возвращает true на мобильном устройстве
 */
function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
