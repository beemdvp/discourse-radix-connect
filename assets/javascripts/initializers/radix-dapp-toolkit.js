import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

let flag = false;

export default {
  name: "@radixdlt/radix-dapp-toolkit",
  initialize() {
    withPluginApi("0.8", (api) => {
      api.onAppEvent("page:changed", () => {
        if (flag) {
          return;
        }

        loadScript("assets/javascripts/radix-dapp-toolkit.bundle.umd.cjs");
        flag = true;
      });
    });
  },
};

function addScript(src, attrs) {
  let script = document.createElement("script");

  script.type = "application/javascript";

  script.setAttribute("src", src);

  Object.keys(attrs).forEach((key) => {
    script.setAttribute(key, attrs[key]);
  });

  document.body.appendChild(script);
}
