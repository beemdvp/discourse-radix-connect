# frozen_string_literal: true

# name: radix-connect
# about: TODO
# meta_topic_id: TODO
# version: 0.0.1
# authors: Beemdvp
# url: TODO
# required_version: 2.7.0

enabled_site_setting :plugin_name_enabled
enabled_site_setting :radix_dapp_definition_address
enabled_site_setting :radix_network_id
enabled_site_setting :radix_application_name
enabled_site_setting :radix_application_version

register_asset "stylesheets/main.scss"

module ::MyPluginModule
  PLUGIN_NAME = "Radix Connect"
end

require_relative "lib/my_plugin_module/engine"

after_initialize do
  # Code which should run after Rails has finished booting
end
