#========================
#CONFIG
#========================
set :application, "blobber.io"
#========================
#CONFIG
#========================
#require 'rollbar/capistrano'
set :rollbar_token, '1481df46d8aa4eca82ea0e61d7d683ee'
require           "capistrano-offroad"
offroad_modules   "defaults"
#, "supervisord"  brol van Sergey
set :repository,  "git@github.com:brepoelsv/blobberbit.git"
set :user, "blobber"
set :port, 22
set :supervisord_start_group, "app"
set :supervisord_stop_group,  "app"
set :deploy_to,   "/home/blobber/www"
set :deploy_user, "blobber"
set :deploy_group,"blobber"
#========================
#ROLES
#========================
role :app,        "blobber.io"
#role :na,        "s101.blobber.io"
#role :site,      "s101.blobber.io"
#role :test,      "s100.blobber.io"
#role :app,        "blobber.io",		"s104.blobber.io",	"s105.blobber.io",	"s100.blobber.io", "s107.blobber.io",  "s106.blobber.io"

namespace :deploy do
  desc "Install node modules non-globally"
  task :npm_install do
    run "bash -c '. /home/blobber/.nvm/nvm.sh && cd #{current_path} && npm install'"
  end

  desc "Webpack build"
  task :webpack do
    run "bash -c '. /home/blobber/.nvm/nvm.sh && cd #{current_path} && npm run build'"
  end

  desc "Babel cache"
  task :babel do
    run "rm #{shared_path}/babel.json && touch #{shared_path}/babel.json && chmod 777 #{shared_path}/babel.json"
  end
end

after "deploy:create_symlink",
      "deploy:npm_install",
      "deploy:webpack",
      "deploy:babel",
      "deploy:cleanup",
      "deploy:restart"
