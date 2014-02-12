class FightClubApp
  configure :development do
    set :database, 'sqlite:///dev.db'
    set :show_exceptions, true
  end

  configure :production do
  db = URI.parse(ENV['DATABASE_URL'] || 'postgres:///localhost/mydb')

  ActiveRecord::Base.establish_connection(
   :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
   :host     => db.host,
   :username => db.user,
   :password => db.password,
   :database => db.path[1..-1],
   :encoding => 'utf8'
  )
  end

  configure do
    if ENV["REDISCLOUD_URL"]
      uri = URI.parse(ENV["REDISCLOUD_URL"])
      $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
    # else
    #   raise "Please set the REDISCLOUD_URL env variable. See the README for more information."
    end
  end
end