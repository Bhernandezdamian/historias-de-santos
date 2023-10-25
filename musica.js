// ID de los videos de YouTube que se van a reproducir
var videos = [
    {id: "3SgFCoRwP4A", title: "Athenas - Jesús, Eres Digno de Alabar,adoración"},
    {id: "guvcXbkKpUE", title: "P. Edward Gilbert - De qué me vale,,adoración"},
    {id: "fo6qIo0WwuY", title: "Kairy Marquez - Eucaristia - Version Acustica,adoración"},
    {id: "8Tm744_jKZw", title: "Pablo Martínez - Hasta la locura,adoración"},
    {id: "ks_uPBpwe1Y", title: "VIDEO LYRICS JESÚS ESTÁ VIVO - MARCO LÓPEZ,adoración"},
    {id: "uMyd3u9K_0Q", title: "MÚSICA CATÓLICA - PAN DE VIDA - MARGARITA ARAUX Y MARCO LÓPEZ,adoración"},
    {id: "h93KiHOYNvQ", title: "Jon Carlo - Tu Eres Más Fuerte,adoración"},
    {id: "lhN9wyhgU0E", title: "Jon Carlo - La Mano de Dios,adoración"},
    {id: "rhUGAlvMKxY", title: "SIGO ADORANDO - JOAN SANCHEZ + RPBAND,adoración"},
    {id: "g1kK0OVsgZw", title: "Ya es: Joan Sanchez & Rpband - Sesiones Adora,adoración"},
    {id: "CLu9efeCkC8", title: "EL REY DE MI VIDA - JOAN SANCHEZ & RPBAND,adoración"},
    {id: "lI45WFXS59Y", title: "Joan Sanchez - Te Entrego,adoración"},
    {id: "f8g95FhTsYU", title: "Quebrántame jesed,adoración"},
    {id: "EAadYr9V4HY", title: "Confío en Ti - Jésed,,adoración"},
    {id: "Nxld5gLwafg", title: "Entraré - Sinai / Canto Para Hora Santa,adoración"},
    {id: "yJTmiht-URU", title: "Athenas - Todo Lo Haces Nuevo ,adoración"},
    {id: "jtt7zyFeNls", title: "Athenas - Espíritu Santo ,adoración"},
    {id: "gkQH4XhaD0o", title: "Athenas - Santo,adoración"},
    {id: "NSuyGf-sWy0", title: "Siempre te Amaré cover - Aziel Mtz"},
    {id: "u88BRv8GX1Y", title: "Temblando de Amor- Marcela de la Garza (Richard Ma"},
    {id: "ttX9FXRiCrk", title: "ENTRA LA PUERTA ESTA ABIERTA,adoración"},
    {id: "Nxld5gLwafg", title: "Entraré - Sinai ,adoración"},
    {id: "Jg-apE6Pn9c", title: "Estoy a la puerta y llamo-jesed,adoración"},
    {id: "FI9_pRxycVw", title: "Grande Eres Señor-MNM RCCES,adoración"},
    {id: "rgJstTarSNo", title: "Espiritu Santo-MNM RCCES,adoración"},
    {id: "4wYzcvvyxFo", title: "En Tu Presencia MNM RCCES,adoración"},
    {id: "54BBbpHwr9M", title: "Te Doy Mi Vida MNM RCCES,adoración"},
    {id: "TFj4kYVyYv0", title: "Cuan Bello es el Señor (Cover) - Yuli & Josh,adoración"},
    {id: "JmHZguzy3YI", title: "Dame un nuevo corazón - (YULI Y JOSH) ,adoración"},
    {id: "bCxRFD84RJQ", title: "Sáname - Rafael Moreno - Yuli y Josh - Cover,adoración"},
    {id: "wQT3rt10Gx0", title: "Jon Carlo - Tócame - Yuli y Josh - Cover,adoración"},
    {id: "snhzGKv8RR4", title: "Rey de Reyes - Yuli y Josh  - Cover - Jesús tu eres la persona más importante,adoración"},
    {id: "XV-6cwAxBws", title: "Mayra Alejandra Barajas - Jesús Eucaristía,adoración"},
    {id: "KUPtiXVx2yM", title: "Athenas - Cuando Estás En El Altar,adoración"},
    {id: "zS3aT1lROXc", title: "Facundo Dening & Martín Ontivero - La Cruz,adoración"},
    {id: "Dyeinqn-n0A", title: "Hay Momentos - Cover - Yuli y Josh feat. Carmen Elisa,adoración"},
    {id: "pNbVB6-5668", title: "Gloria Martin valverde,adoración"},
    {id: "JHHikTR7cIY", title: "Saliendo del pretorio ,adoración"},
    {id: "bu-IhAXV72E", title: "Milagro de Amor | Athenas,adoracion"},
    {id: "osFIh8fprtI", title: "Vive Jesús |Athenas,adoracion"},
  ];

  
  
  
  // Variables para el reproductor de video
  var player;
  var currentVideoIndex = 0;
  
  // Función para inicializar el reproductor de video
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: videos[currentVideoIndex].id,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  
  // Función para reproducir el primer video de la lista
  function onPlayerReady(event) {
    event.target.playVideo();
    setActiveButton(currentVideoIndex);
  }
  
  // Función para cambiar de video cuando termina la reproducción
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
      currentVideoIndex++;
      if (currentVideoIndex == videos.length) {
        currentVideoIndex = 0;
      }
      player.loadVideoById(videos[currentVideoIndex].id);
      setActiveButton(currentVideoIndex);
    }
  }
  
  // Función para activar el botón correspondiente al video que se está reproduciendo
  function setActiveButton(index) {
    var buttons = document.querySelectorAll('#buttons button');
    buttons.forEach(function(button, i) {
      if (i == index) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  
  // Función para buscar un video en la lista y reproducirlo
  function searchVideo() {
    var query = document.getElementById('search-input').value.toLowerCase();
    var index = videos.findIndex(function(video) {
      return video.title.toLowerCase().includes(query);
    });
    if (index != -1) {
      currentVideoIndex = index;
      player.loadVideoById(videos[currentVideoIndex].id);
      setActiveButton(currentVideoIndex);
    }
  }
  
  // Eventos para los botones y el buscador
  document.addEventListener('DOMContentLoaded', function() {
    // Crear botones para los videos de YouTube
    var buttonsContainer = document.getElementById('buttons');
    videos.forEach(function(video) {
      var button = document.createElement('button');
      button.innerText = video.title;
      button.addEventListener('click', function() {
        currentVideoIndex = videos.indexOf(video);
        player.loadVideoById(video.id);
        setActiveButton(currentVideoIndex);
      });
      buttonsContainer.appendChild(button);
    });
  
    // Evento para el botón de búsqueda
    var searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', searchVideo);
  
    // Evento para la tecla Enter en el campo de búsqueda
    var searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchVideo();

      }
    });
  });
  