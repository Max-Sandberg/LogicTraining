cd /D "%~dp0"
cd ".\JS Files"
copy /B Main.js + Menu.js + UpdateGame.js + DrawGame.js + UpdateCircuit.js + PrepareCircuit.js + DrawWires.js + DrawGates.js + EventHandlers.js + Circuits.js "..\Game.js"
