class QuotesController < ApplicationController

  def create
    quote = Quote.new(content: params[:content], user_id: params[:user_id])
    if quote.save
      render json: quote, only: [:id, :content]
    else
      errors = qoute.errors.full_messages
      render json: {error: errors}
    end
  end

  def destroy
    quote = Quote.find(params[:id])
    quote.destroy
    render json: {}
  end

end
