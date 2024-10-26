import { withPluginApi } from "discourse/lib/plugin-api";

let flag = false;

export default {
  name: "@radixdlt/babylon-gateway-api-sdk",
  initialize() {
    withPluginApi("0.8", (api) => {
      api.onAppEvent("page:changed", () => {
        if (flag) {
          return;
        }

        addScript(
          "https://unpkg.com/@radixdlt/babylon-gateway-api-sdk@1.7.3/dist/babylon-gateway-api-sdk.umd.js",
          {
            defer: "",
            crossorigin: "anonymous",
          }
        );
        flag = true;
      });
    });
  },
};

function addScript(src, attrs) {
  let script = document.createElement("script");

  script.setAttribute("src", src);

  Object.keys(attrs).forEach((key) => {
    script.setAttribute(key, attrs[key]);
  });

  document.body.appendChild(script);
}
