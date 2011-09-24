class Api::TransactionsController < InheritedResources::Base
  respond_to :json
  actions :all, :except => [:new, :edit, :show, :destroy]

  def begin_of_association_chain
    current_user
  end

  def update(options={}, &block)
    update! do |format|
      format.json do
        object = resource
        update_resource(object, resource_params)
        render :json => object
      end
    end
  end

  protected

  def resource_params
    [request.request_parameters]
  end
end

