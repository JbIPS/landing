window.addEventListener("DOMContentLoaded", function() {
	// Slideshow
  const gliders = document.querySelectorAll('.glider');
  gliders.forEach(glider => {
    new Glider(glider, {
      draggable: true,
      slidesToShow: glider.classList.contains('posts') ? 1.1 : 1.3,
      slidesToScroll: 1,
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next'
      },
      responsive: [{
        breakpoint: 900,
        settings: {
          slidesToShow: 2.5
        }
      }]
    });
  })

  // Header stick shrink
  let lastScroll = window.pageYOffset;
  const header = document.querySelector('header');
  const nav = header.children[0];
  window.addEventListener('scroll', (e) => {
    const sy = window.pageYOffset;
    // Don't show on small scroll
    //if((sy - lastScroll) < 50 && (sy - lastScroll) > -50) return;

    if(sy < lastScroll && sy < 20) {
      header.classList.remove('shrinked', 'slide-up', 'slide-down');
      nav.classList.add('navbar-dark');
      nav.classList.remove('navbar-light');
      header.onanimationend = null;
    }
    else if(sy < lastScroll) {
      header.classList.add('shrinked', 'slide-down');
      header.classList.remove('slide-up');
      nav.classList.add('navbar-light');
      nav.classList.remove('navbar-dark');
    } else {
      header.classList.add('slide-up');
      header.classList.remove('slide-down');
      nav.classList.add('navbar-light');
      nav.classList.remove('navbar-dark');
    }
    lastScroll = sy;
  })

	// Footer parallax
	const placeholder = document.getElementById('placeholder')
	const footer = document.querySelector('footer')

  // header
  const headerPlaceholder = document.getElementById('headerPlaceholder');
  const hero = document.getElementById('heroContent');

	// On DOMContentLoaded, set placeholder height to be equal to footer height
	updateHeight()

	window.addEventListener('resize', onResize)

	// On window resize, update placeholder height to be equal to footer height
	function onResize() {
		updateHeight()
	}

	function updateHeight() {
		// Placeholder should always match footer height
		placeholder.style.height = `${footer.offsetHeight}px`
    headerPlaceholder.style.height = `${header.offsetHeight}px`;
    //hero.style.height = `calc(100% - ${headerPlaceholder.offsetHeight}px)`;
	}
})
