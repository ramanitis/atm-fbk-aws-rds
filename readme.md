ATM-FBK-AWS-RDS
---
Automation of Facebook Posts, Data Management using AWS and RDS

APIs
---
1. *Generate Image with your prompt with OPENAI*
```
curl --request GET \
  --url 'http://localhost:4545/generate-image?prompt=<YOUR_PROMPT>'
```

2. *Read the saved base64 image content directly from REDIS*
```
curl --request GET \
  --url http://localhost:4545/redis/image?key=<YOUR_REDIS_KEY>
```
---
3. *Upload the image to your aws s3 bucket to generate a public URL*
```
curl --request POST \
  --url 'http://localhost:4545/generate-url?key=<YOUR_REDIS_KEY>'
```