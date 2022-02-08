import fs from "fs";

const FILE_NAME = "sdks.json";

export type WeeklyUpdateData = {
  outputDest: string;
  schemaRoot: string;
};

export type KatSDK = {
  sshURL: string;
  htmlURL: string;
  repo: string;
  weeklyUpdates: WeeklyUpdateData;
  // consumers: string[];
};

export type KatSDKMap = {
  [name: string]: KatSDK;
};

export type Consumer = {
  sdkName: string;
  consumer: string[];
};

export type ConsumerMap = {
  [name: string]: Consumer;
};

export function getKatSdks(fileName = FILE_NAME): KatSDKMap {
  const json: KatSDKMap = JSON.parse(fs.readFileSync(fileName).toString());
  return json;
}

export function getConsumers(): ConsumerMap {
  const json: ConsumerMap = JSON.parse(
    fs.readFileSync("consumers.json").toString()
  );
  return json;
}
