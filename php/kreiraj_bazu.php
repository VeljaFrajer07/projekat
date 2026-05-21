<?php

include "konekcija_sa_bazom.php";

$sql = "
CREATE TABLE IF NOT EXISTS championi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naziv TEXT,
    ip_cena INTEGER,
    tip TEXT,
    napad INTEGER,
    odbrana INTEGER,
    klasa TEXT,
    opis TEXT,
    slika TEXT
)
";

$baza->exec($sql);

echo "Baza i tabela su uspešno kreirane.<br>";
echo "Putanja baze: " . $putanja;

?>
