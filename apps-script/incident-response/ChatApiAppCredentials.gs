/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function handleIncidentWithAppCredentials(formData) {
  const users = formData.users.trim().length > 0 ? formData.users.split(',') : [];
  const spaceName = createChatSpaceWithAppCredentials(formData.title);
  createHumanMembershipWithAppCredentials(spaceName, getUserEmail());
  for (const user of users ){
    createHumanMembershipWithAppCredentials(spaceName, user);
  }
  createMessageWithAppCredentials(spaceName, formData.description);
  return spaceName;
}



function createChatSpaceWithAppCredentials(spaceName) {
  try {
    const service = getService_();
    if (!service.hasAccess()) {
      console.error(service.getLastError());
      return;
    }
    // for private apps, the alias can be used
    const my_customer_alias = "customers/my_customer"
    // Specify the space to create.
    const space = {
        displayName: spaceName,
        spaceType: 'SPACE',                
        customer: my_customer_alias
    };
    // Call Chat API with a service account to create a message.
    const createdSpace = Chat.Spaces.create(
        space,
        {},
        // Authenticate with the service account token.
        {'Authorization': 'Bearer ' + service.getAccessToken()});
    // Log details about the created message.
    console.log(createdSpace);
    return createdSpace.name;
  } catch (err) {
    // TODO (developer) - Handle exception.
    console.log('Failed to create space with error %s', err.message);
  }
}

function createMessageWithAppCredentials(spaceName, message) {
  try {
    const service = getService_();
    if (!service.hasAccess()) {
      console.error(service.getLastError());
      return;
    }

    // Call Chat API with a service account to create a message.
    const result = Chat.Spaces.Messages.create(
        {'text': message},
        spaceName,
        {},
        // Authenticate with the service account token.
        {'Authorization': 'Bearer ' + service.getAccessToken()});

    // Log details about the created message.
    console.log(result);
  } catch (err) {
    // TODO (developer) - Handle exception.
    console.log('Failed to create message with error %s', err.message);
  }
}

function createHumanMembershipWithAppCredentials(spaceName, email){
  try{
    const service = getService_();
      if (!service.hasAccess()) {
        console.error(service.getLastError());
        return;
      }
    const membership = {
      member: {
        // TODO(developer): Replace USER_NAME here
        name: 'users/'+email,
        // User type for the membership
        type: 'HUMAN'
      }
    };
    const result = Chat.Spaces.Members.create(
      membership,
      spaceName,
      {},
      {'Authorization': 'Bearer ' + service.getAccessToken()}
    );
    console.log(result)
  } catch (err){
    console.log('Failed to create membership with error %s', err.message)
  }

}


function getService_() {
  return OAuth2.createService(APP_CREDENTIALS.client_email)
      .setTokenUrl('https://oauth2.googleapis.com/token')
      .setPrivateKey(APP_CREDENTIALS.private_key)
      .setIssuer(APP_CREDENTIALS.client_email)
      .setSubject(APP_CREDENTIALS.client_email)
      .setScope(APP_CREDENTIALS_SCOPES)
      .setPropertyStore(PropertiesService.getScriptProperties());
}