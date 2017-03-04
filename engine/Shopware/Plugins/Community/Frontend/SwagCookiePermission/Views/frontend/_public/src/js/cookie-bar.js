;(function ($, window) {

    /**
     * The SwagCookiePermission JQuery plugin
     */
    $.plugin('swagCookiePermission', {

        /** @object Default plugin configuration */
        defaults: {
            cookiePermissionUrl: null,
            cookieForwardTo: null,
            cookieMode: 0,
            cookieBarClass: '.cookie-bar',
            enableCookieButtonClass: '.cp-enable',
            disableCookieButtonClass: '.cp-disable',
            overlayClassName: 'cookie-overlay',
            cookieName: 'allowCookie'
        },

        allowCookie: false,
        overlayClass: null,
        $_document: null,
        $_cookieBar: null,
        $_enableCookiesButton: null,
        $_disableCookiesButton: null,

        /**
         * Initializes the plugin.
         *
         * @returns void
         */
        init: function () {
            var me = this;

            me.applyDataAttributes();

            me.$_document = $(document);
            me.$_cookieBar = $(me.opts.cookieBarClass);
            me.$_enableCookiesButton = $(me.opts.enableCookieButtonClass);
            me.$_disableCookiesButton = $(me.opts.disableCookieButtonClass);
            me.allowCookie = me.getCookie(me.opts.cookieName);
            me.overlayClass = '.' + me.opts.overlayClassName;

            me.subscribeEvents();
        },

        /**
         * subscribe the necessary events
         */
        subscribeEvents: function () {
            var me = this;

            me.$_document.on('ajaxStop',$.proxy(me.onAjaxStop, me));
            me.$_enableCookiesButton.on('click', $.proxy(me.onEnableClick, me));
            me.$_disableCookiesButton.on('click', $.proxy(me.onDisableClick, me));
        },

        /**
         * the set a cookie with key value pair
         * the key equals the cookie name
         *
         * @param { String } key
         * @param { string } value
         */
        setCookie: function (key, value) {
            var me = this,
                expires = new Date();

            expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
        },

        /**
         * Returns cookie value
         * by name
         *
         * @param { String } name
         * @returns { mixed }
         */
        getCookie: function (name) {
            var nameEQ = name + "=",
                ca = document.cookie.split(';'),
                i = 0,
                caLength = ca.length;

            for (; i < caLength; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }

                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }

            return null;
        },

        /**
         * eventHandler for the document.
         * Checks if cookies are allowed.
         * If Cookies are not allowed send a request to for a required check.
         */
        onAjaxStop: function () {
            var me = this;

            if(me.allowCookie == 1) {
                me.$_cookieBar.remove();
                return
            }

            //If cookies are not allowed
            //show cookie bar
            me.$_document.off('ajaxStop');

            $.ajax({
                url: me.opts.cookiePermissionUrl,
                dataType: 'json'
            }).done(function (result) {
                if (result.isAffectedUser) {
                    me.$_cookieBar.show();
                    //If cookie mode is "remove cookies"
                    //page should be overlayed
                    if (me.opts.cookieMode != 1 && me.isForwarded() === false) {
                        $('<div>', {
                            class: me.opts.overlayClassName
                        }).appendTo($('body'));
                    }
                } else {
                    me.$_cookieBar.remove();
                }
            });
        },

        /**
         * EventHandler for the "enableCookieButton"
         */
        onEnableClick: function () {
            var me = this;

            me.setCookie(me.opts.cookieName, 1);
            me.$_cookieBar.slideToggle("slow", function () {
                me.$_cookieBar.remove();
                $(me.overlayClass).remove();
            });
        },

        /**
         * EventHandler for the "disableCookiesButton"
         */
        onDisableClick: function () {
            var me = this,
                loc = window.location;

            if (me.opts.cookieForwardTo == null) {
                return;
            }

            if (me.opts.cookieForwardTo.search('http://') > -1 || me.opts.cookieForwardTo.search('https://') > -1) {
                window.location = me.opts.cookieForwardTo;
            } else {
                window.location = loc.protocol + "//" + loc.hostname + "/" + me.opts.cookieForwardTo;
            }
        },

        /**
         * @returns { boolean }
         */
        isForwarded: function () {
            var me = this;

            if (me.opts.cookieForwardTo == window.location.href || me.opts.cookieForwardTo == window.location.pathname) {
                return true;
            }

            return false;
        }

    });

    /**
     * add the Plugin to the StateManager
     */
    $(function () {
        StateManager.addPlugin('.swag-cookie-permission', 'swagCookiePermission');
    });

})(jQuery, window);
