adminBanner();

$.ajax({
    method: "GET",
    url: "/ajax/plan",
    dataType: "json",
})
    .done(function (response) {
        if (response.Ok) {
            var user = response.User
            var plan = response.Plan

            if (user.permission_id == 0) {
                $("#no_plan").removeAttr("style");
                done();
                return
            }

            if (plan.id == 0) $("#info_name").text("定制套餐"); else $("#info_name").text(plan.name);

            if (user.reset_date == "0001-01-01") $("#info_resetdate").text("无"); else $("#info_resetdate").text(user.reset_date);
            if (user.expire_date == "0001-01-01") {
                $("#info_expiredate").text("无");
                $("#info_renew").attr("disabled", true);
            } else $("#info_expiredate").text(user.expire_date);

            $("#info_autorenew").prop("checked", user.auto_renew);

            $("#info_rule").text(user.rule + " 条");
            $("#info_nat_rule").text(user.nat_rule + " 条");
            $("#info_traffic").text((user.traffic / 1073741824).toFixed() + " GB");
            $("#info_traffic_used").text((user.traffic_used / 1073741824).toFixed(2) + " GB");

            if (user.speed == 0) $("#info_speed").text("不限制"); else $("#info_speed").text(user.speed + " Mbps");
            if (user.maxconn == 0) $("#info_maxconn").text("不限制"); else $("#info_maxconn").text(user.maxconn);

            if (user.price == 0) $("#info_price").text("免费"); else $("#info_price").text(user.price + " 元");
            if (user.cycle == 0) $("#info_cycle").text("一次性"); else $("#info_cycle").text(user.cycle + " 天");

            $("#view_plan").removeAttr("style");
            done();
        } else sendmsg(response.Msg);
    })
    .fail(function () {
        sendmsg("未能获取服务器数据, 请检查网络是否正常");
    });


$("#info_renew").on("click", function () {
    mdui.confirm("确认续费? 请确保账户内余额充足", "确认", function () {
        $.ajax({
            method: "GET",
            url: "/ajax/plan/renew",
            dataType: "json",
        })
            .done(function (response) {
                sendmsg(response.Msg);
                if (response.Ok) setTimeout(3000, window.reload)
            })
            .fail(function () {
                sendmsg("未能获取服务器数据, 请检查网络是否正常");
            });
    });
});


$("#info_reset").on("click", function () {
    mdui.confirm("确认重置流量? 请确保账户内余额充足", "确认", function () {
        $.ajax({
            method: "GET",
            url: "/ajax/plan/reset",
            dataType: "json",
        })
            .done(function (response) {
                sendmsg(response.Msg);
                if (response.Ok) setTimeout(3000, window.reload)
            })
            .fail(function () {
                sendmsg("未能获取服务器数据, 请检查网络是否正常");
            });
    });
});


$("#info_autorenew").on("click", function () {
    var status = $("#info_autorenew").prop("checked");
    $.ajax({
        method: "GET",
        url: "/ajax/plan/auto_renew?status=" + status,
        dataType: "json",
    })
        .done(function (response) {
            sendmsg("操作成功");
        })
        .fail(function () {
            sendmsg("未能获取服务器数据, 请检查网络是否正常");
        });
});
