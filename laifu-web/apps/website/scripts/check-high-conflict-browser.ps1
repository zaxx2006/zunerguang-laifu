param(
  [string]$BaseUrl = 'http://localhost:3001',
  [string]$EvidenceDir = 'D:/TongRen/laifu/artifacts',
  [string]$BrowserSession = 'laifu-high-conflict-showcase-acceptance'
)
$ErrorActionPreference = 'Stop'
function Invoke-HcBrowser([string[]]$CommandArgs) {
  $result = (& agent-browser --session $BrowserSession --json @CommandArgs) | ConvertFrom-Json
  if (!$result.success) { throw "Browser command failed: $($CommandArgs[0]) $($result.error)" }
  return $result.data
}
function Assert-Hc($Condition, [string]$Message) {
  if (!$Condition) { throw $Message }
}
$null = Invoke-HcBrowser -CommandArgs @('open', "$BaseUrl/services/high-conflict-divorce/")
$null = Invoke-HcBrowser -CommandArgs @('set', 'media', 'light', 'reduced-motion')
$null = Invoke-HcBrowser -CommandArgs @('set', 'viewport', '1440', '900')
$initial = (Invoke-HcBrowser -CommandArgs @('eval', '({services:document.querySelectorAll(".hc-service-tabs>[role=tab]").length,obsolete:!!document.querySelector("#situations,#priorities"),closing:document.querySelector("#invitation-title")?.textContent,source:document.querySelector("main").dataset.contentSource})')).result
Assert-Hc ($initial.services -eq 7) 'Expected seven service directions'
Assert-Hc (!$initial.obsolete) 'Removed checklist sections are still rendered'
Assert-Hc ($initial.closing -eq '不需要做好万全准备再选择我们') 'Shared closing invitation was not reused'
Assert-Hc ($initial.source -eq 'cms') 'Published local CMS content was not rendered'
$before = (Invoke-HcBrowser -CommandArgs @('eval', 'performance.getEntriesByType("resource").filter(r=>r.initiatorType==="fetch"||r.initiatorType==="xmlhttprequest").length')).result
foreach ($index in 1..4) {
  $null = Invoke-HcBrowser -CommandArgs @('click', "#cycle [role=tab]:nth-child($index)")
  $selected = (Invoke-HcBrowser -CommandArgs @('eval', "document.querySelector('#cycle [role=tab]:nth-child($index)').getAttribute('aria-selected')==='true'")).result
  Assert-Hc $selected "Event stage $index did not update"
}
$keys = @('pattern','preparation','records','expression','communication','parenting','stability')
$heights = @()
foreach ($key in $keys) {
  $null = Invoke-HcBrowser -CommandArgs @('click', "#service-tab-$key")
  $state = (Invoke-HcBrowser -CommandArgs @('eval', "({active:!document.querySelector('#service-panel-$key').hidden,height:document.querySelector('.hc-service-panels').getBoundingClientRect().height})")).result
  Assert-Hc $state.active "Service $key did not open"
  $heights += $state.height
  if ($key -eq 'preparation') {
    $null = Invoke-HcBrowser -CommandArgs @('click', '#service-panel-preparation details:nth-of-type(2) summary')
    Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector("#service-panel-preparation details:nth-of-type(2)").open')).result) 'Preparation disclosure failed'
  } elseif ($key -eq 'communication') {
    $null = Invoke-HcBrowser -CommandArgs @('click', '#service-panel-communication .hc-message-parts button:nth-child(2)')
    $null = Invoke-HcBrowser -CommandArgs @('click', '#service-panel-communication .hc-reveal-button')
    Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', '!document.querySelector("#communication-reply").hidden')).result) 'Communication target did not open'
  } else {
    $null = Invoke-HcBrowser -CommandArgs @('click', "#service-panel-$key [role=tab]:nth-child(2)")
    Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', "document.querySelector('#service-panel-$key [role=tab]:nth-child(2)').getAttribute('aria-selected')==='true'")).result) "Material view for $key did not update"
  }
}
Assert-Hc (($heights | Select-Object -Unique).Count -eq 1) 'Desktop service switching changed the section height'
$null = Invoke-HcBrowser -CommandArgs @('click', '#service-tab-pattern')
$null = Invoke-HcBrowser -CommandArgs @('press', 'End')
Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.activeElement.id')).result -eq 'service-tab-stability') 'Service keyboard End failed'
$null = Invoke-HcBrowser -CommandArgs @('press', 'Home')
Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.activeElement.id')).result -eq 'service-tab-pattern') 'Service keyboard Home failed'
$null = Invoke-HcBrowser -CommandArgs @('press', 'ArrowDown')
Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.activeElement.id')).result -eq 'service-tab-preparation') 'Service keyboard arrow failed'
$null = Invoke-HcBrowser -CommandArgs @('click', '.hc-hero-document')
Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector("#service-tab-records").getAttribute("aria-selected")==="true"')).result) 'Hero shortcut did not activate records service'
foreach ($index in 1..4) {
  $null = Invoke-HcBrowser -CommandArgs @('click', "#children [role=tab]:nth-child($index)")
  $null = Invoke-HcBrowser -CommandArgs @('click', "#process [role=tab]:nth-child($index)")
}
$null = Invoke-HcBrowser -CommandArgs @('click', '.hc-professional-details summary')
Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector(".hc-professional-details").open')).result) 'Professional comparison did not expand'
$after = (Invoke-HcBrowser -CommandArgs @('eval', 'performance.getEntriesByType("resource").filter(r=>r.initiatorType==="fetch"||r.initiatorType==="xmlhttprequest").length')).result
Assert-Hc ($before -eq $after) 'Demonstration interactions sent a network request'
foreach ($section in @('cycle','support','children','process','boundaries')) {
  $null = Invoke-HcBrowser -CommandArgs @('click', ".hc-rail a[href='#$section']")
  $visible = (Invoke-HcBrowser -CommandArgs @('eval', "document.querySelector('#$section h2').getBoundingClientRect().top>=document.querySelector('.hc-rail').getBoundingClientRect().bottom-1")).result
  Assert-Hc $visible "Fixed navigation obscures $section heading"
}
$viewports = @(@{w=1440;h=900}, @{w=1024;h=768}, @{w=768;h=1024}, @{w=390;h=844})
foreach ($viewport in $viewports) {
  $null = Invoke-HcBrowser -CommandArgs @('set', 'viewport', "$($viewport.w)", "$($viewport.h)")
  $null = Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector("#children").scrollIntoView({behavior:"instant"})')
  $null = Invoke-HcBrowser -CommandArgs @('wait', '300')
  $measurement = (Invoke-HcBrowser -CommandArgs @('eval', 'window.scrollTo({top:0,behavior:"instant"}); ({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll("main .hc-image img")].every(i=>i.complete&&i.naturalWidth>0)})')).result
  Assert-Hc (!$measurement.overflow) "Page overflow at $($viewport.w)"
  Assert-Hc $measurement.images "Image load failed at $($viewport.w)"
  $null = Invoke-HcBrowser -CommandArgs @('screenshot', "$EvidenceDir/high-conflict-showcase-$($viewport.w)x$($viewport.h).png")
  $null = Invoke-HcBrowser -CommandArgs @('screenshot', '--full', "$EvidenceDir/high-conflict-showcase-$($viewport.w)x$($viewport.h)-full.png")
  foreach ($key in $keys) {
    $null = Invoke-HcBrowser -CommandArgs @('click', "#service-tab-$key")
    Assert-Hc ((Invoke-HcBrowser -CommandArgs @('eval', 'document.documentElement.scrollWidth<=innerWidth')).result) "Service $key overflows at $($viewport.w)"
  }
  Write-Output "PASS $($viewport.w)x$($viewport.h): all seven service views fit, images loaded"
}
$audit = Invoke-HcBrowser -CommandArgs @('a11y')
$audit | ConvertTo-Json -Depth 20 | Set-Content "$EvidenceDir/high-conflict-showcase-a11y.json"
Assert-Hc ($audit.counts.violations -eq 0) 'Accessibility audit found violations'
$null = Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector(".hc-professional-details").open=false')
$null = Invoke-HcBrowser -CommandArgs @('click', '#service-tab-records')
$null = Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector("#support").scrollIntoView({behavior:"instant"})')
$null = Invoke-HcBrowser -CommandArgs @('screenshot', "$EvidenceDir/high-conflict-showcase-support-mobile.png")
$null = Invoke-HcBrowser -CommandArgs @('set', 'viewport', '1440', '900')
$null = Invoke-HcBrowser -CommandArgs @('eval', 'document.querySelector("#support").scrollIntoView({behavior:"instant"})')
$null = Invoke-HcBrowser -CommandArgs @('screenshot', "$EvidenceDir/high-conflict-showcase-support-desktop.png")
Write-Output 'PASS event comparison, seven demonstrations, keyboard, hero shortcut, children, phases, professional table, local-only interactions, anchors and accessibility'
$null = Invoke-HcBrowser -CommandArgs @('close')
