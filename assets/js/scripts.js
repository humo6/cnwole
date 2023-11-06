
function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	
	/*
	    Navigation
	*/	
	$('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		scroll_to($(this), 0);
	});
	
    /*
        Background slideshow
    */
    $('.top-content').backstretch("assets/img/backgrounds/1.webp");
    $('.call-to-action-1').backstretch("assets/img/backgrounds/4.jpg");
    $('.testimonials-container').backstretch("assets/img/backgrounds/2.jpg");
    $('.call-to-action-2').backstretch("assets/img/backgrounds/2.jpg");
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(){
    	$('.testimonials-container').backstretch("resize");
    });
    
    /*
        Wow
    */
    new WOW().init();
    
    /*
	    Modals
	*/
	$('.launch-modal').on('click', function(e){
		e.preventDefault();
		$( '#' + $(this).data('modal-id') ).modal();
	});

	var navListItems = $('div.setup-panel div a'),
		allWells = $('.setup-content'),
		allNextBtn = $('.nextBtn');

	allWells.hide();

	navListItems.click(function (e) {
		e.preventDefault();
		var $target = $($(this).attr('href')),
			$item = $(this);

		if (!$item.hasClass('disabled')) {
			navListItems.removeClass('btn-success').addClass('btn-default');
			$item.addClass('btn-success');
			allWells.hide();
			$target.show();
			$target.find('input:eq(0)').focus();
		}
	});

	allNextBtn.click(function () {
		var curStep = $(this).closest(".setup-content"),
			curStepBtn = curStep.attr("id"),
			nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
			curInputs = curStep.find("input[type='text'],input[type='url']"),
			isValid = true;

		$(".stepwizard").slideDown();
		$(".text-top-header").slideUp().hide();
		$(".form-group").removeClass("has-error");
		for (var i = 0; i < curInputs.length; i++) {
			if (!curInputs[i].validity.valid) {
				isValid = false;
				$(curInputs[i]).closest(".form-group").addClass("has-error");
			}
		}

		if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
	});

	$('div.setup-panel div a.btn-success').trigger('click');

// 	function matchCustom(params, data) {
// 		// If there are no search terms, return all of the data
// 		if ($.trim(params.term) === '') {
// 			return data;
// 		}
// console.log(data);
// 		// Do not display the item if there is no 'text' property
// 		if (typeof data.city === 'undefined') {
// 			return null;
// 		}
//
// 		// `params.term` should be the term that is used for searching
// 		// `data.text` is the text that is displayed for the data object
// 		if (data.city.indexOf(params.term) > -1) {
// 			var modifiedData = $.extend({}, data, true);
// 			modifiedData.text += ' (matched)';
//
// 			// You can return modified objects from here
// 			// This includes matching the `children` how you want in nested data sets
// 			return modifiedData;
// 		}
//
// 		// Return `null` if the term should not be displayed
// 		return null;
// 	}

	$(".getarticle").select2({
		containerCssClass: function(e) {
			return $(e).attr('required') ? 'required' : '';
		},
		placeholder: "City or ZIP...",
		minimumInputLength: 3,

		ajax: {
			url: 'assets/zip.json',
			dataType: 'json',
			tags: true,
			insertTag: function(data, tag) {
				console.log(data);
				var $found = false;
				$.each(data, function(index, value) {
					// console.log($.trim(tag.text).toUpperCase());
					if($.trim(tag.text).toUpperCase() == $.trim(value.text).toUpperCase()) {
						$found = true;
					}
				});

				if(!$found) data.unshift(tag);
			},
			processResults: function(data,params) {
				return {
					results: $.map(data, function(item) {
						if (item.zip_code == params.term && $.isNumeric(params.term)){
							// console.log(item);
							return {
								text: item.zip_code +' | '+ item.county +' | '+ item.city,
								id: item.zip_code
							}
						}else{
							var term = params.term;
							term = term.toUpperCase();
							var ic = item.city;
							ic = ic.toUpperCase();
							// console.log(term);
							if (ic.indexOf(term) > -1) {
								return {
									text: item.zip_code +' | '+ item.county +' | '+ item.city.toUpperCase(),
									id: item.zip_code
								}
							}
							return null;
						}
					})
				};
			},

			cache: true,
			delay: 250
		}
	});

	$.ajax({
		type: "GET",
		url: 'https://done.ship.cars/years',
		dataType: 'JSON',
		data: {
			permit_id: $('#permit_id').val()
		},
		success: function(data) {
			console.log(data);
			var my_obj = data;
			$.each(my_obj, function (i, z) {
				$('.vyear').append($('<option>', {
					value: my_obj[i].year,
					text: my_obj[i].year
				}));
			});
		}
	});
// console.log(dataY1);
	$(".vyear").select2({
		placeholder: "Year"
	});
	var year;
	$('.vyear').on('select2:select', function (e) {
		var data = e.params.data;
		// console.log(data);
		year = data.text;
		$.ajax({
			type: "GET",
			url: 'https://done.ship.cars/makes/?year=' + data.text,
			dataType: 'JSON',
			data: {
				permit_id: $('#permit_id').val()
			},
			success: function(data) {
				// console.log(data);
				var my_obj = data;
				$('.vmake').html('');
				$.each(my_obj, function (i, z) {
					// console.log(my_obj[i].make);

					$('.vmake').append($('<option>', {
						value: my_obj[i].make,
						text: my_obj[i].make
					}));
				});
			}
		});
		sel_year(data.year);
	});


	$('.vmake').select2({
		placeholder: "Select make"
	}).prop('disabled', true);
	function sel_year(type) {
		$('.vmake').select2({
			placeholder: "Select make"
		}).prop('disabled', false);
	}

	$('.vmake').on('select2:select', function (e) {
		var data = e.params.data;
		console.log(data);
		$.ajax({
			type: "GET",
			url: 'https://done.ship.cars/models/?year=' + year + '&make=' + data.text,
			dataType: 'JSON',
			data: {
				permit_id: $('#permit_id').val()
			},
			success: function(data) {
				console.log(data);
				var my_obj = data;
				$('.vmodel').html('');
				$.each(my_obj, function (i, z) {
					// console.log(my_obj[i].make);
					$('.vmodel').append($('<option>', {
						value: my_obj[i].model,
						text: my_obj[i].model
					}));
				});
			}
		});
		sel_make(data.year);
	});

	$('.vdate').select2({
		placeholder: "Select date"
	});
	$('.vmodel').select2({
		placeholder: "Select make"
	}).prop('disabled', true);
	function sel_make(type) {
		$('.vmodel').select2({
			placeholder: "Select make"
		}).prop('disabled', false);
	}

	$(".r-form-1-bottom").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});
	
});


jQuery(window).load(function() {
	
	/*
		Hidden images
	*/
	$(".modal-body img, .testimonial-image img").attr("style", "width: auto !important; height: auto !important;");
	
});
