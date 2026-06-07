using LogLens.Api.Models.Analysis;

namespace LogLens.Api.Services.Interfaces;

public interface IAnomalyDetectionService
{
    AnomalyResult Analyze(string logs);
}