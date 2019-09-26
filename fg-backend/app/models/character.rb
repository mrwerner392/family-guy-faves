class Character < ApplicationRecord
  belongs_to :user
  # validates :name, presence: :true, message: "Enter a name first!"
  validates_presence_of :name, message: "please!"
end
