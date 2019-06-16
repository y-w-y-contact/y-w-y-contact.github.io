function FindProxyForURL(url, host) {
    if (dnsDomainIs(host, ".bilibili.com")) {
        return "PROXY secure.uku.im:8443";
    }
    return "DIRECT";
}
