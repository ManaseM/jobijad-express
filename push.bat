@echo off
echo Pushing updates to GitHub...
git add .
git commit -m "Update: %date% %time%"
git push
echo Done! Your website is updated on GitHub.
pause
