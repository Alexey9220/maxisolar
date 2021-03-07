function header_fixed(e) {
    $(this).scrollTop() > e ? ($(".header__navigation").addClass("fixed"), $(".header-fixed").addClass("hidden"), $(".header-fixed").attr({
        style: "width:100%"
    })) : ($(".header__navigation").removeClass("fixed"), $(".header-fixed").removeClass("hidden"), $(".header-fixed").removeAttr("style"))
}

function scroll_up(e) {
    $(this).scrollTop() > e ? ($(".scrollup").fadeIn(), $(".scrollup").addClass("animation")) : ($(".scrollup").fadeOut(), $(".scrollup").removeClass("animation"))
}

var timerstart = new Date();

function feedback(form, itemname, lang) {
		
	form.getElementsByClassName('result')[0].innerHTML = '';
	
	var list = form.getElementsByTagName('input');
	var arrfb = [];
	var prefix = form.getAttribute('name') + '_';
	var iback = 0;
	
	for (var i = 0; i < list.length; i++) {
		if (list[i].readOnly)
		{
			iback = iback + 1;
		}
		else
		{
			arrfb[i - iback] = {
				name: list[i].getAttribute('id'),
				req: list[i].getAttribute('name'),
				title: list[i].getAttribute('title'),
				value: list[i].value
			}
			arrfb[i - iback].name = arrfb[i - iback].name.replace(prefix, "");
			if (list[i].getAttribute('type') == 'tel')
			{
				if (arrfb[i - iback].value != '') {
					arrfb[i - iback].value = '+380' + arrfb[i - iback].value;
				}
			}
		}
	}
	var listlength = list.length - iback;	
	var list = form.getElementsByTagName('select');
	if (list != 'NULL')
	{
		for (var k = 0; k < list.length; k++) { 
			arrfb[k + listlength] = {
				name: list[k].getAttribute('id'),
				req: list[k].getAttribute('name'),
				title: list[k].getAttribute('title'),
				value: list[k].value
			}
			arrfb[k + listlength].name = arrfb[k + listlength].name.replace(prefix, "");
		}	
	}
	var list = form.getElementsByTagName('textarea');
	if (list != 'NULL')
	{
		for (var j = 0; j < list.length; j++) { 
			arrfb[j + listlength] = {
				name: list[j].getAttribute('id'),
				req: list[j].getAttribute('name'),
				title: list[j].getAttribute('title'),
				value: list[j].value
			}
			arrfb[j + listlength].name = arrfb[j + listlength].name.replace(prefix, "");
		}	
	}
	
	switch(lang) {
	  case '/en/': {
		var lng_param = '2';
		break;
	  }
	  case '/ua/': {
		var lng_param = '3';
		break;
	  }
	  default: {
		var lng_param = '';
	  }
	}	
	
	var validated = validation(arrfb,lang);
	
	if (validated == true && typeof validated == 'boolean') {
		
		var str = JSON.stringify(arrfb);
		
		if (itemname != '') {
			var param = [form, itemname, str, lng_param];
			var url = '/feedback?form=' + form.getAttribute('name') + '&lng='+ lng_param + '&itemname=' + itemname + '&action=db' + '&r=' + Math.random();
		} else {
			var param = [form, null, str, lng_param];
			var url = '/feedback?form=' + form.getAttribute('name') + '&lng='+ lng_param + '&action=db' + '&r=' + Math.random();
		}

		$.ajax({
			type: 'POST',
			url: url,
			data: {"list": str},
			beforeSend: function(data) {
			},			
			complete: function() {
			},
			success: function (data) {
				newfeedback(data, param);
			},
			error: function (xhr, ajaxOptions, thrownError) { 
			}
		});
	} else {
		form.getElementsByClassName('result')[0].className = 'occurred result';
		form.getElementsByClassName('result')[0].innerHTML = validated;		
	}
	return true;
}

function newfeedback(data, param) {

	var result = $.parseJSON(data);
	
	if (result['result'] != 'false') {
		param[0].getElementsByClassName('result')[0].className = 'success result';
		param[0].getElementsByClassName('result')[0].innerHTML = result['message'];
		param[0].reset();
		
		if (param[1] === null) {
			var url_mail = '/feedback?form=' + param[0].getAttribute('name') + '&lng='+ param[3] +  '&action=mail' + '&r=' + Math.random();
		} else {
			var url_mail = '/feedback?form=' + param[0].getAttribute('name') + '&lng='+ param[3] +  '&itemname=' + param[1] + '&action=mail' + '&r=' + Math.random();      
		}
		
		$.ajax({
			type: 'POST',
			url: url_mail,
			data: {"list": param[2]},
			success: function (data) {},
			error: function (xhr, ajaxOptions, thrownError) { 
			}
		});
	} else {	
		param[0].getElementsByClassName('result')[0].className = 'occurred result';
		param[0].getElementsByClassName('result')[0].innerHTML = result['message'];
	}
}

function validation(arrfb,lang) {
	
	switch(lang) {
	  case '/en/': {
		var input_sp = 'Attention! Field ';
		var error_type = ' not indicated!';
		var vemail = 'Enter a valid E-mail address';
		break;
	  }
	  case '/ua/': {
		var input_sp = 'Поле ';
		var error_type = ' не вказано!';
		var vemail = 'Вкажіть правильний E-mail';
		break;
	  }
	  default: {
		var input_sp = 'Поле '
		var error_type = ' не заполнено!';
		var vemail = 'Укажите правильный E-mail';
	  }
	}
	
	var timerend = new Date();
	
	if (timerend - timerstart < 1000) {
		timerstart = new Date();
		return 'Error in Page!';
	} else {
		for (var i = 0; i < arrfb.length; i++) { 
			if (arrfb[i].req == 'required' && arrfb[i].value == '')
			{
				return input_sp + arrfb[i].title + error_type;	
			}
			if (arrfb[i].req == 'required' && arrfb[i].name == 'email' && !validateEmail(arrfb[i].value))
			{
				return vemail;		
			}
		}
		return true;
	}	
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

$(document).ready(function() {
        
        var e = window.innerWidth;
        
        // Maskedinput
        $('#calls_tel').mask('+38(999) 999-99-99');
        $('#contacts_phone').mask('+38(999) 999-99-99');
        $('#costings_tel').mask('+38(999) 999-99-99');

        //  Open nav 
        $('.navbar__open').click(function() {
            $('.navigation__mobile').addClass('mobile__navigation active');
        });
      
        //  Close nav 
        $('.navbar__close').click(function() {
            $('.navigation__mobile').removeClass('mobile__navigation active');
        });
        
        // Scroll Top
        $('.scrollup').click(function(){ $("html, body").animate({ scrollTop: 0 }, 600); return false; }),

        // Fixed Navigation
		$(window).scroll(function() { h = 500, scroll_up(h), e >= "1200" && (h_v = 10, header_fixed(h_v))}), 
        
        // FancyGallery
        $("a.project").fancybox({
            openEffect	: 'none',
            padding	: 0,
            closeEffect	: 'none'
        });

        // Slider OWL index
        $("#owl__slider").owlCarousel({
			navigation : false,	
			singleItem : true,
			transitionStyle: "fadeUp",
			autoPlay: 9500,
			navigation : false,
			navigationText : ["",""],
			slideSpeed : 80,
			paginationSpeed : 80,
			responsive : true,
			mouseDrag : false,
			pagination : true,
			paginationNumbers: false
        }), 
		$(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__slider").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__slider").trigger("owl.prev")
        }),
        
        // Slider OWL partners
        $("#owl__slider__partners").owlCarousel({
            autoPlay: 7000,
            items: 5,
            itemsDesktop: [1199, 5],
            itemsDesktopSmall: [979, 4],
            itemsTablet: [768, 3],
            autoPlay: true,
            stopOnHover: false,
            navigation: false,
            navigationText: ["", ""],
            rewindNav: true,
            scrollPerPage: false,
            mouseDrag: false,
            pagination: false,
            paginationNumbers: false,
            slideSpeed: 1300,
            paginationSpeed: 1300,
            rewindSpeed: 1300
        }), 
        $(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__slider__partners").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__slider__partners").trigger("owl.prev")
        }),
		
        // Slider OWL projects
        $("#owl__slider__projects").owlCarousel({
            autoPlay: 7000,
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 3],
            autoPlay: false,
            stopOnHover: false,
            navigation: false,
            navigationText: ["", ""],
            rewindNav: false,
            scrollPerPage: false,
            mouseDrag: false,
            pagination: false,
            paginationNumbers: false,
            slideSpeed: 1300,
            paginationSpeed: 1300,
            rewindSpeed: 1300
        }), 
        $(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__slider__projects").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__slider__projects").trigger("owl.prev")
        })

        // Slider OWL photos projects
        let owl__photos__projects = $("#owl__photos__projects");
        owl__photos__projects.owlCarousel({
            autoPlay: 7000,
            items: 4,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [979, 4],
            itemsTablet: [768, 3],
            autoPlay: false,
            stopOnHover: false,
            navigation: false,
            navigationText: ["", ""],
            rewindNav: false,
            scrollPerPage: false,
            mouseDrag: false,
            pagination: false,
            paginationNumbers: false,
            slideSpeed: 1300,
            paginationSpeed: 1300,
            rewindSpeed: 1300
        }), 
        $(".owl__photos__projects .slider_arrow_right").click(function() {
            owl__photos__projects.trigger("owl.next")
        }), 
		$(".owl__photos__projects .slider_arrow_left").click(function() {
            owl__photos__projects.trigger("owl.prev")
        })

        // Slider OWL similar projects
        let owl__similar__projects = $("#owl__similar__projects");
        owl__similar__projects.owlCarousel({
            autoPlay: 7000,
            items: 4,
            itemsDesktop: [1199, 5],
            itemsDesktopSmall: [979, 4],
            itemsTablet: [768, 3],
            autoPlay: false,
            stopOnHover: false,
            navigation: false,
            navigationText: ["", ""],
            rewindNav: false,
            scrollPerPage: false,
            mouseDrag: false,
            pagination: false,
            paginationNumbers: false,
            slideSpeed: 1300,
            paginationSpeed: 1300,
            rewindSpeed: 1300
        }), 
        $(".owl__similar__projects .slider_arrow_right").click(function() {
            owl__similar__projects.trigger("owl.next")
        }), 
		$(".owl__similar__projects .slider_arrow_left").click(function() {
            owl__similar__projects.trigger("owl.prev")
        })
		
    }),
    function(e) {
        e("a[data-reveal-id]").on("click", function(t) {
            t.preventDefault();
            var a = e(this).attr("data-reveal-id");
            e("#" + a).reveal(e(this).data()), window.innerWidth >= "768" && "search_modal" === a && e("#ajax_search_producrs").focus()
        }), e.fn.reveal = function(t) {
            var a = {
                    animation: "fade",
                    animationspeed: 10,
                    closeonbackgroundclick: false,
                    dismissmodalclass: "close-reveal-modal"
                },
                t = e.extend({}, a, t);
            return this.each(function() {
                function a() {
                    s = false
                }
                function i() {
                    s = false
                }
                var n = e(this),
                    o = parseInt(n.css("top")),
                    r = n.height() + o,
                    s = false,
                    l = e(".reveal-modal-bg");
                0 == l.length && (l = e('<div class="reveal-modal-bg" />').insertAfter(n)), n.bind("reveal:open", function() {
                    l.unbind("click.modalEvent"), e("." + t.dismissmodalclass).unbind("click.modalEvent"), s || (i(), "fadeAndPop" == t.animation && (n.css({
                        top: e(document).scrollTop() - r,
                        opacity: 0,
                        visibility: "visible"
                    }), l.fadeIn(t.animationspeed / 2), n.delay(t.animationspeed / 2).animate({
                        top: e(document).scrollTop() + parseInt(n.css("top")) + 30,
                        opacity: 1
                    }, t.animationspeed, a())), "fade" == t.animation && (n.css({
                        opacity: 0,
                        visibility: "visible",
                        top: e(document).scrollTop() + o
                    }), l.fadeIn(t.animationspeed / 2), n.delay(t.animationspeed / 2).animate({
                        opacity: 1
                    }, t.animationspeed, a())), "none" == t.animation && (n.css({
                        visibility: "visible",
                        top: e(document).scrollTop() + o
                    }), l.css({
                        display: "block"
                    }), a())), n.unbind("reveal:open")
                }), n.bind("reveal:close", function() {
                    s || (i(), "fadeAndPop" == t.animation && (l.delay(t.animationspeed).fadeOut(t.animationspeed), n.animate({
                        top: e(document).scrollTop() - r + "px",
                        opacity: 0
                    }, t.animationspeed / 1, function() {
                        n.css({
                            top: o,
                            opacity: 1,
                            visibility: "hidden"
                        }), a()
                    })), "fade" == t.animation && (l.delay(t.animationspeed).fadeOut(t.animationspeed), n.animate({
                        opacity: 0
                    }, t.animationspeed, function() {
                        n.css({
                            opacity: 1,
                            visibility: "hidden",
                            top: o
                        }), a()
                    })), "none" == t.animation && (n.css({
                        visibility: "hidden",
                        top: o
                    }), l.css({
                        display: "none"
                    }))), l.remove(), n.unbind("reveal:close")
                }), n.trigger("reveal:open");
                e("." + t.dismissmodalclass).bind("click.modalEvent", function() {
                    n.trigger("reveal:close")
                });
                t.closeonbackgroundclick && (l.css({
                    cursor: "pointer"
                }), l.bind("click.modalEvent", function() {
                    n.trigger("reveal:close")
                })), e("body").keyup(function(e) {
                    27 === e.which && n.trigger("reveal:close")
                })
            })
        }
    }(jQuery);
var rtime, loaded = 0,
    timerstart = new Date