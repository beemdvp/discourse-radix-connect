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

        loadScript("/plugins/discourse-radix-connect/javascripts/radix-dapp-toolkit.bundle.umd.cjs");
        flag = true;
      });
    });
  },
};
