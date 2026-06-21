Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'audit\private-itgreen-originals'
$destination = Join-Path $root 'public\gallery\itgreen-anonymized'
New-Item -ItemType Directory -Force -Path $destination | Out-Null

function Protect-Region {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [int]$PixelSize = 18
    )

    $safeX = [Math]::Max(0, $X)
    $safeY = [Math]::Max(0, $Y)
    $safeWidth = [Math]::Min($Width, $Bitmap.Width - $safeX)
    $safeHeight = [Math]::Min($Height, $Bitmap.Height - $safeY)
    if ($safeWidth -le 0 -or $safeHeight -le 0) { return }

    $region = New-Object System.Drawing.Rectangle($safeX, $safeY, $safeWidth, $safeHeight)
    $smallWidth = [Math]::Max(1, [Math]::Ceiling($safeWidth / $PixelSize))
    $smallHeight = [Math]::Max(1, [Math]::Ceiling($safeHeight / $PixelSize))
    $small = New-Object System.Drawing.Bitmap($smallWidth, $smallHeight)

    $down = [System.Drawing.Graphics]::FromImage($small)
    $down.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::Low
    $down.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $down.DrawImage($Bitmap, (New-Object System.Drawing.Rectangle(0, 0, $smallWidth, $smallHeight)), $region, [System.Drawing.GraphicsUnit]::Pixel)
    $down.Dispose()

    $up = [System.Drawing.Graphics]::FromImage($Bitmap)
    $up.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $up.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $up.DrawImage($small, $region, 0, 0, $smallWidth, $smallHeight, [System.Drawing.GraphicsUnit]::Pixel)

    # A pale veil prevents characters from remaining guessable after pixelation.
    $veil = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(105, 232, 239, 235))
    $up.FillRectangle($veil, $region)
    $veil.Dispose()
    $up.Dispose()
    $small.Dispose()
}

function Export-ProtectedImage {
    param(
        [string]$InputName,
        [string]$OutputName,
        [array]$Regions
    )

    $inputPath = Join-Path $source $InputName
    $outputPath = Join-Path $destination $OutputName
    $original = [System.Drawing.Image]::FromFile($inputPath)
    $bitmap = New-Object System.Drawing.Bitmap($original.Width, $original.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.DrawImageUnscaled($original, 0, 0)
    $graphics.Dispose()
    $original.Dispose()

    foreach ($region in $Regions) {
        Protect-Region -Bitmap $bitmap -X $region[0] -Y $region[1] -Width $region[2] -Height $region[3] -PixelSize $region[4]
    }

    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Created $outputPath"
}

$account = @(1640, 0, 260, 58, 18)

Export-ProtectedImage 'itgreen accueil.png' 'intranet-dashboard.png' @(
    $account,
    @(278, 158, 1315, 165, 20),
    @(278, 390, 1315, 520, 24),
    @(1790, 150, 80, 160, 18)
)

Export-ProtectedImage 'itgreen ebayecommercehub.png' 'intranet-ecommerce.png' @(
    $account,
    @(250, 95, 1650, 65, 18),
    @(250, 280, 400, 630, 22),
    @(650, 430, 1250, 105, 20),
    @(650, 715, 270, 105, 20)
)

Export-ProtectedImage 'itgreendiag  detail.png' 'diagnostic-detail.png' @(
    $account,
    @(920, 405, 190, 42, 18),
    @(1410, 405, 175, 42, 18)
)

Export-ProtectedImage 'itgreendiagtableau.png' 'diagnostic-table.png' @(
    $account,
    @(535, 440, 160, 470, 20),
    @(910, 440, 145, 470, 20),
    @(1055, 440, 105, 470, 18),
    @(1165, 440, 105, 470, 18),
    @(1385, 440, 160, 470, 20)
)
