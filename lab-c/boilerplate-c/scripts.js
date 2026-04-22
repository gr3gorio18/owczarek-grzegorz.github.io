let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

if (Notification.permission !== "denied") {
  Notification.requestPermission();
}

document.getElementById("getLocation").addEventListener("click", function() {
  if (!navigator.geolocation) {
    console.error("No geolocation.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    map.setView([lat, lon]);
  }, positionError => {
    console.error(positionError);
  });
});

document.getElementById("getRasterMap").addEventListener("click", function() {
  setTimeout(() => {
    leafletImage(map, function (err, canvas) {
      if (err) {
        console.error(err);
        return;
      }

      let rasterMap = document.getElementById("rasterMap");

      rasterMap.width = 600;
      rasterMap.height = 400;

      let rasterContext = rasterMap.getContext("2d");

      rasterContext.drawImage(canvas, 0, 0, 600, 400);

      createPuzzle(canvas);
    });
  }, 500);
});

let draggedPiece = null;

function createPuzzle(sourceCanvas) {
  const piecesContainer = document.getElementById('puzzle-pieces');
  const boardContainer = document.getElementById('puzzle-board');

  piecesContainer.innerHTML = '';
  boardContainer.innerHTML = '';

  piecesContainer.style.position = 'relative';

  const cols = 4;
  const rows = 4;
  const pieceWidth = 600 / cols; // 150px
  const pieceHeight = 400 / rows; // 100px
  let pieces = [];

  for (let i = 0; i < cols * rows; i++) {
    let dropZone = document.createElement('div');
    dropZone.classList.add('drop-zone');
    dropZone.dataset.targetIndex = i;

    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);

    boardContainer.appendChild(dropZone);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let pieceCanvas = document.createElement('canvas');
      pieceCanvas.width = pieceWidth;
      pieceCanvas.height = pieceHeight;
      let ctx = pieceCanvas.getContext('2d');

      ctx.drawImage(sourceCanvas, c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

      pieceCanvas.classList.add('puzzle-piece');
      pieceCanvas.draggable = true;
      pieceCanvas.dataset.correctIndex = r * cols + c;

      pieceCanvas.addEventListener('dragstart', function(e) {
        draggedPiece = this;
        setTimeout(() => this.style.opacity = "0.5", 0);
      });

      pieceCanvas.addEventListener('dragend', function() {
        this.style.opacity = "1";
      });

      pieces.push(pieceCanvas);
    }
  }

  pieces.sort(() => Math.random() - 0.5);

  pieces.forEach(piece => {
    piecesContainer.appendChild(piece);
    piece.style.position = 'absolute';

    let randomLeft = Math.floor(Math.random() * (600 - pieceWidth));
    let randomTop = Math.floor(Math.random() * (400 - pieceHeight));

    piece.style.left = randomLeft + 'px';
    piece.style.top = randomTop + 'px';
  });

  piecesContainer.addEventListener('dragover', (e) => e.preventDefault());
  piecesContainer.addEventListener('drop', function(e) {
    e.preventDefault();
    this.appendChild(draggedPiece);
    draggedPiece.style.position = 'absolute';
    draggedPiece.style.left = Math.floor(Math.random() * (600 - pieceWidth)) + 'px';
    draggedPiece.style.top = Math.floor(Math.random() * (400 - pieceHeight)) + 'px';
    checkWin();
  });
}

function handleDrop(e) {
  e.preventDefault();
  const dropZone = this;

  if (dropZone.children.length === 0) {
    dropZone.appendChild(draggedPiece);
    draggedPiece.style.position = 'static';

    checkWin();
  }
}

function checkWin() {
  const dropZones = document.querySelectorAll('.drop-zone');
  let correctCount = 0;

  dropZones.forEach(zone => {
    if (zone.children.length > 0) {
      const piece = zone.children[0];
      if (zone.dataset.targetIndex === piece.dataset.correctIndex) {
        correctCount++;
      }
    }
  });

  if (correctCount === 16) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Zwycięstwo!", {
          body: "Gratulacje, poprawnie ułożyłeś całą mapę!"
        });
      } else {
        alert("Zwycięstwo! Gratulacje, poprawnie ułożyłeś całą mapę!");
      }
    }, 100);
  }
}
