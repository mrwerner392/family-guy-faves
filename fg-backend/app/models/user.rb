class User < ApplicationRecord
  has_many :characters
  has_many :quotes
end
