import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

import { v4 as uuidV4 } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  const id = uuidV4();

  await document
    .put({
      TableName: "todos",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toISOString(),
        created_at: new Date().toISOString(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
