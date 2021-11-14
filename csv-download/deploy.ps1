<# 
.SYNOPSIS
Moves the custom symbol to the PI Vision extensibility folder, only works on the PI Vision machine

.DESCRIPTION
Automates the deployment of this custom sybmol for use in testing

.EXAMPLE
PS C:\Sample> .\deploy.ps1

#>
<#
If PI vision is local, can use the following
$pihome = $env:PIHOME64
$symbolFolder = $pihome + "PIVision\Scripts\app\editor\symbols\ext"
#>
$symbolFolder = "\\jerome-pivision\ext"

if (-Not (Test-Path $symbolFolder)) {
    Write-Host "Not on the PI Vision server or ext folder is missing"
    Read-Host 
    exit
}

$files = @("sym-CSV-template.html", "sym-CSV.js", "sym-CSV.css")
foreach ($file in $files) {
    $source = $PSScriptRoot + "\" + $file
    $target = $symbolFolder
    Copy-Item $source $target
}

$icons = @("sym-CSV.png", "sym-CSV.svg")
foreach ($icon in $icons) {
    $source = $PSScriptRoot + "\" + $icon
    $target = $symbolFolder + "\icons"
    Copy-Item $source $target
}

<#
$urls = @("https://localhost/PIVision/#/Displays/AdHoc?dataitems=%5C%5CJLEFEBVRE7390%5CVisy%5CRoll1%7CActual%20GSM&symbol=thresholdtrend", 
           "https://localhost/PIVision/#/Displays/20107/garbage")
foreach ($url in $urls) {
    start microsoft-edge:$url
}#>
<#
Start-Sleep 1
Start-Process microsoft-edge:https://localhost/PIVision/#/Displays/20109/Trend-bar
$wshell = New-Object -ComObject wscript.shell;
Start-Sleep 2
$wshell.SendKeys('{F12}')
Start-Sleep 2
$wshell.SendKeys('^p')
Start-Sleep 3
$wshell.SendKeys('localhost/PIVision/Scripts/app/editor/symbols/ext/sym-thresholdbar.js')
Start-Sleep 3
$wshell.SendKeys('{ENTER}')
#>