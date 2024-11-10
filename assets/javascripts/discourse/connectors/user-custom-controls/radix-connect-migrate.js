import { tracked } from "@glimmer/tracking";
import Component from "@ember/component";
import { service } from "@ember/service";

const getCsrfToken = async () => {
  const headers = {
    "X-CSRF-Token": "undefined",
    Refererer: window.location.href,
    "X-Requested-With": "XMLHttpRequest",
  };

  return fetch("/session/csrf", { headers })
    .then((res) => res.json())
    .then((res) => res.csrf);
};

export default class RadixConnectMigrate extends Component {
  @service siteSettings;

  @service currentUser;

  @tracked radixDappToolkit;

  @tracked gatewayApi;

  constructor() {
    super(...arguments);

    setTimeout(async () => {
      const RDT = window["RDT"];
      const GatewayApiClient =
        window["babylon-gateway-api-sdk"]?.GatewayApiClient;

      this.radixDappToolkit = RDT.RadixDappToolkit({
        dAppDefinitionAddress: this.siteSettings.radix_dapp_definition_address,
        networkId: +this.siteSettings.radix_network_id,
        applicationName: this.siteSettings.radix_application_name,
        applicationVersion: this.siteSettings.radix_application_version,
        onDisconnect: () => {},
      });

      this.radixDappToolkit.disconnect();

      this.radixDappToolkit.walletApi.setRequestData(
        RDT.DataRequestBuilder.persona().withProof(),
        RDT.DataRequestBuilder.personaData().fullName().emailAddresses(),
        RDT.DataRequestBuilder.accounts().atLeast(1).withProof()
      );

      const getChallenge = () =>
        fetch(`${this.siteSettings.radix_rola_api_url}/create-challenge`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((res) => res.challenge);

      this.radixDappToolkit.walletApi.provideChallengeGenerator(getChallenge);

      this.radixDappToolkit.walletApi.dataRequestControl(
        async ({ proofs, personaData }) => {
          const { valid, rolaPassword } = await fetch(
            `${this.siteSettings.radix_rola_api_url}/verify`,
            {
              method: "POST",
              body: JSON.stringify({
                proofs,
                personaData,
                migrationAuth: {
                  id: this.currentUser.id,
                  clientId: this.currentUser.session.messageBus.clientId,
                  csrfToken: this.currentUser.session.csrfToken,
                  token: this.token,
                },
              }),
              headers: { "content-type": "application/json" },
              credentials: "include",
            }
          )
            .then((res) => res.json())
            .catch(() => ({ valid: false }));

          if (!valid) {
            this.radixDappToolkit.disconnect();
          }
        }
      );

      const gatewayApi = GatewayApiClient.initialize(
        this.radixDappToolkit.gatewayApi.clientConfig
      );

      this.gatewayApi = gatewayApi;
    }, 100);
  }
}
