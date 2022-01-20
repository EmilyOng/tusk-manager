git submodule foreach git pull origin main

now=$(date +'%m/%d/%Y %r')

git add .
git commit -m "[${now}] Update submodules"
git push origin main
