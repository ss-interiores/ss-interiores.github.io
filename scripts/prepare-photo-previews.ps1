param([int]$MaxEdge = 400, [int]$Quality = 42)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$reviewRoot = Join-Path $projectRoot 'outputs/photo-review'
$manifest = Get-Content -LiteralPath (Join-Path $reviewRoot 'manifest.json') -Raw | ConvertFrom-Json
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
$previews = @{}
foreach ($item in $manifest.items) {
  $eligible = @($item.versions | Where-Object { $_.fidelity -and $_.status -in @('pending', 'approved', 'published') })
  if ($eligible.Count -eq 0) { throw "Sem candidata revisada: $($item.id)" }
  $candidate = $eligible[-1]
  $pair = @{}
  foreach ($entry in @(@('before', $item.original), @('after', $candidate.file))) {
    $img = [System.Drawing.Image]::FromFile((Join-Path $projectRoot $entry[1]))
    $scale = [Math]::Min([double]1.0, [Math]::Min([double]$MaxEdge / $img.Width, [double]$MaxEdge / $img.Height))
    $bmp = [System.Drawing.Bitmap]::new([int]($img.Width * $scale), [int]($img.Height * $scale))
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $bmp.Width, $bmp.Height)
    $stream = [System.IO.MemoryStream]::new()
    $bmp.Save($stream, $codec, $parameters)
    $pair[$entry[0]] = 'data:image/jpeg;base64,' + [Convert]::ToBase64String($stream.ToArray())
    $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $stream.Dispose()
  }
  $previews[$item.id] = $pair
}
$parameters.Dispose()
$previews | ConvertTo-Json -Depth 4 -Compress | Set-Content -LiteralPath (Join-Path $reviewRoot 'previews/data.json') -Encoding utf8
Get-Item -LiteralPath (Join-Path $reviewRoot 'previews/data.json') | Select-Object Name, Length
