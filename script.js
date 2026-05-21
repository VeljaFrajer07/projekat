var championi = [];

var btnDodajChampiona = document.getElementById("btnDodajChampiona");
var btnPrikaziChampione = document.getElementById("btnPrikaziChampione");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var championSekcija = document.getElementById("championSekcija");

var championForm = document.getElementById("championForm");
var editForm = document.getElementById("editForm");

var nazivInput = document.getElementById("naziv");
var ipCenaInput = document.getElementById("ip_cena");
var napadInput = document.getElementById("napad");
var odbranaInput = document.getElementById("odbrana");
var opisInput = document.getElementById("opis");

var filterKlasa = document.getElementById("filterKlasa");
var sortiranje = document.getElementById("sortiranje");

var championsContainer = document.getElementById("championsContainer");
var brojChampiona = document.getElementById("brojChampiona");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajChampiona.addEventListener("click", prikaziFormu);
btnPrikaziChampione.addEventListener("click", prikaziChampione);
btnPrimeni.addEventListener("click", prikaziKarticeChampa);
championForm.addEventListener("submit", dodajChampiona);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  championSekcija.classList.add("d-none");
}

function dodajChampiona(e) {
  e.preventDefault();

  var naziv = nazivInput.value.trim();
  var ipCena = parseInt(ipCenaInput.value);
  var napad = parseInt(napadInput.value);
  var odbrana = parseInt(odbranaInput.value);
  var opis = opisInput.value.trim();

  var tipRadio = document.querySelector('input[name="tip"]:checked');
  var tip;

  if (tipRadio) {
    tip = tipRadio.value;
  } else {
    tip = "Melee";
  }

  if (
    naziv == "" ||
    isNaN(ipCena) ||
    isNaN(napad) ||
    isNaN(odbrana) ||
    ipCena <= 0 ||
    napad < 1 || napad > 10 ||
    odbrana < 1 || odbrana > 10
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var podaci = new FormData(championForm);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/dodaj_championa.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);

    championForm.reset();
    document.getElementById("melee").checked = true;

    prikaziChampione();
  };

  zahtev.send(podaci);
}

function prikaziChampione() {
  formaSekcija.classList.add("d-none");
  championSekcija.classList.remove("d-none");

  var zahtev = new XMLHttpRequest();
  zahtev.open("GET", "php/prikazi_champione.php", true);

  zahtev.onload = function () {
    championi = JSON.parse(zahtev.responseText);
    prikaziKarticeChampa();
  };

  zahtev.send();
}

function prikaziKarticeChampa() {
  championsContainer.innerHTML = "";

  var listaZaPrikaz = [];

  for (var i = 0; i < championi.length; i++) {
    listaZaPrikaz.push(championi[i]);
  }

  var klasaFilter = filterKlasa.value;

  if (klasaFilter != "Sve") {
    var filtrirani = [];
    for (var i = 0; i < listaZaPrikaz.length; i++) {
      if (listaZaPrikaz[i].klasa == klasaFilter) {
        filtrirani.push(listaZaPrikaz[i]);
      }
    }
    listaZaPrikaz = filtrirani;
  }

  var nacinSortiranja = sortiranje.value;

  if (nacinSortiranja == "min-max") {
    listaZaPrikaz.sort(function (a, b) { return a.napad - b.napad; });
  }
  if (nacinSortiranja == "max-min") {
    listaZaPrikaz.sort(function (a, b) { return b.napad - a.napad; });
  }

  brojChampiona.textContent = listaZaPrikaz.length + " šampiona";

  if (listaZaPrikaz.length == 0) {
    championsContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<h4 class="mb-2" style="color:#a8b8d0">Nema šampiona za prikaz</h4>' +
      '<p class="mb-0" style="color:#3a5070">Dodaj šampiona ili promeni filter.</p>' +
      "</div>" +
      "</div>";
    return;
  }

  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var champ = listaZaPrikaz[i];

    var klasaLower = (champ.klasa || "fighter").toLowerCase();

    var linija = "line-" + klasaLower;
    var badgeClass = "badge-" + klasaLower;

    var opisTekst = "Nema opisa.";
    if (champ.opis != "" && champ.opis != null) {
      opisTekst = champ.opis;
    }

    var slikaHTML = "";
    if (champ.slika != "" && champ.slika != null) {
      slikaHTML =
        '<img src="uploads/' + champ.slika + '" class="slika-champ">';
    }

    var napadBarWidth = (parseInt(champ.napad) / 10 * 100) + "%";
    var odbranaBarWidth = (parseInt(champ.odbrana) / 10 * 100) + "%";

    var kartica = document.createElement("div");
    kartica.className = "col-12 col-md-6 col-xl-4";
    kartica.innerHTML =
      '<div class="card champion-card">' +
      slikaHTML +
      '<div class="card-top-line ' + linija + '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' + champ.naziv + "</h4>" +
      '<div class="info-line"><strong>IP cena:</strong> ' + champ.ip_cena + " 🪙</div>" +
      '<div class="info-line"><strong>Tip:</strong> ' + champ.tip + "</div>" +
      '<div class="info-line d-flex align-items-center"><strong>Napad:</strong> <div class="stat-bar-wrap"><div class="stat-bar stat-bar-attack" style="width:' + napadBarWidth + '"></div></div> <span style="margin-left:6px;color:#ff8080;font-weight:700">' + champ.napad + "</span></div>" +
      '<div class="info-line d-flex align-items-center"><strong>Odbrana:</strong> <div class="stat-bar-wrap"><div class="stat-bar stat-bar-defense" style="width:' + odbranaBarWidth + '"></div></div> <span style="margin-left:6px;color:#80d8ff;font-weight:700">' + champ.odbrana + "</span></div>" +
      '<div class="info-line"><strong>Klasa:</strong> <span class="badge ' + badgeClass + '">' + champ.klasa + "</span></div>" +
      '<div class="mt-3"><strong style="color:#c89b3c">Opis:</strong><p style="color:#6a8ab0;margin-top:4px;margin-bottom:0;font-size:0.9rem">' + opisTekst + "</p></div>" +
      '<div class="d-flex gap-2 mt-3">' +
      '<button class="btn btn-sm btn-uredi">Uredi</button>' +
      '<button class="btn btn-sm btn-obrisi">Obriši</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    var btnUredi = kartica.querySelector(".btn-uredi");
    var btnObrisi = kartica.querySelector(".btn-obrisi");

    (function (c) {
      btnUredi.addEventListener("click", function () { otvoriUrediModal(c); });
      btnObrisi.addEventListener("click", function () { obrisiChampiona(c.id, c.naziv); });
    })(champ);

    championsContainer.appendChild(kartica);
  }
}

function otvoriUrediModal(champ) {
  document.getElementById("editId").value = champ.id;
  document.getElementById("editNaziv").value = champ.naziv;
  document.getElementById("editIpCena").value = champ.ip_cena;
  document.getElementById("editNapad").value = champ.napad;
  document.getElementById("editOdbrana").value = champ.odbrana;
  document.getElementById("editOpis").value = champ.opis || "";
  document.getElementById("editSlika").value = "";

  var klasaSelect = document.getElementById("editKlasa");
  klasaSelect.value = champ.klasa;

  var tipRadios = document.querySelectorAll('input[name="tip"]');
  for (var i = 0; i < tipRadios.length; i++) {
    tipRadios[i].checked = tipRadios[i].value === champ.tip;
  }

  modalUredi.show();
}

function sacuvajIzmene() {
  var naziv = document.getElementById("editNaziv").value.trim();
  var ipCena = parseInt(document.getElementById("editIpCena").value);
  var napad = parseInt(document.getElementById("editNapad").value);
  var odbrana = parseInt(document.getElementById("editOdbrana").value);

  if (
    naziv == "" ||
    isNaN(ipCena) ||
    isNaN(napad) ||
    isNaN(odbrana) ||
    ipCena <= 0 ||
    napad < 1 || napad > 10 ||
    odbrana < 1 || odbrana > 10
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var podaci = new FormData(editForm);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/uredi_championa.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    modalUredi.hide();
    prikaziChampione();
  };

  zahtev.send(podaci);
}

function obrisiChampiona(id, naziv) {
  if (!confirm('Da li sigurno želiš da obrišeš šampiona "' + naziv + '"?')) {
    return;
  }

  var podaci = new FormData();
  podaci.append("id", id);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/obrisi_championa.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    prikaziChampione();
  };

  zahtev.send(podaci);
}
