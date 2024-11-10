# frozen_string_literal: true

RadixConnectPlugin::Engine.routes.draw do
  post "/update-user" => "radix_auth#create"
end

Discourse::Application.routes.draw { mount ::RadixConnectPlugin::Engine, at: "/radix-connect" }
