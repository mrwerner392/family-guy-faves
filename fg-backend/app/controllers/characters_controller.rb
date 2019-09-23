class CharactersController < ApplicationController

  def create
    character = Character.new(name: params[:content], user_id: params[:user_id])
    if character.save
      render json: character, only: [:id, :name]
    else
      errors = character.errors.full_messages
      render json: {error: errors}
    end
  end

  def destroy
    character = Character.find(params[:id])
    character.destroy
    render json: {}
  end

end
