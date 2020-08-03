<# 
.SYNOPSIS
Moves the custom symbol to the PI Vision extensibility folder, only works on the PI Vision machine

.DESCRIPTION
Automates the deployment of this custom sybmol for use in testing

.EXAMPLE
PS C:\Sample> .\deploy.ps1

#>

$pihome = $env:PIHOME64
$symbolFolder = $pihome + "PIVision\Scripts\app\editor\symbols\ext"

if (-Not (Test-Path $symbolFolder)) {
    Write-Host "Not on the PI Vision server or ext folder is missing"
    Read-Host 
    exit
}

$files = @("sym-thresholdtrend-template.html", "sym-thresholdtrend.js")

foreach ($file in $files) {
    $source = $PSScriptRoot + "\" + $file
    $target = $symbolFolder
    Copy-Item $source $target
}
$icons = @("sym-thresholdtrend.png")
foreach ($icon in $icons) {
    $source = $PSScriptRoot + "\" + $icon
    $target = $symbolFolder + "\icons"
    Copy-Item $source $target
}

Start-Process microsoft-edge:https://localhost/pivision/#/Displays/20113/Compare-to-trend
$wshell = New-Object -ComObject wscript.shell;
Start-Sleep 2
$wshell.SendKeys('{F12}')
Start-Sleep  2
$wshell.SendKeys('^p')
Start-Sleep  1
$wshell.SendKeys('localhost/PIVision/Scripts/app/editor/symbols/ext/sym-thresholdtrend.js')
Start-Sleep  2
$wshell.SendKeys('{ENTER}')
