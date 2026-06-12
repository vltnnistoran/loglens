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
            You are a DevOps monitoring assistant.

            Analyze the following application logs:

            {0}

            A rule-based anomaly detector produced this result:

            {1}

            Your task:
            1. Determine whether the logs indicate abnormal behavior.
            2. Explain what is happening in clear technical language.
            3. Identify possible root causes.
            4. Suggest practical fixes.
            5. State uncertainty if the root cause cannot be confirmed.

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