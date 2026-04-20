import { Client } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN;

export const notion = new Client({
  auth: NOTION_TOKEN,
});

export const fetchDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const createPage = async (databaseId: string, properties: Parameters<typeof notion.pages.create>[0]['properties']) => {
  return await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
};
