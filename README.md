# nasearch-nginx-auth

- 这是 NASearch 的定制化部署包。

- 使用 `nginx` 和 `auth.js` 接入了外部认证 API。

- 在 `nginx.conf` 中隐藏了 Settings、Footer 和下载按钮。

- 管理员如果需要重建索引，使用命令：

   `curl -X POST http://127.0.0.1:8000/api/reindex`
