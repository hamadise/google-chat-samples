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
// [START chat_incident_response_gemini]

/**
 * Summarizes a Chat conversation using the Gemini API text prediction API.
 *
 * @param {string} chatHistory The Chat history that will be summarized.
 * @return {string} The content from the text prediction response.
 */
function summarizeChatHistory_(chatHistory) {
  const prompt =
    "Summarize the following conversation between Engineers resolving an incident"
      + " in a few sentences. Use only the information from the conversation.\n\n"
      + chatHistory;

  const payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };

  const fetchOptions = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  }
  const gemini_endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    var response = UrlFetchApp.fetch(gemini_endpoint, fetchOptions);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    if (responseCode === 200) {
      var json = JSON.parse(responseBody);
      if (json.candidates && json.candidates.length > 0 &&
          json.candidates[0].content && json.candidates[0].content.parts &&
          json.candidates[0].content.parts.length > 0) {
        return json.candidates[0].content.parts[0].text;
      } else {
        return "Gemini API: Unexpected response structure.";
      }
    } else {
      return "Gemini API Error: " + responseCode + " - " + responseBody;
    }
  } catch (e) {
    console.log("Error during API call: " + e.toString())
    return 'Gemini API error, please check logs.'
  }
}
// [END chat_incident_response_gemini]