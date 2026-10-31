import crypto from 'crypto';

export default { verify };

async function verify(r) {
    var authHeader = r.headersIn['Authorization'];
    var account = null;
    var pass = null;

    if (authHeader && authHeader.startsWith('Basic ')) {
        try {
            var decoded = Buffer.from(authHeader.substring(6), 'base64').toString('utf8');
            var parts = decoded.split(':');
            account = parts[0];
            pass = parts.slice(1).join(':'); 
        } catch (e) {
            r.error("Base64 decode error: " + e);
        }
    }

    if (!account || !pass) {
        r.return(401);
        return;
    }

    // 修复：加上 Buffer.from，确保中文/特殊字符 MD5 准确
    var hashedPass = crypto.createHash('md5').update(Buffer.from(pass, 'utf8')).digest('hex').toUpperCase();

    var body = "account=" + encodeURIComponent(account) + "&password=" + encodeURIComponent(hashedPass);

    var reply = await r.subrequest("/_auth_api", {
        method: "POST",
        body: body
    });

    // 修复：显式调用 r.return 接管响应
    if (reply.status === 200) {
        r.return(200); 
    } else {
        r.error("Auth API returned: " + reply.status + " Body: " + reply.responseBody);
        r.return(401);
    }
}
