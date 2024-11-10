# frozen_string_literal: true

module ::RadixConnectPlugin
  class RadixAuthController < ::ApplicationController
    skip_before_action :check_xhr
    requires_plugin PLUGIN_NAME
    requires_login

    def create
      rola_password = params["password"]
      requested_email = params["email"]
      requested_username = params["username"]

      # validate params match current user
      if current_user.email != requested_email || current_user.username != requested_username
        render json: {
          success: false,
          error: "Invalid username or email."
        }
      end

      # update password
      current_user.update!(password: rola_password)

      render json: {
        success: true
      }
    end
  end
end
