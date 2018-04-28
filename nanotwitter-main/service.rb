require 'sinatra'
require 'byebug'
require 'time_difference'
require 'time'
require 'redis'
require 'sinatra/cors'
require 'uri'
require 'securerandom'
require 'bunny'
require 'json'
require 'rest-client'

configure do
  TEST_INTERFACE_URL = 'https://fierce-garden-41263.herokuapp.com'
  PREFIX = 'api/v1'
  TWEET_SERVICE_URL = 'https://nt-tweet-reader.herokuapp.com'
  TWEET_WRITER_URL = 'https://nt-tweet-writer.herokuapp.com'
  TWEETS = 'tweets'
  RECENT = 'recent'
  TIMELINE = 'timeline'
  TEST_USER = 'testuser'
  USERS = 'users'
end

# used for CORS, so that clients can get resources from other sources
set :allow_origin, '*'
set :allow_methods, 'GET,HEAD,POST'
set :allow_headers, 'accept,content-type,if-modified-since'
set :expose_headers, 'location,link'
set :bind, '0.0.0.0' # Needed to work with Vagrant

# For loader.io to auth
get '/loaderio-5026e65eed1dbb67971ba6671d1760fe.txt' do
  send_file 'loaderio-5026e65eed1dbb67971ba6671d1760fe.txt'
end

get '/loaderio-4cb8e3e2b3bbc621379e0973e4802a54.txt' do
  send_file 'loaderio-4cb8e3e2b3bbc621379e0973e4802a54.txt'
end

get '/loaderio-c1de10acb26fb559a7ee2d14a50fc37f.txt' do
  send_file 'loaderio-c1de10acb26fb559a7ee2d14a50fc37f.txt'
end

get '/loaderio-34f40d88339b25f6c5921bd93a6604ad.txt' do
  send_file 'loaderio-34f40d88339b25f6c5921bd93a6604ad.txt'
end

get '/loaderio-cdeae1ba221d7f8d0412bea9949dfd43.txt' do
  send_file 'loaderio-cdeae1ba221d7f8d0412bea9949dfd43.txt'
end

get '/' do
  render :html, :index
end

get '/78cc6f9c2e98cf61/bundle.js' do
  send_file '78cc6f9c2e98cf61/bundle.js'
end

#returns the bundle for the purposes of loader.io tests
get '/bundle.js' do
  $bundle
end

# these replicate the experience of a user in choo for the 
# main routes in the loader.io tests
# see the microservices for real implementations
get '/tweets/recent' do
  # we use three redis servers and randomly choose
  # one to send our request for main tweets
  # we use connection pool to reduce contention on redis connections
  redis_num = rand(3)
  case redis_num
  when 0
    $tweet_redis_1.with do |redis_conn|
      tweets = redis_conn.lrange("recent", 0, -1)
      if tweets.length != 0
        return tweets.to_json
      end
    end
  when 1
    $tweet_redis_2.with do |redis_conn|
      tweets = redis_conn.lrange("recent", 0, -1)
      if tweets.length != 0
        return tweets.to_json
      end
    end
  when 2
    $tweet_redis_3.with do |redis_conn|
      tweets = redis_conn.lrange("recent", 0, -1)
      if tweets.length != 0
        return tweets.to_json
      end
    end
  end
  # if tweets are not in redis, get from database
  url = TWEET_SERVICE_URL + '/' + PREFIX + '/' + TWEETS + '/' + RECENT
  RestClient.get url, {}
end

get '/user/testuser' do
  # same here, we cycle through our three redises to get
  # the feed for a user
  redis_num = rand(2)
  case redis_num
  when 0
    $tweet_redis_1.with do |redis_conn|
      user_tweets = redis_conn.lrange("3456_feed", 0, -1)
      if user_tweets.length > 0
        return user_tweets.to_json
      end
    end
  when 1
    $tweet_redis_2.with do |redis_conn|
      user_tweets = redis_conn.lrange("3456_feed", 0, -1)
      if user_tweets.length > 0
        return user_tweets.to_json
      end
    end
  when 2
    $tweet_redis_3.with do |redis_conn|
      user_tweets = redis_conn.lrange("3456_feed", 0, -1)
      if user_tweets.length > 0
        return user_tweets.to_json
      end
    end
  end
  # if not in redis, get from database
  response = RestClient.get(TWEET_SERVICE_URL + '/' + PREFIX + '/' + 'testuser/users/3456/feed')
  response.body
end

# posts a tweet
post '/user/testuser/tweet' do
  jsonmsg = { "username": 'testuser', "id": 3456, "time": '', 'tweet-input': 'This is a test tweet!' }
  RestClient.post TWEET_WRITER_URL + '/testing/tweets/new', jsonmsg
end

