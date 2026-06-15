using LogLens.Api.Controllers;
using LogLens.Api.Models.Analysis;
using LogLens.Api.Models.Requests;
using LogLens.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Text;
using Xunit;

namespace LogLens.Api.Tests;

public sealed class LogAnalysisControllerTests
{
    private readonly Mock<IAnomalyDetectionService> _anomalyServiceMock = new();
    private readonly Mock<ILlmAnalysisService> _llmServiceMock = new();
    private readonly LogAnalysisController _sut;

    public LogAnalysisControllerTests()
    {
        _sut = new LogAnalysisController(_anomalyServiceMock.Object, _llmServiceMock.Object);
    }

    private void SetupDefaultMocks(string logs)
    {
        _anomalyServiceMock
            .Setup(s => s.Analyze(logs))
            .Returns(new AnomalyResult
            {
                AnomalyDetected = true,
                Severity = "High",
                Summary = "Anomaly detected.",
                DetectedPatterns = ["ERROR count: 3"]
            });

        _llmServiceMock
            .Setup(s => s.AnalyzeAsync(logs, It.IsAny<AnomalyResult>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LlmAnalysisResult
            {
                IncidentDetected = true,
                Summary = "Database connection failures detected.",
                Explanation = "Repeated timeouts suggest the database is unreachable.",
                PossibleCauses = ["Database server is down"],
                SuggestedFixes = ["Verify database availability"],
                Confidence = "High"
            });
    }

    // Bad request cases

    [Fact]
    public async Task AnalyzeAsync_NullLogsAndNullFile_ReturnsBadRequest()
    {
        var request = new LogAnalysisRequest { Logs = null, File = null };

        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task AnalyzeAsync_WhitespaceLogsAndNullFile_ReturnsBadRequest()
    {
        var request = new LogAnalysisRequest { Logs = "   ", File = null };

        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    // Text input path

    [Fact]
    public async Task AnalyzeAsync_WithTextLogs_ReturnsOkWithResponse()
    {
        const string logs = "ERROR db connection failed\nERROR db connection failed\nERROR db connection failed";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task AnalyzeAsync_WithTextLogs_ResponseMapsAnomalyServiceSeverity()
    {
        const string logs = "ERROR fatal crash";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<LogLens.Api.Models.Responses.LogAnalysisResponse>(ok.Value);
        Assert.Equal("High", response.Severity);
    }

    [Fact]
    public async Task AnalyzeAsync_WithTextLogs_ResponseMapsLlmServiceSummary()
    {
        const string logs = "ERROR fatal crash";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<LogLens.Api.Models.Responses.LogAnalysisResponse>(ok.Value);
        Assert.Equal("Database connection failures detected.", response.Summary);
    }

    [Fact]
    public async Task AnalyzeAsync_WithTextLogs_ResponseIncludesDetectedPatterns()
    {
        const string logs = "ERROR fatal crash";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<LogLens.Api.Models.Responses.LogAnalysisResponse>(ok.Value);
        Assert.NotEmpty(response.DetectedPatterns);
    }

    // File input path

    [Fact]
    public async Task AnalyzeAsync_WithFileUpload_ReadsFileAndReturnsOk()
    {
        const string fileContent = "ERROR timeout connecting to db\nERROR timeout connecting to db\nERROR timeout";
        var fileBytes = Encoding.UTF8.GetBytes(fileContent);
        var stream = new MemoryStream(fileBytes);

        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.Length).Returns(fileBytes.Length);
        fileMock.Setup(f => f.OpenReadStream()).Returns(stream);

        _anomalyServiceMock
            .Setup(s => s.Analyze(It.IsAny<string>()))
            .Returns(new AnomalyResult
            {
                AnomalyDetected = true,
                Severity = "Medium",
                Summary = "Anomaly detected.",
                DetectedPatterns = ["timeout"]
            });

        _llmServiceMock
            .Setup(s => s.AnalyzeAsync(It.IsAny<string>(), It.IsAny<AnomalyResult>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LlmAnalysisResult
            {
                IncidentDetected = true,
                Summary = "Timeout issues detected.",
                Explanation = "Database timeouts observed.",
                PossibleCauses = ["DB overloaded"],
                SuggestedFixes = ["Scale DB"],
                Confidence = "Medium"
            });

        var request = new LogAnalysisRequest { Logs = null, File = fileMock.Object };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public async Task AnalyzeAsync_WithEmptyFile_ReturnsBadRequest()
    {
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.Length).Returns(0);

        var request = new LogAnalysisRequest { Logs = null, File = fileMock.Object };
        var result = await _sut.AnalyzeAsync(request, CancellationToken.None);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    // Service interaction

    [Fact]
    public async Task AnalyzeAsync_WithValidLogs_CallsAnomalyServiceExactlyOnce()
    {
        const string logs = "ERROR something went wrong";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        await _sut.AnalyzeAsync(request, CancellationToken.None);

        _anomalyServiceMock.Verify(s => s.Analyze(logs), Times.Once);
    }

    [Fact]
    public async Task AnalyzeAsync_WithValidLogs_CallsLlmServiceExactlyOnce()
    {
        const string logs = "ERROR something went wrong";
        SetupDefaultMocks(logs);

        var request = new LogAnalysisRequest { Logs = logs, File = null };
        await _sut.AnalyzeAsync(request, CancellationToken.None);

        _llmServiceMock.Verify(
            s => s.AnalyzeAsync(logs, It.IsAny<AnomalyResult>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task AnalyzeAsync_WithBadRequest_NeverCallsLlmService()
    {
        var request = new LogAnalysisRequest { Logs = null, File = null };
        await _sut.AnalyzeAsync(request, CancellationToken.None);

        _llmServiceMock.Verify(
            s => s.AnalyzeAsync(It.IsAny<string>(), It.IsAny<AnomalyResult>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }
}