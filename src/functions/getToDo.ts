import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  var params = {
    TableName: "todos",
    FilterExpression: "user_id = :user_id",

    ExpressionAttributeValues: { ":user_id": user_id },
  };

  const response = await document.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  };
};
