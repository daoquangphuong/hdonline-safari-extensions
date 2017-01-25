if (!window.injected) {
    window.stop();

    function hack(data) {
        data = data.replace(/isVip = false;/g, 'isVip = true;');
        data = data.replace(/"uvip":false/g, '"uvip":true');
        data = data.replace(/"vads":true/g, '"vads":false');
        data = data.replace(/jwplayer\('hdoplayer'\).getState\(\) !=  null/g, 'false');
        data = data.replace(/eval\(function/g, 'var oldJwplayer = jwplayer; var hook = 1; jwplayer = function (name) { if (hook) { hook = 0; return { setup: function (config) { var key = Object.keys(config.plugins)[0]; config.plugins[key].vads = false; oldJwplayer(name).setup(config); } } } return oldJwplayer(name); }; eval(function');
        return data;
    }

    function jQueryHack() {
        jQuery.ajaxSetup({
            dataFilter: function (data) {
                if (typeof data === 'string') {
                    return hack(data);
                }
                return data;
            }
        });
    }

    jQueryHack();

    $.get(window.location.href).done(data => {
        const oldScript = `<script type="text/javascript" src="http://static.hdonline.vn/template/frontend/js/jquery-1.11.0.min.js?v=006"></script>`;
        data = data.replace(oldScript, `
${oldScript}
<script type="text/javascript" id="jQueryHack">
    ${hack.toString()}
    ${jQueryHack.toString()}
    jQueryHack();
    $('#jQueryHack').remove();
</script>
`);
        document.write(data);
        document.close();
    });
}

window.injected = true;
