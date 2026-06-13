using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using LogLens.Api.Models.Analysis;
using LogLens.Api.Services.Interfaces;

namespace LogLens.Api.Services;

public sealed class OpenAiLlmAnalysisService : ILlmAnalysisService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public OpenAiLlmAnalysisService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<LlmAnalysisResult> AnalyzeAsync(
        string logs,
        AnomalyResult anomalyResult,
        CancellationToken cancellationToken)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        var model = _configuration["OpenAI:Model"] ?? "gpt-4.1-mini";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("OpenAI API key is missing.");
        }

        var prompt = BuildPrompt(logs, anomalyResult);

        var requestBody = new
        {
            model,
            input = prompt,
            temperature = 0.2,
            text = new
            {
                format = new
                {
                    type = "json_object"
                }
            }
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/responses");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        using var response = await _httpClient.SendAsync(
            request,
            cancellationToken);

        var responseJson = await response.Content.ReadAsStringAsync(
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"LLM API request failed: {response.StatusCode} - {responseJson}");
        }

        var outputText = ExtractOutputText(responseJson);

        return JsonSerializer.Deserialize<LlmAnalysisResult>(
                   outputText,
                   new JsonSerializerOptions
                   {
                       PropertyNameCaseInsensitive = true
                   })
               ?? throw new InvalidOperationException("Failed to parse LLM response.");
    }

    private static string BuildPrompt(string logs, AnomalyResult anomalyResult)
    {
        var anomalyJson = JsonSerializer.Serialize(anomalyResult);

        return string.Format(
            """
            You are a senior Site Reliability Engineer and DevOps specialist with deep expertise in distributed systems, application monitoring, and log-based incident diagnosis.

            Analyze the following application logs:

            {0}

            A rule-based anomaly detector produced this result:

            {1}

            Your task:
            1. Determine whether the logs indicate abnormal behavior.
            2. Explain in clear technical language what is happening, referencing specific log entries or patterns as evidence.
            3. Identify possible root causes. For each cause, cite the specific log evidence that supports it.
            4. Suggest practical, actionable fixes directly related to the evidence found in the logs. Do not suggest generic fixes that are not grounded in the log content.
            5. Assign confidence based on the following criteria:
            - "High": the logs contain direct, unambiguous evidence that clearly identifies the problem.
            - "Medium": the pattern is strongly suggestive but the logs alone are insufficient to confirm the root cause with certainty.
            - "Low": the logs are too limited, ambiguous, or incomplete to determine the cause with reasonable confidence.
            6. If the log sample is too short or lacks sufficient detail for confident analysis, acknowledge this explicitly in the explanation.

            Return only valid JSON with this exact structure:

            {{
            "incidentDetected": true,
            "summary": "",
            "explanation": "",
            "possibleCauses": [],
            "suggestedFixes": [],
            "confidence": "Low"
            }}

            The confidence value must be one of: "Low", "Medium", "High".
            """,
            logs,
            anomalyJson);
    }

    private static string ExtractOutputText(string responseJson)
    {
        using var document = JsonDocument.Parse(responseJson);
        var root = document.RootElement;

        if (root.TryGetProperty("output_text", out var outputText))
        {
            return outputText.GetString() ?? "{}";
        }

        var output = root.GetProperty("output");

        foreach (var item in output.EnumerateArray())
        {
            if (!item.TryGetProperty("content", out var content))
            {
                continue;
            }

            foreach (var contentItem in content.EnumerateArray())
            {
                if (contentItem.TryGetProperty("text", out var text))
                {
                    return text.GetString() ?? "{}";
                }
            }
        }

        return "{}";
    }
}