# frozen_string_literal: true

RadixConnectPlugin::Engine.routes.draw do
  get "/examples" => "examples#index"
  # define routes here
end

Discourse::Application.routes.draw { mount ::RadixConnectPlugin::Engine, at: "my-plugin" }
