# Azure Functions (TypeScript)

This app contains Azure Functions running on the Node.js v4 programming model.

## Create new Functions 

Use Azure Functions Core Tools CLI to create new functions.

```bash
func new --template "[template-name]" --name "[function-name]"
```

Notes:
- `--template` selects the trigger/binding template.
- `--name` is the function file/function name.
- Critical: run this command from the Functions app root (`apps/functions`) so files are generated in the correct app.


### TypeScript templates are:

- Azure Blob Storage trigger
- Azure Cosmos DB trigger
- Durable Functions activity
- Durable Functions entity
- Durable Functions Entity HTTP starter
- Durable Functions HTTP starter
- Durable Functions orchestrator
- Azure Blob Storage Trigger (using Event Grid)
- Azure Event Grid trigger
- Azure Event Hub trigger
- HTTP trigger
- IoT Hub (Event Hub)
- Kafka output
- Kafka trigger
- MySql Input Binding
- MySql Output Binding
- MySql Trigger
- Azure Queue Storage trigger
- RabbitMQ trigger
- SendGrid
- Azure Service Bus Queue trigger
- Azure Service Bus Topic trigger
- SignalR negotiate HTTP trigger
- SQL Input Binding
- SQL Trigger
- Timer trigger
- Azure Blob Storage trigger
- Azure Cosmos DB trigger
- Durable Functions entity
- Durable Functions orchestrator
- Azure Blob Storage trigger (using Event Grid)
- Azure Event Grid trigger
- Azure Event Hub trigger
- HTTP trigger
- Azure Queue Storage trigger
- Azure Service Bus Queue trigger
- Azure Service Bus Topic trigger
- Timer trigger
- MCP Tool Trigger
