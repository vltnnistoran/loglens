using LogLens.Api.Models.Analysis;

namespace LogLens.Api.Services.Interfaces;

public interface ILlmAnalysisService
{
    Task<LlmAnalysisResult> AnalyzeAsync(
        string logs,
        AnomalyResult anomalyResult,
        CancellationToken cancellationToken);
}