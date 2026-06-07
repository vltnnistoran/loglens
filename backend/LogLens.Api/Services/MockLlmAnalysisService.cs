using LogLens.Api.Models.Analysis;
using LogLens.Api.Services.Interfaces;

namespace LogLens.Api.Services;

public sealed class MockLlmAnalysisService : ILlmAnalysisService
{
    public Task<LlmAnalysisResult> AnalyzeAsync(
        string logs,
        AnomalyResult anomalyResult,
        CancellationToken cancellationToken)
    {
        var result = new LlmAnalysisResult
        {
            IncidentDetected = anomalyResult.AnomalyDetected,
            Summary = anomalyResult.AnomalyDetected
                ? "The logs indicate potentially abnormal application behavior."
                : "The logs do not indicate a clear incident.",
            Explanation = anomalyResult.AnomalyDetected
                ? "The system detected suspicious patterns in the logs, such as repeated errors, critical keywords, or an unusually high number of error entries."
                : "The provided logs appear to represent normal or low-risk application behavior.",
            PossibleCauses = anomalyResult.AnomalyDetected
                ? ["Service dependency failure", "Configuration issue", "Network connectivity problem"]
                : [],
            SuggestedFixes = anomalyResult.AnomalyDetected
                ? ["Review recent deployments", "Check dependent services", "Inspect application configuration"]
                : [],
            Confidence = anomalyResult.AnomalyDetected ? "Medium" : "Low"
        };

        return Task.FromResult(result);
    }
}