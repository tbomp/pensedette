Detteapp::Application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }
  
  match 'friends' => 'welcome#test_get_fb_friends'

  match 'app' => 'welcome#app', :via => :get

  namespace :api, :format => :json do
    scope '1.0' do
      resources :friends, :only => [:index, :create, :destroy]
      resources :transactions, :except => [:new, :edit, :show, :destroy]
    end
  end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'welcome#index', :via => :get
end
