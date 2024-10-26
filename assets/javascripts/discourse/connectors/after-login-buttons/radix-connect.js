import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { service } from "@ember/service";

const RDT = window["RDT"];
const GatewayApiClient = window["babylon-gateway-api-sdk"].GatewayApiClient;

export default class RadixConnect extends Component {
  @service siteSettings;

  @tracked radixDappToolkit = RDT.RadixDappToolkit({
    dAppDefinitionAddress: this.siteSettings.radix_dapp_definition_address,
    networkId: +this.siteSettings.radix_network_id,
    applicationName: this.siteSettings.radix_application_name,
    applicationVersion: this.siteSettings.radix_application_version,
    onDisconnect: () => {},
  });

  @tracked gatewayApi;

  constructor() {
    super(...arguments);

    this.radixDappToolkit.disconnect();

    this.radixDappToolkit.walletApi.setRequestData(
      RDT.DataRequestBuilder.persona().withProof(),
      RDT.DataRequestBuilder.personaData().fullName().emailAddresses(),
      RDT.DataRequestBuilder.accounts().atLeast(1).withProof()
    );

    const getChallenge = () =>
      fetch(`${this.siteSettings.radix_rola_api_url}/create-challenge`)
        .then((res) => res.json())
        .then((res) => res.challenge);

    this.radixDappToolkit.walletApi.provideChallengeGenerator(getChallenge);

    this.radixDappToolkit.walletApi.dataRequestControl(
      async ({ proofs, personaData }) => {
        const { valid, credentials } = await fetch(
          `${this.siteSettings.radix_rola_api_url}/verify`,
          {
            method: "POST",
            body: JSON.stringify({ proofs, personaData }),
            headers: { "content-type": "application/json" },
          }
        )
          .then((res) => res.json())
          .catch(() => ({ valid: false }));

        if (!valid) {
          this.radixDappToolkit.disconnect();
        }

        if (valid) {
          const accountNameInput = document.querySelector(
            'input[id="login-account-name"]'
          );
          accountNameInput.style.color = "transparent";
          accountNameInput.value = credentials.username;
          accountNameInput.dispatchEvent(new Event("input"));

          const passwordInput = document.querySelector(
            'input[id="login-account-password"]'
          );
          passwordInput.style.color = "transparent";
          passwordInput.value = credentials.password;
          passwordInput.dispatchEvent(new Event("input"));
          document.querySelector('button[id="login-button"]').click();
        }
      }
    );

    const gatewayApi = GatewayApiClient.initialize(
      this.radixDappToolkit.gatewayApi.clientConfig
    );

    this.gatewayApi = gatewayApi;
  }
}
