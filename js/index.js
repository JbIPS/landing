window.addEventListener("DOMContentLoaded", function() {
	// Slideshow
	new Glider(document.querySelector('.glider'), {
		draggable: true,
    slidesToShow: 1.4,
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

  // Header stick shrink
  let lastScroll = window.pageYOffset;
  window.addEventListener('scroll', (e) => {
    const sy = window.pageYOffset;
    const header = document.querySelector('header');
    // Don't show on small scroll
    //if((sy - lastScroll) < 50 && (sy - lastScroll) > -50) return;

    if(sy < lastScroll && sy < 20) {
      header.classList.remove('shrinked');
      header.classList.remove('slide-up');
      header.onanimationend = null;
    }
    else if(sy < lastScroll) {
      header.classList.add('shrinked', 'slide-down');
      header.classList.remove('slide-up');
    } else {
      header.classList.add('slide-up');
      header.classList.remove('slide-down');
    }
    lastScroll = sy;
  })

	// Footer parallax
	const placeholder = document.getElementById('placeholder')
	const footer = document.querySelector('footer')

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
	}
})
