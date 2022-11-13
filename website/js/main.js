

;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};




	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	

	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	
	var parallax = function() {

		if ( !isMobile.any() ) {
			$(window).stellar({
				horizontalScrolling: false,
				hideDistantElements: false, 
				responsive: true

			});
		}
	};


	$(function(){
		contentWayPoint();
		
		goToTop();
		loaderPage();
		parallax();
	});

	async function listPaymails() {

		const { data } = await axios.get('https://onchain.sv/api/v1/events?app=egoboost.vip&type=paymail')


		return data.events.map(event => event).filter(event => !!event)
		
	}

	async function listRankings() {

		const { data: { events: boostpow } } = await axios.get('https://onchain.sv/api/v1/boostpow/rankings?app=egoboost.vip&type=paymail')

		return boostpow
		
	}

	(async () => {

		listRankings().then(rankings => console.log('RANKINGS', rankings))

		const events = await listPaymails()

		console.log('PAYMAILS', events)

		const templateHTML = document.getElementById('link-list-item-template').innerHTML

		const template = Handlebars.compile(templateHTML)

		console.log('EVENTS', events)

		for (let event of events) {

			console.log('EVENT', event)

			const html = template(Object.assign(event))

			$('#homepage-links-list').prepend(html)

		}

		$('.boost-button').on('click', event => {

			event.preventDefault()

			console.log('target', event.target)

			const txid = $(event.target).closest('.homepage-links-item').data('txid')

			const nearest = $(event.target).closest('.homepage-links-item')

			console.log('txid', { nearest, txid })

			Snackbar.show({text: `Boosting Post with BoostPow.com for $0.05`, pos: 'bottom-right', actionTextColor: 'red'});

			handleBoost(txid)

		})

	})();


}());

function enqueueSnackbar(text, params) {

	Snackbar.show({text, pos: 'bottom-right', actionTextColor: 'red'});

}

const handleBoost = async (txid) => {

    const value = 0.05;
    const currency = 'USD';

    enqueueSnackbar(`Getting Boostpow Details for ${value} ${currency} of Proof of Work`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    });

    const url = `https://askbitcoin.ai/api/v1/boostpow/${txid}/new?value=${value}&currency=${currency}`;

    console.log('boostpow.job.build', { url });

    let { data } = await axios.get(url);

    console.log('boostpow.payment_request', data);

    enqueueSnackbar(`Posting Boostpow Order: ${txid}`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      },
      variant: 'info'
    });

    const script = new bsv.Script(data.outputs[0].script);

    const amount = data.outputs[0].amount / 100000000;

    try {
      const send = {
        opReturn: [
          'onchain',
          '18pPQigu7j69ioDcUG9dACE1iAN9nCfowr',
          'job',
          JSON.stringify({
            index: 0
          })
        ],
        amount,
        to: script.toASM(),
        currency: 'BSV'
      };

      console.log('relayx.send.params', send);

      const result = await relayone.send(send);

      console.log('relayx.send.result', result);

      console.log('RESULT', result);

      const { txid } = result;

      console.log('TXID', txid);

      // Post the new boostpow job transaction to the indexer API at pow.co
      axios
        .get(`https://pow.co/api/v1/boost/jobs/${txid}`)
        .then(({ data }) => {
          console.log(`pow.co/api/v1/jobs/${result.txid}.result`, data);
         })
        .catch((error) => {
          console.error(`pow.co/api/v1/jobs/${result.txid}`, error);
        });

      enqueueSnackbar(`Boostpow Order Posted`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'success'
      });

      enqueueSnackbar(`boostpow.job ${result.txid}`, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        persist: true
      });

      console.log('relay.quote', result);
    } catch (error) {
      console.error('relayx', error);

      enqueueSnackbar(`Error Posting Boostpow Order: ${error.message}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'
      });
    }
}
