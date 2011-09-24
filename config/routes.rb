Detteapp::Application.routes.draw do

  devise_for :users

  match 'app' => 'welcome#app', :via => :get

  namespace :api, :format => :json do
    scope '1.0' do
      match 'friends' => 'api/friends', :via => :get
      resources :friends, :only => [:index, :create, :destroy]
      resources :transactions, :except => [:new, :edit, :show, :destroy]
    end
  end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'welcome#index', :via => :get

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
