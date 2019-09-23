class UsersController < ApplicationController

  def index
    users = User.all
    render json: users, only: [:name, :id], include: {characters: {only: [:name, :id]}, quotes: {only: [:content, :id]}}
  end

end
