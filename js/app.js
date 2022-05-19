function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
	let dropdown = document.querySelector('.menu__link_dropdown');
	if (dropdown) {
		dropdown.addEventListener("click", function (e) {
			dropdown.classList.toggle('_active');
		});
	}
} else {
	document.querySelector('html').classList.add('_pc');
}


let unlock = true;

//=================
//ActionsOnHash
if (location.hash) {
	const hsh = location.hash.replace('#', '');
	if (document.querySelector('.popup_' + hsh)) {
		popup_open(hsh);
	} else if (document.querySelector('div.' + hsh)) {
		_goto(document.querySelector('.' + hsh), 500, '');
	}
}
//=================

//Menu

const menuMobileMQ = window.matchMedia("(min-width: 768px)");

function someFunctionMQ(e) {
	let iconMenu = document.querySelector(".header__icon");
	let menuClose = document.querySelector(".menu__close");
	let delay = 500;
	let menuBody = document.querySelector(".menu__body");
	let headerLogo = document.querySelector(".header__logo");
	iconMenu.addEventListener("click", function (el) {
		if (e.matches) {
			if (unlock) {
				body_lock(delay);
				menuBody.classList.add("_active");
				headerLogo.classList.add("_active");
			}
		} else {
			if (unlock) {
				menuBody.classList.add("_active");
				headerLogo.classList.add("_active");
				popup_open("catalog")
				body_lock(delay);
			}
		}
	});
	menuClose.addEventListener("click", function (e) {
		document.querySelector('.header').classList.remove('open');
		popup_close();
		body_lock(delay);
		menuBody.classList.remove("_active");
		headerLogo.classList.remove("_active");
	});
}
// Register event listener
menuMobileMQ.addListener(someFunctionMQ);
// Initial check
someFunctionMQ(menuMobileMQ);

//=================
//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
//=================
//=================
//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove('_active');
				tabs_blocks[index].classList.remove('_active');
			}
			tabs_item.classList.add('_active');
			tabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}
//=================
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/

// SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}
//=================


//=================
//Popups
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			let item = el.getAttribute('href').replace('#', '');
			let video = el.getAttribute('data-video');
			popup_open(item, video);
		}
		e.preventDefault();
	})
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	let input_focus = curent_popup.querySelector('.input');
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}

		let menu = document.querySelector('.header');
		curent_popup.classList.add('_active');
		menu.classList.add('open');
		history.pushState('', '', '#' + item);
		if (input_focus) {
			setTimeout(() => {
				input_focus.focus();
			}, 550);
		}
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
			}
		} else {
			let video = item.querySelector('.popup__video');
			let menu = document.querySelector('.header');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
			menu.classList.remove('open');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
});

//=================
//SlideToggle
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
//========================================
//Wrap
function _wrap(el, wrapper) {
	el.parentNode.insertBefore(wrapper, el);
	wrapper.appendChild(el);
}
//========================================
//RemoveClasses
function _removeClasses(el, class_name) {
	for (var i = 0; i < el.length; i++) {
		el[i].classList.remove(class_name);
	}
}
//========================================
//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}

//#region Gallery
let gallery = document.querySelectorAll('._gallery');
if (gallery) {
	gallery_init();
}
function gallery_init() {
	for (let index = 0; index < gallery.length; index++) {
		const el = gallery[index];
		lightGallery(el, {
			counter: false,
			selector: 'a',
			download: false
		});
	}
}
//#endregion
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
async function form_submit(e) {
	let btn = e.target;
	let form = btn.closest('form');
	let error = form_validate(form);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');
		const test = form.getAttribute('data-test');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (test) {
			e.preventDefault();
			popup_open(message + '-message');
			form_clean(form);
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.addEventListener("input", function (e) {
		if (input.value.length > 3) {
			input.classList.remove('_error');
			input.parentElement.classList.remove('_error');
			let input_error = input.parentElement.querySelector('.form__error');
			if (input_error) {
				input.parentElement.removeChild(input_error);
			}
		}
	});
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

let viewPass = document.querySelectorAll('.form__viewpass');
for (let index = 0; index < viewPass.length; index++) {
	const element = viewPass[index];
	element.addEventListener("click", function (e) {
		if (element.classList.contains('_active')) {
			element.parentElement.querySelector('input').setAttribute("type", "password");
		} else {
			element.parentElement.querySelector('input').setAttribute("type", "text");
		}
		element.classList.toggle('_active');
	});
}


//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass" && !input.parentElement.querySelector('.form__viewpass').classList.contains('_active')) {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask("+7(999) 999 9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				const calendarItem = datepicker(input, {
					customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					overlayButton: 'Применить',
					overlayPlaceholder: 'Год (4 цифры)',
					startDay: 1,
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
				const dataFrom = input.getAttribute('data-from');
				const dataTo = input.getAttribute('data-to');
				if (dataFrom) {
					calendarItem.setMin(new Date(dataFrom));
				}
				if (dataTo) {
					calendarItem.setMax(new Date(dataTo));
				}
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}

//QUANTITY
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
			if (quantityButton.classList.contains('quantity__button_plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity').querySelector('input').value = value;
		});
	}
}


let scr_body = document.querySelector('body');
let scr_items = document.querySelectorAll('._scr-item');
let scrolling = true;
let scrollDirection = 0;
let currentScroll;

//ScrollOnScroll
window.addEventListener('scroll', scroll_scroll);
function scroll_scroll() {
	let src_value = currentScroll = pageYOffset;
	let header = document.querySelector('header.header');
	let mainScreen = document.querySelector('.main-screen');
	if (header !== null) {
		if (src_value > 100) {
			header.classList.add('_scroll');
		} else {
			header.classList.remove('_scroll');
		}
	}

	if (mainScreen && window.innerWidth > 767.98) {
		let menu_right = document.querySelectorAll('.menu-right__btn');
		if (src_value < window.innerHeight - 150) {
			for (let index = 0; index < menu_right.length; index++) {
				menu_right[index].classList.add('menu-right__btn_white');
			}
		} else {
			for (let index = 0; index < menu_right.length; index++) {
				menu_right[index].classList.remove('menu-right__btn_white');
			}
		}
	}

	if (scr_items.length > 0) {
		for (let index = 0; index < scr_items.length; index++) {
			let scr_item = scr_items[index];
			let scr_item_offset = offset(scr_item).top;
			let scr_item_height = scr_item.offsetHeight;
			let scr_item_point = window.innerHeight - (window.innerHeight - scr_item_height / 3);
			if (window.innerHeight > scr_item_height) {
				scr_item_point = window.innerHeight - scr_item_height / 3;
			}
			if ((src_value > scr_item_offset - scr_item_point) && src_value < (scr_item_offset + scr_item_height)) {
				scr_item.classList.add('_active');
			} else {
				scr_item.classList.remove('_active');
			}
		}
	}
	if (src_value > scrollDirection) {
		// downscroll code
	} else {
		// upscroll code
	}
	scrollDirection = src_value <= 0 ? 0 : src_value;
}
setTimeout(function () {
	//document.addEventListener("DOMContentLoaded", scroll_scroll);
	scroll_scroll();
}, 100);

//ScrollOnClick (Simple)
let goto_links = document.querySelectorAll('._goto');
if (goto_links) {
	for (let index = 0; index < goto_links.length; index++) {
		let goto_link = goto_links[index];
		goto_link.addEventListener('click', function (e) {
			let target_block_class = goto_link.getAttribute('href').replace('#', '');
			let target_block = document.querySelector('.' + target_block_class);
			_goto(target_block, 300);
			e.preventDefault();
		});
	}
}
function _goto(target_block, speed, offset = 0) {
	let header = '';
	//OffsetHeader
	//if (window.innerWidth < 992) {
	//	header = 'header';
	//}
	let options = {
		speedAsDuration: true,
		speed: 1000,
		header: header,
		offset: offset,
		easing: 'easeInOutCubic',
	};
	let scr = new SmoothScroll();
	scr.animateScroll(target_block, '', options);
}

//SameFunctions
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;
}

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle




function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("min");
da.init();
//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('lightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}

function sliders_bild_callback(params) { }

if (document.querySelector('.advantages__slider')) {
	new Swiper('.advantages__slider', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		speed: 800,
		thumbs: {
			swiper: {
				el: '.advantages__row',
				slidesPerView: 6,
				simulateTouch: true,
				loop: true,
				breakpoints: {
					320: {
						slidesPerView: 2,
						//spaceBetween: 20,
					},
					940: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					1280: {
						slidesPerView: 4,
					},
					1440: {
						slidesPerView: 5,
						loop: true,
					},
					1920: {
						loop: false,
						slidesPerView: 6,
					},
				},
			}
		},
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		simulateTouch: false,
		loop: true,
		parallax: true,
	});
}

if (document.querySelector('.popular-slider__row')) {
	new Swiper('.popular-slider__row', {
		slidesPerGroup: 2,
		slidesPerView: 4,
		spaceBetween: 0,
		speed: 800,
		simulateTouch: true,
		loop: true,
		pagination: {
			el: '.popular-slider__fraction',
			clickable: true,
			type: 'fraction'
		},
		// Arrows
		navigation: {
			nextEl: '.popular-slider__next',
			prevEl: '.popular-slider__prev'
		},

		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			1150: {
				slidesPerView: 3,
			},
			1700: {
				slidesPerView: 4,
			},
		},
	});
}

if (document.querySelector('.partners__slider')) {
	new Swiper('.partners__slider', {
		autoplay: {
			delay: 1000,
			disableOnInteraction: false,
		},
		centeredSlides: true,
		slidesPerGroup: 1,
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		speed: 1000,
		observeSlideChildren: true,
		initialSlide: 3,
		loop: true,
		breakpoints: {
			320: {
				spaceBetween: 20,
				slidesPerView: 1,
			},
			1200: {
				spaceBetween: 100,
				slidesPerView: 3,
			},
		},
	});
}

if (document.querySelector('.slider-product__big')) {
	new Swiper('.slider-product__big', {
		thumbs: {
			swiper: {
				el: '.slider-product__nav',
				slidesPerView: 3.3,
				breakpoints: {
					767.98: {
						direction: "vertical",
					},
				},
			},
		},
	});
}

if (document.querySelector('.popular-slider__row_1')) {
	new Swiper('.popular-slider__row_1', {
		slidesPerGroup: 1,
		slidesPerView: 4,
		spaceBetween: 0,
		speed: 800,
		simulateTouch: true,
		loop: true,
		pagination: {
			el: '.popular-slider__fraction1',
			clickable: true,
			type: 'fraction'
		},
		// Arrows
		navigation: {
			nextEl: '.popular-slider__next1',
			prevEl: '.popular-slider__prev1'
		},

		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			1150: {
				slidesPerView: 3,
			},
			1700: {
				slidesPerView: 4,
			},
		},
	});
}

if (document.querySelector('.popular-slider__row_2')) {
	new Swiper('.popular-slider__row_2', {
		slidesPerGroup: 2,
		slidesPerView: 4,
		spaceBetween: 0,
		speed: 800,
		simulateTouch: true,
		loop: true,
		pagination: {
			el: '.popular-slider__fraction2',
			clickable: true,
			type: 'fraction'
		},
		// Arrows
		navigation: {
			nextEl: '.popular-slider__next2',
			prevEl: '.popular-slider__prev2'
		},

		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			1150: {
				slidesPerView: 3,
			},
			1700: {
				slidesPerView: 4,
			},
		},
	});
}

if (document.querySelector('.compare__row')) {
	new Swiper('.compare__row', {
		speed: 800,
		observer: true,
		observeParents: true,
		scrollbar: {
			el: ".swiper-scrollbar",
			draggable: true,
		},
		grabCursor: true,
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			1280: {
				slidesPerView: 2,
			},
			1540: {
				slidesPerView: 3,
			},
		}
	});
}

if (document.querySelector('.certificates__slider')) {
	new Swiper('.certificates__slider', {
		observer: true,
		observeParents: true,
		loop: true,
		autoHeight: true,
		breakpoints: {
			320: {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			1366: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
		},
		pagination: {
			el: '.certificates__fraction',
			clickable: true,
			type: 'fraction'
		},
		// Arrows
		navigation: {
			nextEl: '.certificates__next',
			prevEl: '.certificates__prev'
		},
	});
}

function mapAdd() {
	let tag = document.createElement('script');
	tag.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDf4p3LffKDVRZJBYNqvV2DGVNVQwA1Mm4&callback=mapInit";
	let firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function mapInit(n = 1) {
	google.maps.Map.prototype.setCenterWithOffset = function (latlng, offsetX, offsetY) {
		var map = this;
		var ov = new google.maps.OverlayView();
		ov.onAdd = function () {
			var proj = this.getProjection();
			var aPoint = proj.fromLatLngToContainerPixel(latlng);
			aPoint.x = aPoint.x + offsetX;
			aPoint.y = aPoint.y + offsetY;
			map.panTo(proj.fromContainerPixelToLatLng(aPoint));
			//map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
		}
		ov.draw = function () { };
		ov.setMap(this);
	};
	var markers = new Array();
	var infowindow = new google.maps.InfoWindow({
		//pixelOffset: new google.maps.Size(-230,250)
	});
	var locations = [
		[new google.maps.LatLng(56.032800, 92.804867)],
	]
	var options = {
		zoom: 18,
		panControl: false,
		mapTypeControl: false,
		fullscreenControl: false,
		disableDefaultUI: true,
		zoomControl: true,
		scrollwheel: false,
		center: new google.maps.LatLng(56.032800, 92.804867),
		styles: [
			{
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#363636"
					}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#ffffff"
					}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#212121"
					}
				]
			},
			{
				"featureType": "administrative.country",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#cecece"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#64779e"
					}
				]
			},
			{
				"featureType": "administrative.province",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#4b6878"
					}
				]
			},
			{
				"featureType": "landscape.man_made",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#737373"
					}
				]
			},
			{
				"featureType": "landscape.natural",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#4d4d4d"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#283d6a"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#f2f2f2"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#4d4d4d"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#3C7680"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#595959"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#98a5be"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#1d2c4d"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#595959"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#255763"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#b0d5ce"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#023e58"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#98a5be"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#1d2c4d"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#283d6a"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#666666"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#454545"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#4e6d70"
					}
				]
			}
		],
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	var map = new google.maps.Map(document.getElementById('map'), options);
	var icon = {
		url: '/local/templates/main/img/icons/map.svg',
		scaledSize: new google.maps.Size(45, 60),
		//anchor: new google.maps.Point(9, 10)
	}
	for (var i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
			icon: icon,
			position: locations[i][0],
			map: map,
		});
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				for (var m = 0; m < markers.length; m++) {
					markers[m].setIcon(icon);
				}
				var cnt = i + 1;
				//infowindow.setContent(document.querySelector('.events-map__item_' + cnt).innerHTML);
				//infowindow.open(map, marker);
				marker.setIcon(icon);
				map.setCenterWithOffset(marker.getPosition(), 0, 0);
				setTimeout(function () {

				}, 10);
			}
		})(marker, i));
		markers.push(marker);
	}
	if (n) {
		var nc = n - 1;
		setTimeout(function () {
			google.maps.event.trigger(markers[nc], 'click');
		}, 500);
	}
}
if (document.querySelector('#map')) {
	mapAdd();
}
window.addEventListener('resize', move);
let subLink = document.querySelectorAll('.menu__sub-link');

function move() {
	let catalog__content = document.querySelector(".catalog__content");
	let row = document.querySelector('.layout-row');
	let col = document.querySelector('.layout-col ');
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 1099.93) {
		for (let i = 0; i < subLink.length; i++) {
			subLink[i].classList.remove('menu__sub-link');
			subLink[i].classList.add('menu__link');
		}
	} else {
		for (let i = 0; i < subLink.length; i++) {
			subLink[i].classList.add('menu__sub-link');
			subLink[i].classList.remove('menu__link');
		}
	}
	if (viewport_width <= 1180) {
		if (catalog__content) {
			if (catalog__content.classList.contains('catalog__content_row')) {
				catalog__content.classList.remove('catalog__content_row');
				catalog__content.classList.add('catalog__content_col');
				row.classList.remove('_active');
				col.classList.add('_active');
			}
		}
	}
}

move();

//========================================================================================================================================================


//*автовысота для textarea


document.addEventListener("click", function (e) {
	const el = e.target;
	if (el.closest('textarea')) {
		el.style.height = el.setAttribute('style', 'height: ' + el.scrollHeight + 'px');
		el.classList.add('auto');
		el.addEventListener('input', e => {
			el.style.height = 'auto';
			el.style.height = (el.scrollHeight) + 10 + 'px';
		});
	}
});

//========================================================================================================================================================



if (window.matchMedia('(max-width: 1280px)').matches) {
	let tabsBlock = document.querySelectorAll('.catalog-modal__subcategory');
	let tabsItem = document.querySelectorAll('.catalog-modal__category');

	tabsBlock.forEach(element => {
		element.classList.remove('catalog-modal__subcategory_active');
	});
	tabsItem.forEach(element => {
		element.classList.remove('catalog-modal__category_active');
	});

};

//========================================================================================================================================================
//*стиль хедера для главной

function styleForIndex() {
	let header = document.querySelector('.header');
	let mainScreen = document.querySelector('.main-screen');
	if (mainScreen) {
		header.classList.add('main-page');
	}
}
styleForIndex();

//========================================================================================================================================================
//*табы для модалки каталога
let modalCatalog = document.querySelectorAll('.catalog-modal__body');
if (window.matchMedia('(min-width: 1281px)').matches) {
	for (let index = 0; index < modalCatalog.length; index++) {
		let cat = modalCatalog[index];
		let catalog_items = cat.querySelectorAll(".catalog-modal__category");
		let catalog_blocks = cat.querySelectorAll(".catalog-modal__subcategory");
		for (let index = 0; index < catalog_items.length; index++) {
			let catalog_item = catalog_items[index];
			catalog_item.addEventListener("mouseenter", function (e) {
				for (let index = 0; index < catalog_items.length; index++) {
					let catalog_item = catalog_items[index];
					catalog_item.classList.remove('catalog-modal__category_active');
					catalog_blocks[index].classList.remove('catalog-modal__subcategory_active');
				}
				catalog_item.classList.add('catalog-modal__category_active');
				catalog_blocks[index].classList.add('catalog-modal__subcategory_active');
				e.preventDefault();
			});
		}
	}
};

//========================================================================================================================================================
//*Плавающая линия для табов
const menu = document.querySelector(".float-line");
if (menu) {
	menu.addEventListener("mouseover", (event) => {
		if (event.target.classList.contains("float-line__item")) {
			menu.style.setProperty(
				"--underline-width",
				`${event.target.offsetWidth}px`
			);
			menu.style.setProperty(
				"--underline-offset-x",
				`${event.target.offsetLeft}px`
			);
		}
	});
	menu.addEventListener("mouseleave", () =>
		menu.style.setProperty("--underline-width", "0")
	);
}

//========================================================================================================================================================
//*переключатель layout в каталоге
let sort__layout_btns = document.querySelectorAll(".sort__layout-btn");


for (let index = 0; index < sort__layout_btns.length; index++) {
	let catalog__content = document.querySelector(".catalog__content");
	let row = document.querySelector('.layout-row');
	let col = document.querySelector('.layout-col ');
	let sort__layout_btn = sort__layout_btns[index];
	if (localStorage.getItem('catalog_layout') == 'row') {
		catalog__content.classList.add('catalog__content_row');
		catalog__content.classList.remove('catalog__content_col');
		row.classList.add('_active');
		col.classList.remove('_active');
	} else {
		catalog__content.classList.add('catalog__content_col');
		catalog__content.classList.remove('catalog__content_row');
		col.classList.add('_active');
		row.classList.remove('_active');
	}
	sort__layout_btn.addEventListener("click", function (e) {
		if (col.classList.contains('_active')) {
			catalog__content.classList.add('catalog__content_row');
			catalog__content.classList.remove('catalog__content_col');
			localStorage.setItem('catalog_layout', 'row')
		}
		if (row.classList.contains('_active')) {
			catalog__content.classList.remove('catalog__content_row');
			catalog__content.classList.add('catalog__content_col');
			localStorage.setItem('catalog_layout', 'col')
		}
		for (let index = 0; index < sort__layout_btns.length; index++) {
			let sort__layout_btn = sort__layout_btns[index];
			sort__layout_btn.classList.remove('_active');
		}
		sort__layout_btn.classList.add('_active');
	});
};


//========================================================================================================================================================

//========================================================================================================================================================
//*смена текста кнопки


if (document.querySelectorAll('.order__more-btn').length > 0) {
	let more_btn = document.querySelectorAll('.order__more-btn');
	for (let btn = 0; btn < more_btn.length; btn++) {
		const element = more_btn[btn];
		element.addEventListener("click", function (e) {
			if (!element.classList.contains('_active')) {
				element.innerHTML = 'Скрыть состав заказа';
				element.classList.add('btn-15_blck');
			} else {
				element.innerHTML = 'Показать состав заказа';
				element.classList.remove('btn-15_blck');
			}
		});
	}
};

//========================================================================================================================================================
//*смена цвета номера заказа по статусу
if (document.querySelectorAll('.order__status').length > 0) {
	let order_status = document.getElementsByClassName('order__status');
	for (let status = 0; status < order_status.length; status++) {
		const element = order_status[status];
		let color = getComputedStyle(element);
		color = color.backgroundColor;
		element.previousElementSibling.firstElementChild.style.color = color;
	};
};
//========================================================================================================================================================
//*progressBar для preloader
function preloader() {
	document.querySelector('.preloader__wht').style.display = 'none';
	let images = document.images,
		images_total_count = images.length,
		images_loaded_count = 0,
		progress_bar = document.querySelector('.preloader__progress-bar'),
		preloader = document.querySelector('.preloader');
	preloader.style.display = 'flex'
	preloader.querySelector('.preloader__logo').style.display = 'flex';
	preloader.querySelector('.preloader__progress-bar').style.display = 'block';
	for (let i = 0; i < images_total_count; i++) {
		image_clone = new Image();
		image_clone.onload = image_loaded;
		image_clone.onerror = image_loaded;
		image_clone.src = images[i].src;

	}
	function image_loaded() {
		images_loaded_count++;
		progress_bar.style.width = (((100 / images_total_count) * images_loaded_count) << 0) + '%';

		if (images_loaded_count >= images_total_count) {
			setTimeout(() => {
				if (!preloader.classList.contains('done')) {
					preloader.classList.add('done');
					sessionStorage.setItem('loader', 'done');
				}
				if (document.querySelector('.wrapper')) {
					document.querySelector('.wrapper').classList.add('_loaded');
				}
			}, 500);
		}
	};
};

if (!sessionStorage.getItem('loader')) {
	console.log('loader');
	preloader()
} else {
	document.querySelector('.wrapper').classList.add('_loaded');
	document.querySelector('.preloader').classList.add('done');
}
//========================================================================================================================================================
//*zoom on scroll



(() => {
	window.addEventListener('scroll', function () {
		let scroll = document.documentElement.scrollTop;
		let zoom = document.querySelector('.about__image img');
		if (zoom) {
			zoom.style.transform = 'scale(' + (100 + scroll / 15) / 100 + ')';
		}

	});
})();
$(window).scroll(function () {
	var scroll = $(window).scrollTop();
	$(".about__image img").css({
		transform: 'scale(' + (100 + scroll / 5) / 100 + ')',
	});
});


$('._img-parallax').each(function () {
	var img = $(this);
	var imgParent = $(this).parent();
	function parallaxImg() {
		var speed = img.data('speed');
		var imgY = imgParent.offset().top;
		var winY = $(this).scrollTop();
		var winH = $(this).height();
		var parentH = imgParent.innerHeight();


		// The next pixel to show on screen      
		var winBottom = winY + winH;

		// If block is shown on screen
		if (winBottom > imgY && winY < imgY + parentH) {
			// Number of pixels shown after block appear
			var imgBottom = ((winBottom - imgY) * speed);
			// Max number of pixels until block disappear
			var imgTop = winH + parentH;
			// Porcentage between start showing until disappearing
			var imgPercent = ((imgBottom / imgTop) * 100) + (50 - (speed * 50));
		}
		img.css({
			top: imgPercent + '%',
			transform: 'translate(-50%, -' + imgPercent + '%)'
		});
	}
	$(document).on({
		scroll: function () {
			parallaxImg();
		}, ready: function () {
			parallaxImg();
		}
	});
});
//========================================================================================================================================================
//*очистка поля поиска

if (document.querySelector('.modal-search__search-input')) {
	const search__input = document.querySelector('.modal-search__search-input');
	const search__clear = document.querySelector('.modal-search__clear');
	search__clear.addEventListener("click", function (e) {
		search__input.value = "";
	});

}

$(document).ready(function () {
	$('select').niceSelect();
});


window.addEventListener('load', function () {
	const request = document.querySelector('.request');
	if (!request) {
		return;
	}
	const requestBlock = document.querySelectorAll('.bx-soa-customer-field');

	requestBlock.forEach(function (requestBlockItem) {
		const customerInput = requestBlockItem.querySelector('.form-control');

		if (customerInput.value !== '') {
			requestBlockItem.classList.add('active');
		}

		customerInput.addEventListener('focus', function () {
			requestBlockItem.classList.add('active');
		})
		customerInput.addEventListener('blur', function () {
			if (customerInput.value == '') {
				requestBlockItem.classList.remove('active');
			}
		})

	})
})




// global click events
const globalClickHandlers = {
	'js-open-modal': (node) => {
		if (node.dataset.closeAllModals !== undefined) {
			[...document.querySelectorAll(".modal.open")].map(n => closeModal(n))
		}
		openModal(document.querySelector(node.dataset.openModal))
	},
}
document.addEventListener("click", function (e) {
	var foundNodes = []
	var checkRecursive = (target) => {
		if (target === document || target == undefined) {
			return false
		}
		var cl = target.classList

		if (cl === undefined) {
			return false
		}
		var contains = false
		for (var c of Object.keys(globalClickHandlers)) {
			if (cl.contains(c)) {
				contains = true
				break
			}
		}
		if (contains) {
			foundNodes.push(target)
		}

		return checkRecursive(target.parentElement)
	}
	checkRecursive(e.target)

	var handlers = Object.entries(globalClickHandlers)
	foundNodes.map(node => {
		handlers.map(([className, callback]) => {
			if (node.classList.contains(className)) {
				callback(node)
			}
		})
	})
})


$(document).ready(() => {
	[...document.querySelectorAll('input')].filter(i => i.value.trim().length > 0)
		.map(i => i.classList.add('is-active'))
})

// just an end of a file


