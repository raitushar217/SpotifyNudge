/**
 * Clean LLM response by stripping Markdown code fences.
 */
function cleanJsonResponse(text) {
  let cleaned = text.trim();
  
  const firstCurly = cleaned.indexOf('{');
  const lastCurly = cleaned.lastIndexOf('}');
  const firstSquare = cleaned.indexOf('[');
  const lastSquare = cleaned.lastIndexOf(']');
  
  let startIdx = -1;
  let endIdx = -1;
  
  if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
    startIdx = firstCurly;
    endIdx = lastCurly;
  } else if (firstSquare !== -1) {
    startIdx = firstSquare;
    endIdx = lastSquare;
  }
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  } else {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  
  return cleaned.trim();
}

/**
 * Send a POST request to Groq OpenAI-compatible Chat Completion API
 * and parse the return content as a clean JSON object.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options
 * @returns {Promise<any>} Parsed JSON object
 */
export async function callGroq(systemPrompt, userPrompt, { temperature = 0.7, logResponse = false } = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not defined in environment variables");
  }

  const maxRetries = 5;
  let delay = 600; // base delay in ms

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature,
          response_format: { type: "json_object" },
        }),
      });

      // Handle 429 Rate Limits
      if (response.status === 429 && attempt < maxRetries) {
        const retryAfterHeader = response.headers.get("retry-after");
        let sleepMs = delay;
        if (retryAfterHeader) {
          const parsed = parseFloat(retryAfterHeader);
          if (!isNaN(parsed)) {
            sleepMs = parsed * 1000 + 150; // Add small buffer
          }
        }
        if (logResponse) {
          console.warn(`Groq Rate limit (429) hit on attempt ${attempt}. Retrying in ${sleepMs}ms...`);
        }
        await new Promise((resolve) => setTimeout(resolve, sleepMs));
        delay *= 2; // exponential backoff
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        if (logResponse) {
          console.error("Raw Groq API error response:", errorText);
        }
        throw new Error(`Groq API returned error status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (logResponse) {
        console.log("Raw Groq API response:", data);
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Groq API response did not contain message content");
      }

      const cleanedContent = cleanJsonResponse(content);
      try {
        return JSON.parse(cleanedContent);
      } catch (err) {
        throw new Error(`Failed to parse Groq response as JSON. Error: ${err.message}. Original content: ${content}`);
      }

    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      if (logResponse) {
        console.warn(`Error on attempt ${attempt} in callGroq: ${err.message}. Retrying in ${delay}ms...`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
