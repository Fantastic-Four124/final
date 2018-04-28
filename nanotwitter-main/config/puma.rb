# bind "unix:///var/run/puma/my_app.sock"
# pidfile "/var/run/puma/my_app.sock"

require 'redis'
require 'connection_pool'
workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['RAILS_MAX_THREADS'] || 10)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 3000
environment ENV['RACK_ENV'] || 'development'

tweet_uri_1 = URI.parse(ENV["TWEET_REDIS_URL"])
tweet_uri_2 = URI.parse(ENV['TWEET_REDIS_SPARE_URL'])
tweet_uri_3 = URI.parse(ENV['TWEET_REDIS_3'])

#$tweet_redis_1 = Redis.new(:host => tweet_uri_1.host, :port => tweet_uri_1.port, :password => tweet_uri_1.password)

#$tweet_redis_2 = Redis.new(:host => tweet_uri_2.host, :port => tweet_uri_2.port, :password => tweet_uri_2.password)

#$tweet_redis_3 = Redis.new(:host => tweet_uri_3.host, :port => tweet_uri_3.port, :password => tweet_uri_3.password)

$tweet_redis_1 = ConnectionPool.new(size: 5) { Redis.new(:host => tweet_uri_1.host, :port => tweet_uri_1.port, :password => tweet_uri_1.password) }
$tweet_redis_2 = ConnectionPool.new(size: 5) { Redis.new(:host => tweet_uri_2.host, :port => tweet_uri_2.port, :password => tweet_uri_2.password) }
$tweet_redis_3 = ConnectionPool.new(size: 5) { Redis.new(:host => tweet_uri_3.host, :port => tweet_uri_3.port, :password => tweet_uri_3.password) }
#$redis_num = 0

on_worker_boot do
  $bundle = File.read('bundle.js')
end
