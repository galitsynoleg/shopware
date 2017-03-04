{block name='frontend_index_page_wrap'}
    <div class="swag-cookie-permission"
         data-cookieForwardTo="{$swagCookieBarConfig.forwardTo}"
         data-shopId="{$Shop->getId()}"
         data-cookiePermissionUrl="{url module=widgets controller=SwagCookiePermission action=isAffectedUser}"
         data-cookieMode="{$swagCookieBarConfig.cookieMode}">

        <div class="cookie-bar" style="display: none;{if $swagCookieBarConfig.backgroundColor} background-color:{$swagCookieBarConfig.backgroundColor}{/if}">
            <p class="bar--paragraph">{s name='cookieBarMessage' namespace='frontend/swag_cookie_permission/main'}This page requires cookies. Do you agree with the usage of cookies?{/s}
                <a href="#" class="cp-enable cp-btn"
                   title="{s name='CookieBarYesBtn' namespace='frontend/swag_cookie_permission/main'}Yes{/s}">
                    <span class="cp-yes-icon cp-icon"></span>
                    <span class="cp-btn-label">{s name='CookieBarYesBtn' namespace='frontend/swag_cookie_permission/main'}Yes{/s}</span>
                </a>
                <a href="#" class="cp-disable  cp-btn"
                   title="{s name='CookieBarNoBtn' namespace='frontend/swag_cookie_permission/main'}No{/s}">
                    <span class="cp-no-icon cp-icon"></span>
                    <span class="cp-btn-label">{s name='CookieBarNoBtn' namespace='frontend/swag_cookie_permission/main'}No{/s}</span>
                </a>
            </p>
        </div>
    </div>
    {$smarty.block.parent}
{/block}