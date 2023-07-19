# brittanyandcaleb.gay

> A wedding invitation app

**Examples to follow**:

- <https://github.com/andreivmaksimov/serverless-framework-aws-lambda-amazon-api-gateway-s3-dynamodb-and-cognito>
- <https://github.com/bsdkurt/aws-node-custom-user-pool>

**Documentation**:

- <https://www.serverless.com/framework/docs/providers/aws/events/cognito-user-pool>

**Client app**:

- [how to get a Cognito token from google auth access token](https://docs.aws.amazon.com/cognito/latest/developerguide/google.html#set-up-google-1.javascript)

---

## What I've done so far

1. Set up a rudimentary React app
2. Configured Google as a Federated Identity Provider for the web-client of the Cognito User Pool ([this was the guide that really made the difference](https://beabetterdev.com/2021/08/16/how-to-add-google-social-sign-on-to-your-amazon-cognito-user-pool/), then [this article on the dreadful **Authorization code flow** absolutely saved me](https://www.yippeecode.com/topics/aws-cognito-oauth-2-authorization-code-flow/))
   1. As best as I could, configured this after-the-fact in serverless.yml
   2. [The Google App](https://console.cloud.google.com/apis/credentials?project=calebandbrittany-gay-v0&supportedpurview=project)
3. Deployed React app to S3
   1. I had to modify the bucket manually in the AWS console, which is a bummer, but oh well.
4. Registered `brittanyandcaleb.gay` in Route 53, configured their Nameservers with namecheap.com
5. Registered with AWS Certificate Manager for a Certificate for brittanyandcaleb.gay
   1. Updated Route 53 to have CNAME provided by ACM
6. Created the Cloudfront distribution for the S3 bucket + domain + certificate

## Tangential, relevant, but not-actually-used-at-all links

1. Example configuration for a Federated Identity Provider <https://gist.github.com/singledigit/2c4d7232fa96d9e98a3de89cf6ebe7a5>
2. Good to know this very magical API exists <https://docs.amplify.aws/lib/auth/social/q/platform/js/#configure-auth-category>
3. <https://blog.logrocket.com/guide-adding-google-login-react-app/>
