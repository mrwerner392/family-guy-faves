class Quote < ApplicationRecord
  belongs_to :user
  # validates :content, presence: :true
  validates_presence_of :content, message: "please!"
end
