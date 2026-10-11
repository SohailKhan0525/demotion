import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Optional overrides for unusual machines (CI, containers). Normal users need neither.
if (process.env.DEMOTION_BROWSER) Config.setBrowserExecutable(process.env.DEMOTION_BROWSER);
if (process.env.DEMOTION_CONCURRENCY) Config.setConcurrency(Number(process.env.DEMOTION_CONCURRENCY));
