using LogLens.Api.Models.Requests;
using LogLens.Api.Models.Responses;
using LogLens.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LogLens.Api.Controllers;

[ApiController]
[Route("api/log-analysis")]
public sealed class LogAnalysisController : ControllerBase
{
    private readonly IAnomalyDetectionService _anomalyDetectionService;
    private readonly ILlmAnalysisService _llmAnalysisService;

    public LogAnalysisController(
        IAnomalyDetectionService anomalyDetectionService,
        ILlmAnalysisService llmAnalysisService)
    {
        _anomalyDetectionService = anomalyDetectionService;
        _llmAnalysisService = llmAnalysisService;
    }

    [HttpPost("analyze")]
    [RequestSizeLimit(2_000_000)]
    public async Task<ActionResult<LogAnalysisResponse>> AnalyzeAsync(
        [FromForm] LogAnalysisRequest request,
        CancellationToken cancellationToken)
    {
        var logs = await ExtractLogsAsync(request, cancellationToken);

        if (string.IsNullOrWhiteSpace(logs))
        {
            return BadRequest("No log content was provided.");
        }

        var anomalyResult = _anomalyDetectionService.Analyze(logs);

        var llmResult = await _llmAnalysisService.AnalyzeAsync(
            logs,
            anomalyResult,
            cancellationToken);

        var response = new LogAnalysisResponse
        {
            AnomalyDetected = anomalyResult.AnomalyDetected,
            Severity = anomalyResult.Severity,
            Summary = llmResult.Summary,
            Explanation = llmResult.Explanation,
            PossibleCauses = llmResult.PossibleCauses,
            SuggestedFixes = llmResult.SuggestedFixes,
            Confidence = llmResult.Confidence,
            DetectedPatterns = anomalyResult.DetectedPatterns
        };

        return Ok(response);
    }

    private static async Task<string> ExtractLogsAsync(
        LogAnalysisRequest request,
        CancellationToken cancellationToken)
    {
        if (request.File is not null && request.File.Length > 0)
        {
            await using var stream = request.File.OpenReadStream();
            using var reader = new StreamReader(stream);

            return await reader.ReadToEndAsync(cancellationToken);
        }

        return request.Logs ?? string.Empty;
    }
}