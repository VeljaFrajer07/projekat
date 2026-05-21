<?php

include "konekcija_sa_bazom.php";

$rezultat = $baza->query("
SELECT *
FROM championi
ORDER BY id DESC
");

$championi = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $championi[] = $red;
}

echo json_encode($championi, JSON_UNESCAPED_UNICODE);

?>
