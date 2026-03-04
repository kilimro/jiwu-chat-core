export interface EnvConfigMap {
  VITE_API_BASE_URL: string;
  VITE_API_WS_BASE_URL: string;
  VITE_BASE_OSS_PATH?: string;
}

/** 部署时由 serve 注入的 config.js 写入（Docker 环境变量） */
type WindowWithAppConfig = Window & { __APP_CONFIG__?: Partial<EnvConfigMap> };

// 构建时默认值；部署时可由 window.__APP_CONFIG__（config.js）覆盖
const buildTimeDefaults: EnvConfigMap = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_WS_BASE_URL: import.meta.env.VITE_API_WS_BASE_URL,
  VITE_BASE_OSS_PATH: import.meta.env.VITE_BASE_OSS_PATH ?? "",
};
const win = typeof window !== "undefined" ? (window as WindowWithAppConfig) : undefined;
const deploymentConfig = win?.__APP_CONFIG__
  ? { ...buildTimeDefaults, ...win.__APP_CONFIG__ }
  : null;
export const DefaultEnvConfigMap: EnvConfigMap = deploymentConfig ?? buildTimeDefaults;

const savedConfig = useLocalStorage("env-config", DefaultEnvConfigMap, {
  mergeDefaults: true,
});
export function getEnvConfig() {
  return JSON.parse(JSON.stringify(savedConfig.value));
}
export function setEnvConfig(config: EnvConfigMap) {
  savedConfig.value = config;
}

// http请求
export const BASE_URL = savedConfig.value.VITE_API_BASE_URL;
export const BaseUrl = savedConfig.value.VITE_API_BASE_URL;
export const BaseUrlFont = `${savedConfig.value.VITE_API_BASE_URL}/public/font`;
export const BaseUrlRef = computed(() => savedConfig.value.VITE_API_BASE_URL);

// 图片（优先使用部署/本地配置）
export const BASE_OSS_PATH = savedConfig.value.VITE_BASE_OSS_PATH ?? import.meta.env.VITE_BASE_OSS_PATH ?? "";
export const BaseUrlAppFile = BASE_OSS_PATH;
export const BaseUrlImg = BASE_OSS_PATH;
export const BaseUrlVideo = BASE_OSS_PATH;
export const BaseUrlSound = BASE_OSS_PATH;
export const BaseUrlFile = BASE_OSS_PATH;
export const AuthKey = "Authorization";

// websocket
export const BaseWSUrl = savedConfig.value.VITE_API_WS_BASE_URL;
export const BaseWSUrlRef = computed(() => savedConfig.value.VITE_API_WS_BASE_URL);
