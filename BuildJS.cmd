cd /D "%~dp0"
cd ".\JS Files"
copy /B Main.js + DrawWires.js + DrawGates.js + Circuits.js "..\Game.js"
