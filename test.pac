function FindProxyForURL(url, host) {
    if (shExpMatch(host, "*.data.bilibili.com") || shExpMatch(host, "data.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.chat.bilibili.com") || shExpMatch(host, "chat.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.cm.bilibili.com") || shExpMatch(host, "cm.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.live.bilibili.com") || shExpMatch(host, "live.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.vc.bilibili.com") || shExpMatch(host, "vc.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.message.bilibili.com") || shExpMatch(host, "message.bilibili.com"))
        return "DIRECT";
    if (shExpMatch(host, "*.passport.bilibili.com") || shExpMatch(host, "passport.bilibili.com"))
        return "DIRECT";

    //bilibili預設連線方式
    if (shExpMatch(host, "*.bilibili.com") || shExpMatch(host, "bilibili.com"))
        return "HTTPS secure.uku.im:8443";
    //預設連線方式
    return "DIRECT";

}