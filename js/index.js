window.addEventListener("DOMContentLoaded", function() {
	// Slideshow
	new Glider(document.querySelector('.glider'), {
		draggable: true,
    slidesToShow: 2.5,
		slidesToScroll: 1,
		arrows: {
			prev: '.glider-prev',
			next: '.glider-next'
		}
	});

  // Header stick shrink
  let lastScroll = window.pageYOffset;
  window.addEventListener('scroll', (e) => {
    const sy = window.pageYOffset;
    const header = document.querySelector('header');
    if(sy < 20) {
      header.classList.remove('shrinked');
    }
    if(sy < lastScroll || sy < 100) {
      header.classList.remove('hidden');
    } else {
      header.classList.add('shrinked', 'hidden');
    }
    lastScroll = sy;
  })

  // Panels
  const summaries = document.querySelectorAll('.summary');
  const panel = document.querySelector('.panel');
  const hide = (panel, target) => {
    panel.classList.remove('hover');
    target.classList.remove('details', 'vh-100');
  }
  summaries.forEach((sum) => {
    sum.addEventListener('mouseenter', (e) => {
      const target = document.getElementById(e.target.getAttribute('data-target'));
      panel.classList.add('hover');
      target.classList.add('details', 'vh-100');
      document.querySelector('header').classList.add('shrinked');
      target.addEventListener('mouseleave', () => {
        hide(panel, target);
      });
      window.addEventListener('scroll', () => {
        hide(panel, target);
      });
    })
  });

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
