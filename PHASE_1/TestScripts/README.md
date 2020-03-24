# How to run Tests
Test can either be run from the cmd or from the Postman Client

## CMD
Locally
`./localTests.sh`

On deployed API
`./deployedTests.sh`

### To Install Newman
If you haven't used newman before, you will be prompted to install newman. To do that, do as follows. 
`npm install -g newman`

## Postman Client
To use postman to see the tests, you need to import the collection into your client. To do that you:

 1. Click file -> then import. 
 2. Click choose file
 3. Navigate to and select the collection json file. 

The collection will now be imported into your client, and can be run through the client. 

