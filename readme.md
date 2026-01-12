ATM-FBK-AWS-RDS
---
Facebook Page Automation, Data Management using AWS and REDIS

APIs
---
<br>

1. *Generate Image with your prompt with OPENAI*
```
curl --request GET \
  --url 'http://localhost:4545/generate-image?prompt=<YOUR_PROMPT>'
```  
<br>

2. *Read the saved base64 image content directly from REDIS*
```
curl --request GET \
  --url http://localhost:4545/redis/image?key=<YOUR_REDIS_KEY>
```
<br>

3. *Upload the image to your aws s3 bucket to generate a public URL*
```
curl --request POST \
  --url 'http://localhost:4545/generate-url?key=<YOUR_REDIS_KEY>'
```
<br>

4. *Authenticate yourself with facebook*

```
curl --request GET \
  --url 'http://localhost:4545/auth/facebook'
```
<br>

5. *Manage where you want to redirect yourself after successfull authentication*

```
curl --request GET \
  --url 'http://localhost:4545/auth/facebook/callback'
```
<br>

6. *Post, to a Facebook page*

```
curl --request POST \
  --url http://localhost:4545/facebook/post \
  --header 'content-type: application/json' \
  --data '{
  "pageId": "<PAGE_ID>",
  "message": "<YOUR_MESSAGE>"
}'
```
<br>

7. *List Facebook Pages, that you inclucded while authenticating*

```
curl --request GET \
  --url http://localhost:4545/facebook/page
```
