using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<Exception> _logger;
        public IHostEnvironment _Env { get; }
        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<Exception> logger,
            IHostEnvironment env)
        {
            this._Env = env;
            this._logger = logger;
            this._next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _Env.IsDevelopment()
                ? new APIException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new APIException(context.Response.StatusCode, ex.Message, "Internal Server Error!");

                var option = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                
                var json = JsonSerializer.Serialize(response, option);

                await context.Response.WriteAsync(json);

            }
        }

    }
}