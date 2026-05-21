<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];

$slikaUpit = $baza->prepare("SELECT slika FROM championi WHERE id = :id");
$slikaUpit->bindValue(":id", $id);
$slikaRez = $slikaUpit->execute();
$slikaRed = $slikaRez->fetchArray(SQLITE3_ASSOC);

if ($slikaRed && $slikaRed["slika"] != "") {
    $putanjaSlike = __DIR__ . "/../uploads/" . $slikaRed["slika"];
    if (file_exists($putanjaSlike)) {
        unlink($putanjaSlike);
    }
}

$upit = $baza->prepare("DELETE FROM championi WHERE id = :id");
$upit->bindValue(":id", $id);
$rezultat = $upit->execute();

if ($rezultat) {
    echo "Šampion uspešno obrisan.";
} else {
    echo "Greška pri brisanju.";
}

?>
