# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'

User.destroy_all
Character.destroy_all
Quote.destroy_all

character_names = []
quotes = []

10.times do
  character_names << Faker::TvShows::FamilyGuy.character
end

matt = User.create(name: "Matt")
sam = User.create(name: "Sam")
alex = User.create(name: "Alex")
noah = User.create(name: "Noah")

User.all.each do |user|
  num_characters = rand(5) + 1
  num_characters.times do
    user.characters << Character.create(name: Faker::TvShows::FamilyGuy.character)
  end
end

User.all.each do |user|
  num_quotes = rand(5) + 1
  num_quotes.times do
    user.quotes << Quote.create(content: Faker::TvShows::FamilyGuy.quote)
  end
end
