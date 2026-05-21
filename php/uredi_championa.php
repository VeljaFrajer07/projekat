<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$naziv = $_POST["naziv"];
$ip_cena = $_POST["ip_cena"];
$tip = $_POST["tip"];
$napad = $_POST["napad"];
$odbrana = $_POST["odbrana"];
$klasa = $_POST["klasa"];
$opis = $_POST["opis"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM championi WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $noviNaziv;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
    $nazivSlike = $noviNaziv;
}

$upit = $baza->prepare("
UPDATE championi SET
    naziv = :naziv,
    ip_cena = :ip_cena,
    tip = :tip,
    napad = :napad,
    odbrana = :odbrana,
    klasa = :klasa,
    opis = :opis,
    slika = :slika
WHERE id = :id
");

$upit->bindValue(":id", $id);
$upit->bindValue(":naziv", $naziv);
$upit->bindValue(":ip_cena", $ip_cena);
$upit->bindValue(":tip", $tip);
$upit->bindValue(":napad", $napad);
$upit->bindValue(":odbrana", $odbrana);
$upit->bindValue(":klasa", $klasa);
$upit->bindValue(":opis", $opis);
$upit->bindValue(":slika", $nazivSlike);

$rezultat = $upit->execute();

if ($rezultat) {
    echo "Šampion uspešno izmenjen.";
} else {
    echo "Greška pri izmeni.";
}

?>
