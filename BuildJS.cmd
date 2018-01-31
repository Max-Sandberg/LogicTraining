cd /D "%~dp0"
cd ".\JS Files"
copy /B Main.js + Circuits.js + DrawGates.js + DrawWires.js "..\Game.js"
