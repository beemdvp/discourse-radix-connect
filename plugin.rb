# frozen_string_literal: true

# name: discourse-radix-connect
# about: Integrate Radix Connect into Discourse
# meta_topic_id:
# version: 0.0.1
# authors: Beemdvp
# url: https://github.com/beemdvp/discourse-radix-connect-plugin
# required_version: 2.7.0

enabled_site_setting :plugin_name_enabled
enabled_site_setting :radix_dapp_definition_address
enabled_site_setting :radix_network_id
enabled_site_setting :radix_application_name
enabled_site_setting :radix_application_version

register_asset "stylesheets/main.scss"

module ::RadixConnectPlugin
  PLUGIN_NAME = "Radix Connect"
end

require_relative "lib/radix_connect_module/engine"

after_initialize do
  # Code which should run after Rails has finished booting
end
