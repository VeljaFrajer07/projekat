<?php

include "konekcija_sa_bazom.php";

$naziv = $_POST["naziv"];
$ip_cena = $_POST["ip_cena"];
$tip = $_POST["tip"];
$napad = $_POST["napad"];
$odbrana = $_POST["odbrana"];
$klasa = $_POST["klasa"];
$opis = $_POST["opis"];

$nazivSlike = "";

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $nazivSlike = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;

    $novaPutanja = $folder . $nazivSlike;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
}

$upit = $baza->prepare("
INSERT INTO championi
(
    naziv,
    ip_cena,
    tip,
    napad,
    odbrana,
    klasa,
    opis,
    slika
)
VALUES
(
    :naziv,
    :ip_cena,
    :tip,
    :napad,
    :odbrana,
    :klasa,
    :opis,
    :slika
)
");

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
    echo "Šampion uspešno dodat.";
} else {
    echo "Greška pri dodavanju.";
}

?>
