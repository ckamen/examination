var Crypto = require('../libs/cryptojs/cryptojs.js').Crypto;

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatDatetime(value) {
    value = trim(value);
    if (value != '') {
        value = value.substring(0, 16);
    }
    return value;
}

function trim(s) {
    if (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    } else {
        return "";
    }
}

function showToast(title, success) {
    wx.showToast({
        title: title,
        icon: 'success',
        duration: 3000,
        success: success
    })
}

function showAlert(content, callback) {
    wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
        success: () => {
            if (typeof callback === 'function') {
                callback();
            }
        }
    });
}

function showConfirm(content, yesCallback, noCallback) {
    wx.showModal({
        title: '确认',
        content: content,
        success: res => {
            if (res.confirm && typeof yesCallback === 'function') {
                yesCallback();
            } else if (typeof  noCallback === 'function') {
                noCallback();
            }
        },
    });
}

function showLoading(title) {
    title = title || '加载中...';
    wx.showLoading({
        title: title,
        mask: true
    });
}

function redirectTo(url, success) {
    wx.redirectTo({
        url: url,
        success: success
    })
}

function navigateTo(url, success) {
    wx.navigateTo({
        url: url,
        success: success
    });
}

function aesEncrypt (word){
    var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    var eb = Crypto.charenc.UTF8.stringToBytes(word);
    var kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    var vb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//IV
    var ub = Crypto.AES.encrypt(eb,kb,{iv:vb,mode:mode,asBytes:true});
    var encrypted = Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(Crypto.util.bytesToBase64(ub)));
    return encrypted;
}
function aesDecrypt (word){
    var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    var eb = Crypto.util.base64ToBytes(Crypto.charenc.UTF8.bytesToString(Crypto.util.hexToBytes(word)));
    var kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    var vb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//IV
    var ub = Crypto.AES.decrypt(eb,kb,{asBytes:true,mode:mode,iv:vb});
    var decrypted = Crypto.charenc.UTF8.bytesToString(ub);
    return decrypted;
}

module.exports = {
    formatTime: formatTime,
    formatDatetime: formatDatetime,
    showToast: showToast,
    showAlert: showAlert,
    showConfirm: showConfirm,
    showLoading: showLoading,
    trim: trim,
    redirectTo: redirectTo,
    navigateTo: navigateTo,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt
}
