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
// [START handle_incident_with_human_credentials]

/**
 * Handles an incident by creating a chat space, adding members, and posting a message.
 * All the actions are done using human credentials.
 *
 * @param {Object} formData - The data submitted by the user. It should contain the fields:
 *                           - title: The display name of the chat space.
 *                           - description: The description of the incident.
 *                           - users: A comma-separated string of user emails to be added to the space.
 * @return {string} The resource name of the new space.
 */
function handleIncidentWithHumanCredentials(formData) {
  const users = formData.users.trim().length > 0 ? formData.users.split(',') : [];
  const spaceName = setUpSpaceWithHumanCredentials_(formData.title, users);
  addAppToSpaceWithHumanCredentials_(spaceName);
  createMessageWithHumanCredentials_(spaceName, formData.description);
  return spaceName;
}

/**
 * Creates a space in Google Chat with the provided display name and members.
 *
 * @return {string} the resource name of the new space.
 */
function setUpSpaceWithHumanCredentials_(displayName, users) {
  const memberships = users.map(email => ({
    member: {
      name: `users/${email}`,
      type: "HUMAN"
    }
  }));
  const request = {
    space: {
      displayName: displayName,
      spaceType: "SPACE",
      externalUserAllowed: true
    },
    memberships: memberships
  };
  // Call Chat API method spaces.setup
  const space = Chat.Spaces.setup(request);
  return space.name;
}

/**
 * Adds this Chat app to the space.
 *
 * @return {string} the resource name of the new membership.
 */
function addAppToSpaceWithHumanCredentials_(spaceName) {
  const request = {
    member: {
      name: "users/app",
      type: "BOT"
    }
  };
  // Call Chat API method spaces.members.create
  const membership = Chat.Spaces.Members.create(request, spaceName);
  return membership.name;
}

/**
 * Posts a text message to the space on behalf of the user.
 *
 * @return {string} the resource name of the new message.
 */
function createMessageWithHumanCredentials_(spaceName, text) {
  const request = {
    text: text
  };
  // Call Chat API method spaces.messages.create
  const message = Chat.Spaces.Messages.create(request, spaceName);
  return message.name;
}
// [END handle_incident_with_human_credentials]