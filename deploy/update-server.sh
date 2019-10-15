#!/bin/sh
REV=`git rev-parse HEAD | awk '{print substr($0,0,8)}'`
PROJECT=widget-v3-server
ARCHIVE=thinkpage-$PROJECT-$REV

update_remote_server() {
  HOST=$1
  ARCHIVE=$2
  USER=api
  WEB_ROOT=/var/www/$USER/$PROJECT
  LOG_ROOT=/var/log/$USER/$PROJECT
  START_SCRIPT=/index.js

  echo "Uploading to $HOST ..."
  scp tmp/$ARCHIVE.tar.gz $USER@$HOST:/home/$USER/archives

  echo "Updating remote NodeJS server..."
  ssh $USER@$HOST "
    forever stop $WEB_ROOT$START_SCRIPT

    cd ~
    rm -rf ./thinkpage-$PROJECT*
    tar xzf ./archives/$ARCHIVE.tar.gz
    rm -rf $WEB_ROOT/*
    cp -r ./$ARCHIVE/* $WEB_ROOT/

    forever start --killSignal=SIGTERM -a -l $LOG_ROOT/forever_log -e $LOG_ROOT/error_log $WEB_ROOT$START_SCRIPT
  "
}

echo "Remove old files"
(cd ../ && rm -rf ./dist)

echo "Install node_modules..."
(cd ../src && npm install && cd ..)

echo "Get production config..."
(cd ../src/config && rm -rf ./widget-v3-config && git clone git@git.seniverse.com:lab/widget-v3-config.git && mv -f ./widget-v3-config/* ./env)

echo "Build server source from ES6..."
(cd ../src && npm run build && cd ..)

echo "Exporting version $REV"
if [ ! -d tmp ];
then
  mkdir tmp
  mkdir tmp/$ARCHIVE
fi

cp -r ../dist/* tmp/$ARCHIVE
cp -r ../node_modules tmp/$ARCHIVE

echo "Packing..."
tar czf tmp/$ARCHIVE.tar.gz -C tmp ./$ARCHIVE/

for HOST
do
  update_remote_server $HOST $ARCHIVE;
done

echo "Cleaning up..."
rm -rf tmp

echo "Done."
