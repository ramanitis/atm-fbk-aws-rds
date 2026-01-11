ATM-FBK-AWS-RDS
---
Automation of Facebook Posts, Data Management using AWS and RDS

APIs
---
*Generate Image with your prompt with OPENAI*
```
curl --request GET \
  --url 'http://localhost:4545/generate-image?prompt=<YOUR_PROMPT>'
```
---
*Read the saved base64 image content directly from REDIS*
```
curl --request GET \
  --url http://localhost:4545/redis/image?key=<YOUR_REDIS_KEY>
```
