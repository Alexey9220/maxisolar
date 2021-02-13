//= wow.js

function header_fixed(e) {
    $(this).scrollTop() > e ? ($(".header__navigation").addClass("fixed"), $(".header-fixed").addClass("hidden"), $(".header-fixed").attr({
        style: "width:100%"
    })) : ($(".header__navigation").removeClass("fixed"), $(".header-fixed").removeClass("hidden"), $(".header-fixed").removeAttr("style"))
}

function toggleNav() {
    var e = !$(".cd-dropdown").hasClass("dropdown-is-active");
    $(".cd-dropdown").toggleClass("dropdown-is-active", e), $(".cd-dropdown-trigger").toggleClass("dropdown-is-active", e), e || $(".cd-dropdown").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
        $(".has-children ul").addClass("is-hidden"), $(".move-out").removeClass("move-out"), $(".is-active").removeClass("is-active")
    })
}

function videomodal() {
    var e = !$(".cd-mobile-video").hasClass("v-is-active");
    $(".cd-mobile-video").toggleClass("v-is-active", e), $(".cd-mvideo").toggleClass("v-is-active", e), e || $(".cd-mobile-video").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {})
}

function scroll_up(e) {
    $(this).scrollTop() > e ? ($(".scrollup").fadeIn(), $(".scrollup").addClass("animation")) : ($(".scrollup").fadeOut(), $(".scrollup").removeClass("animation"))
}

function feedback(e, t, a) {
    e.getElementsByClassName("indicator")[0].style.display = "block", e.getElementsByClassName("result")[0].innerHTML = "";
    for (var i = e.getElementsByTagName("input"), n = [], o = e.getAttribute("name") + "_", r = 0, s = 0; s < i.length; s++) i[s].readOnly ? r += 1 : (n[s - r] = {
        name: i[s].getAttribute("id"),
        req: i[s].getAttribute("name"),
        title: i[s].getAttribute("title"),
        value: i[s].value
    }, n[s - r].name = n[s - r].name.replace(o, ""), "tel" == i[s].getAttribute("type") && "" != n[s - r].value && (n[s - r].value = "+380" + n[s - r].value));
    var l = i.length - r;
    if ("NULL" != (i = e.getElementsByTagName("select")))
        for (var d = 0; d < i.length; d++) n[d + l] = {
            name: i[d].getAttribute("id"),
            req: i[d].getAttribute("name"),
            title: i[d].getAttribute("title"),
            value: i[d].value
        }, n[d + l].name = n[d + l].name.replace(o, "");
    if ("NULL" != (i = e.getElementsByTagName("textarea")))
        for (var c = 0; c < i.length; c++) n[c + l] = {
            name: i[c].getAttribute("id"),
            req: i[c].getAttribute("name"),
            title: i[c].getAttribute("title"),
            value: i[c].value
        }, n[c + l].name = n[c + l].name.replace(o, "");
    switch (a) {
        case "/en/":
            u = "2";
            break;
        case "/ru/":
            u = "2";
            break;
        default:
            var u = "3"
    }
    var m = validation(n, a);
    if (1 == m && "boolean" == typeof m) {
        var v = JSON.stringify(n);
        if ("" != t) var p = [e, t, v, u],
            g = "/feedback?form=" + e.getAttribute("name") + "&lng=" + u + "&itemname=" + t + "&action=db&r=" + Math.random();
        else var p = [e, null, v, u],
            g = "/feedback?form=" + e.getAttribute("name") + "&lng=" + u + "&action=db&r=" + Math.random();
        $.ajax({
            type: "POST",
            url: g,
            data: {
                list: v
            },
            beforeSend: function(e) {},
            complete: function() {},
            success: function(e) {
                newfeedback(e, p)
            },
            error: function(e, t, a) {}
        })
    } else e.getElementsByClassName("indicator")[0].style.display = "none", e.getElementsByClassName("result")[0].className = "occurred result", e.getElementsByClassName("result")[0].innerHTML = m;
    return false
}

function newfeedback(e, t) {
    var a = $.parseJSON(e);
    if ("false" != a.result) {
        if (t[0].getElementsByClassName("indicator")[0].style.display = "none", t[0].getElementsByClassName("result")[0].className = "success result", t[0].getElementsByClassName("result")[0].innerHTML = a.message, t[0].reset(), null === t[1]) i = "/feedback?form=" + t[0].getAttribute("name") + "&lng=" + t[3] + "&action=mail&r=" + Math.random();
        else var i = "/feedback?form=" + t[0].getAttribute("name") + "&lng=" + t[3] + "&itemname=" + t[1] + "&action=mail&r=" + Math.random();
        $.ajax({
            type: "POST",
            url: i,
            data: {
                list: t[2]
            },
            success: function(e) {},
            error: function(e, t, a) {}
        })
    } else t[0].getElementsByClassName("indicator")[0].style.display = "none", t[0].getElementsByClassName("result")[0].className = "errormodal result", t[0].getElementsByClassName("result")[0].innerHTML = a.message
}

function validation(e, t) {
    switch (t) {
		case "/en/":
            var a = "Attention! Field ",
                i = " not indicated!",
                n = "Enter a valid E-mail address";
            break;
        case "/ru/":
            var a = "Поле ",
                i = " не заполнено!",
                n = "Укажите правильный E-mail";
            break;
        default:
            var a = "Поле ",
                i = " не вказано!",
                n = "Вкажіть правильний E-mail"
    }
    if (new Date - timerstart < 1e3) return timerstart = new Date, "Error in Page!";
    for (var o = 0; o < e.length; o++) {
        if ("required" == e[o].req && "" == e[o].value) return a + e[o].title + i;
        if ("required" == e[o].req && "email" == e[o].name && !validateEmail(e[o].value)) return n
    }
    return false
}

function validateEmail(e) {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(e)
}

$(document).ready(function() {
        
        var e = window.innerWidth;
        
        $('#contacts_phone').mask('+38(999) 999-99-99');
        $('#calls_tel').mask('+38(999) 999-99-99');
        $('#price_tel').mask('+38(999) 999-99-99');
        
        $('.scrollup').click(function(){ $("html, body").animate({ scrollTop: 0 }, 600); return false; }),

		$(window).scroll(function() { h = 500, scroll_up(h), e >= "991" && (h_v = 10, header_fixed(h_v))}), 
		
		$("a.cd-mvideo").on("click", function(e) { return e.preventDefault(), youtube1($(this).attr("href")), false }), 
        
		$("#socia-share-buttons .s_shared").on("click", function(e) {
            var t = $(this).attr("data-target");
            return window.open(t, "_blank", "scrollbars=0, resizable=1, menubar=0, left=400, top=110, width=550, height=440, toolbar=0, status=0"), e.preventDefault(), false
        });
        
        /* FancyGallery */
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
        $(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__slider__projects").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__slider__projects").trigger("owl.prev")
        })

        // Slider OWL photos projects
        $("#owl__photos__projects").owlCarousel({
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
        $(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__photos__projects").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__photos__projects").trigger("owl.prev")
        })

        // Slider OWL similar projects
        $("#owl__similar__projects").owlCarousel({
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
        $(".owl__slider__controls .slider_arrow_right").click(function() {
            $("#owl__similar__projects").trigger("owl.next")
        }), 
		$(".owl__slider__controls .slider_arrow_left").click(function() {
            $("#owl__similar__projects").trigger("owl.prev")
        })
		
    }),
    function(e) {
        function t(t) {
            var a = e(this),
                i = null,
                n = [],
                o = null,
                r = null,
                s = e.extend({
                    rowSelector: "> li",
                    submenuSelector: "*",
                    submenuDirection: "right",
                    tolerance: 75,
                    enter: e.noop,
                    exit: e.noop,
                    activate: e.noop,
                    deactivate: e.noop,
                    exitMenu: e.noop
                }, t),
                l = function(e) {
                    e != i && (i && s.deactivate(i), s.activate(e), i = e)
                },
                d = function(e) {
                    var t = c();
                    t ? r = setTimeout(function() {
                        d(e)
                    }, t) : l(e)
                },
                c = function() {
                    function t(e, t) {
                        return (t.y - e.y) / (t.x - e.x)
                    }
                    if (!i || !e(i).is(s.submenuSelector)) return 0;
                    var r = a.offset(),
                        l = {
                            x: r.left,
                            y: r.top - s.tolerance
                        },
                        d = {
                            x: r.left + a.outerWidth(),
                            y: l.y
                        },
                        c = {
                            x: r.left,
                            y: r.top + a.outerHeight() + s.tolerance
                        },
                        u = {
                            x: r.left + a.outerWidth(),
                            y: c.y
                        },
                        m = n[n.length - 1],
                        v = n[0];
                    if (!m) return 0;
                    if (v || (v = m), v.x < r.left || v.x > u.x || v.y < r.top || v.y > u.y) return 0;
                    if (o && m.x == o.x && m.y == o.y) return 0;
                    var p = d,
                        g = u;
                    "left" == s.submenuDirection ? (p = c, g = l) : "below" == s.submenuDirection ? (p = u, g = c) : "above" == s.submenuDirection && (p = l, g = d);
                    var f = t(m, p),
                        h = t(m, g),
                        b = t(v, p),
                        $ = t(v, g);
                    return f < b && h > $ ? (o = m, 300) : (o = null, 0)
                };
            a.mouseleave(function() {
                r && clearTimeout(r), s.exitMenu(this) && (i && s.deactivate(i), i = null)
            }).find(s.rowSelector).mouseenter(function() {
                r && clearTimeout(r), s.enter(this), d(this)
            }).mouseleave(function() {
                s.exit(this)
            }).click(function() {
                l(this)
            }), e(document).mousemove(function(e) {
                n.push({
                    x: e.pageX,
                    y: e.pageY
                }), n.length > 3 && n.shift()
            })
        }
        e.fn.menuAim = function(e) {
            return this.each(function() {
                t.call(this, e)
            }), this
        }
    }(jQuery), $(".cd-mobile-video .mv-close").on("click", function(e) {
        e.preventDefault(), videomodal()
    }), $(".cd-dropdown-trigger").on("click", function(e) {
        e.preventDefault(), toggleNav()
    }), $(".cd-dropdown .cd-close").on("click", function(e) {
        e.preventDefault(), toggleNav()
    }), $(".has-children").children("a").on("click", function(e) {
        $(this).parent(".has-children").parent(".cd-dropdown-content").length > 0 && e.preventDefault(), $(this).next("ul").removeClass("is-hidden").end().parent(".has-children").parent("ul").addClass("move-out")
    });
var submenuDirection = $(".cd-dropdown-wrapper").hasClass("open-to-left") ? "left" : "right";
$(".cd-dropdown-content").menuAim({
        activate: function(e) {
            $(e).children().addClass("is-active").removeClass("fade-out"), 0 == $(".cd-dropdown-content .fade-in").length && $(e).children("ul").addClass("fade-in")
        },
        deactivate: function(e) {
            $(e).children().removeClass("is-active"), (0 == $("li.has-children:hover").length || $("li.has-children:hover").is($(e))) && ($(".cd-dropdown-content").find(".fade-in").removeClass("fade-in"), $(e).children("ul").addClass("fade-out"))
        },
        exitMenu: function() {
            return $(".cd-dropdown-content").find(".is-active").removeClass("is-active"), false
        },
        submenuDirection: submenuDirection
    }), $(".go-back").on("click", function() {
        var e = $(this);
        $(this).parent("ul").parent(".has-children").parent("ul");
        e.parent("ul").addClass("is-hidden").parent(".has-children").parent("ul").removeClass("move-out")
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