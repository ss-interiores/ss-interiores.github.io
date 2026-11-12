Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$reviewRoot = Join-Path $projectRoot 'outputs/photo-review'
$manifest = Get-Content -LiteralPath (Join-Path $reviewRoot 'manifest.json') -Raw | ConvertFrom-Json
$board = [System.Drawing.Image]::FromFile((Join-Path $reviewRoot 'originals/prancha-area-gourmet.png'))
foreach ($item in $manifest.items) {
  if ($null -ne $item.crop) {
    $destination = Join-Path $projectRoot $item.original
    if (-not (Test-Path -LiteralPath $destination)) {
      $bmp = [System.Drawing.Bitmap]::new([int]$item.crop[2], [int]$item.crop[3])
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $rectangle = [System.Drawing.Rectangle]::new([int]$item.crop[0], [int]$item.crop[1], [int]$item.crop[2], [int]$item.crop[3])
      $g.DrawImage($board, [System.Drawing.Rectangle]::new(0,0,$bmp.Width,$bmp.Height), $rectangle, [System.Drawing.GraphicsUnit]::Pixel)
      $bmp.Save($destination,[System.Drawing.Imaging.ImageFormat]::Png)
      $g.Dispose(); $bmp.Dispose()
    }
  }
}
$board.Dispose()
Write-Output '29 originais preparados; prancha preservada e recortes sem reconstrução de áreas ocultas.'
