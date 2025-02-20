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
/**
 * Creates a space in Google Chat with the provided title and members, and posts an
 * initial message to it.
 *
 * @param {Object} formData the data submitted by the user. It should contain the fields
 *                          title, description, and users.
 * @return {string} the resource name of the new space.
 */
function handleIncident(formData) {
  console.log(formData)
  const appCredentialsMode = formData.appCredentials; // Get the appCredentials element
  if(appCredentialsMode){
    return handleIncidentWithAppCredentials(formData)
  } else{
    return handleIncidentWithHumanCredentials(formData)
  }
}