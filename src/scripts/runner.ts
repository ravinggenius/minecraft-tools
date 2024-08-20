import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const work = async (script: string) => {
	const { execute } = await import(script);

	await execute();
};

(async () => {
	await work("./import-releases.ts");
})();
