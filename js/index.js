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
    // Don't show on small scroll
    if((sy - lastScroll) < 50 && (sy - lastScroll) > -50) return;

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
      //header.onanimationend = () => {
        //header.classList.remove('slide-up');
        //header.onanimationend = null;
      //};
    }
    lastScroll = sy;
  })

  // Panels
  const summaries = document.querySelectorAll('.summary');
  const panel = document.querySelector('.panel');
  const hide = (panel, target) => {
    panel.classList.remove('hover');
    target.classList.remove('details', 'vh-100');
    target.style = "";
  }
  summaries.forEach((sum) => {
    sum.addEventListener('mouseenter', (e) => {
      const target = document.getElementById(e.target.getAttribute('data-target'));
      panel.classList.add('hover');
      target.classList.add('details', 'vh-100');
      const headerHeight = document.querySelector('header').clientHeight;
      panel.style = `top: -${Math.max(headerHeight - window.pageYOffset, 0)}px;`;
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
