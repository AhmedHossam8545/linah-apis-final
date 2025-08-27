$srcDir = ".\src"
$serviceFiles = Get-ChildItem -Path $srcDir -Recurse -Filter "*service.ts" | Where-Object { $_.FullName -notlike "*\node_modules\*" }

foreach ($file in $serviceFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip already refactored files
    if ($content -match "v4 as uuidv4") {
        Write-Host "Skipping already refactored file: $($file.FullName)"
        continue
    }
    
    # Replace imports
    $content = $content -replace "import \{ randomUUID \} from 'crypto';", "import { v4 as uuidv4 } from 'uuid';"
    
    # Replace randomUUID with uuidv4
    $content = $content -replace "const id = randomUUID\(\);", "const id = uuidv4();"
    $content = $content -replace "randomUUID\(\)", "uuidv4()"
    
    # Add dto.id = id; after id generation
    $content = $content -replace "const id = uuidv4\(\);(\r?\n)", "const id = uuidv4();$1    dto.id = id;$1"
    
    # Replace INSERT queries
    $content = $content -replace "INSERT INTO (\w+) \(.*\) VALUES \(.*\)", "INSERT INTO `$1 set ?"
    $content = $content -replace "\[id, .*\]", "[dto]"
    
    # Replace SELECT queries
    $content = $content -replace "SELECT BIN_TO_UUID\(id\) AS id,.*FROM (\w+)", "SELECT * FROM `$1"
    $content = $content -replace "SELECT BIN_TO_UUID\((\w+)\.id\) AS id,.*FROM", "SELECT * FROM"
    
    # Replace WHERE clauses
    $content = $content -replace "WHERE id = UUID_TO_BIN\(\?, 1\)", "WHERE id = ?"
    $content = $content -replace "WHERE (\w+)\.id = UUID_TO_BIN\(\?, 1\)", "WHERE `$1.id = ?"
    
    # Replace UPDATE queries
    $content = $content -replace "UPDATE (\w+) SET (.*) WHERE id = UUID_TO_BIN\(\?, 1\)", "UPDATE `$1 SET `$2 WHERE id = ?"
    
    # Replace DELETE queries
    $content = $content -replace "DELETE FROM (\w+) WHERE id = UUID_TO_BIN\(\?, 1\)", "DELETE FROM `$1 WHERE id = ?"
    
    # Write the modified content back to the file
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Refactored: $($file.FullName)"
}

Write-Host "Refactoring completed!"