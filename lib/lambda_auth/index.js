import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: "us-east-1" });
let cachedSecret = null; // 1. Cache the secret in a global variable

// Helper function to get the secret (with caching)
async function getMySecret() {
  if (cachedSecret) {
    return cachedSecret;
  }
  
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "connectors_nodejs_api" })
  );
  
  // NOTE: Store the plain string, not the JSON object
  cachedSecret = response.SecretString; 
  return cachedSecret;
}

export const handler = async (event) => {
  try {
    // console.log(event);
    const incomingKey = event.headers['authorization'];
    
    const secret = await getMySecret();
    const realKey = JSON.parse(secret);
    
    if (incomingKey === realKey.API_KEY) {
      // console.log('Allow...beep');
      return { "isAuthorized": true };
    } else {
      console.warn('Invalid API key provided.');
      return { "isAuthorized": false };
    }
  } catch (error) {
    console.error('Error in authorizer:', error);
    return { "isAuthorized": false };
  }
};